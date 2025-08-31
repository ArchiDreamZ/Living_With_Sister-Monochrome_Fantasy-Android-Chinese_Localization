//================================================
// KRD_AndroidMain.js
//
// Copyright (c) 2017 KRD_DATA (Kuroudo)
// This plugin is released under the MIT License.
// https://opensource.org/licenses/mit-license.php
//
// ■これは、RPGツクールMVのゲームを、CordovaでAndroidアプリ化する時に使用します。
//
// ■使用する際は、RPGツクールMVのindex.htmlに以下の追加＆変更を行ってください。
//   （RPGツクールMVのエディタでプラグインとして設定するものではありません）
//   （main.jsをコメントアウトして置き換えます）
//
//   <script type="text/javascript" src="js/plugins/KRD_AndroidMain.js"></script>
//   <!--<script type="text/javascript" src="js/main.js"></script>-->
//
// ■Androidのバックボタンを押した時に、ゲーム終了の確認ダイアログを表示します。
//   （ダイアログ表示中はゲームが停止します）
//   OK→ゲーム終了
//   キャンセル→ゲームに戻る
//
// ■確認ダイアログのメッセージを変えたい場合は、 
//   window.confirm("Quit This Game?") の " で囲まれた中の文章を変更してください。
//
//================================================

/*:
 * @plugindesc This is the Android back button processing.
 * @author KRD_DATA(Kuroudo)
 * 
 */

PluginManager.setup($plugins);

window.onload = function() {
    document.addEventListener("deviceready", onDeviceReady, false);
    SceneManager.run(Scene_Boot);
};

function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
}

function onBackKeyDown() {
    if (window.confirm("ゲームを終了しますか?")) {
        navigator.app.exitApp();
    }
}
