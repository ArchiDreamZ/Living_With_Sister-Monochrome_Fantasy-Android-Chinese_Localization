//=============================================================================
// TimeLimitedChoice.js	2017/04/02
// Copyright (c) 2017 Tsukimi
//=============================================================================

/*:
 * @plugindesc 時間制限付き選択肢プレグイン
 * @author Tsukimi
 *
 * @help 
 * 時間制限付き選択肢プレグイン
 * 作者：ツキミ
 * 
 * 2018/09/17 ver 1.0.1 ツキミ式選択肢との競合を解消
 * 2017/05/01 ver 1.0 完成
 * 
 * ***************************************************
 * 説明：
 * 次の選択肢に時間制限をかけます。
 * プラグインコマンドを実行して選択肢を設定した時、タイマーが自動で起動します。
 * 時間切れすると選択ウィンドウが消え、[キャンセルのとき]
 * のイベントコマンドを実行します。
 * 
 * ※ 選択肢の表示の設定の中の、キャンセルを[分岐]にしてください。
 * 
 * ※ 必ずしもプラグインコマンドの直後に選択肢を設定する必要がありません。
 * オススメの設定方法は：
 * ◆プラグインコマンド：TLChoice 300
 * ◆文章：～～～～～
 * ◆選択肢の表示：～～～～～
 * 
 * 
 * ***************************************************
 * プラグインコマンド：
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 * 
 * TLChoice [フレーム数]
 * 　　次の選択肢表示に時間制限をかける（1秒=60フレーム）
 * 　　例： TLChoice 600
 * 　　※次の選択肢にだけ効果があります。連続で使用したい場合、
 * 　　各[選択肢の表示]コマンドの前にもう一度このコマンドを行ってください。
 * 
 * 
 * 作者のサイト： http://tsukimitsf.blog.fc2.com/
 * バグなどがあったら、是非こちらへご一報ください。ありがとうございます。
 */
 
var Imported = Imported || {};

(function(_global) {
  	// ここにプラグイン処理を記載
    
    var _Game_Timer_onExpire = Game_Timer.prototype.onExpire;
    Game_Timer.prototype.onExpire = function() {
        _Game_Timer_onExpire.call(this);
        var cw = SceneManager._scene._messageWindow._choiceWindow;
        if(!!cw._timeLimit && !!cw._TLStarted) {
            cw._timeLimit = false;
            cw._TLStarted = false;
            // processCancel, without sound
            cw.updateInputData();
            cw.deactivate();
            cw.callCancelHandler();
            // end
            this.stop();
        }
    }
    if(Imported.TKM_ChoiceList) {
        var _Window_TKMChoiceList_oked = Window_TKMChoiceList.prototype.oked;
        Window_TKMChoiceList.prototype.oked = function() {
            _Window_TKMChoiceList_oked.call(this);
            if(!!this._timeLimit) {
                this._timeLimit = false;
                this._TLStarted = false;
                $gameTimer.stop();
            }
        };
    } else {
        var _Window_ChoiceList_callOkHandler = Window_ChoiceList.prototype.callOkHandler;
        Window_ChoiceList.prototype.callOkHandler = function() {
            _Window_ChoiceList_callOkHandler.call(this);
            if(!!this._timeLimit) {
                this._timeLimit = false;
                this._TLStarted = false;
                $gameTimer.stop();
            }
        }
    }
    
    var _Window_ChoiceList_start = Window_ChoiceList.prototype.start;
    Window_ChoiceList.prototype.start = function() {
        _Window_ChoiceList_start.call(this);
        if(!!this._timeLimit) {
            this._TLStarted = true;
            $gameTimer.start(this._limitedTime || 300);
        }
    }
    
    var _Window_ChoiceList_isCancelEnabled = Window_ChoiceList.prototype.isCancelEnabled;
    Window_ChoiceList.prototype.isCancelEnabled = function() {
        var normal = _Window_ChoiceList_isCancelEnabled.call(this);
        if(!!this._timeLimit) return false;
        else return normal;
    }
    
    
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        switch(command) {
            case "TLChoice":
               var cw = SceneManager._scene._messageWindow._choiceWindow;
                cw._timeLimit = true;
                if(!args) cw._limitedTime = 300;
                else if(parseInt(args[0]) == 0) cw._limitedTime = 300;
                else cw._limitedTime = parseInt(args[0]);
                break;
        }
    };
    
})(this);
