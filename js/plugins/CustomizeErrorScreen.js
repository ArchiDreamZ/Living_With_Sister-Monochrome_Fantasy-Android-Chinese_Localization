//=============================================================================
// CustomizeErrorScreen.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2016/11/10 連絡先のリンクを開く際に、既定のブラウザで開くよう変更
// 1.1.1 2016/07/13 表記方法を少しだけ変更
// 1.1.0 2016/07/13 ローカル実行時、エラー情報のパスを出力しないよう修正
// 1.0.1 2016/06/25 エラー発生時のリンク先を別画面で開くよう修正
// 1.0.0 2016/05/14 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Customize Error Screen
 * @author triacontane
 *
 * @param MainMessage
 * @desc
 * @default !!Error!!
 *
 * @param HyperLink
 * @desc
 * @default
 *
 * @param OutputDetail
 * @desc
 * @default ON
 *
 * @help Visualize detail information for Error Screen.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc エラー画面表示改善プラグイン
 * @author トリアコンタン
 *
 * @param メインメッセージ
 * @desc エラー画面に共通で表示されるメッセージ
 * @default 以下のエラーが発生しました。
 *
 * @param ハイパーリンク
 * @desc エラー画面に表示するリンク先URL
 * @default
 * 
 * @param 詳細情報出力
 * @desc エラー情報の詳細(スタックトレース)を出力します。
 * @default ON
 *
 * @help エラー画面の表示を改善します。固定メッセージと連絡先のハイパーリンクを
 * 指定できるほか、エラーの詳細情報（スタックトレース）も表示されるようになります。
 * またURL用にエンコードされて表示される全角文字列をもとの文字列に
 * デコードして表示します。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName = 'CustomizeErrorScreen';

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var contentId = "231383"; // ナコ
    var setdmessage = "";
    var sendLogDtil = "";
    var sendDate = "";
    var sendTime = "";

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramMainMessage  = getParamString(['MainMessage', 'メインメッセージ']);
    var paramHyperLink    = getParamString(['HyperLink', 'ハイパーリンク']);
    var paramOutputDetail = getParamBoolean(['OutputDetail', '詳細情報出力']);

    //=============================================================================
    // SceneManager
    //  エラー情報の出力処理を追加します。
    //=============================================================================
    var _SceneManager_onError = SceneManager.onError;
    SceneManager.onError      = function(e) {
        _SceneManager_onError.apply(this, arguments);
        try {
            Graphics.printErrorDetail(e, decodeURIComponent(e.filename));
        } catch (e2) {
        }
    };

    var _SceneManager_catchException = SceneManager.catchException;
    SceneManager.catchException      = function(e) {
        _SceneManager_catchException.apply(this, arguments);
        Graphics.printErrorDetail(e);
    }; 
    
    //=============================================================================
    // Graphics
    //  エラー情報を出力します。
    //=============================================================================
    var _Graphics__makeErrorHtml = Graphics._makeErrorHtml;
    Graphics._makeErrorHtml      = function(name, message) {
        var hiduke = new Date(); 
        var year = hiduke.getFullYear();
        var month = hiduke.getMonth()+1;
        var day = hiduke.getDate();

        var jikan= new Date();
        var hour = jikan.getHours();
        var minute = jikan.getMinutes();
        var second = jikan.getSeconds();

        sendDate =  year + "-" + month + "-" + day;
        sendTime = hour + ":" + minute + ":" + second;

        var mapid = "mapID:" + $gameMap.mapId() + "<br>";
        var evid = $gameMap._interpreter._eventId;
        if(evid != null){
            var strEvid = "eventID:" + evid + "<br>";
            mapid += strEvid
        }

        var mobinfo = navigator.userAgent;
        var st = mobinfo.indexOf("Android");
        if(st <= 0){
            st = 0;
        }
        var ed = mobinfo.indexOf("Build");
     
        var strOsVer = mobinfo.substr(st, ed - st);

        setdmessage = mapid + strOsVer + "<br>" + message;
        arguments[1] = decodeURIComponent(setdmessage);
        return _Graphics__makeErrorHtml.apply(this, arguments);
    };

    Graphics.printErrorDetail = function(e) {
        this.hideFps();
        this._setErrorPrinterStyle();
        if (this._errorPrinter) {
            //this._makeMainMessage();
            //if (paramHyperLink)    this._makeHyperLink();
            if (paramOutputDetail) {
                var stack = String(e.stack) || '';
                if (Utils.isNwjs()) {
                    stack = stack.replace(/file:.*js\//g, '');
                    stack = stack.replace(/ at /g, '<br/>');
                }
                this._makeStackTrace(stack);
            }
        }

        stack = stack.replace(/\r?\n/g,"");

        var mobinfo = navigator.userAgent;
        var url = "http://hbox.jp/appdata/cloud_save/rpgmaker_errlog.php?contentid=" + contentId + "&log=" + setdmessage + " " + stack + "&mobileinfo=" + mobinfo + "&dt=" + sendDate + "&tm=" + sendTime;
        var xhr = new XMLHttpRequest();
		xhr.open('POST', url);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.overrideMimeType('text/plain');
		xhr.timeout = 5000;
		//
		xhr.ontimeout = function(e){
			//タイムアウト
			//$gameVariables.setValue(vID, "ERROR TIMEOUT");
			console.log("ERROR TIMEOUT");
		};
		xhr.onabort = function(e){
			//通信中止
			//$gameVariables.setValue(vID, "ERROR ABORT");
			console.log("ERROR ABORT");
		};
		xhr.onerror = function() {
			//なんやかんやエラー
			//$gameVariables.setValue(vID, "ERROR");
			console.log("ERROR");
		};
		xhr.onload = function() {
			if (xhr.status < 400) {
				//受信成功
				console.log(xhr.responseText);
				//$gameVariables.setValue(vID, xhr.responseText);
			} else {
				//サーバー側エラー応答
				//$gameVariables.setValue(vID, "ERROR RESPONSE");
				console.log("ERROR RESPONSE");
			}
		};

		//送信
		xhr.send("");

    };

    Graphics._makeMainMessage = function() {
        var mainMessage       = document.createElement('div');
        var style             = mainMessage.style;
        style.color           = 'white';
        style.textAlign       = 'left';
        style.fontSize        = '18px';
        mainMessage.innerHTML = '<hr>' + paramMainMessage;
        this._errorPrinter.appendChild(mainMessage);
    };

    Graphics._makeHyperLink = function() {
        var hyperLink            = document.createElement('a');
        var style                = hyperLink.style;
        style.color              = 'blue';
        style.textAlign          = 'left';
        style.fontSize           = '20px';
        style['text-decoration'] = 'underline';
        style.cursor             = 'pointer';
        hyperLink.addEventListener('click', this._openUrl.bind(this, paramHyperLink));
        hyperLink.innerHTML = paramHyperLink;
        this._errorPrinter.appendChild(hyperLink);
    };

    Graphics._openUrl = function(url) {
        if (!Utils.isNwjs()) {
            window.open(url);
            return;
        }
        var exec = require('child_process').exec;
        switch (process.platform) {
            case 'win32':
                exec('rundll32.exe url.dll,FileProtocolHandler "' + url + '"');
                break;
            default:
                exec('open "' + url + '"');
                break;
        }
    };

    Graphics._makeStackTrace = function(stack) {
        var stackTrace         = document.createElement('div');
        var style              = stackTrace.style;
        style.color            = 'white';
        style.textAlign        = 'left';
        style.fontSize         = '12px';
        style.userSelect       = 'text';
        style.webkitUserSelect = 'text';
        style.msUserSelect     = 'text';
        style.mozUserSelect    = 'text';
        //stackTrace.innerHTML   = '<br><hr>' + stack + '<hr>';
        stackTrace.innerHTML   = stack;
        this._errorPrinter.appendChild(stackTrace);
    };

    Graphics._setErrorPrinterStyle = function() {
        this._errorPrinter.width  = this._width * 0.9;
        this._errorPrinter.height = this._height * 0.9;
        var style                 = this._errorPrinter.style;
        style.textAlign           = 'center';
        style.textShadow          = '1px 1px 3px #000';
        style.fontSize            = '12px';
        style.zIndex              = 99;
        this._centerElement(this._errorPrinter);
    };
})();

