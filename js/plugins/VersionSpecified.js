//=============================================================================
// VersionSpecified.js
//=============================================================================
// Copyright (c) 2015 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 【MMP ver.1.0】タイトル画面にバージョンを明記します。
 * @author 木星ペンギン
 *
 * @help 文字列を表記するだけなので、バージョンでなくても使えます。
 * 
 * ================================
 * 制作 : 木星ペンギン
 * URL : http://woodpenguin.blog.fc2.com/
 * 
 * @param version
 * @desc 表示する文字列
 * @default Version 1.0.0
 *
 * @param fontSize
 * @desc 文字サイズ
 * @default 20
 *
 * @param fontColor
 * @desc 文字色
 * @default rgb(255, 255, 255)
 *
 * @param windowX
 * @desc 表示位置 X 座標
 * @default 540
 *
 * @param windowY
 * @desc 表示位置 Y 座標
 * @default 560
 *
 */

(function() {
    
    var parameters = PluginManager.parameters('VersionSpecified');
    var version = parameters['version'];
    var fontSize = Number(parameters['fontSize']);
    var fontColor = parameters['fontColor'] || 'rgb(255, 255, 255)';
    var windowX = Number(parameters['windowX']);
    var windowY = Number(parameters['windowY']);
    
    //-----------------------------------------------------------------------------
    // Window_Version
    
    function Window_Version() {
        this.initialize.apply(this, arguments);
    }

    Window_Version.prototype = Object.create(Window_Base.prototype);
    Window_Version.prototype.constructor = Window_Version;

    Window_Version.prototype.initialize = function() {
        var height = this.windowHeight();
        Window_Base.prototype.initialize.call(this, windowX, windowY, 160, height);
        this.width = this.windowWidth();
        this.opacity = 0;
        this.refresh();
    };

    Window_Version.prototype.windowWidth = function() {
        return this.drawTextEx(version, 0, fontSize) + this.standardPadding()* 6;
    };

    Window_Version.prototype.windowHeight = function() {
        return this.fittingHeight(1);
    };

    Window_Version.prototype.lineHeight = function() {
        return fontSize + 4;
    };

    Window_Version.prototype.refresh = function() {
        this.createContents();
        this.contents.fontSize = fontSize;
        this.contents.textColor = fontColor;
        if (version) {
            var width = this.contentsWidth();
            this.drawBackground(0, 0, width, this.lineHeight());
            this.drawText(version, 0, 0, width, 'center');
        }
    };

    Window_Version.prototype.drawBackground = function(x, y, width, height) {
        var color1 = this.dimColor1();
        var color2 = this.dimColor2();
        this.contents.gradientFillRect(x, y, width / 2, height, color2, color1);
        this.contents.gradientFillRect(x + width / 2, y, width / 2, height, color1, color2);
    };
    
    //-------------------------------------------------------------------------
    // Scene_Title
    
    var _Scene_Title_create = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function() {
        _Scene_Title_create.call(this);
        this.createVersionWindow();
    };

    Scene_Title.prototype.createVersionWindow = function() {
        this._versionWindow = new Window_Version();
        this.addWindow(this._versionWindow);
    };
    
})();
