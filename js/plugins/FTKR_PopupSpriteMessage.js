//=============================================================================
// 任意のメッセージを画面上にポップアップ表示するプラグイン
// FTKR_PopupSpriteMessage.js
// プラグインNo : 63
// 作成者     : フトコロ
// 作成日     : 2018/01/05
// 最終更新日 : 2018/08/11
// バージョン : v1.2.5
//=============================================================================
//=============================================================================
// BattleEffectPopup.js　//ベースにしたプラグイン
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

var Imported = Imported || {};
Imported.FTKR_PSM = true;

var FTKR = FTKR || {};
FTKR.PSM = FTKR.PSM || {};

//=============================================================================
/*:
 * @plugindesc v1.2.5 任意のメッセージを画面上にポップアップ表示するプラグイン
 * @author フトコロ
 *
 * @param Max Popup Messages
 * @desc 画面上に表示可能な文字列の数
 * @default 10
 *
 * @param Popup Message Status
 * @desc ポップアップ表示する際の設定
 * 複数のパターンを設定し、プラグインコマンドで呼び出し可能
 * @type struct<popup>[]
 * @default ["{\"fontFace\":\"\",\"fontSize\":\"28\",\"color\":\"[\\\"0\\\",\\\"0\\\",\\\"0\\\",\\\"0\\\"]\",\"italic\":\"false\",\"outlineColor\":\"15\",\"popupHeight\":\"40\",\"duration\":\"90\"}"]
 * 
 * @param Repop Message After Menu
 * @desc メニュー開閉後にポップアップを再度表示させるか
 * @type boolean
 * @on 表示させる
 * @off 表示させない
 * @default false
 * 
 * @help 
 *-----------------------------------------------------------------------------
 * 概要
 *-----------------------------------------------------------------------------
 * 画面の任意の位置に、任意の文字列をポップアップさせるプラグインです。
 * マップ画面、バトル画面のどちらでも表示可能です。
 * 
 * ポップアップ時に文字列を１文字ずつ時間をずらしながら表示させることもできます。
 * 
 * 
 * ポップアップ表示させた文字列は、以下の操作を行うことができます。
 * １．移動（画面外から移動や、画面外に移動も可）
 * ２．角度変更と回転
 * ３．色調と透明度の変化
 * ４．削除
 * 
 * 
 * このプラグインは、トリアコンタンさんのBattleEffectPopup.js(v1.7.1)を
 * ベースにしています。
 * 
 * 
 *-----------------------------------------------------------------------------
 * 設定方法
 *-----------------------------------------------------------------------------
 * 1.「プラグインマネージャー(プラグイン管理)」に、本プラグインを追加して
 *    ください。
 * 
 * 
 *-----------------------------------------------------------------------------
 * 使い方
 *-----------------------------------------------------------------------------
 * １．プラグインパラメータPopup Message Statusに、ポップアップさせる時の
 *     設定を指定してください。
 * 
 * 
 * ２．以下のプラグインコマンドでポップアップを表示します。
 * ※[]は実際の入力に使用しません
 * 
 * PSM_ポップアップ表示 [ポップアップID] [ポップアップ設定ID] [X座標] [Y座標] [表示時間] [文字列] [オプション]
 * PSM_SHOW_POPUP [popupId] [statusId] [x] [y] [duration] [text] [options]
 * 
 *    ポップアップID(popupId)
 *      ：1 から、プラグインパラメータMax Popup Messagesで設定した
 *        値の任意の数字を指定します。\v[n]で変数を指定することも可能です。
 *        この値を変えることで、同時に複数の文字列を表示できます。
 * 
 *    ポップアップ設定ID(statusId)
 *      ：プラグインパラメータPopup Message Statusで設定した内容を呼び出します。
 *        設定時の[リスト番号-1]の値を指定してください。
 *        \v[n]で変数を指定することも可能です。
 * 
 *    X座標、Y座標
 *      ：ポップアップを表示する場合の、画面上の座標を指定します。
 *      　\v[n]で変数を指定することも可能です。
 *      　デフォルトでは文字列の左上が原点ですが、オプション(options)部に
 *      　-c と記載することで文字列の中心を原点にできます。
 *    
 *    表示時間(duration)
 *      ：ポップアップを表示している時間を指定します。
 *        ここで指定した時間が経過すると、自動的に表示が消えます。
 *        \v[n]で変数を指定することも可能です。
 *        -1 を指定すると、ポップアップが時間経過で消えません。
 *        この場合は、別途プラグインコマンドで消去を行ってください。
 * 
 *    文字列(text)
 *      ：ポップアップする内容を指定します。
 *        半角スペースは使用できません。
 *        半角スペースを入れたい場合は \_ (アンダーバー)と入力してください。
 *        また、以下の制御文字が使用可能です。
 *           \v[n] \N[n] \P[n] \G
 * 
 *    オプション(options)
 *      ：末尾に以下の文字列を入力することもできます。(順不同)
 *      　オプションの文字列同士は半角スペースを空けてください。
 * 
 *        -c : 指定する座標が文字列の中心になります。
 *             入力しない場合は、文字列左上座標になります。
 * 
 *        -s : 表示が完了するまでウェイトが掛かります。
 *             表示時間を-1に設定した場合は無効です。 
 * 
 * 
 * なお、以下のコマンドでポップアップ設定IDを使用せずに、直接パラメータを指定できます。
 * 
 * PSM_ポップアップ表示B [ポップアップID] [X座標] [Y座標] [表示時間] [文字列] [フォント] [フォントサイズ] [文字色] [イタリック] [縁色] [バウンド高さ] [時間間隔] [透明度] [オプション]
 * PSM_SHOW_POPUP_B [popupId] [x] [y] [duration] [text] [fontFace] [fontSize] [color] [italic] [outlineColor] [popupHeight] [offsetWait] [opacity] [options]
 * 
 *    フォント(fontFace)以降のパラメータの意味は、プラグインパラメータと同じです。
 *    以下のパラメータの入力方式に気をつけてください。
 * 
 *    フォント(fontFace)
 *      ：指定しない場合は、-1 と記入してください。
 * 
 *    文字色(color)
 *      ：赤,青,緑,グレー　の形式で入力してください。
 *      　それぞれの値は 0 ~ 255 の範囲です。半角スペースは禁止です。
 *      　例)255,0,0,100
 * 
 *    イタリック(italic)
 *      ：true または false と記入してください。
 *      　true でイタリック表示です。
 * 
 *    縁色(outlineColor)
 *      ：縁取りなしにする場合は、-1 と記入してください。
 * 
 * 
 * ２．以下のプラグインコマンドでポップアップを移動させます。
 * ※[]は実際の入力に使用しません
 * 
 * PSM_ポップアップ移動 [ポップアップID] [X座標] [Y座標] [移動時間] [オプション]
 * PSM_MOVE_POPUP [popupId] [x] [y] [duration] [options]
 * 
 *    ポップアップID(popupId)
 *      ：移動したいポップアップIDを指定します。
 *      　\v[n]で変数を指定することも可能です。
 * 
 *    X座標、Y座標
 *      ：ポップアップの移動先の、画面上の座標を指定します。
 *      　\v[n]で変数を指定することも可能です。
 *    
 *    表示時間(duration)
 *      ：ポップアップを移動させる時間を指定します。
 *        \v[n]で変数を指定することも可能です。
 *        0 を指定すると即座に移動します。
 * 
 *    オプション(options)
 *      ：末尾に以下の文字列を入力することもできます。
 * 
 *        -s : 移動が完了するまでウェイトが掛かります。
 * 
 * 
 * ３．以下のプラグインコマンドでポップアップを回転させます。
 * ※[]は実際の入力に使用しません
 * 
 * PSM_ポップアップ回転 [ポップアップID] [角度] [回転]
 * PSM_ROTATE_POPUP [popupId] [angle] [rotate]
 * 
 *    ポップアップID(popupId)
 *      ：回転したいポップアップIDを指定します。
 *      　\v[n]で変数を指定することも可能です。
 * 
 *    角度(angle)
 *      ：ポップアップを回転させる角度の増減値を指定します。(0 ～ 359)
 *        \v[n]で変数を指定することも可能です。
 *        ポップアップの左上を原点に、正の値で時計周り側に回転します。
 * 
 *    回転(rotate)
 *      ：ポップアップを回転させるかどうかを指定します。
 *        ture で、指定した角度分回転し続けます。
 *        false で、指定した角度に変化させます。
 * 
 * 
 * ４．以下のプラグインコマンドでポップアップの色調と透明度を変化させます。
 * ※[]は実際の入力に使用しません
 * 
 * PSM_ポップアップ色調変更 [ポップアップID] [色調] [透明度] [変化時間] [オプション]
 * PSM_CHANGECOLOR_POPUP [popupId] [tone] [opacity] [duration] [options]
 * 
 *    ポップアップID(popupId)
 *      ：移動したいポップアップIDを指定します。
 *      　\v[n]で変数を指定することも可能です。
 * 
 *    色調(tone)
 *      ：ポップアップの色調を指定します。
 *      　赤,青,緑,グレー　の形式で入力してください。
 *      　それぞれの値は 0 ~ 255 の範囲です。半角スペースは禁止です。
 *      　例)255,0,0,100
 *      　-1 と入力すると、色調を変更しません。
 *    
 *    透明度(opacity)
 *      ：ポップアップの透明度を指定します。
 *      　\v[n]で変数を指定することも可能です。
 *      　-1 と入力すると、透明度を変更しません。
 *    
 *    変化時間(duration)
 *      ：ポップアップの色調と透明度を変化させる時間を指定します。
 *        \v[n]で変数を指定することも可能です。
 *        0 を指定すると即座に変化します。
 * 
 *    オプション(options)
 *      ：末尾に以下の文字列を入力することもできます。
 * 
 *        -s : 変化が完了するまでウェイトが掛かります。
 * 
 * 
 * ４．以下のプラグインコマンドでポップアップを消去します。
 * ※[]は実際の入力に使用しません
 * 
 * PSM_ポップアップ消去 [ポップアップID] [消去時間] [オプション]
 * PSM_ERASE_POPUP [popupId] [duration] [options]
 * 
 *    ポップアップID(popupId)
 *      ：消去したいポップアップIDを指定します。
 *        \v[n]で変数を指定することも可能です。
 * 
 *    消去時間(duration)
 *      ：ポップアップを消去する時間を指定します。
 *        ここで指定した時間が経過すると、自動的に表示が消えます。
 *        \v[n]で変数を指定することも可能です。
 *        指定しない場合、または 0 を指定すると即座に消えます。
 * 
 *    オプション(options)
 *      ：末尾に以下の文字列を入力することもできます。
 * 
 *        -s : 消去が完了するまでウェイトが掛かります。
 * 
 * 
 *-----------------------------------------------------------------------------
 * メニュー開閉とポップアップ表示について
 *-----------------------------------------------------------------------------
 * ポップアップ表示中にメニューを開閉すると、ポップアップ表示は消去されます。
 * 
 * プラグインパラメータ<Repop Message After Menu>を「表示する」に
 * 設定することで、メニュー開閉後に再表示させることができます。
 * 
 * 
 * なお、メニュー開閉後の再表示の仕様は以下の通りです。
 * 
 * １．ポップアップのバウンドと、１文字ずつ表示する機能は無効。(即座に表示)
 * ２．ポップアップの移動中にメニューを開閉すると、移動動作をキャンセルし
 * 　　移動後の場所に再表示します。
 * ３．ポップアップの回転中にメニューを開閉すると、初期状態から再回転します。
 * 　　角度を変えた場合は、その角度を維持します。
 * 
 * 
 *-----------------------------------------------------------------------------
 * ウェイトコマンドの設定時間とポップアップ操作コマンドの実行時間について
 *-----------------------------------------------------------------------------
 * ポップアップ操作(移動、回転、色調変更）では、各操作の実行時間(duration)を
 * 0 に設定した場合でも極短時間(1ウェイト分)ですが処理が行われます。
 * 
 * そのため、操作コマンドの後にウェイトコマンドを入れる場合は
 * 最低でも、実行時間＋1 のウェイトに設定してください。
 * 
 * 
 * なお、各操作の実行処理が完了する前に、次の操作を実行した場合は
 * 前の処理を即座に終了させた上で、次の操作を実行します。
 * 
 * 例)
 * A地点に表示したポップアップ文字列を、B地点に移動させるコマンドを実行中に
 * (AとB地点の途中で)、C地点に移動させるコマンドを実行した場合は、
 * 即座にBに移動させた上で、BからC地点に移動させます。
 * 
 * 
 *-----------------------------------------------------------------------------
 * 本プラグインのライセンスについて(License)
 *-----------------------------------------------------------------------------
 * 本プラグインはMITライセンスのもとで公開しています。
 * This plugin is released under the MIT License.
 * 
 * Copyright (c) 2018 Futokoro
 * http://opensource.org/licenses/mit-license.php
 * 
 * 
 * プラグイン公開元
 * https://github.com/futokoro/RPGMaker/blob/master/README.md
 * 
 * 
 *-----------------------------------------------------------------------------
 * 変更来歴
 *-----------------------------------------------------------------------------
 * 
 * v1.2.5 - 2018/08/11 : 不具合修正
 *    1. プラグイン適用前のセーブデータからゲームを実行したときのエラー回避処理を追加。
 * 
 * v1.2.4 - 2018/03/10 : 不具合修正、機能追加
 *    1. ポップアップの移動実行中に、別地点への移動コマンドを実行すると
 *       前の移動がキャンセルされて初期位置から移動してしまう不具合を修正。
 *    2. ポップアップの操作実行時間とウェイト時間に関する注意をヘルプに追加。
 *    3. ポップアップ表示コマンドに、文字列の中心座標を設定できる機能を追加。
 *    4. ポップアップ動作が完了するまで、イベント処理にウェイトを掛ける機能を追加。
 * 
 * v1.2.3 - 2018/03/03 : 不具合修正
 *    1. メニュー開閉時に色調と透明度が元に戻ってしまう不具合を修正。
 * 
 * v1.2.2 - 2018/03/03 : 不具合修正、機能追加
 *    1. 文字の縁取りの色指定方法が間違っていたため修正。プラグインパラメータの
 *       初期値変更。
 *    2. ポップアップの色調と透明度を変更するコマンドを追加。
 *    3. ポップアップ表示のパラメータを直接設定するコマンドを追加。
 * 
 * v1.2.1 - 2018/02/28 : ヘルプ修正
 *    1. ポップアップ表示のプラグインコマンドの説明で、ポップアップ設定IDの記述に
 *       誤記があったものを修正。
 * 
 * v1.2.0 - 2018/02/25 : 機能追加
 *    1. メニュー開閉後にポップアップを再表示させる機能を追加。
 * 
 * v1.1.1 - 2018/02/24 : 不具合修正
 *    1. $gamePartyの初期化処理が間違っていた不具合を修正。
 * 
 * v1.1.0 - 2018/01/06 : 機能追加
 *    1. ポップアップを時間経過で消さない機能と、消去するコマンドを追加
 *    2. ポップアップを移動および回転させるコマンドを追加
 * 
 * v1.0.0 - 2018/01/05 : 初版作成
 * 
 *-----------------------------------------------------------------------------
*/
//=============================================================================
/*~struct~popup:
 * @param fontFace
 * @desc 使用するフォントを記述
 * 空欄の場合はMVデフォルトフォントを使用
 * @default 
 *
 * @param fontSize
 * @desc フォントサイズ
 * @type number
 * @default 28
 *
 * @param color
 * @desc 文字列の色を指定、各リスト番号の値の意味は以下
 * 1:赤, 2:緑 ,3:青 ,4:グレー  (0~255の範囲で指定)
 * @type number[]
 * @default ["0","0","0","0"]
 * 
 * @param italic
 * @desc イタリック体で表示するか
 * @type boolean
 * @on 有効
 * @off 無効
 * @default false
 * 
 * @param outlineColor
 * @desc 文字を縁取り表示する場合にカラー番号を指定(0~31)
 * 空欄は縁取りなし
 * @default 15
 *
 * @param popupHeight
 * @desc ポップアップ時にバウンドさせる高さ
 * @type number
 * @min 0
 * @default 40
 *
 * @param offsetWait
 * @desc 文字を一文字ずつ表示させる場合の時間間隔
 * 0 の場合は、同時に表示
 * @type number
 * @min 0
 * @default 0
 *
 * @param opacity
 * @desc 文字の透明度
 * @default 255
 * @min 0
 * @max 255
*/

