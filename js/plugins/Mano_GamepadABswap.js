//=============================================================================
// Mano_MultiButtonPush.js
// ----------------------------------------------------------------------------
// Copyright (c) 2017-2017 Sigureya
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/Sigureya/
// [github]:https://github.com/Sigureya/RPGmakerMV
//=============================================================================

/*:
 * @plugindesc ゲームパッドのAとBを入れ替えます。
 * 
 * @help
 * DirectInput対応のゲームパッドで操作すると
 * ○ボタンがキャンセル
 * ×ボタンが決定
 * となってしまい、違和感を覚える人も多いでしょう。
 * このプラグインは、これを解決します。
*/

Input.gamepadMapper[1]='ok';
Input.gamepadMapper[0] ='cancel';
