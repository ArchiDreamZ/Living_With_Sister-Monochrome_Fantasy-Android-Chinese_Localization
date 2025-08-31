//=============================================================================
// UTA_MessageSkip.js
//=============================================================================
// Version    : 1.00
// LastUpdate : 2016.02.17
// Author     : T.Akatsuki
// Website    : http://utakata-no-yume.net/
// License    : MIT License(http://opensource.org/licenses/mit-license.php)
//=============================================================================

//=============================================================================
/*:
 * @plugindesc Skip message on pressing a particular key.
 * @author T.Akatsuki
 * 
 * @param Skip Key
 * @desc Set the message skip key. The value has been defined in the Input.KeyMapper is valid.
 * @default control
 * 
 * @param Show Trace
 * @desc Set state traces display.
 * true  : Show trace., false : Don't show trace.
 * @default false
 * 
 * @help # Overview
 * MessageSkip plugin can be done to skip in that continue to press a specfic key in a message display.
 * Well there is a message skip functions in such Novel games.
 * Skip if choice window will be temporarily supended.
 * 
 * # Parameters
 *   Skip Key [any key]
 *     Set the message skip key.
 *     The value that has been defined in Input.keyMapper is valid.
 *     Initial value is in 'control'.
 * 
 *   Show Trace [true|false]
 *     Set whether the issue a trace for debugging.
 * 
 * # Plugin Commands
 *   There is no plugin command.
 * 
 * # Change Log
 *   ver 1.00 (Feb 17, 2016)
 *     Initial release.
 */

/*:ja
 * @plugindesc 特定キーを押す事でメッセージをスキップできるようにします。
 * @author 赤月 智平
 * 
 * @param Skip Key
 * @desc メッセージスキップキーを設定します。Input.keyMapperに定義された値が有効です。
 * @default control
 * 
 * @param Show Trace
 * @desc デバッグ用のトレースを出すかを設定します。
 * true: トレースを表示, false: トレースを表示しない
 * @default false
 * 
 * @help ■概要
 * MessageSkipプラグインではメッセージ表示中に特定のキーを押し続ける事で
 * スキップ処理を行う事ができます。
 * ADV等で良くあるメッセージスキップの機能です。
 * 選択肢を挟む場合は選択肢が表示されるタイミングでスキップが中断されます。
 * 
 * ■パラメータの説明
 *   Skip Key [任意のキー]
 *     メッセージスキップキーを設定します。Input.keyMapperに定義された値が有効です。
 *     初期値はcontrolになっています。他にもshift等が使いやすそうです。
 * 
 *   Show Trace [true|false]
 *     デバッグ用のトレースを出すかを設定します。
 * 
 * ■プラグインコマンド
 *   プラグインコマンドはありません。
 * 
 * ■更新履歴
 *   ver 1.00 (2016.02.17)
 *     初版。
 */
//=============================================================================

//name space
var utakata = utakata || (utakata = {});

(function(utakata){
    //-----------------------------------------------------------------------------
    // class MessageSkip
    //-----------------------------------------------------------------------------
    var MessageSkip = (function(){
        //constructor
        function MessageSkip(){
            this._skipKey = "";         //bind target key

            //trace
            this._showTrace = false;
            this._tr = null;

            this.initialize();
        }

        //private methods
        MessageSkip.prototype.initialize = function(){
            var parameters = PluginManager.parameters('UTA_MessageSkip');

            this._skipKey = String(parameters['Skip Key']) || null;

            var _show_tr = (String(parameters['Show Trace']) === "true");
            this._tr = _show_tr ? function(s){ var str = "MessageSkip: " + s; console.log(str); } : function(s){ };

            this._tr("skip key bind: " + this._skipKey);
        };

        //protected methods
        MessageSkip.prototype.isPressedMsgSkipButton = function(){
            return /*Input.isPressed(this._skipKey)*/Input.isLongPressed('ok') && !TouchInput.isLongPressed();
        };

        return MessageSkip;
    })();
    utakata.MessageSkip = new MessageSkip();
})(utakata || (utakata = {}));


(function(){
    //-----------------------------------------------------------------------------
    // PluginCommands
    //-----------------------------------------------------------------------------
    var _Game_Interpreter_pluginCommand = 
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args){
        _Game_Interpreter_pluginCommand.call(this, command, args);

        //UT_MessageSkip don't have plugin commands.
        if(command === 'UT_MessageSkip'){
            switch(args[0]){
                default:
                    break;
            }
        }
    };

    //-----------------------------------------------------------------------------
    // Window_Message
    //-----------------------------------------------------------------------------
    //文章表示途中にskipキーが入力された場合は即全表示
    var _Window_Message_updateShowFast = Window_Message.prototype.updateShowFast;
    Window_Message.prototype.updateShowFast = function() {
        _Window_Message_updateShowFast.call(this);

        if(utakata.MessageSkip.isPressedMsgSkipButton()){
            this._showFast = true;
            this._pauseSkip = true;
        }
    };

    //文章が表示されkey入力待ちの際もskipキーの入力を監視しておく
    var _Window_Message_updateInput = Window_Message.prototype.updateInput;
    Window_Message.prototype.updateInput = function() {
        var ret = _Window_Message_updateInput.call(this);

        if(this.pause && utakata.MessageSkip.isPressedMsgSkipButton()){
            this.pause = false;
            if (!this._textState) {
                this.terminateMessage();
            }
            return true;
        }

        return ret;
    };

    //-----------------------------------------------------------------------------
    // Window_ScrollText
    //-----------------------------------------------------------------------------
    //スクロールメッセージは更に爆速で流れるように
    var Window_ScrollText_scrollSpeed = Window_ScrollText.prototype.scrollSpeed;
    Window_ScrollText.prototype.scrollSpeed = function() {
        var ret = Window_ScrollText_scrollSpeed.call(this);

        if(utakata.MessageSkip.isPressedMsgSkipButton()){
            ret *= 100;
        }
        return ret;
    };


    //-----------------------------------------------------------------------------
    // Window_BattleLog
    //-----------------------------------------------------------------------------
    //バトルログを超高速に
    var _Window_BattleLog_messageSpeed = Window_BattleLog.prototype.messageSpeed;
    Window_BattleLog.prototype.messageSpeed = function() {
        var ret = _Window_BattleLog_messageSpeed.call(this);
        if(utakata.MessageSkip.isPressedMsgSkipButton()){
            ret = 1;
        }
        return ret;
    };

})();
