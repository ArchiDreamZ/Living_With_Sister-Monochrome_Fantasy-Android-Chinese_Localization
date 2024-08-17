/*
 * --------------------------------------------------
 * MNKR_MovePictureSwitch.js
 *   Ver.0.0.1
 * Copyright (c) 2020 Munokura
 * This software is released under the MIT license.
 * http://opensource.org/licenses/mit-license.php
 * --------------------------------------------------
 */

/*:
 * @target MV
 * @url https://raw.githubusercontent.com/munokura/MNKR-MV-plugins/master/MNKR_MovePictureSwitch.js
 * @plugindesc スイッチでピクチャの移動座標を絶対値と相対値とを切り替えられます。
 * @author munokura
 *
 * @help
 * スイッチでピクチャの移動座標を絶対値と相対値とを切り替えられます。
 * 
 * 
 * 利用規約:
 *   MITライセンスです。
 *   https://licenses.opensource.jp/MIT/MIT.html
 *   作者に無断で改変、再配布が可能で、
 *   利用形態（商用、18禁利用等）についても制限はありません。
 * 
 * 
 * @param switchPciture
 * @text 相対指定スイッチ
 * @type switch
 * @default 0
 * @desc 指定スイッチON時はピクチャの移動座標が相対指定になります。スイッチが無指定の場合、常に相対指定になります。
 */

(() => {
  "use strict";

  const pluginName = document.currentScript.src.split("/").pop().replace(/\.js$/, "");
  const parameters = PluginManager.parameters(pluginName);
  const switchPciture = Number(parameters['switchPciture'] || 0);

  const _Game_Picture_move = Game_Picture.prototype.move;
  Game_Picture.prototype.move = function (origin, x, y, scaleX, scaleY, opacity, blendMode, duration) {
    if ($gameSwitches.value(switchPciture) || switchPciture === 0) {
      x += this.x();
      y += this.y();
    }
    _Game_Picture_move.call(this, origin, x, y, scaleX, scaleY, opacity, blendMode, duration);
  }

})();