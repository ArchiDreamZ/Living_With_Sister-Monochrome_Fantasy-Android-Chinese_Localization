/*---------------------------------------------------------------------------*
 * Torigoya_SaveCommand.js
 *---------------------------------------------------------------------------*
 * 2019/01/26 ru_shalm
 * http://torigoya.hatenadiary.jp/
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc Add save command in Plugin Command
 * @author ru_shalm
 *
 * @help
 *
 * Plugin Command:
 *   SaveCommand save 1       # save to slot 1
 *   SaveCommand save [1]     # save to slot variables[1]
 *   SaveCommand save last    # save to last accessed file
 *   SaveCommand load 1       # load from slot 1
 *   SaveCommand load [1]     # load from slot variables[1]
 *   SaveCommand load last    # load from last accessed file
 *   SaveCommand remove 1     # remove save file of slot 1
 *   SaveCommand remove [1]   # remove save file of slot variables[1]
 *   SaveCommand remove last  # remove last accessed file
 *
 * (default last accessed file: 1)
 */

/*:ja
 * @plugindesc プラグインコマンドからセーブを実行できるようにします。
 * @author ru_shalm
 *
 * @help
 * イベントコマンドの「プラグインコマンド」を使って、
 * イベント中に自動的にセーブを実行できるようになります。
 *
 * 例えばオートセーブのゲームなどが作れるようになります。
 *
 * ------------------------------------------------------------
 * ■ プラグインコマンド（セーブ系）
 * ------------------------------------------------------------
 *
 * ● スロット1にセーブを実行する
 * SaveCommand save 1
 *
 * ※ 1 の部分の数字を変えると別のスロットにセーブされます
 *
 * ● 変数[1]番のスロットにセーブを実行する
 * SaveCommand save [1]
 *
 * ● 前回ロード/セーブしたスロットにセーブを実行する
 * SaveCommand save last
 *
 * ※ ロード/セーブしていない場合はスロット1になります。
 *
 * ＜おまけ＞
 * セーブ時に以下のように末尾に「notime」をつけることで
 * セーブ時刻を更新せずにセーブすることができます。
 *
 * SaveCommand save 1 notime
 *
 * これによってロード画面でカーソル位置をオートセーブした場所ではなく
 * プレイヤーが自分でセーブしたファイルに合わせたままにすることができます。
 *
 * ------------------------------------------------------------
 * ■ プラグインコマンド（ロード系）
 * ------------------------------------------------------------
 * ＜注意＞
 * RPGツクールはイベントの途中で
 * セーブデータがロードされることが想定されていません。
 * そのためイベントのタイミングによっては、
 * ロード後のゲームの動作がおかしくなることがあります。
 *
 * ● スロット1からロードを実行する
 * SaveCommand load 1
 *
 * ● 変数[1]番のスロットからロードを実行する
 * SaveCommand load [1]
 *
 * ● 前回ロード/セーブしたスロットからロードを実行する
 * SaveCommand load last
 *
 * ※ ロード/セーブしていない場合はスロット1になります。
 *
 * ● 一番最後にセーブをしたスロットからロードを実行する
 * SaveCommand load latest
 *
 * ※ last ではなく latest です＞＜；
 *
 * ------------------------------------------------------------
 * ■ プラグインコマンド（削除系）
 * ------------------------------------------------------------
 * ＜注意＞
 * セーブデータを削除するコマンドなので取扱注意ですよ！
 *
 * ● スロット1を削除する
 * SaveCommand remove 1
 *
 * ● 変数[1]番のスロットを削除する
 * SaveCommand remove [1]
 *
 * ● 前回ロード/セーブしたスロットを削除する
 * SaveCommand remove last
 *
 * ※ ロード/セーブしていない場合はスロット1になります。
 */

