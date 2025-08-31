//=============================================================================
// EmptyVal.js
//=============================================================================

/*:ja
 * @plugindesc ver1.00 ゲーム変数に空の文字列を代入・表示できます。
 * @author まっつＵＰ
 *
 * @help
 * 
 * RPGで笑顔を・・・
 * 
 * このヘルプとパラメータの説明をよくお読みになってからお使いください。
 * 
 * 素材のみの販売はダメです。
 * 上記以外の規約等はございません。
 * もちろんツクールMVで使用する前提です。
 * 何か不具合ありましたら気軽にどうぞ。
 *  
 * 免責事項：
 * このプラグインを利用したことによるいかなる損害も制作者は一切の責任を負いません。
 * 
 */

(function() {

var _Game_Variables_value = Game_Variables.prototype.value;
Game_Variables.prototype.value = function(variableId) {
    var val = this._data[variableId];
    if(val === '' || val === "") return val;
    return _Game_Variables_value.call(this, variableId);
};
 
})();
