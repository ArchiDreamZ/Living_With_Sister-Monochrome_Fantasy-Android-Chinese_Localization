//=============================================================================
// ALT_WindowTextMove.js
// by machina (Altered)
// Version: 1.0.2
//=============================================================================

/*:
 * @plugindesc メッセージテキストの位置を調整
 *
 * @author Altered (Machina Suzuhara)
 * @help ※メッセージウィンドウ外はテキストが表示されませんので、
 * 　位置調整はメッセージウィンドウ内でお願いします。
 *
 *
 *
 * 【利用規約】
 * 1.利用上の注意
 * ・本スクリプトを使用してゲームなどを配布する際、
 *   添付ドキュメント内に本素材を使用して制作した旨を表記し、その際に次の権利表記を行なうこと。
 *
 *  (C)Altered  http://altered.sblo.jp
 *
 *   ※ただし、「http://altered.sblo.jp」はR-18サイトのため、表記は配布者の任意としますが、
 *    本素材を使用した配布物がR-18指定の場合、表記は必須です。
 *
 * ・利用に関しては全て自己責任で行ってください。
 *   本スクリプトを使用すること及びゲームなどを制作・配布・販売することにより、
 *   第三者との間で生じたトラブル等に関しては、弊組は一切責任を負わないものとします。
 * ・有償・無償・年齢制限コンテンツでの利用に、特に制限はありません。
 *
 * 2.利用報告
 * ・特に必要ありません。
 *
 * 3.禁止事項
 * ・二次配布。
 * ・素材への直リンク。
 *
 *  4.サポート
 * ・競合などの対処は致しかねます。
 *
 * @param zahyou_X
 * @desc X座標を半角数字で入力してください　　例）100
 *
 * @param zahyou_Y
 * @desc Y座標を半角数字で入力してください　　例）15
 *
 */

//=============================================================================

(function() {

  var parameters = PluginManager.parameters('ALT_WindowTextMove');

  var zahyou_X = String(parameters['zahyou_X'] || 0) - 0;
  var zahyou_Y = String(parameters['zahyou_Y'] || 0) - 0;


  //--------------------------------------------------
  //テキスト全体をずらす
  //--------------------------------------------------

  Window_Message.prototype.processNormalCharacter = function(textState) {
    var c = textState.text[textState.index++];
    var w = this.textWidth(c);
    this.contents.drawText(c, textState.x + zahyou_X, textState.y + zahyou_Y, w * 2, textState.height);

    textState.x += w;
  };



  //--------------------------------------------------
  //アイコンの位置を調整 ※フォントサイズを変えたらずれます！！
  //--------------------------------------------------

  Window_Message.prototype.processDrawIcon = function(iconIndex, textState) {
    this.drawIcon(iconIndex, textState.x + 2 + zahyou_X, textState.y + 2 + zahyou_Y);

    textState.x += Window_Base._iconWidth + 4;
  };
})();
