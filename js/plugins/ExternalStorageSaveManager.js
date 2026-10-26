//=============================================================================
// ExternalStorageSaveManager.js
//=============================================================================
// [English]
// Stores RPG Maker MV save data in a user-accessible external directory
// instead of the WebView private storage:
//     /data/user/0/<package>/app_webview/Default/Local Storage/leveldb/
//  -> Android/data/<package>/files/save/
//
// The target directory requires neither storage permission nor root access,
// and players can import or export saves with any file manager.
// File names and format (file1.rpgsave, global.rpgsave, config.rpgsave,
// common.rpgsave; LZString + Base64) match the desktop (NW.js) build, so
// saves are interchangeable between platforms.
//
// ==COMPANION NATIVE BRIDGE==
//   This plugin cannot write files by itself. It requires the native class
//   ExternalStorageSaveBridge (Java/Kotlin), registered on the WebView before
//   the game page is loaded.
//
//   The bridge exposes only primitive file I/O (read, write, exists, delete,
//   metadata, list). All save policy - paths, compression, caching, backup,
//   migration - lives in this file. If the bridge is absent, the plugin
//   disables itself and the game keeps using its original localStorage.
//
// ==INTEGRATION==
//   Four files need to be touched outside this plugin.
//
//   1) Native bridge (Java/Kotlin)
//      Add ExternalStorageSaveBridge.java to your Android project. It depends
//      only on android.content.Context and android.webkit.JavascriptInterface.
//
//   2) WebView registration (1 line)
//      Register the bridge before the game page is loaded:
//
//          player.addJavascriptInterface(
//              new ExternalStorageSaveBridge(this),
//              ExternalStorageSaveBridge.INTERFACE_NAME);
//
//      In an Activity this usually goes right after the player/WebView is
//      created and before the first loadUrl() call.
//
//   3) ProGuard / R8 (release builds only)
//      Keep the class and its interface methods, otherwise the names are
//      obfuscated and the JS calls fail at runtime:
//
//          -keep class <your.package>.ExternalStorageSaveBridge { *; }
//          -keepclassmembers class <your.package>.ExternalStorageSaveBridge {
//              @android.webkit.JavascriptInterface <methods>;
//          }
//
//   4) Plugin registration
//      Add this entry to js/plugins.js (name must match the file name):
//
//          {"name":"ExternalStorageSaveManager","status":true,
//           "description":"External save storage",
//           "parameters":{"enableBackup":"true",
//                         "migrateWebStorage":"true",
//                         "debugLog":"false"}}
//
//      Registration order matters: this plugin must come AFTER any plugin that
//      defines its own save storage (e.g. UTA_CommonSave), otherwise the later
//      definitions win.
//
// ==TECHNICAL NOTES==
//   1. Avoiding stutter when the save/load scene opens
//      Because saves are stored externally, the game side talks to native code
//      through a bridge exposed with @JavascriptInterface. Every call across
//      that bridge is a synchronous round trip, so making many of them is
//      expensive.
//
//      RMMV walks all 20 save slots several times whenever the save/load scene
//      opens, calling StorageManager.exists() for each slot. With a
//      straightforward implementation every exists() becomes its own
//      synchronous @JavascriptInterface call, so one screen refresh produces
//      roughly 400 native round trips. At about 1 ms each that is 0.4-1 s of
//      blocking work, and occasional 10-35 ms spikes bring the perceived delay
//      to roughly 3 s before the list appears.
//
//      To avoid this, exists() and getFileMeta() must be treated as hot paths:
//      cache their results, and never call into native code unconditionally
//      from them.
//
//      How this plugin handles it
//        1. exists() results are cached for 2 seconds (EXISTS_TTL), and the
//           cache is refreshed immediately on write and delete so the game
//           always sees its own changes.
//        2. Decompressed save data stays in memory, keyed by the file's
//           lastModified|length, so repeated reads never touch the file system.
//        3. Compression happens on the JS side; the native bridge needs no
//           LZString implementation.
//        4. Legacy localStorage is consulted only when the external directory
//           is completely empty, never on the per-slot hot path.
//
//   2. Debug facilities
//      Set debugLog to true to enable them.
//        - save / read / load / exists are timed with performance.now().
//        - Native (JNI) calls are measured separately from JS work, so storage
//          latency can be told apart from script overhead.
//        - A summary line is emitted every 20 load() calls:
//            [PERF load#20] ... || JNI: exists n=20 avg=1.0 max=6.1
//        - Single calls taking 5 ms or more are logged individually with
//          HIT / MISS, making a slow slot easy to spot.
//        - Output goes to the console and to
//          Android/data/<package>/files/log.txt.
//
// [中文]
// 将 RPG Maker MV 的存档写入用户可访问的外置目录，而不是 WebView 私有存储：
//     /data/user/0/<包名>/app_webview/Default/Local Storage/leveldb/
//  -> Android/data/<包名>/files/save/
//
// 该目录无需存储权限，也无需 root；玩家用任意文件管理器即可导入或导出存档。
// 存档文件名与格式（file1.rpgsave、global.rpgsave、config.rpgsave、
// common.rpgsave，LZString + Base64）与桌面（NW.js）版一致，
// 可在不同平台之间直接互通。
//
// ==配套原生桥==
//   本插件自身无法写文件，必须配合原生类 ExternalStorageSaveBridge
//   （Java/Kotlin），并在加载游戏页之前注册到 WebView。
//
//   原生桥只提供最原始的文件 I/O（读、写、存在、删除、元信息、列目录），
//   所有存档策略——路径、压缩、缓存、备份、迁移——都在本文件中实现。
//   若缺少该桥，插件会自动禁用，游戏继续使用原有的 localStorage。
//
// ==集成步骤==
//   除本插件外，需要改动 4 个文件。
//
//   1) 原生桥（Java/Kotlin）
//      将 ExternalStorageSaveBridge.java 加入 Android 工程。它只依赖
//      android.content.Context 与 android.webkit.JavascriptInterface。
//
//   2) WebView 注册（1 行）
//      在加载游戏页之前注册桥：
//
//          player.addJavascriptInterface(
//              new ExternalStorageSaveBridge(this),
//              ExternalStorageSaveBridge.INTERFACE_NAME);
//
//      在 Activity 中通常放在创建 player/WebView 之后、首次 loadUrl() 之前。
//
//   3) ProGuard / R8（仅 release 构建）
//      保留类名及其接口方法，否则名称被混淆后 JS 调用会在运行时失败：
//
//          -keep class <你的包名>.ExternalStorageSaveBridge { *; }
//          -keepclassmembers class <你的包名>.ExternalStorageSaveBridge {
//              @android.webkit.JavascriptInterface <methods>;
//          }
//
//   4) 插件注册
//      在 js/plugins.js 中加入（name 必须与文件名一致）：
//
//          {"name":"ExternalStorageSaveManager","status":true,
//           "description":"外置存档",
//           "parameters":{"enableBackup":"true",
//                         "migrateWebStorage":"true",
//                         "debugLog":"false"}}
//
//      注册顺序很重要：本插件必须排在任何自定义存档存储的插件
//      （例如 UTA_CommonSave）之后，否则后定义的方法会覆盖本插件。
//
// ==技术细节==
//   一、存/读档界面卡顿的避免
//     本插件的存档外置方案由「JS 插件 + 原生桥」两部分组成，游戏侧通过
//     @JavascriptInterface 暴露的桥与原生代码通信。跨桥的每次调用都是一次
//     同步往返，调用次数一多就会明显耗时。
//
//     RMMV 在打开存/读档界面时会多次遍历全部 20 个槽位，并对每个槽位调用
//     StorageManager.exists()。如果按最直接的方式实现，每次 exists() 都会
//     变成一次独立的同步 @JavascriptInterface 调用，于是一次界面刷新就会
//     产生约 400 次原生往返。按每次约 1 ms 计算，光这部分就要阻塞 0.4–1 秒；
//     再叠加偶发的 10–35 ms 尖峰，列表弹出前的主观等待会接近 3 秒。
//
//     因此必须把 exists() 和 getFileMeta() 当作热路径对待：缓存结果，
//     不要在它们内部无条件调用原生代码。
//
//     本插件的解决方法
//       1. exists() 结果缓存 2 秒（EXISTS_TTL），写入与删除时立即刷新，
//          因此游戏总能看到自己的改动。
//       2. 已解压的存档保存在内存中，以文件的 lastModified|length 为键，
//          重复读取不再访问文件系统。
//       3. 压缩在 JS 侧完成，原生桥不需要任何 LZString 实现。
//       4. 仅在外置目录完全为空时才查询旧的 localStorage，
//          绝不会在逐槽位热路径上触发。
//
//   二、调试功能
//     把 debugLog 设为 true 即可启用。
//       - 每次 save / read / load / exists 都用 performance.now() 计时。
//       - 原生（JNI）调用与 JS 逻辑分开统计，便于区分存储延迟与脚本开销。
//       - 每 20 次 load() 输出一行汇总：
//           [PERF load#20] ... || JNI: exists n=20 avg=1.0 max=6.1
//       - 单次超过 5 ms 的调用会单独记录并标注 HIT / MISS，
//         方便定位具体哪个槽位慢。
//       - 日志同时写入控制台与 Android/data/<包名>/files/log.txt。
//
// Author: ArchiDreamZ
//=============================================================================

