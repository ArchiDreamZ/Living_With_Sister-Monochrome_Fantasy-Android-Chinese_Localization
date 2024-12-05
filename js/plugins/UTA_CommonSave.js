//=============================================================================
// UTA_CommonSave.js
//=============================================================================
// Version    : 1.20
// LastUpdate : 2016.05.11
// Author     : T.Akatsuki
// Website    : http://utakata-no-yume.net/
// License    : MIT License(http://opensource.org/licenses/mit-license.php)
//=============================================================================

//=============================================================================
/*:
 * @plugindesc Create a share save data. Share state of game switch and variables between each save data.
 * @author T.Akatsuki
 * 
 * @param Target Switches
 * @desc Set target switch index number.
 * If you want to set multiple, put comma between indexes.
 * Using "-", the range can be specified.
 * (ex) 1-3,11,12,13,20,21
 * @default 
 * 
 * @param Target Variables
 * @desc Set target variable index number.
 * If you want to set multiple, put comma between indexes.
 * Using "-", the range can be specified.
 * (ex) 1-5,11,12,13,23,24
 * @default 
 * 
 * @param Is Auto
 * @desc Automatically to set save / load common save data on save / load timing.
 * true  : Automatically common save data is saved/loaded on save / load timing.
 * false : Save and load of common save data you do manually.
 * @default true
 * 
 * @param Auto on Gameover
 * @desc If auto saving common save data is enabled , it automatically saves common save data on gameover.
 * true  : It save common save data on game over.
 * false : It do nothing on game over. 
 * @default false
 * 
 * @param Show Trace
 * @desc Set state traces display.
 * true  : Show trace., false : Don't show trace.
 * @default false
 * 
 * @help # Overview
 * Create a share save data. Share state of game switch and variables between each save data.
 * If you use plugin command, you can operate common save data at any time.
 * 
 * Common save data will be saved with a name "common.rpgsave" below save directory.
 * 
 * # Parameters
 *   Target Switches [Switch No, ...]
 *     Set target switch index number.
 *     If you want to set multiple, put comma between indexes.
 *     Using "-", the range can be specified.
 *     (Ex) 1-3,11,12,13,20,21
 *            => number 1,2,3,11,12,13,20,21 switches are target.
 * 
 *   Target Variables [Valiable No, ...]
 *     Set target variable index number.
 *     If you want to set multiple, put comma between indexes.
 *     Using "-", the range can be specified.
 *     (Ex) 1-3,11,12,13,14,15
 *            => number 1,2,3,11,12,13,14,15 variables are target.
 * 
 *   Is Auto [true|false]
 *     Automatically to set save / load common save data on save / load timing.
 * 
 *   Auto on Gameover [true|false]
 *     If auto saving common save data is enabled , it automatically saves common save data on gameover.
 * 
 *   Show Trace [true|false]
 *     Set whether the issue a trace for debugging.
 * 
 * # Plugin Command
 *   CommonSave load                  # Read GameSwitches and GameVariables from common save data and apply game data.
 *                                    # This command is used when you want to load common save data at any time.
 *   CommonSave save                  # Save target GameSwitches and GameVariables common save data.
 *                                    # This command is used when you want to save in common save data at any time.
 *   CommonSave remove                # Remove common save data file.
 * 
 *   CommonSave setTrace [true|false] # Setting to enabled trace on console.
 * 
 *   CommonSave check                 # Show sharing target switches and variables to console.
 * 
 * # Change Log
 *   ver 1.20 (2016.05.11)
 *     Using "-", the range can be specified.
 *     Add setTrace plugin command.
 *     Add check plugin command.
 * 
 *   ver 1.10 (Fed 17, 2016)
 *     Rename to UTA_CommonSave.js.
 *     To be able to set trace in the parameter.
 * 
 *   ver1.01 (Jan 14, 2016)
 *     Fixed bug where could not share variables.
 * 
 *   ver1.00 (Dec 31, 2015)
 *     To ver1.00 according to the Japanese version of RPG Maker MV.
 * 
 *   ver0.01 (Nov 05, 2015)
 *     Initial release.
 */