(function() {

    var paramParse = function(obj) {
        return JSON.parse(JSON.stringify(obj, paramReplace));
    };

    var paramReplace = function(key, value) {
        try {
            return JSON.parse(value || null);
        } catch (e) {
            return value;
        }
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var window = SceneManager._scene._windowLayer.children[0];
        return window ? window.convertEscapeCharacters(text) : text;
    };

    var textColor = function(colorId) {
        if (colorId == null || isNaN(colorId)) return colorId;
        var window = SceneManager._scene._windowLayer.children[0];
        return window && Number(colorId)>=0 ? window.textColor(colorId) : '';
    };

    var convertTextWidth = function(text) {
        var tw = 0;
        var window = SceneManager._scene._windowLayer.children[0];
        if (!window) return tw;
        var conv = window.convertEscapeCharacters(text);
        var reg = /i\[(\d+)\]/i
        while (reg.test(conv)) {
            conv = (conv.toUpperCase()).replace(reg, '');
            tw += Window_Base._iconWidth + 4;
        }
        if (/c\[(\d+)\]/i.test(conv)) {
            conv = (conv.toUpperCase()).replace(/c\[(\d+)\]/ig, '');
        }
        if (conv.match(/lw\[(\d+),?([^\]]+)\]/i)) {
            tw += RegExp.$1;
            conv = (conv.toUpperCase()).replace(/lw\[(\d+),?([^\]]+)\]/ig, '');
        }
        tw += window.textWidth(conv);
        return tw;
    };

    var setArgStr = function(arg) {
        return convertEscapeCharacters(arg);
    };

    var setArgNum = function(arg) {
        try {
            return Number(eval(setArgStr(arg)));
        } catch (e) {
            return 0;
        }
    };

    //配列の要素を、すべて数値に変換する。
    Array.prototype.num = function() {
      return this.map(function(elm) {
          return Number(elm);
      });
    }

    //=============================================================================
    // プラグイン パラメータ
    //=============================================================================
    var parameters = PluginManager.parameters('FTKR_PopupSpriteMessage');

    FTKR.PSM = {
        maxPopupMessages : paramParse(parameters['Max Popup Messages'] || 0),
        popupStatus      : paramParse(parameters['Popup Message Status']),
        repop            : paramParse(parameters['Repop Message After Menu']),
    };

    //=============================================================================
    // Game_Interpreter
    //=============================================================================

    var _PSM_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _PSM_Game_Interpreter_pluginCommand.call(this, command, args);
        if (!command.match(/PSM_(.+)/i)) return;
        command = (RegExp.$1 + '').toUpperCase();
        switch (command) {
            case 'ポップアップ表示':
            case 'SHOW_POPUP':
                this.setupPopupMessage(args);
                break;
            case 'ポップアップ表示B':
            case 'SHOW_POPUP_B':
                this.setupPopupMessage_B(args);
                break;
            case 'ポップアップ移動':
            case 'MOVE_POPUP':
                this.setupMoveMessage(args);
                break;
            case 'ポップアップ回転':
            case 'ROTATE_POPUP':
                this.setupRotateMessage(args);
                break;
            case 'ポップアップ消去':
            case 'ERASE_POPUP':
                $gameParty.requestErasePopupMessage(setArgNum(args[0]), setArgNum(args[1]));
                var option = this.setupPopupMessageOptions(args, 2);
                break;
            case 'ポップアップ色調変更':
            case 'CHANGECOLOR_POPUP':
                this.setupChangeColorMessage(args);
                break;
        }
    };

    Game_Interpreter.prototype.setupPopupMessageOptions = function(args, i) {
        var option = {};
        for (var m = i; m < args.length; m++) {
            switch(args[m]) {
                case '-c':
                    option.align = true;
                    break;
                case '-s':
                    this.setPSMWaitMode();
                    break;
            }
        }
        return option;
    };

    Game_Interpreter.prototype.setupPopupMessage = function(args) {
        var status = FTKR.PSM.popupStatus[Number(args[1])];
        var option = this.setupPopupMessageOptions(args, 6);
        $gameParty.setPopupMessage(
          setArgNum(args[0]), setArgNum(args[2]), setArgNum(args[3]), setArgNum(args[4]),
          status.offsetWait, args[5], status.color, 0, status.italic,
          status.fontSize, status.outlineColor, status.popupHeight, status.fontFace,
          status.opacity, !!option.align
        );
    };

    Game_Interpreter.prototype.setupPopupMessage_B = function(args) {
        var font = args[5] == -1 ? '' : args[5];
        var option = this.setupPopupMessageOptions(args, 13);
        var color = /,/g.test(args[7]) ? args[7].split(',').num() : [0,0,0,0];
        $gameParty.setPopupMessage(
          setArgNum(args[0]), setArgNum(args[1]), setArgNum(args[2]), setArgNum(args[3]),
          setArgNum(args[11]), args[4], color, 0, Boolean(args[8]),
          setArgNum(args[6]), args[9], setArgNum(args[10]), font,
          setArgNum(args[12]), !!option.align
        );
    };

    Game_Interpreter.prototype.setupMoveMessage = function(args) {
        var option = this.setupPopupMessageOptions(args, 4);
        $gameParty.movePopupMessage(
          setArgNum(args[0]), setArgNum(args[1]), setArgNum(args[2]), setArgNum(args[3])
        );
    };

    Game_Interpreter.prototype.setupRotateMessage = function(args) {
        $gameParty.rotatePopupMessage(
          setArgNum(args[0]), setArgNum(args[1]), Boolean(setArgNum(args[2]))
        );
    };

    Game_Interpreter.prototype.setupChangeColorMessage = function(args) {
        var option = this.setupPopupMessageOptions(args, 4);
        $gameParty.changeColorMessage(
          setArgNum(args[0]), args[1], setArgNum(args[2]), setArgNum(args[3])
        );
    };

    Game_Interpreter.prototype.setPSMWaitMode = function() {
        this._waitMode = 'popupSpriteText';
    };

    var _PSM_Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function() {
        var waiting = false;
        switch (this._waitMode) {
            case 'popupSpriteText':
                waiting = $gameParty.isPsmBusy();
                break;
        }
        if (waiting) return waiting;
        return _PSM_Game_Interpreter_updateWaitMode.call(this);
    };

    //=============================================================================
    // Game_Party
    // メッセージスプライトを設定する
    //=============================================================================
    
    var _PSM_Game_Party_initialize = Game_Party.prototype.initialize;
    Game_Party.prototype.initialize = function() {
        _PSM_Game_Party_initialize.call(this);
        this._psmMessage = [];
    };

    Game_Party.prototype.maxPopupMessages = function() {
        return FTKR.PSM.maxPopupMessages;// 画面に表示可能な文字列の最大数
    };

    Game_Party.prototype.psmMessages = function(){
        if (!this._psmMessage) this._psmMessage = [];
        return this._psmMessage;
    };

    Game_Party.prototype.psmMessage = function(messageId) {
        return this.psmMessages()[messageId];
    };

    Game_Party.prototype.clearPsmMessage = function(messageId) {
        if (this.psmMessage(messageId)) {
            for(var key in this.psmMessage(messageId)) {
                delete this.psmMessage(messageId)[key];
            };
            this._psmMessage[messageId] = null;
        }
    };

    Game_Party.prototype.setPopupMessage = function(messageId, x1, y1, duration,
            offsetCount, text, flashColor, flashDuration, italic,
            fontSize, outlineColor, popupHeight, fontFace, opacity, align) {
        if (messageId > 0 && messageId <= this.maxPopupMessages()) {
            this.psmMessage(messageId);
            this._psmMessage[messageId] = {
                x : x1,
                y : y1,
                duration : duration,
                text : convertEscapeCharacters(text),
                flashColor : flashColor,
                flashDuration : flashDuration,
                popup : true,
                offsetCount : offsetCount,
                italic : italic,
                fontSize : fontSize,
                outlineColor : outlineColor,
                popupHeight : popupHeight,
                fontFace : fontFace,
                opacity : opacity,
                align : align,
            };
            return true;
        }
        return false;
    };

    Game_Party.prototype.clearPopupMessage = function(messageId) {
        if (!this.psmMessage(messageId)) return;
        this.psmMessage(messageId).popup = false;
    };

    Game_Party.prototype.clearMoveMessage = function(messageId) {
        if (!this.psmMessage(messageId)) return;
        this.psmMessage(messageId).move = false;
    };

    Game_Party.prototype.clearRotateMessage = function(messageId) {
        if (!this.psmMessage(messageId)) return;
        this.psmMessage(messageId).rotate = false;
    }
    
    Game_Party.prototype.requestErasePopupMessage = function(messageId, duration) {
        if (!this.psmMessage(messageId)) return;
        this.psmMessage(messageId).erase = true;
        this.psmMessage(messageId).eraseDuration = duration;
    };

    Game_Party.prototype.clearErasePopupMessage = function(messageId) {
        if (!this.psmMessage(messageId)) return;
        this.psmMessage(messageId).erase = false;
        this.psmMessage(messageId).eraseDuration = 0;
    };

    Game_Party.prototype.clearChangeColorMessage = function(messageId) {
        if (!this.psmMessage(messageId)) return;
        this.psmMessage(messageId).changeColor = false;
    };

    Game_Party.prototype.isPopupMessage = function(messageId) {
        return this.psmMessage(messageId) && this.psmMessage(messageId).popup;
    };

    Game_Party.prototype.isMoveMessage = function(messageId) {
        return this.psmMessage(messageId) && this.psmMessage(messageId).move;
    };

    Game_Party.prototype.isChangeColorMessage = function(messageId) {
        return this.psmMessage(messageId) && this.psmMessage(messageId).changeColor;
    };

    Game_Party.prototype.isErasePopupMessage = function(messageId) {
        return this.psmMessage(messageId) && this.psmMessage(messageId).erase;
    };

    Game_Party.prototype.eraseDuration = function(messageId) {
        return this.psmMessage(messageId) && this.psmMessage(messageId).eraseDuration || 0
    };

    Game_Party.prototype.isPsmBusy = function() {
        return this.psmMessages().some(function(message) {
            return !!message && 
              (message.duration > 0 ||
              message.moveDuration >= 0 || 
              message.colorDuration >= 0);
        });
    };

    Game_Party.prototype.movePopupMessage = function(messageId, x2, y2, duration) {
        var message = this.psmMessage(messageId);
        if (message) {
            if (message.duration) {
                this.stopUpdateMessage(messageId);
            }
            message.dx = x2;
            message.dy = y2;
            message.moveDuration = duration;
            message.move = true;
        }
    };

    Game_Party.prototype.rotatePopupMessage = function(messageId, speed, rotate) {
        var message = this.psmMessage(messageId);
        if (message) {
            if (message.duration) {
                this.stopUpdateMessage(messageId);
            }
            message.rotateSpeed = speed;
            message.rotate = rotate;
        }
    };

    Game_Party.prototype.changeColorMessage = function(messageId, color, opacity, duration){
        var message = this.psmMessage(messageId);
        if (message) {
            if (message.duration) {
                this.stopUpdateMessage(messageId);
            }
            message.dopacity = opacity;
            message.dcolor = /,/g.test(color) ? color.split(',').num() : '';
            message.colorDuration = duration;
            message.changeColor = true;
        }
    };

    Game_Party.prototype.stopUpdateMessage = function(messageId) {
        var message = this.psmMessage(messageId);
        if (message) {
            message.offsetCount = 0;
            if (message.dx) message.x = message.dx;
            if (message.dy) message.y = message.dy;
            if (message.dopacity>=0) {
                message.opacity = message.dopacity;
            }
            if (message.dcolor instanceof Array) message.flashColor = message.dcolor.clone();
        }
    };

    //=============================================================================
    // Window_Base
    //  半角スペース用の制御文字を追加
    //=============================================================================
    var _PSM_Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function(text) {
        text = _PSM_Window_Base_convertEscapeCharacters.call(this, text);
        text = text.replace(/\x1b_/gi, ' ');
        return text;
    };

    var _PSM_Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _PSM_Scene_Map_start.call(this);
        this.repopPsmMessages();
    };

    Scene_Map.prototype.repopPsmMessages = function() {
        if (FTKR.PSM.repop) {
            $gameParty.psmMessages().forEach(function(message, i){
                if (message && message.duration) {
                    $gameParty.stopUpdateMessage(i);
                    var sprite = this._spriteset._ftPopupMessages[i];
                    sprite.setup(message);
                    sprite.setupSprite(sprite._text);
                }
            },this);
        }
    };

    //=============================================================================
    // Spriteset_Base
    // メッセージスプライトを作成
    //=============================================================================
    var _PSM_Spriteset_Base_createUpperLayer = Spriteset_Base.prototype.createUpperLayer;
    Spriteset_Base.prototype.createUpperLayer = function() {
        _PSM_Spriteset_Base_createUpperLayer.call(this);
        this.createPopupMessages();
    };

    Spriteset_Base.prototype.createPopupMessages = function() {
        var width = Graphics.boxWidth;
        var height = Graphics.boxHeight;
        var x = (Graphics.width - width) / 2;
        var y = (Graphics.height - height) / 2;
        this._messageContainer = new Sprite();
        this._messageContainer.setFrame(x, y, width, height);
        this._ftPopupMessages = [];
        for (var i = 1; i <= this.maxPopupMessages(); i++) {
            this._ftPopupMessages[i] = new Sprite_FtPopupMessage(i);
            this._messageContainer.addChild(this._ftPopupMessages[i]);
        }
        this.addChild(this._messageContainer);
    };

    Spriteset_Base.prototype.maxPopupMessages = function() {
        return $gameParty.maxPopupMessages();
    };

    //=============================================================================
    // Sprite_FtPopupMessage
    // メッセージを表示するスプライト
    //=============================================================================
    function Sprite_FtPopupMessage() {
        this.initialize.apply(this, arguments);
    }

    Sprite_FtPopupMessage.prototype             = Object.create(Sprite_Damage.prototype);
    Sprite_FtPopupMessage.prototype.constructor = Sprite_FtPopupMessage;

    Sprite_FtPopupMessage.prototype.initialize = function(messageId) {
        Sprite_Damage.prototype.initialize.call(this);
        this._messageId = messageId;
        this._messageSprites = [];
        this._index = 0;
        this._offsetCount = -1;
        this._moveDuration = -1;
        this._colorDuration = -1;
        this._angle = 0;
        this._duration = 0;
        this._isKeepPopup = false;
    };

    Sprite_FtPopupMessage.prototype.setup = function(message) {
        if (this._messageSprites.length) {
            this._messageSprites.forEach( function(sprite) {
                this.removeChild(sprite);
            },this);
        }
        this._text = message.text;
        this._fontSize = message.fontSize;
        this._fontFace = message.fontFace;
        this._outlineColor = textColor(message.outlineColor);
        this._italic = message.italic;
        this._offsetCount = message.offsetCount;
        this._popupHeight = message.popupHeight || 0;
        message.popupHeight = 0;
        this._index = 0;
        this._count = 0;
        this._align = message.align;
        this._textWidth = this.getTextWidth();
        this._textHeight = this.setupDynamicText().height;
        var x = message.x;
        var y = message.y;
        this.move(this.textX(message.x), this.textY(message.y));// スプライトの原点
        if (message.flashColor) {
            this.setupFlashEffect(message.flashColor, message.flashDuration);
        }
        this._duration = message.duration;
        this.opacity = !isNaN(message.opacity)  ? Number(message.opacity) : 255;
    };

    Sprite_FtPopupMessage.prototype.getTextWidth = function() {
        return this.setupDynamicText().measureTextWidth(this._text);
    };

    Sprite_FtPopupMessage.prototype.textX = function(x) {
        return this._align ? x - this._textWidth / 2 : x;
    };

    Sprite_FtPopupMessage.prototype.textY = function(y) {
        return this._align ? y - this._textHeight / 2 : y;
    };

    Sprite_FtPopupMessage.prototype.setupSprite = function(text) {
        var bitmap     = this.setupDynamicText(text);
        var sprite     = this.createChildSprite(bitmap);
        sprite.dy      = 0;
        sprite.dw      = bitmap.measureTextWidth(text);
        return sprite;
    };

    Sprite_FtPopupMessage.prototype.setupDynamicText = function(text) {
        var size = this._fontSize;
        var width = text ? (this._italic ? size * 1.5 : size) * text.length : size + 8;
        var bitmap = new Bitmap(width, size + 8);// 文字の描画領域サイズ
        bitmap.fontSize = size;// フォントサイズ
        if (this._fontFace) {
            bitmap.fontFace = this._fontFace + ',' + bitmap.fontFace;
        }
        if (this._italic) {
            bitmap.fontItalic = true;// イタリック体で表示
        }
        if (this._outlineColor) {
            bitmap.outlineWidth = Math.floor(bitmap.fontSize / 6);// 文字の縁取り太さ
            bitmap.outlineColor = this._outlineColor;// 文字の縁取り色
        }
        if (text) bitmap.drawText(text, 0, 0, bitmap.width, bitmap.height, 'center');
        return bitmap;
    };

    Sprite_FtPopupMessage.prototype.createChildSprite = function(bitmap) {
        var sprite = new Sprite();
        sprite.bitmap = bitmap || this._damageBitmap;
        sprite.anchor.x = 0;// 原点に対する文字の表示位置
        sprite.anchor.y = 0;// 原点に対する文字の表示位置
        sprite.y = -this._popupHeight; // はねる高さ
        sprite.ry = sprite.y;
        return sprite;
    };

    Sprite_FtPopupMessage.prototype.setupFlashEffect = function(flashColor, duration) {
        this._flashColor    = flashColor.clone();
        this._flashDuration = duration;
    };

    Sprite_FtPopupMessage.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updateBitmap();
        this.updateDuration();
        this.updatePosition();
        this.updateFlash();
        this.updateOpacity();
    };

    Sprite_FtPopupMessage.prototype.updateBitmap = function() {
        if ($gameParty.isPopupMessage(this._messageId)) {
            var message = this.message();
            this.setup(message);
            $gameParty.clearPopupMessage(this._messageId);
        }
        if (this._text) {
            if (this._offsetCount > 0) {
                if (this._count == 0) {
                    var i = this._index;
                    var sprite = this.setupSprite(this._text[i]);
                    sprite.x = i > 0 ? this._messageSprites[i-1].x + sprite.dw : 0;
                    this._messageSprites[i] = sprite;
                    this.addChild(this._messageSprites[i]);
                    this._count = this.message().offsetCount;
                    this._index++;
                } else if (this._count > 0) {
                    this._count--;
                }
                if (this._index >= this._text.length) this._text = '';
            } else if (this._offsetCount == 0) {
                for (var i = 0; i < this._text.length; i++) {
                    var sprite = this.setupSprite(this._text[i]);
                    sprite.x = i > 0 ? this._messageSprites[i-1].x + sprite.dw : 0;
                    this._messageSprites[i] = sprite;
                    this.addChild(this._messageSprites[i]);
                    this._count = this.message().offsetCount;
                }
                this._text = '';
            } else {
                this._messageSprites[0] = this.setupSprite(this._text);
                this.addChild(this._messageSprites[0]);
                this._text = '';
            }
        }
    };

    Sprite_FtPopupMessage.prototype.message = function() {
        return $gameParty.psmMessage(this._messageId);
    };

    Sprite_FtPopupMessage.prototype.updatePosition = function() {
        if ($gameParty.isMoveMessage(this._messageId)) {
            var message = this.message();
            this._moveDuration = message.moveDuration;
            $gameParty.clearMoveMessage(this._messageId);
        }
        if (this._moveDuration > 0) {
            this._moveDuration--;
            var message = this.message();
            if (this.message()) this.message().moveDuration = this._moveDuration;
            this.x = this.textX(Math.floor(message.x + (message.dx - message.x) * (1 - this._moveDuration / message.moveDuration)));
            this.y = this.textY(Math.floor(message.y + (message.dy - message.y) * (1 - this._moveDuration / message.moveDuration)));
        } else if (this._moveDuration == 0) {
            this._moveDuration--;
            var message = this.message();
            if (this.message()) this.message().moveDuration = this._moveDuration;
            this.x = this.textX(message.dx);
            message.x = message.dx;
            this.y = this.textY(message.dy);
            message.y = message.dy;
        }
        if (this.message() && this.message().rotate) {
            this._angle += this.message().rotateSpeed / 2;
        } else if (this.message() && !this.message().rotate && this.message().rotateSpeed) {
            this._angle = this.message().rotateSpeed / 2;
        }
        this.rotation = this._angle * Math.PI / 180;
    };

    Sprite_FtPopupMessage.prototype.updateDuration = function() {
        if (this._duration == -1 && $gameParty.isErasePopupMessage(this._messageId)) {
            this._duration = $gameParty.eraseDuration(this._messageId);
            $gameParty.clearErasePopupMessage(this._messageId);
        }
        if (this._duration == -1) {
            for (var i = 0; i < this.children.length; i++) {
                this.updateChild(this.children[i]);
            }
        } else if (this._duration > 0) {
            this._duration--;
            if (this.message()) this.message().duration = this._duration;
            for (var i = 0; i < this.children.length; i++) {
                this.updateChild(this.children[i]);
            }
        }
        if (this._duration == 0 && this._messageSprites.length) {
            this._messageSprites.forEach( function(sprite) {
                this.removeChild(sprite);
            },this);
            this._moveDuration = -1;
            this._angle = 0;
            $gameParty.clearPsmMessage(this._messageId);
            this._messageSprites = [];
        }
    };

    Sprite_FtPopupMessage.prototype.updateColor = function() {
        var message = this.message();
        if (!Array.isArray(message.dcolor)) return;
        this._flashColor = [
            this.setNextColor(0, message),
            this.setNextColor(1, message),
            this.setNextColor(2, message),
            this.setNextColor(3, message),
        ];
        message.flashColor = this._flashColor.clone();
    };

    Sprite_FtPopupMessage.prototype.setNextColor = function(index, message) {
      return Math.floor(this._colorA[index] + (message.dcolor[index] - this._colorA[index]) * (1 - this._colorDuration / message.colorDuration));
    };

    Sprite_FtPopupMessage.prototype.updateOpacity = function() {
        if ($gameParty.isChangeColorMessage(this._messageId)) {
            var message = this.message();
            this._colorDuration = message.colorDuration;
            this._colorA = this._flashColor.clone();
            $gameParty.clearChangeColorMessage(this._messageId);
        }
        if (this._colorDuration > 0) {
            this._colorDuration--;
            var message = this.message();
            if (this.message()) this.message().colorDuration = this._colorDuration;
            this.updateColor();
            if (message.dopacity>=0) this.opacity = Math.floor(message.opacity + (message.dopacity - message.opacity) * (1 - this._colorDuration / message.colorDuration));
        } else if (this._colorDuration == 0) {
            this._colorDuration--;
            var message = this.message();
            if (this.message()) this.message().colorDuration = this._colorDuration;
            if (message.dopacity>=0) {
                this.opacity = message.dopacity;
                message.opacity = message.dopacity;
            }
            if (message.dcolor instanceof Array) {
                this._flashColor = message.dcolor.clone();
                message.flashColor = message.dcolor.clone();
            }
        }
        if (this._duration >= 0 && this._duration < 10) {
            this.opacity = 255 * this._duration / 10;
        }
    };

}());//EOF