/*:
 * @plugindesc [v1.0] Move RMMV Android saves to external storage to allow access without root. （将RMMV安卓版存档转移到外部路径，实现无需root即可访问。）
 * @author 彼梦ArchiDreamZ
 *
 * @param enableBackup
 * @desc [EN] Keep a .bak copy before overwriting a save file. [CN] 覆盖存档前保留 .bak 备份。
 * @default true
 *
 * @param migrateWebStorage
 * @desc [EN] Migrate legacy localStorage saves to the external directory on first run. [CN] 首次运行时将旧的 localStorage 存档迁移到外置目录。
 * @default true
 *
 * @param debugLog
 * @desc [EN] Print save I/O logs to the console. [CN] 在控制台输出存档读写日志，便于排查问题。
 * @default false
 *
 * @help
 * ============================================================================
 * [English]
 * ============================================================================
 * OVERVIEW
 *   RPG Maker MV normally stores save data in the WebView's private storage,
 *   which is not reachable without root. This plugin redirects all save I/O
 *   to Android/data/<package>/files/save/ by overriding StorageManager.
 *
 * REQUIREMENTS
 *   A native file I/O bridge is mandatory. The plugin performs no file access
 *   on its own; it only calls the bridge. Without the bridge it disables
 *   itself silently and the game behaves as if the plugin were not installed.
 *
 * INTEGRATION
 *   The complete checklist (native bridge, WebView registration, ProGuard
 *   rules, plugin registration) is in the header comment at the top of this
 *   file.
 *
 * SAVE LOCATION
 *   Default: Android/data/<package>/files/save/
 *       file1.rpgsave ... file20.rpgsave   regular save slots
 *       global.rpgsave                     save slot metadata
 *       config.rpgsave                     game settings
 *       common.rpgsave                     cross-playthrough data (UTA_CommonSave)
 *       xxx.rpgsave.bak                    automatic backup
 *
 * MIGRATION AND FALLBACK
 *   1) If a save is missing from the external directory, reads fall back to the
 *      legacy localStorage entry, so existing players do not lose data.
 *   2) On first run the plugin copies legacy localStorage saves into the
 *      external directory. Existing external files are never overwritten.
 *
 * DEVELOPER API
 *   ExternalStorageSaveManager.dir()    -> absolute path of the save directory
 *   ExternalStorageSaveManager.list()   -> file names inside the directory
 *   ExternalStorageSaveManager.enabled  -> whether the plugin is active
 *
 * ============================================================================
 * [中文]
 * ============================================================================
 * 概述
 *   RPG Maker MV 默认把存档保存在 WebView 私有存储中，没有 root 无法访问。
 *   本插件通过覆盖 StorageManager，把所有存档读写重定向到
 *   Android/data/<包名>/files/save/。
 *
 * 依赖
 *   必须配合原生文件 I/O 桥使用。插件自身不直接访问文件系统，只调用该桥。
 *   缺少该桥时插件会自动静默禁用，游戏行为与未安装时完全一致。
 *
 * 集成步骤
 *   完整的集成步骤（原生桥、WebView 注册、ProGuard 规则、插件注册）
 *   见本文件开头的注释。
 *
 * 存档位置
 *   默认：Android/data/<包名>/files/save/
 *       file1.rpgsave ... file20.rpgsave   普通存档槽
 *       global.rpgsave                     存档列表信息
 *       config.rpgsave                     游戏设置
 *       common.rpgsave                     跨周目数据（UTA_CommonSave）
 *       xxx.rpgsave.bak                    自动备份
 *
 * 迁移与回退
 *   1) 外置目录中缺少某个存档时，读取会自动回退到旧的 localStorage 记录，
 *      因此已有玩家不会丢档。
 *   2) 首次运行时，插件会把旧的 localStorage 存档复制到外置目录，
 *      外置目录中已存在的文件绝不会被覆盖。
 *
 * 开发者接口
 *   ExternalStorageSaveManager.dir()    -> 存档目录的绝对路径
 *   ExternalStorageSaveManager.list()   -> 存档目录内的文件名数组
 *   ExternalStorageSaveManager.enabled  -> 插件是否生效
 * ============================================================================
 */