/*:ja
 * @plugindesc 共有のセーブデータを作成し、指定したスイッチ・変数の状態をセーブデータ間で共有します。
 * @author 赤月 智平
 * 
 * @param Target Switches
 * @desc 対象となるスイッチの番号を指定します。
 * カンマ区切りで複数指定、ハイフンで範囲指定が可能です。
 * (例) 1-3,11,12,13,20,21
 * @default 
 * 
 * @param Target Variables
 * @desc 対象となる変数の番号を指定します。
 * カンマ区切りで複数指定、ハイフンで範囲指定が可能です。
 * (例) 1-5,11,12,13,23,24
 * @default 
 * 
 * @param Is Auto
 * @desc セーブ・ロード時に自動的に共通セーブデータのセーブ・ロードを行うかを設定します。
 *       true  : セーブ・ロード時に自動的に共有セーブデータにデータのセーブ・ロードを行う。
 *       false : 共通セーブデータのセーブ・ロードは手動で行う。
 * @default true
 * 
 * @param Auto on Gameover
 * @desc 自動セーブ設定がONの時にゲームオーバー時に共有セーブデータの自動セーブを行うかを設定します。
 *       true  : ゲームオーバー時に自動共有セーブを行う。
 *       false : ゲームオーバー時は自動共有セーブを行わない。
 * @default false
 * 
 * @param Show Trace
 * @desc デバッグ用のトレースを出すかを設定します。
 * true: トレースを表示, false: トレースを表示しない
 * @default false
 * 
 * @help ■概要
 * CommonSaveプラグインは共有セーブデータを作成し、指定したスイッチ・変数の状態をセーブデータ間で共有する事ができます。
 * 基本的にはセーブ・ロード時に設定に応じて自動的に処理してくれます。
 * プラグインコマンドを利用すると、任意のタイミングで共有セーブデータの操作を行う事ができます。
 *
 * 共有セーブデータはsaveディレクトリ以下に「common.rpgsave」という名前で保存されます。
 * 
 * ■パラメータの説明
 *   Target Switches [スイッチ番号, ...]
 *     共有したいスイッチの番号を指定します。「,」で区切り複数の値を指定する事ができます。
 *     「-」で数値の範囲を指定する事も可能です。
 *     (例) 1-3,11,12,13,20,21
 *            => 1,2,3,11,12,13,20,21番のスイッチが対象になる。
 * 
 *   Target Variables [変数番号, ...]
 *     共有したい変数の番号を指定します。「,」で区切り複数の値を指定する事ができます。
 *     「-」で数値の範囲を指定する事も可能です。
 *     (例) 1-3,11,12,13,14,15
 *            => 1,2,3,11,12,13,14,15番の変数が対象になる。
 * 
 *   Is Auto [true|false]
 *     セーブ・ロード時に自動的に共通セーブデータのセーブ・ロードを行うかを設定します。
 *     デフォルトではtrue(セーブ・ロード時に自動的に共有セーブ・ロードを行う)になっています。
 * 
 *   Auto on Gameover [true|false]
 *     自動セーブ設定がONの時にゲームオーバー時に共有セーブデータの自動セーブを行うかを設定します。
 *     デフォルトではfalse(ゲームオーバー時に自動共有セーブを行わない)になっています。
 * 
 *   Show Trace [true|false]
 *     デバッグ用のトレースを出すかを設定します。
 * 
 * ■プラグインコマンド
 *   CommonSave load                  # 共有セーブデータからスイッチ・変数を読み込み反映させます。
 *                                    # 任意のタイミングで共有セーブデータのロードを行いたい場合に使用します。
 *   CommonSave save                  # 共有セーブデータにスイッチ・変数の状態を記録します。
 *                                    # 任意のタイミングで共有セーブデータのセーブを行いたい場合に使用します。
 *   CommonSave remove                # 共有セーブデータを削除します。
 *                                    # 共有セーブデータをリセットしたい場合に使用します。
 *   CommonSave setTrace [true|false] # コンソールにトレースを出力するかを設定します。
 *                                    # ゲーム実行中にトレース状態を切り替えたい場合に使用します。
 *   CommonSave check                 # 共有状態になっているスイッチ・変数番号をコンソールに表示し確認します。
 * 
 * ■更新履歴
 *   ver 1.20 (2016.05.11)
 *     スイッチ・変数の指定の際に「-」を使う事で範囲指定を可能に。
 *     トレース状態を動的に変えられるように setTrace プラグインコマンドを追加。
 *     共有対象になっているスイッチ・変数を確認できる check プラグインコマンドを追加。
 * 
 *   ver 1.10 (2016.02.17)
 *     ファイル名をUTA_CommonSave.jsに変更。
 *     トレース出力の有無をパラメータで設定できるように。
 * 
 *   ver 1.01 (2016.01.14)
 *     変数の共有が上手くできていないバグの修正。
 * 
 *   ver 1.00 (2015.12.31)
 *     日本語版RPGツクールMVの発売に合わせver1.00に。
 * 
 *   ver 0.01 (2015.11.05)
 *     初版。
 */