(function (global) {
    'use strict';

    var SaveCommand = {
        name: 'Torigoya_SaveCommand',
        settings: {},
        lastTimestamp: undefined,
        lastAccessId: undefined
    };

    // -------------------------------------------------------------------------
    // SaveCommand

    /**
     * スロットID指定文字列からスロットIDを求める
     * @param {string} str
     * @returns {number}
     */
    SaveCommand.parseSlotId = function (str) {
        var slotId, matches;
        if (matches = str.match(/^\[(\d+)\]$/)) {
            slotId = $gameVariables.value(~~matches[1]);
        } else if (str.match(/^\d+$/)) {
            slotId = ~~str;
        } else {
            switch (str) {
                case 'last':
                    slotId = DataManager.lastAccessedSavefileId();
                    break;
                case 'latest':
                    slotId = DataManager.latestSavefileId();
                    break;
            }
        }

        if (~~slotId <= 0) {
            throw '[Torigoya_SaveCommand.js] invalid SlotId: ' + slotId;
        }

        return slotId;
    };

    /**
     * セーブ系コマンド処理の実行
     * @param {Game_Interpreter} gameInterpreter
     * @param {string} type
     * @param {number} slotId
     * @param {boolean} skipTimestamp
     */
    SaveCommand.runCommand = function (gameInterpreter, type, slotId, skipTimestamp) {
        switch (type) {
            case 'load':
                this.runCommandLoad(gameInterpreter, slotId);
                break;
            case 'save':
                this.runCommandSave(gameInterpreter, slotId, skipTimestamp);
                break;
            case 'remove':
                this.runCommandRemove(gameInterpreter, slotId);
                break;
        }
    };

    /**
     * ロード処理
     * @note ちょっと無理やり感があるのでイベントの組み方次第ではまずそう
     * @param {Game_Interpreter} gameInterpreter
     * @param {number} slotId
     */
    SaveCommand.runCommandLoad = function (gameInterpreter, slotId) {
        if (!DataManager.isThisGameFile(slotId)) return;

        var scene = SceneManager._scene;
        scene.fadeOutAll();
        DataManager.loadGame(slotId);
        gameInterpreter.command115(); // 今のイベントが継続しないように中断コマンドを実行する
        Scene_Load.prototype.reloadMapIfUpdated.apply(scene);
        SceneManager.goto(Scene_Map);
        $gameSystem.onAfterLoad();
    };

    /**
     * セーブ処理
     * @param {Game_Interpreter} gameInterpreter
     * @param {number} slotId
     * @param {boolean} skipTimestamp
     */
    SaveCommand.runCommandSave = function (gameInterpreter, slotId, skipTimestamp) {
        if (skipTimestamp) {
            var info = DataManager.loadSavefileInfo(slotId);
            SaveCommand.lastTimestamp = info && info.timestamp ? info.timestamp : 0;
            SaveCommand.lastAccessId = DataManager.lastAccessedSavefileId();
        }

        // そのままセーブしてしまうと
        // ロード時にもプラグインコマンドが呼び出されてしまうため
        // 次の行のイベントコマンドから始まるように細工する
        var originalIndex = gameInterpreter._index;
        gameInterpreter._index++;

        $gameSystem.onBeforeSave();
        if (DataManager.saveGame(slotId) && StorageManager.cleanBackup) {
            StorageManager.cleanBackup(slotId);
        }

        if (skipTimestamp) {
            DataManager._lastAccessedId = SaveCommand.lastAccessId;
            SaveCommand.lastTimestamp = undefined;
            SaveCommand.lastAccessId = undefined;
        }

        // 細工した分を戻す
        gameInterpreter._index = originalIndex;
    };

    /**
     * セーブファイルの削除処理
     * @param {Game_Interpreter} _
     * @param {number} slotId
     */
    SaveCommand.runCommandRemove = function (_, slotId) {
        StorageManager.remove(slotId);
    };

    // -------------------------------------------------------------------------
    // alias

    var upstream_DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
    DataManager.makeSavefileInfo = function () {
        var info = upstream_DataManager_makeSavefileInfo.apply(this);
        if (SaveCommand.lastTimestamp !== undefined) {
            info.timestamp = SaveCommand.lastTimestamp;
        }
        return info;
    };

    var upstream_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        if (command === 'SaveCommand') {
            var type = (args[0] || '').trim();
            var slotId = SaveCommand.parseSlotId((args[1] || '').trim());
            var skipTimestamp = (args[2] === 'notime');
            SaveCommand.runCommand(this, type, slotId, skipTimestamp);
            return;
        }
        upstream_Game_Interpreter_pluginCommand.apply(this, arguments);
    };

    // -------------------------------------------------------------------------
    global.Torigoya = (global.Torigoya || {});
    global.Torigoya.SaveCommand = SaveCommand;
})(window);