(function () {
    'use strict';

    var PLUGIN_NAME = 'ExternalStorageSaveManager';

    // Guard against double loading (e.g. registered both in plugins.js and
    // index.html). / 防止重复加载（例如 plugins.js 与 index.html 同时注册）。
    if (window.ExternalStorageSaveManager && window.ExternalStorageSaveManager.__installed) {
        return;
    }

    //-------------------------------------------------------------------------
    // Configuration / 配置
    //-------------------------------------------------------------------------
    var params = PluginManager.parameters(PLUGIN_NAME);
    var OPT_BACKUP  = String(params['enableBackup']      !== undefined ? params['enableBackup']      : 'true')  !== 'false';
    var OPT_MIGRATE = String(params['migrateWebStorage'] !== undefined ? params['migrateWebStorage'] : 'true')  !== 'false';
    var OPT_DEBUG   = String(params['debugLog']          !== undefined ? params['debugLog']          : 'false') === 'true';

    function log() {
        if (OPT_DEBUG) {
            console.log.apply(console, ['[' + PLUGIN_NAME + ']'].concat(Array.prototype.slice.call(arguments)));
        }
    }

    //-------------------------------------------------------------------------
    // Native bridge detection / 原生桥探测
    //-------------------------------------------------------------------------
    var bridge = null;
    try {
        if (typeof ExternalStorageSaveBridge !== 'undefined' && ExternalStorageSaveBridge &&
            typeof ExternalStorageSaveBridge.writeFile === 'function' &&
            typeof ExternalStorageSaveBridge.readFile === 'function') {
            bridge = ExternalStorageSaveBridge;
        }
    } catch (e) {
        bridge = null;
    }

    if (!bridge) {
        // No bridge available: stay inert so the game keeps its original
        // behaviour on desktop or under other wrappers.
        // 没有原生桥时保持静默，桌面环境或其它构建壳下行为不变。
        console.log('[' + PLUGIN_NAME + '] Native bridge not found; keeping localStorage saves.');
        window.ExternalStorageSaveManager = {
            __installed: true,
            enabled: false,
            dir: function () { return ''; },
            list: function () { return []; }
        };
        return;
    }

    //-------------------------------------------------------------------------
    // Helpers / 基础工具
    //-------------------------------------------------------------------------
    // Debug logging: console + native log file (Android/data/<pkg>/files/log.txt).
    // Enabled only when the debugLog parameter is true.
    // 调试日志：同时写入控制台与原生日志文件，仅在 debugLog 参数为 true 时启用。
    var DEBUG_BUDGET = 80;
    function debugLog(msg) {
        if (!OPT_DEBUG) return;
        var line = '[' + PLUGIN_NAME + '] ' + msg;
        console.log(line);
        try {
            if (bridge && typeof bridge.log === 'function') bridge.log(msg);
        } catch (e) { /* ignore / 忽略 */ }
    }
    // Rate-limited variant for hot paths (per-slot reads).
    // 热路径用的限流版本，避免日志本身拖慢游戏。
    function debugLogHot(msg) {
        if (!OPT_DEBUG || DEBUG_BUDGET <= 0) return;
        DEBUG_BUDGET--;
        debugLog(msg);
    }

    // Whether the external directory holds no save at all. Detected once per
    // session. Only in that case is localStorage consulted, so the per-slot
    // enumeration in the save/load scene never pays for it.
    //
    // 外置目录是否完全没有存档，每个会话只检测一次。只有这种情况才查询
    // localStorage，因此存档界面遍历槽位时不会产生额外开销。
    var externalDirEmpty = null;
    function isExternalDirEmpty() {
        if (externalDirEmpty === null) {
            var listing = '';
            try { listing = String(bridge.listFiles() || ''); } catch (e) { listing = ''; }
            externalDirEmpty = listing.replace(/\s/g, '') === '';
            debugLog('external dir empty: ' + externalDirEmpty);
        }
        return externalDirEmpty;
    }

    // Migration is driven by the presence of global.rpgsave, not by a flag:
    // if the player deletes the external folder, the next launch imports the
    // old localStorage saves again.
    //
    // 旧档迁移以外置是否存在 global.rpgsave 为判断依据，而不是依赖标记：
    // 玩家删掉外置目录后，下次启动会重新从 localStorage 导入。
    var MIGRATION_FLAG = 'ExternalStorageSaveManager.migrated';

    // Decompressed save cache: name -> { meta, json }.
    // RMMV reads the same file repeatedly while drawing the save list
    // (isThisGameFile iterates every slot), so caching avoids repeated
    // file reads and LZString decompression.
    // 已解压存档的内存缓存。RMMV 绘制存档列表时会对同一文件反复读取，
    // 缓存可避免重复的文件读取与解压开销。
    var cache = {};

    // exists() is called hundreds of times per save-screen refresh, because
    // RMMV walks every slot. Each call is a synchronous JNI round trip, so the
    // result is cached for a short window. A save copied in from a file manager
    // is still picked up within EXISTS_TTL.
    //
    // exists() 在存档界面每次刷新时会被调用数百次（RMMV 会遍历全部槽位），
    // 每次都是一次同步 JNI 往返，因此对结果做短暂缓存。
    // 玩家从文件管理器拷入的存档最多 EXISTS_TTL 之后就能被识别。
    var existsCache = {};
    var EXISTS_TTL = 2000;

    function setExistsCache(name, value) {
        existsCache[name] = { value: value, t: perfNow() };
    }

    //-------------------------------------------------------------------------
    // Performance probe (debug only) / 性能探针（仅调试时启用）
    //-------------------------------------------------------------------------
    // Times are taken with performance.now() when available, so sub-millisecond
    // JNI calls are still measurable. Every bucket keeps count / total / max.
    // 优先使用 performance.now()，因此亚毫秒级的 JNI 调用也能测出来。
    // 每个桶记录 次数 / 总耗时 / 最大值。
    var perfNow = (typeof performance !== 'undefined' && performance.now)
        ? function () { return performance.now(); }
        : function () { return Date.now(); };

    var PERF = {
        calls: {},
        jni: {},
        mark: function (bucket, key, ms) {
            if (!OPT_DEBUG) return;
            var b = bucket[key];
            if (!b) { b = bucket[key] = { n: 0, total: 0, max: 0 }; }
            b.n++;
            b.total += ms;
            if (ms > b.max) b.max = ms;
        },
        fmt: function (bucket) {
            var out = [];
            for (var k in bucket) {
                if (!Object.prototype.hasOwnProperty.call(bucket, k)) continue;
                var b = bucket[k];
                out.push(k + ' n=' + b.n + ' avg=' + (b.total / b.n).toFixed(2) +
                         ' max=' + b.max.toFixed(2));
            }
            return out.join(' | ');
        },
        dump: function (tag) {
            if (!OPT_DEBUG) return;
            debugLog('[PERF ' + tag + '] ' + PERF.fmt(PERF.calls) +
                     ' || JNI: ' + PERF.fmt(PERF.jni));
            PERF.calls = {};
            PERF.jni = {};
        }
    };

    // File metadata used to detect external replacement (cache invalidation).
    // 读取文件元信息，用于判断文件是否被外部替换（缓存失效检查）。
    function fileMeta(name) {
        var t0 = perfNow();
        try {
            var m = bridge.getFileMeta(name);
            PERF.mark(PERF.jni, 'getFileMeta', perfNow() - t0);
            return (m === null || m === undefined) ? '' : String(m);
        } catch (e) {
            PERF.mark(PERF.jni, 'getFileMeta', perfNow() - t0);
            return '';
        }
    }

    function bridgeWrite(name, text) {
        var t0 = perfNow();
        try {
            var ok = bridge.writeFile(name, text) === true;
            PERF.mark(PERF.jni, 'writeFile', perfNow() - t0);
            return ok;
        } catch (e) {
            PERF.mark(PERF.jni, 'writeFile', perfNow() - t0);
            console.error('[' + PLUGIN_NAME + '] write failed: ' + name, e);
            return false;
        }
    }

    function bridgeRead(name) {
        var t0 = perfNow();
        try {
            var t = bridge.readFile(name);
            PERF.mark(PERF.jni, 'readFile', perfNow() - t0);
            return (t === null || t === undefined) ? null : String(t);
        } catch (e) {
            PERF.mark(PERF.jni, 'readFile', perfNow() - t0);
            console.error('[' + PLUGIN_NAME + '] read failed: ' + name, e);
            return null;
        }
    }

    function bridgeExists(name) {
        var t0 = perfNow();
        try {
            var ok = bridge.exists(name) === true;
            PERF.mark(PERF.jni, 'exists', perfNow() - t0);
            return ok;
        } catch (e) {
            PERF.mark(PERF.jni, 'exists', perfNow() - t0);
            return false;
        }
    }

    function bridgeDelete(name) {
        try {
            bridge.delete(name);
        } catch (e) { /* ignored / 忽略 */ }
    }

    // Decompress a save file.
    //
    // Some third-party lz-string ports (notably Java/Kotlin ports) append an
    // extra '=' padding when encoding. The resulting byte count is odd, so
    // lz-string runs out of data and returns an empty string, which surfaces
    // as "the save file is there but the game shows no save data".
    // When the normal decompression fails, retry once without trailing '='.
    // Normal saves never reach this branch.
    //
    // 部分第三方 lz-string 移植版（尤其是 Java/Kotlin 版）在编码时会在末尾
    // 多写一个 '=' 填充，导致解出的字节数为奇数，lz-string 数据不足而返回
    // 空字符串，表现为“存档文件存在，但游戏里看不到存档”。
    // 因此仅在正常解压失败时，去掉末尾的 '=' 重试一次；正常存档不会走到这里。
    function decompressSave(raw) {
        if (raw === null || raw === undefined || raw === '') return raw;

        var json = LZString.decompressFromBase64(raw);
        if (json) return json;

        var trimmed = String(raw).replace(/=+$/, '');
        if (trimmed.length > 0 && trimmed !== raw) {
            var retry = LZString.decompressFromBase64(trimmed);
            if (retry) {
                log('Recovered save with non-standard base64 padding.');
                return retry;
            }
        }
        return json;
    }

    //-------------------------------------------------------------------------
    // File names / 文件名
    //-------------------------------------------------------------------------
    // Keep the same naming as the desktop (NW.js) build so saves are
    // interchangeable. / 与桌面（NW.js）版命名保持一致，便于存档互通。
    StorageManager.externalFileName = function (savefileId) {
        if (savefileId < 0) {
            return 'config.rpgsave';
        } else if (savefileId === 0) {
            return 'global.rpgsave';
        } else {
            return 'file' + savefileId + '.rpgsave';
        }
    };

    StorageManager.externalSaveDir = function () {
        try {
            return String(bridge.getSaveDir());
        } catch (e) {
            return '';
        }
    };

    StorageManager.externalExists = function (savefileId) {
        return bridgeExists(this.externalFileName(savefileId));
    };

    //-------------------------------------------------------------------------
    // Core read / write / 核心读写
    //-------------------------------------------------------------------------
    // Compression happens on the JS side, so the native bridge needs no
    // LZString implementation at all.
    // 压缩在 JS 侧完成，原生桥因此完全不需要 LZString 实现。
    function writeSave(name, json) {
        var t0 = perfNow();
        var tc = perfNow();
        var b64 = LZString.compressToBase64(json);
        PERF.mark(PERF.calls, 'compress', perfNow() - tc);
        if (!bridgeWrite(name, b64)) return false;
        cache[name] = { meta: fileMeta(name), json: json };
        setExistsCache(name, true);
        var dt = perfNow() - t0;
        PERF.mark(PERF.calls, 'writeSave', dt);
        debugLog('write ' + name + ' ' + Math.round(json.length / 1024) + 'KB in ' + dt.toFixed(2) + 'ms');
        return true;
    }

    // Read from cache when valid, otherwise read and decompress the file.
    // 缓存有效时直接返回，否则读取文件并解压。
    function readSave(name) {
        var t0 = perfNow();
        var meta = fileMeta(name);
        if (meta === '') {
            PERF.mark(PERF.calls, 'read:miss', perfNow() - t0);
            return undefined;                             // file not found / 文件不存在
        }

        var hit = cache[name];
        if (hit && hit.meta === meta) {
            PERF.mark(PERF.calls, 'read:hit', perfNow() - t0);
            return hit.json;                              // cache hit / 缓存命中
        }

        var raw = bridgeRead(name);
        if (raw === null) {
            PERF.mark(PERF.calls, 'read:miss', perfNow() - t0);
            return undefined;
        }

        var td = perfNow();
        var json = decompressSave(raw);
        PERF.mark(PERF.calls, 'decompress', perfNow() - td);

        cache[name] = { meta: fileMeta(name), json: json };
        var dt = perfNow() - t0;
        PERF.mark(PERF.calls, 'read:load', dt);
        debugLogHot('read ' + name + ' ' + (json ? Math.round(json.length / 1024) + 'KB' : '(empty)') +
                    ' in ' + dt.toFixed(2) + 'ms');
        return json;
    }

    //-------------------------------------------------------------------------
    // StorageManager overrides / 覆盖 StorageManager 存档入口
    //-------------------------------------------------------------------------
    // StorageManager.isLocalMode() is intentionally left untouched. Making it
    // return true would make other plugins assume NW.js and would route
    // StorageManager.backup() through require('fs'), which throws inside a
    // WebView. Overriding the high-level entry points is safer and has no
    // side effects.
    //
    // 这里刻意不修改 StorageManager.isLocalMode()。把它改成 true 会让其它
    // 插件误以为运行在 NW.js 上，并使 StorageManager.backup() 走 require('fs')，
    // 在 WebView 中直接抛异常。覆盖高层入口更安全，也没有副作用。

    StorageManager.save = function (savefileId, json) {
        var name = this.externalFileName(savefileId);
        if (!writeSave(name, json)) {
            // External write failed (e.g. storage unmounted): fall back to the
            // original implementation so the game keeps running.
            // 外置写入失败（例如外置存储被卸载）时回退到原实现，保证游戏不中断。
            console.warn('[' + PLUGIN_NAME + '] external write failed, falling back to localStorage: ' + name);
            this.saveToWebStorage(savefileId, json);
        }
    };

    var loadCalls = 0;
    StorageManager.load = function (savefileId) {
        var t0 = perfNow();
        var name = this.externalFileName(savefileId);
        var json = readSave(name);
        var dt = perfNow() - t0;
        PERF.mark(PERF.calls, 'load', dt);
        if (OPT_DEBUG && dt >= 5) {
            debugLog('load(' + savefileId + ') ' + dt.toFixed(2) + 'ms ' +
                     (json === undefined ? 'MISS' : 'HIT'));
        }
        loadCalls++;
        if (loadCalls % 20 === 0) PERF.dump('load#' + loadCalls);
        if (json !== undefined) return json;
        // Only fall back when the external directory is completely empty
        // (fresh install or the player wiped it). Otherwise the external copy
        // is authoritative and no slow localStorage lookup happens.
        // 仅在外置目录完全为空时回退；否则以外置为准，不做慢查询。
        return isExternalDirEmpty() ? this.loadFromWebStorage(savefileId) : null;
    };

    var existsCalls = 0;
    StorageManager.exists = function (savefileId) {
        var t0 = perfNow();
        var name = this.externalFileName(savefileId);
        var now = t0;
        var c = existsCache[name];
        var found;
        if (c && (now - c.t) < EXISTS_TTL) {
            found = c.value;
            PERF.mark(PERF.calls, 'exists:cached', perfNow() - t0);
        } else {
            found = this.externalExists(savefileId);
            if (!found) found = isExternalDirEmpty() ? this.webStorageExists(savefileId) : false;
            setExistsCache(name, found);
            PERF.mark(PERF.calls, 'exists', perfNow() - t0);
        }
        if (OPT_DEBUG) {
            var dt = perfNow() - t0;
            if (dt >= 5) {
                debugLog('exists(' + savefileId + ') ' + dt.toFixed(2) + 'ms ' +
                         (found ? 'true' : 'false') + (c ? ' cached' : ''));
            }
        }
        existsCalls++;
        return found;
    };

    StorageManager.remove = function (savefileId) {
        var name = this.externalFileName(savefileId);
        bridgeDelete(name);
        delete cache[name];
        setExistsCache(name, false);
        this.removeWebStorage(savefileId);
    };

    //-------------------------------------------------------------------------
    // Backup (.bak) / 备份
    //-------------------------------------------------------------------------
    // DataManager.saveGame() calls backup() before overwriting a save slot.
    // DataManager.saveGame() 会在覆盖存档槽之前调用 backup()。
    if (OPT_BACKUP) {

        StorageManager.backup = function (savefileId) {
            if (!this.exists(savefileId)) return;
            var data = this.load(savefileId);
            if (data === undefined || data === null || data === '') return;
            var name = this.externalFileName(savefileId) + '.bak';
            if (bridgeWrite(name, LZString.compressToBase64(data))) {
                log('backed up', name);
            }
        };

        StorageManager.backupExists = function (savefileId) {
            return bridgeExists(this.externalFileName(savefileId) + '.bak');
        };

        StorageManager.cleanBackup = function (savefileId) {
            bridgeDelete(this.externalFileName(savefileId) + '.bak');
        };

        StorageManager.restoreBackup = function (savefileId) {
            var name = this.externalFileName(savefileId) + '.bak';
            if (!bridgeExists(name)) return;
            var raw = bridgeRead(name);
            if (raw === null) return;
            if (bridgeWrite(this.externalFileName(savefileId), raw)) {
                delete cache[this.externalFileName(savefileId)];
                bridgeDelete(name);
                log('restored from backup', name);
            }
        };

    } else {
        // Explicit no-ops. Otherwise DataManager.saveGame() would fall through
        // to the original localStorage backup path and produce empty backups.
        // 显式置空。否则 DataManager.saveGame() 会走到原版的 localStorage
        // 备份分支，产生内容为空的备份。
        StorageManager.backup = function () { };
        StorageManager.backupExists = function () { return false; };
        StorageManager.cleanBackup = function () { };
        StorageManager.restoreBackup = function () { };
    }

    //-------------------------------------------------------------------------
    // UTA_CommonSave integration / UTA_CommonSave 适配
    //-------------------------------------------------------------------------
    // UTA_CommonSave defines its own storage layer that bypasses
    // StorageManager.save()/load(), so these four methods must be overridden
    // separately to keep common.rpgsave in the external directory.
    //
    // UTA_CommonSave 使用独立的存储层，不经过 StorageManager.save()/load()，
    // 因此需要单独覆盖以下四个方法，才能让 common.rpgsave 同样落到外置目录。
    var COMMON_SAVE_NAME = 'common.rpgsave';

    StorageManager.saveCommonSave = function (json) {
        if (!writeSave(COMMON_SAVE_NAME, json)) {
            this.saveToWebStorageCommonSave(json);
        }
    };

    StorageManager.loadCommonSave = function () {
        var json = readSave(COMMON_SAVE_NAME);
        if (json !== undefined) return json;
        return isExternalDirEmpty() ? this.loadFromWebStorageCommonSave() : null;
    };

    StorageManager.existsCommonSave = function () {
        if (bridgeExists(COMMON_SAVE_NAME)) return true;
        return isExternalDirEmpty() ? this.webStorageExistsCommonSave() : false;
    };

    StorageManager.removeCommonSave = function () {
        bridgeDelete(COMMON_SAVE_NAME);
        delete cache[COMMON_SAVE_NAME];
        this.removeWebStorageCommonSave();
    };

    //-------------------------------------------------------------------------
    // Legacy migration / 旧存档迁移
    //-------------------------------------------------------------------------
    function migrateLegacySaves() {
        // If the external directory already holds a global save file, it is
        // authoritative and no import is needed.
        // 外置目录已有 global.rpgsave 时以它为准，无需导入。
        if (bridgeExists('global.rpgsave')) {
            debugLog('migrate: external global.rpgsave exists, skip import');
            return;
        }
        debugLog('migrate: external dir empty, importing from localStorage');

        var ids = [-1, 0];
        var max = 20;
        try {
            max = DataManager.maxSavefiles();
        } catch (e) { /* use default / 使用默认值 */ }
        for (var i = 1; i <= max; i++) ids.push(i);

        var migrated = 0;
        for (var k = 0; k < ids.length; k++) {
            var id = ids[k];
            var name = StorageManager.externalFileName(id);
            if (bridgeExists(name)) continue;              // never overwrite / 绝不覆盖
            var legacy = null;
            try {
                legacy = localStorage.getItem(StorageManager.webStorageKey(id));
            } catch (e) { legacy = null; }
            if (!legacy) continue;
            debugLog('migrate: id=' + id + ' legacy=' + legacy.length + ' chars');
            var json = decompressSave(legacy);
            if (json && writeSave(name, json)) {
                migrated++;
                debugLog('migrate: id=' + id + ' -> ' + name + ' OK');
            } else {
                debugLog('migrate: id=' + id + ' FAILED (decoded=' + (!!json) + ')');
            }
        }

        // Common save data (UTA_CommonSave).
        // 共有存档数据（UTA_CommonSave）。
        if (!bridgeExists(COMMON_SAVE_NAME)) {
            var commonKey = 'RPG Common';
            try {
                if (typeof StorageManager.webStorageKeyCommonSave === 'function') {
                    commonKey = StorageManager.webStorageKeyCommonSave();
                }
            } catch (e) { /* use default key / 使用默认键名 */ }
            var legacyCommon = null;
            try {
                legacyCommon = localStorage.getItem(commonKey);
            } catch (e) { legacyCommon = null; }
            if (legacyCommon) {
                var jsonCommon = decompressSave(legacyCommon);
                if (jsonCommon && writeSave(COMMON_SAVE_NAME, jsonCommon)) migrated++;
            }
        }

        try {
            localStorage.setItem(MIGRATION_FLAG, '1');
        } catch (e) { /* ignored / 忽略 */ }

        debugLog('migrate: done, imported ' + migrated + ' save(s)');
        externalDirEmpty = null;   // re-detect on first use / 首次使用时重新检测
    }

    if (OPT_MIGRATE) {
        try {
            migrateLegacySaves();
        } catch (e) {
            console.error('[' + PLUGIN_NAME + '] legacy migration failed (game continues normally)', e);
        }
    }

    //-------------------------------------------------------------------------
    // Developer API / 开发者接口
    //-------------------------------------------------------------------------
    window.ExternalStorageSaveManager = {
        __installed: true,
        enabled: true,
        dir: function () {
            return StorageManager.externalSaveDir();
        },
        list: function () {
            try {
                var raw = bridge.listFiles();
                if (!raw) return [];
                if (Object.prototype.toString.call(raw) === '[object Array]') return raw;
                return String(raw).split('\n').filter(function (s) { return s.length > 0; });
            } catch (e) {
                return [];
            }
        }
    };

    console.log('[' + PLUGIN_NAME + '] external save storage enabled: ' + StorageManager.externalSaveDir());
    debugLog('init: dir=' + StorageManager.externalSaveDir() + ' backup=' + OPT_BACKUP + ' migrate=' + OPT_MIGRATE + ' debug=' + OPT_DEBUG);

})();