//=============================================================================

//name space
var utakata = utakata || (utakata = {});

//-----------------------------------------------------------------------------
// class CommonSaveManager
//-----------------------------------------------------------------------------
(function(utakata){
    var CommonSaveManager = (function(){
        //constructor
        function CommonSaveManager(){
            //member variables
            this._targetSwitchList = [];
            this._targetVariableList = [];

            this._showTrace = false;
            this._tr = null;

            this.initialize();
        }

        //private methods
        CommonSaveManager.prototype.initialize = function(){
            this.parameters = PluginManager.parameters('UTA_CommonSave');

            this._showTrace = (String(this.parameters['Show Trace']) === "true");

            this._tr = function(s){
                        if(!this._showTrace){ return; }
                        var str = "CommonSaveManager: " + s; console.log(str);
            };

            var targetSwitchStr = String(this.parameters['Target Switches']);
            var targetVariableStr = String(this.parameters['Target Variables']);

            this._targetSwitchList = this._parseTargetNumber(targetSwitchStr);
            this._targetVariableList = this._parseTargetNumber(targetVariableStr);
        };

        CommonSaveManager.prototype._parseTargetNumber = function(str){
            if(typeof str === "undefined" || str === "undefined"){ return []; }

            str = str.replace(/\s+/g, "");

            var split_str = ',';
            var rgn_split_str = '-';

            var indexes = str.split(split_str, -1);
            var ret = [];

            var parseTargetNumbersFromRegion = function(rgn_target){
                var ret = [];
                var target_number = rgn_target.split(rgn_split_str, -1);
                if(typeof target_number[0] === "undefined" || typeof target_number[1] === "undefined"){ return []; }

                var s_number = parseInt(target_number[0]);
                if(s_number !== s_number){
                    this._tr("_parseTargetNumber getTargetNumbersFromRegion: Setting parameter is invalid.");
                    return [];
                }

                var e_number = parseInt(target_number[1]);
                if(e_number !== e_number){
                    this._tr("_parseTargetNumber getTargetNumbersFromRegion: Setting parameter is invalid.");
                    return [];
                }

                for(var i = s_number; i <= e_number; i++){
                    ret.push(i);
                }

                return ret;
            };

            for(var i = 0; i < indexes.length; i++){
                var rgn_target = indexes[i].match(/\d+-\d+/g);
                if(!!rgn_target){
                    var parseIndexes = parseTargetNumbersFromRegion(rgn_target[0]);
                    if(parseIndexes.length <= 0){ continue; }

                    ret = ret.concat(parseIndexes);
                }else{
                    var parseIndex = parseInt(indexes[i]);
                    if(parseIndex !== parseIndex){
                        this._tr("_parseTargetNumber: Setting parameter is invalid.");
                        continue;
                    }
                    ret.push(parseIndex);
                }
            }
            return ret;
        };

        CommonSaveManager.prototype._getTargetSwitchJson = function(){
            var json = { };

            for(var i = 0; i < this._targetSwitchList.length; i++){
                var idx = this._targetSwitchList[i].toString();
                var value = $gameSwitches.value(idx);
                json[idx] = value;
            }

            return json;
        };

        CommonSaveManager.prototype._getTargetVariableJson = function(){
            var json = { };

            for(var i = 0; i < this._targetVariableList.length; i++){
                var idx = this._targetVariableList[i].toString();
                var value = $gameVariables.value(idx);
                json[idx] = value;
            }

            return json;
        };

        CommonSaveManager.prototype.setLoadSwitches = function(switches){
            for(var key in switches){
                var idx = parseInt(key);
                var value = switches[key];
                $gameSwitches.setValue(idx, value);
            }
        };

        CommonSaveManager.prototype.setLoadVariables = function(variables){
            for(var key in variables){
                var idx = parseInt(key);
                var value = variables[key];
                $gameVariables.setValue(idx, value);
            }
        };

        //public methods
        CommonSaveManager.prototype.load = function(){
            this._tr("load common save data.");

            //if(!this.exists()){ return false; }

            var loadData = DataManager.loadCommonSave();
            if("gameSwitches" in loadData){
                this.setLoadSwitches(loadData["gameSwitches"]);
            }
            if("gameVariables" in loadData){
                this.setLoadVariables(loadData["gameVariables"]);
            }
        };

        CommonSaveManager.prototype.save = function(){
            this._tr("save common save data.");

            var switchesJson = this._getTargetSwitchJson();
            var variablesJson = this._getTargetVariableJson();

            var json = { "gameSwitches": switchesJson, 
                         "gameVariables": variablesJson };

            DataManager.saveCommonSave(json);
        };

        CommonSaveManager.prototype.exists = function(){
            this._tr("check exists common save data.");
            return StorageManager.existsCommonSave();
        };

        CommonSaveManager.prototype.remove = function(){
            this._tr("remove common save data.");
            StorageManager.removeCommonSave();
        };

        CommonSaveManager.prototype.setShowTrace = function(args){
            if(!args){ return; }
            var enabled = String(args[1]) === "true" ? true : false;
            this._tr("setShowTrace: " + this._showTrace);
            this._showTrace = enabled;
        };

        CommonSaveManager.prototype.check = function(){
            var str = "CommonSaveManager: \n";
            str += " # Share switch targets : \n";
            str += JSON.stringify(this._targetSwitchList);

            str += "\n # Share variable targets : \n";
            str += JSON.stringify(this._targetVariableList);

            console.log(str);
        };

        CommonSaveManager.prototype.isAuto = function(){
            return String(this.parameters['Is Auto']) === "true";
        };

        CommonSaveManager.prototype.isAutoOnGameOver = function(){
            return String(this.parameters['Auto on Gameover']) === "true";
        };

        return CommonSaveManager;
    })();
    utakata.CommonSaveManager = new CommonSaveManager();

})(utakata || (utakata = {}));

