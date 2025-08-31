//=============================================================================
// TitleCommandPosition.js
//=============================================================================

/*:
 * @plugindesc Changes the position of the title command window.
 * @author Yoji Ojima
 *
 * @param Offset X
 * @desc The offset value for the x coordinate.
 * @default 0
 *
 * @param Offset Y
 * @desc The offset value for the y coordinate.
 * @default 0
 *
 * @param Width
 * @desc The width of the command window.
 * @default 240
 *
 * @param Background
 * @desc The background type. 0: Normal, 1: Dim, 2: Transparent
 * @default 0
 *
 * @help This plugin does not provide plugin commands.
 */

/*:ja
 * @plugindesc タイトルコマンドウィンドウの位置を変更します。
 * @author Yoji Ojima
 *
 * @param Offset X
 * @desc X座標のオフセット値です。
 * @default 0
 *
 * @param Offset Y
 * @desc Y座標のオフセット値です。
 * @default 0
 *
 * @param Width
 * @desc コマンドウィンドウの幅です。
 * @default 240
 *
 * @param Background
 * @desc 背景タイプです。0: 通常、1: 暗くする、2: 透明
 * @default 0
 *
 * @help このプラグインには、プラグインコマンドはありません。
 */

(function() {

    var parameters = PluginManager.parameters('TitleCommandPosition');
    var offsetX = Number(parameters['Offset X'] || 0);
    var offsetY = Number(parameters['Offset Y'] || 0);
    var width = Number(parameters['Width'] || 240);
    var background = Number(parameters['Background'] || 0);

    var _Window_TitleCommand_updatePlacement =
            Window_TitleCommand.prototype.updatePlacement;
    Window_TitleCommand.prototype.updatePlacement = function() {
        _Window_TitleCommand_updatePlacement.call(this);
        this.x += offsetX;
        this.y += offsetY;
        this.setBackgroundType(background);
    };

    Window_TitleCommand.prototype.windowWidth = function() {
        return width;
    };

})();
