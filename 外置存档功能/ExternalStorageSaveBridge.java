/*
 * ExternalStorageSaveBridge.java
 *
 * [English]
 * Native file I/O bridge for the ExternalStorageSaveManager plugin.
 *
 * COMPANION PLUGIN
 *   This class is the native half of a two-part feature. All game-side logic
 *   lives in js/plugins/ExternalStorageSaveManager.js, which overrides
 *   StorageManager to store save data in an external directory. That plugin
 *   requires this bridge; without it the plugin disables itself and the game
 *   keeps using the WebView's private storage.
 *
 *   Minimal integration (details in the plugin header):
 *     1. Register the bridge on the WebView before loading the game page:
 *          player.addJavascriptInterface(
 *              new ExternalStorageSaveBridge(this),
 *              ExternalStorageSaveBridge.INTERFACE_NAME);
 *     2. Add the ProGuard keep rule so release builds do not strip the
 *        @JavascriptInterface methods.
 *     3. Enable the plugin in js/plugins.js.
 *
 * RESPONSIBILITIES
 *   This class exposes only primitive file operations: read text, write text,
 *   test existence, delete, read metadata, list files, and append a log line.
 *   It contains no RMMV or LZString knowledge. Compression, file naming,
 *   caching, backup, and migration are handled by the plugin on the JS side,
 *   so this file rarely needs to change.
 *
 * DEFAULT SAVE DIRECTORY
 *     Android/data/<package>/files/save/
 *   This is the app-specific external directory, therefore:
 *     - no storage permission is required (Android 4.4+);
 *     - no root is required, and players can import/export saves with any
 *       file manager;
 *     - the system removes it when the app is uninstalled.
 *
 * [中文]
 * ExternalStorageSaveManager 插件的原生文件 I/O 桥。
 *
 * 配套插件
 *   本类是"双半实现"中的原生部分。所有游戏侧逻辑位于
 *   js/plugins/ExternalStorageSaveManager.js，它通过覆盖 StorageManager
 *   把存档写入外置目录。该插件依赖本桥；缺少本桥时插件会自动禁用，
 *   游戏继续使用 WebView 私有存储。
 *
 *   最小集成步骤（完整说明见插件头部注释）：
 *     1. 在加载游戏页之前，把桥注册到 WebView：
 *          player.addJavascriptInterface(
 *              new ExternalStorageSaveBridge(this),
 *              ExternalStorageSaveBridge.INTERFACE_NAME);
 *     2. 添加 ProGuard keep 规则，避免 release 构建裁剪
 *        @JavascriptInterface 方法。
 *     3. 在 js/plugins.js 中启用插件。
 *
 * 职责
 *   本类只暴露最原始的文件操作：读文本、写文本、判断存在、删除、读取元信息、
 *   列出文件、追加日志。它不包含任何 RMMV 或 LZString 知识；压缩、文件命名、
 *   缓存、备份与迁移全部由 JS 侧插件处理，因此本文件基本无需改动。
 *
 * 默认存档目录
 *     Android/data/<包名>/files/save/
 *   该目录属于应用专属外部目录，因此：
 *     - 不需要任何存储权限（Android 4.4 及以上）；
 *     - 不需要 root，玩家用任意文件管理器即可导入或导出存档；
 *     - 卸载应用时会被系统一并清除。
 *
 * Author: ArchiDreamZ
 */

package jp.hbox.ImoutoFantasy;