(function(){
    //parse and dispatch plugin command
    var _Game_Interpreter_pluginCommand = 
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args){
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if(command === 'CommonSave'){
            switch(args[0]){
                case 'load':
                    utakata.CommonSaveManager.load();
                    break;
                case 'save':
                    utakata.CommonSaveManager.save();
                    break;
                case 'exists':
                    utakata.CommonSaveManager.exists();
                    break;
                case 'remove':
                    utakata.CommonSaveManager.remove();
                    break;
                case 'setTrace': 
                    utakata.CommonSaveManager.setShowTrace(args);
                    break;
                case 'check': 
                    utakata.CommonSaveManager.check();
                    break;
                default:
                    break;
            }
        }
    };

    //-----------------------------------------------------------------------------
    // DataManager
    //-----------------------------------------------------------------------------
    // # extension
    var _Data_Manager_loadGame = DataManager.loadGame;
    DataManager.loadGame = function(savefileId){
        var ret = _Data_Manager_loadGame.call(this, savefileId);

        if(utakata.CommonSaveManager.isAuto()){ utakata.CommonSaveManager.load(); }
        return ret;
    };

    var _Data_Manager_saveGame = DataManager.saveGame;
    DataManager.saveGame = function(savefileId){
        var ret = _Data_Manager_saveGame.call(this, savefileId);

        if(utakata.CommonSaveManager.isAuto()){ utakata.CommonSaveManager.save(); }
        return ret;
    };

    var _Data_Manager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function(){
        _Data_Manager_setupNewGame.call(this);
        if(utakata.CommonSaveManager.isAuto()){
            utakata.CommonSaveManager.load();
        }
    };

    // # add methods
    DataManager.loadCommonSave = function(){
        var json;
        try{
            json = StorageManager.loadCommonSave();
        }catch(e){
            console.error(e);
            return [];
        }
        if(json){
            var commonInfo = JSON.parse(json);
            return commonInfo;
        }else{
            return [];
        }
    };

    DataManager.saveCommonSave = function(json){
        var jsonStr = JsonEx.stringify(json);
        if(jsonStr.length >= 200000){
            console.warn('Common Save too big!');
        }
        StorageManager.saveCommonSave(jsonStr);
        return true;
    };

    //-----------------------------------------------------------------------------
    // StorageManager
    //-----------------------------------------------------------------------------
    //load methods ----------------------------------------------------------------
    StorageManager.loadCommonSave = function(){
        if(this.isLocalMode()){
            return this.loadFromLocalFileCommonSave();
        }else{
            return this.loadFromWebStorageCommonSave();
        }
    };

    StorageManager.loadFromLocalFileCommonSave = function(){
        var data = null;
        var fs = require('fs');
        var filePath = this.localFilePathCommonSave();
        if (fs.existsSync(filePath)) {
            data = fs.readFileSync(filePath, { encoding: 'utf8' });
        }
        return LZString.decompressFromBase64(data);
    };

    StorageManager.loadFromWebStorageCommonSave = function(){
        var key = this.webStorageKeyCommonSave();
        var data = localStorage.getItem(key);
        //var data = ServerSave.ServerSaveManager.loadFromWebServer(key);
         return LZString.decompressFromBase64(data);
    };

    // save methods ---------------------------------------------------------------
    StorageManager.saveCommonSave = function(json){
        if(this.isLocalMode()){
            this.saveToLocalFileCommonSave(json);
        }else{
            this.saveToWebStorageCommonSave(json);
        }
    };

    StorageManager.saveToLocalFileCommonSave = function(json){
        var data = LZString.compressToBase64(json);
        var fs = require('fs');
        var dirPath = this.localFileDirectoryPath();
        var filePath = this.localFilePathCommonSave();
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        fs.writeFileSync(filePath, data);
    };

    StorageManager.saveToWebStorageCommonSave = function(json){
        var key = this.webStorageKeyCommonSave();
        var data = LZString.compressToBase64(json);
        localStorage.setItem(key, data);
        //ServerSave.ServerSaveManager.saveToWebServer(key, data);
    };

    //check exists ----------------------------------------------------------------
    StorageManager.existsCommonSave = function(){
        if(this.isLocalMode()){
            return this.localFileExistsCommonSave();
        }else{
            return this.webStorageExistsCommonSave();
        }
    };

    StorageManager.localFileExistsCommonSave = function(){
        var fs = require('fs');
        return fs.existsSync(this.localFilePathCommonSave());
    };

    StorageManager.webStorageExistsCommonSave = function(){
        var key = this.webStorageKeyCommonSave();
        return !!localStorage.getItem(key);
    };

    //remove ----------------------------------------------------------------------
    StorageManager.removeCommonSave = function(){
        if(this.isLocalMode()){
            this.removeLocalFileCommonSave();
        }else{
            this.removeWebStorageCommonSave();
        }
    };

    StorageManager.removeLocalFileCommonSave = function(){
        var fs = require('fs');
        var filePath = this.localFilePathCommonSave();
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
        }
    };

    StorageManager.removeWebStorageCommonSave = function(){
        var key = this.webStorageKeyCommonSave();
        localStorage.removeItem(key);
    };

    StorageManager.localFilePathCommonSave = function(){ return this.localFileDirectoryPath() + 'common.rpgsave'; };
    StorageManager.webStorageKeyCommonSave = function(){ return 'RPG Common'; };


    //-----------------------------------------------------------------------------
    // Scene_Gameover
    //-----------------------------------------------------------------------------
    var _Scene_Gameover_Start = Scene_Gameover.prototype.start;
    Scene_Gameover.prototype.start = function(){
        if(utakata.CommonSaveManager.isAutoOnGameOver()){
            utakata.CommonSaveManager.save();
        }
        _Scene_Gameover_Start.call(this);
    };

})();
