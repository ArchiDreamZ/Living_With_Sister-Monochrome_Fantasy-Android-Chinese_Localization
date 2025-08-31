//=============================================================================
// Lunatlazur_ActorNameWindow.js
// ----------------------------------------------------------------------------
// Copyright (c) 2018 Taku Aoi
// This plugin is released under the zlib License.
// http://zlib.net/zlib_license.html
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2018/04/01
// ----------------------------------------------------------------------------
// [Web]    : https://lunatlazur.com/
// [Twitter]: https://twitter.com/lunatlazur/
// [GitHub] : https://github.com/Lunatlazur/
//=============================================================================
/*:
 * @plugindesc Show actor name window
 * @author Taku Aoi
 * @help This plugin shows speaker's name window.
 *
 * Input the character name with \N<Character name> format
 * to display the speaker's name window.
 *
 * The same font as the message window is used for this window.
 */
/*:ja
 * @plugindesc 名前ウィンドウ表示プラグイン
 * @author あおいたく
 * @help このプラグインは名前ウィンドウを表示できるようにします。
 *
 * \N<キャラクター名> 形式でメッセージ内にキャラクターの名前を記述することで
 * メッセージウィンドウの上部に名前ウィンドウを表示するようになります。
 *
 * 名前ウィンドウのフォントはメッセージウィンドウのものが使われます。
 *
 * @param テキストカラー
 * @desc 名前を表示するテキストの色番号を指定します。
 * @default 1
 * @type number
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function () {
    var pluginName = 'Lunatlazur_ActorNameWindow';
    function getValue(params) {
        var names = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            names[_i - 1] = arguments[_i];
        }
        var found = null;
        names.forEach(function (name) {
            if (!!params[name]) {
                found = params[name];
            }
        });
        return found;
    }
    function asNumber(params) {
        var names = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            names[_i - 1] = arguments[_i];
        }
        return parseInt(getValue.apply(void 0, [params].concat(names)), 10);
    }
    var parameters = PluginManager.parameters(pluginName);
    var params = {
        textColor: asNumber(parameters, 'テキストカラー'),
    };
    var Window_ActorName = /** @class */ (function (_super) {
        __extends(Window_ActorName, _super);
        function Window_ActorName(_) {
            var _this = _super.call(this) || this;
            _this.initialize.apply(_this, arguments);
            return _this;
        }
        Window_ActorName.prototype.initialize = function (parentWindow) {
            this._parentWindow = parentWindow;
            _super.prototype.initialize.call(this, 170, 0, 240, this.windowHeight());
            this._padding = 4;
            this._text = '';
            this._openness = 0;
            this.deactivate();
            this.hide();
        };
        Window_ActorName.prototype.standardFontFace = function () {
            if (this._parentWindow) {
                return this._parentWindow.standardFontFace();
            }
            else {
                return _super.prototype.standardFontFace.call(this);
            }
        };
        Window_ActorName.prototype.windowWidth = function () {
            this.resetFontSettings();
            return Math.ceil(this.textWidth(this._text) + this.padding * 2 + this.standardPadding() * 4);
        };
        Window_ActorName.prototype.windowHeight = function () {
            return this.lineHeight() + this.padding * 2;
        };
        Window_ActorName.prototype.contentsWidth = function () {
            return this.width - this.padding * 2;
        };
        Window_ActorName.prototype.contentsHeight = function () {
            return this.lineHeight();
        };
        Window_ActorName.prototype.update = function () {
            _super.prototype.update.call(this);
            if (this.active || this.isClosed() || this.isClosing()) {
                return;
            }
            if (this._parentWindow.isClosing()) {
                this._openness = this._parentWindow.openness;
            }
            this.close();
        };
        Window_ActorName.prototype.setText = function (text) {
            this._text = text;
            this.refresh();
        };
        Window_ActorName.prototype.refresh = function () {
            this.width = this.windowWidth();
            this.createContents();
            this.contents.clear();
            this.resetFontSettings();
            this.changeTextColor(this.textColor(params.textColor));
            this.drawText(this._text, this.standardPadding() * 2, 0, this.contents.width);
        };
        Window_ActorName.prototype.updatePlacement = function () {
            if (this._parentWindow.y === 0) {
                this.y = this._parentWindow.y + this._parentWindow.windowHeight();
            }
            else {
                this.y = this._parentWindow.y - this.windowHeight();
            }
        };
        Window_ActorName.prototype.updateBackground = function () {
            this.setBackgroundType(this._parentWindow._background);
        };
        Window_ActorName.prototype.processActorName = function (text) {
            var _this = this;
            return text.replace(/\x1bN\<(.*?)\>/gi, function (whole) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                _this.setText(args[0]);
                _this.show();
                _this.open();
                _this.activate();
                return '';
            });
        };
        return Window_ActorName;
    }(Window_Base));
    var Window_Message_createSubWindows = Window_Message.prototype.createSubWindows;
    Window_Message.prototype.createSubWindows = function () {
        Window_Message_createSubWindows.call(this);
        this._nameWindow = new Window_ActorName(this);
    };
    var Window_Message_subWindows = Window_Message.prototype.subWindows;
    Window_Message.prototype.subWindows = function () {
        return Window_Message_subWindows.call(this).concat([this._nameWindow]);
    };
    var Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function () {
        this._nameWindow.deactivate();
        Window_Message_startMessage.call(this);
    };
    var Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function () {
        this._nameWindow.deactivate();
        Window_Message_terminateMessage.call(this);
    };
    Window_Message.prototype.convertEscapeCharacters = function (text) {
        text = Window_Base.prototype.convertEscapeCharacters.call(this, text);
        text = this._nameWindow.processActorName(text);
        return text;
    };
    var Window_Message_updatePlacement = Window_Message.prototype.updatePlacement;
    Window_Message.prototype.updatePlacement = function () {
        Window_Message_updatePlacement.call(this);
        if (this._nameWindow.active) {
            this._nameWindow.updatePlacement();
        }
    };
    var Window_Message_updateBackground = Window_Message.prototype.updateBackground;
    Window_Message.prototype.updateBackground = function () {
        Window_Message_updateBackground.call(this);
        if (this._nameWindow.active) {
            this._nameWindow.updateBackground();
        }
    };
})();