import android.content.Context;
import android.webkit.JavascriptInterface;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class ExternalStorageSaveBridge {

    /**
     * [EN] Interface name exposed to JavaScript. Must match the name probed by
     *      js/plugins/ExternalStorageSaveManager.js.
     * [CN] 暴露给 JavaScript 的接口名，必须与
     *      js/plugins/ExternalStorageSaveManager.js 中探测的名称一致。
     */
    public static final String INTERFACE_NAME = "ExternalStorageSaveBridge";

    /**
     * [EN] Log file lives next to the save directory to keep saves clean.
     * [CN] 日志文件放在存档目录的上一级，避免污染存档目录。
     */
    private static final String LOG_FILE_NAME = "log.txt";

    private final File mSaveDir;
    private final File mLogFile;

    public ExternalStorageSaveBridge(Context context) {
        File externalRoot = context.getExternalFilesDir(null);
        if (externalRoot == null) {
            // External storage unavailable (e.g. not mounted): fall back to
            // internal storage instead of crashing.
            // 外部存储不可用（例如未挂载）时退回内部目录，避免崩溃。
            externalRoot = context.getFilesDir();
        }

        File dir = new File(externalRoot, "save");
        if (!dir.exists()) {
            dir.mkdirs();
        }
        mSaveDir = dir;
        mLogFile = new File(mSaveDir.getParentFile(), LOG_FILE_NAME);
    }

    //=========================================================================
    // Methods exposed to JavaScript / 暴露给 JavaScript 的方法
    //=========================================================================

    /**
     * [EN] Absolute path of the save directory.
     * [CN] 存档目录的绝对路径。
     */
    @JavascriptInterface
    public String getSaveDir() {
        return mSaveDir.getAbsolutePath();
    }

    /**
     * [EN] Write a UTF-8 text file. Returns true on success.
     * [CN] 写入 UTF-8 文本文件，成功返回 true。
     */
    @JavascriptInterface
    public boolean writeFile(String name, String content) {
        File file = resolve(name);
        if (file == null || content == null) return false;

        FileOutputStream out = null;
        try {
            out = new FileOutputStream(file);
            out.write(content.getBytes("UTF-8"));
            out.flush();
            return true;
        } catch (IOException e) {
            log("writeFile failed: " + name + " -> " + e.getMessage());
            return false;
        } finally {
            if (out != null) {
                try { out.close(); } catch (IOException ignored) { }
            }
        }
    }

    /**
     * [EN] Read a UTF-8 text file. Returns null when missing or on error.
     * [CN] 读取 UTF-8 文本文件，不存在或出错时返回 null。
     */
    @JavascriptInterface
    public String readFile(String name) {
        File file = resolve(name);
        if (file == null || !file.isFile()) return null;

        FileInputStream in = null;
        try {
            long len = file.length();
            if (len > Integer.MAX_VALUE - 8) return null;   // not reachable in practice / 实际不会发生
            byte[] buf = new byte[(int) len];
            in = new FileInputStream(file);
            int offset = 0;
            while (offset < buf.length) {
                int n = in.read(buf, offset, buf.length - offset);
                if (n <= 0) break;
                offset += n;
            }
            return new String(buf, 0, offset, "UTF-8");
        } catch (IOException e) {
            log("readFile failed: " + name + " -> " + e.getMessage());
            return null;
        } finally {
            if (in != null) {
                try { in.close(); } catch (IOException ignored) { }
            }
        }
    }

    /**
     * [EN] Whether the file exists.
     * [CN] 文件是否存在。
     */
    @JavascriptInterface
    public boolean exists(String name) {
        File file = resolve(name);
        return file != null && file.isFile();
    }

    /**
     * [EN] Delete a file. Returns true on success.
     * [CN] 删除文件，成功返回 true。
     */
    @JavascriptInterface
    public boolean delete(String name) {
        File file = resolve(name);
        return file != null && file.isFile() && file.delete();
    }

    /**
     * [EN] File metadata as "<lastModified>|<length>", or an empty string when
     *      the file is missing. The JS side uses it for cache invalidation,
     *      so replacing a save from a file manager is detected.
     * [CN] 文件元信息，格式为 "<lastModified>|<length>"，文件不存在时返回空字符串。
     *      JS 侧用它做缓存失效判断，玩家从文件管理器替换存档时能被检测到。
     */
    @JavascriptInterface
    public String getFileMeta(String name) {
        File file = resolve(name);
        if (file == null || !file.isFile()) return "";
        return file.lastModified() + "|" + file.length();
    }

    /**
     * [EN] List file names in the save directory, separated by '\n'.
     *      Subdirectories are skipped.
     * [CN] 列出存档目录内的文件名，以 '\n' 分隔，忽略子目录。
     */
    @JavascriptInterface
    public String listFiles() {
        String[] names = mSaveDir.list();
        if (names == null || names.length == 0) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < names.length; i++) {
            File f = new File(mSaveDir, names[i]);
            if (!f.isFile()) continue;
            if (sb.length() > 0) sb.append('\n');
            sb.append(names[i]);
        }
        return sb.toString();
    }

    /**
     * [EN] Append one line to Android/data/<package>/files/log.txt for on-device
     *      troubleshooting.
     * [CN] 向 Android/data/<包名>/files/log.txt 追加一行日志，便于真机排查。
     */
    @JavascriptInterface
    public void log(String message) {
        if (message == null) return;
        FileOutputStream out = null;
        try {
            out = new FileOutputStream(mLogFile, true);
            String line = "[" + System.currentTimeMillis() + "] " + message + "\n";
            out.write(line.getBytes("UTF-8"));
            out.flush();
        } catch (IOException ignored) {
            // Logging failures must never affect the game.
            // 日志写入失败不得影响游戏。
        } finally {
            if (out != null) {
                try { out.close(); } catch (IOException ignored) { }
            }
        }
    }

    //=========================================================================
    // Internal helpers / 内部工具
    //=========================================================================

    /**
     * [EN] Resolve a JS-provided file name inside the save directory and reject
     *      path traversal ("../", absolute paths, subdirectories).
     * [CN] 将 JS 传入的文件名解析为存档目录下的文件，并拦截目录穿越
     *      （"../"、绝对路径、子目录）。
     */
    private File resolve(String name) {
        if (name == null) return null;
        String trimmed = name.trim();
        if (trimmed.isEmpty()) return null;
        if (trimmed.indexOf('/') >= 0) return null;
        if (trimmed.indexOf('\\') >= 0) return null;
        if (trimmed.indexOf("..") >= 0) return null;
        if (trimmed.length() > 128) return null;
        return new File(mSaveDir, trimmed);
    }
}
