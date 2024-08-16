//=============================================================================
// PictureCallCommon.js
// ----------------------------------------------------------------------------
// (C)2015 Triacontane
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.14.4 2021/08/22 「並列処理として実行」のパラメータが戦闘画面には適用されない問題を修正
// 1.14.3 2021/05/01 紐付け解除の際の設定値を変更
// 1.14.2 2020/06/05 ヘルプのキーバインドにpagedownとpageupを追加
// 1.14.1 2020/05/16 ヘルプのコマンド部分の紛らわしい記述を修正
// 1.14.0 2020/05/13 指定したスイッチがONのときのみ「タッチ操作抑制」を有効にできる設定を追加
// 1.13.1 2020/05/06 マップズームを実行したときの座標の取得計算が間違っていた問題を修正
// 1.13.0 2019/12/22 ピクチャコモンを並列処理として実行する設定を追加。
// 1.12.2 2019/03/31 キーバインドで追加でキーを指定した場合に、ボタン名称が小文字でないと反応しない仕様を変更
// 1.12.1 2019/03/19 コミュニティ版コアスクリプト1.3以降でピクチャコモンから移動ルートの設定を実行するとエラーになっていた問題を修正
// 1.12.0 2018/11/02 すべてのピクチャタッチを無効にできるスイッチを追加
// 1.11.0 2018/08/10 なでなで機能に透過設定が正しく適用されない問題を修正
//                   なでなで機能にもプラグインコマンドから透過設定を変更できる機能を追加
// 1.10.8 2018/06/16 Boolean型のパラメータが一部正常に取得できていなかった問題を修正
// 1.10.7 2018/06/01 イベント「戦闘の処理」による戦闘の場合、「戦闘中に常にコモン実行」の機能が使えない問題を修正
// 1.10.6 2018/04/12 ヘルプの記述を微修正
// 1.10.5 2017/12/17 コモンイベントを実行するタイプのボタンは、イベント実行中に無効になるよう仕様変更
// 1.10.4 2017/11/01 ピクチャコモンが呼ばれる瞬間に対象ピクチャが表示されていない場合はイベントを呼ばない仕様に変更
// 1.10.3 2017/10/28 ピクチャタッチイベントの呼び出し待機中に戦闘に突入すると、戦闘画面表示後に実行されてしまう問題を修正
// 1.10.2 2017/10/21 戦闘画面に突入する際のエフェクトで、マウスオーバーイベントが予期せず発生する場合がある問題を修正
// 1.10.1 2017/05/27 動的文字列ピクチャプラグインのウィンドウフレームクリックをピクチャクリックに対応
// 1.9.3 2017/05/27 競合の可能性のある記述（Objectクラスへのプロパティ追加）をリファクタリング（by liplyさん）
// 1.9.2 2017/03/16 1.9.0で戦闘中にコモンイベント実行が正しく動作していなかった問題を修正
// 1.9.1 2017/03/16 透明色を考慮する場合、不透明度が0のピクチャは一切反応しなくなるように仕様変更
// 1.9.0 2017/03/13 戦闘中常にピクチャクリックイベントを実行できる機能を追加
// 1.8.2 2017/02/14 1.8.0の修正により、ピクチャクリック時に変数に値を格納する機能が無効化されていたのを修正
// 1.8.1 2017/02/07 端末依存の記述を削除
// 1.8.0 2017/02/03 ピクチャクリックを任意のボタンにバインドできる機能を追加
// 1.7.0 2017/02/02 マップのズームおよびシェイク中でも正確にピクチャをクリックできるようになりました。
//                  マウスポインタがピクチャ内にあるかどうかをスクリプトで判定できる機能を追加。
// 1.6.0 2016/12/29 ピクチャクリックでイベントが発生したらマップタッチを無効化するよう仕様修正
// 1.5.1 2016/11/20 1.5.0で混入した不要なコードを削除
// 1.5.0 2016/11/19 ピクチャクリック時にコモンイベントではなくスイッチをONにできる機能を追加
// 1.4.0 2016/08/20 ピクチャごとに透明色を考慮するかどうかを設定できる機能を追加
//                  プラグインを適用していないセーブデータをロードした場合に発生するエラーを修正
// 1.3.5 2016/04/20 リファクタリングによりピクチャの優先順位が逆転していたのをもとに戻した
// 1.3.4 2016/04/08 ピクチャが隣接する状態でマウスオーバーとマウスアウトが正しく機能しない場合がある問題を修正
// 1.3.3 2016/03/19 トリガー条件を満たした場合に以後のタッチ処理を抑制するパラメータを追加
// 1.3.2 2016/02/28 処理の負荷を少し軽減
// 1.3.1 2016/02/21 トリガーにマウスを押したまま移動を追加
// 1.3.0 2016/01/24 ピクチャをなでなでする機能を追加
//                  トリガーにマウスムーブを追加
//                  ピクチャが回転しているときに正しく位置を補足できるよう修正
// 1.2.1 2016/01/21 呼び出すコモンイベントの上限を100から1000（DB上の最大値）に修正
//                  競合対策（YEP_MessageCore.js）
// 1.2.0 2016/01/14 ホイールクリック、ダブルクリックなどトリガーを10種類に拡充
// 1.1.3 2016/01/02 競合対策（TDDP_BindPicturesToMap.js）
// 1.1.2 2015/12/20 長押しイベント発生時に1秒間のインターバルを設定するよう仕様変更
// 1.1.1 2015/12/10 ピクチャを消去後にマウスオーバーするとエラーになる現象を修正
// 1.1.0 2015/11/23 コモンイベントを呼び出した対象のピクチャ番号を特定する機能を追加
//                  設定で透明色を考慮する機能を追加
//                  トリガーとして「右クリック」や「長押し」を追加
// 1.0.0 2015/11/14 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:ja
 * @plugindesc ピクチャのボタン化プラグイン
 * @author トリアコンタン
 *
 * @param 透明色を考慮
 * @desc クリックされた箇所が透明色だった場合は、クリックを無効にする。
 * @default true
 * @type boolean
 *
 * @param ピクチャ番号の変数番号
 * @desc ピクチャクリック時にピクチャ番号を格納するゲーム変数の番号。
 * @default 0
 * @type variable
 *
 * @param ポインタX座標の変数番号
 * @desc マウスカーソルもしくはタッチした位置のX座標を常に格納するゲーム変数の番号
 * @default 0
 * @type variable
 *
 * @param ポインタY座標の変数番号
 * @desc マウスカーソルもしくはタッチした位置のY座標を常に格納するゲーム変数の番号
 * @default 0
 * @type variable
 *
 * @param タッチ操作抑制
 * @desc トリガー条件を満たした際にタッチ情報をクリアします。(ON/OFF)
 * 他のタッチ操作と動作が重複する場合にONにします。
 * @default false
 * @type boolean
 *
 * @param タッチ操作抑制スイッチ
 * @desc 指定した場合、対象スイッチがONのときのみ「タッチ操作抑制」が有効になります。
 * @default 0
 * @type switch
 *
 * @param 戦闘中常にコモン実行
 * @desc 戦闘中にピクチャをクリックしたとき、常にコモンイベントを実行します。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param 並列処理として実行
 * @desc ピクチャクリックによるコモンイベント実行を並列処理扱いで実行します。
 * @default false
 * @type boolean
 *
 * @param 無効スイッチ
 * @desc 指定した番号のスイッチがONになっている場合、すべてのピクチャタッチが無効になります。
 * @default 0
 * @type switch
 *
 * @help ピクチャをクリックすると、指定したコモンイベントが
 * 呼び出される、もしくは任意のスイッチをONにするプラグインコマンドを提供します。
 * このプラグインを利用すれば、JavaScriptの知識がなくても
 * 誰でも簡単にクリックやタッチを主体にしたゲームを作れます。
 *
 * 戦闘中でも実行可能ですが、ツクールMVの仕様により限られたタイミングでしか
 * イベントは実行されません。パラメータ「戦闘中常にコモン実行」を有効にすると
 * 常にイベントが実行されるようになりますが、
 * 一部イベントコマンドは正しく動作しない制約があります。
 *
 * 注意！
 * 一度関連づけたピクチャとコモンイベントはピクチャを消去しても有効です。
 * ピクチャが存在しなければどこをクリックしても反応しませんが、
 * 同じ番号で再度、ピクチャの表示を行うと反応するようになります。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （引数の間は半角スペースで区切る）
 *
 *  ピクチャのボタン化 or
 *  P_CALL_CE [ピクチャ番号] [コモンイベントID] [トリガー] [透明色を考慮]
 *      ピクチャの領域内でトリガー条件を満たした場合に呼び出されるコモンイベントを関連づけます。
 *  　　トリガーは以下の通りです。(省略すると 1 になります)
 *      1  : クリックした場合
 *      2  : 右クリックした場合
 *      3  : 長押しした場合
 *      4  : マウスをピクチャに重ねた場合
 *      5  : マウスをピクチャから放した場合
 *      6  : クリックを解放（リリース）した場合
 *      7  : クリックした場合（かつ長押しの際の繰り返しを考慮）
 *      8  : クリックしている間ずっと
 *      9  : ホイールクリックした場合（PCの場合のみ有効）
 *      10 : ダブルクリックした場合
 *      11 : マウスをピクチャ内で移動した場合
 *      12 : マウスを押しつつピクチャ内で移動した場合
 *
 *      透明色を考慮のパラメータ(ON/OFF)を指定するとピクチャごとに透明色を考慮するかを
 *      設定できます。何も設定しないとプラグインパラメータの設定が適用されます。(従来の仕様)
 *
 *  例：P_CALL_CE 1 3 7 ON
 *  　：ピクチャのボタン化 \v[1] \v[2] \v[3] OFF
 *
 *  ピクチャのスイッチ化 or
 *  P_CALL_SWITCH [ピクチャ番号] [スイッチID] [トリガー] [透明色を考慮]
 *  　　ピクチャの領域内でトリガー条件を満たした場合に、任意のスイッチをONにします。
 *  　　トリガーの設定などは、ピクチャのボタン化と同一です。
 *
 *  ピクチャのキーバインド or
 *  P_CALL_KEY_BIND [ピクチャ番号] [ボタン名称] [トリガー] [透明色を考慮]
 *  　　ピクチャの領域内でトリガー条件を満たした場合に、任意のボタンを押したことにします。
 *  　　ボタン名の設定は以下の通りです。(Windows基準)
 *  ok       : Enter,Z
 *  shift    : Shift
 *  control  : Ctrl,Alt
 *  escape   : Esc,X
 *  left     : ←
 *  up       : ↑
 *  right    : →
 *  down     : ↓
 *  pageup   : PageUp
 *  pagedown : PageDown
 *
 *  ピクチャのボタン化解除 or
 *  P_CALL_CE_REMOVE [ピクチャ番号]
 *      ピクチャとコモンイベントもしくはスイッチの関連づけを解除します。
 *      全てのトリガーが削除対象です。
 *
 *  例：P_CALL_CE_REMOVE 1
 *  　：ピクチャのボタン化解除 \v[1]
 *
 *  ピクチャのなでなで設定 or
 *  P_STROKE [ピクチャ番号] [変数番号] [透明色を考慮]
 *  　　指定したピクチャの上でマウスやタッチを動かすと、
 *  　　速さに応じた値が指定した変数に値が加算されるようになります。
 *  　　この設定はピクチャを差し替えたり、一時的に非表示にしても有効です。
 *  　　10秒でだいたい1000くらいまで溜まります。
 *
 *  例：P_STROKE 1 2 ON
 *  　：ピクチャのなでなで設定 \v[1] \v[2] OFF
 *
 *  ピクチャのなでなで解除 or
 *  P_STROKE_REMOVE [ピクチャ番号]
 *  　　指定したピクチャのなでなで設定を解除します。
 *
 *  例：P_STROKE_REMOVE 1
 *  　：ピクチャのなでなで解除 \v[1]
 *
 *  ピクチャのポインタ化 or
 *  P_POINTER [ピクチャ番号]
 *  　　指定したピクチャがタッチ座標を自動で追従するようになります。
 *  　　タッチしていないと自動で非表示になります。
 *
 *  例：P_POINTER 1
 *  　：ピクチャのポインタ化 \v[1]
 *
 *  ピクチャのポインタ化解除 or
 *  P_POINTER_REMOVE [ピクチャ番号]
 *  　　指定したピクチャのポインタ化を解除します。
 *
 *  例：P_POINTER_REMOVE 1
 *  　：ピクチャのポインタ化解除 \v[1]
 *
 *  ・スクリプト（上級者向け）
 *  $gameScreen.isPointerInnerPicture([ID]);
 *
 *  指定した[ID]のピクチャ内にマウスポインタもしくはタッチ座標が存在する場合に
 *  trueを返します。このスクリプトは[P_CALL_CE]を使用していなくても有効です。
 *
 *  例：$gameScreen.isPointerInnerPicture(5);
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
/*:
 * @plugindesc Clickable picture plugin
 * @author triacontane
 *
 * @param TransparentConsideration
 * @desc if click position is transparent, click is disabled.
 * @default true
 * @type boolean
 *
 * @param GameVariablePictureNum
 * @desc Game variable number that stores the picture number when common event called.
 * @default 0
 * @type variable
 *
 * @param GameVariableTouchX
 * @desc Game variable number that stores touch x position
 * @default 0
 * @type variable
 *
 * @param GameVariableTouchY
 * @desc Game variable number that stores touch y position
 * @default 0
 * @type variable
 *
 * @param SuppressTouch
 * @desc Suppress touch event for others(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param SuppressTouchSwitch
 * @desc If this is specified, the "SuppressTouch" is enabled only when the target switch is on.
 * @default 0
 * @type switch
 *
 * @param AlwaysCommonInBattle
 * @desc Always execute common event in battle(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param AsParallelCommon
 * @desc ピクチャクリックによるコモンイベント実行を並列処理扱いで実行します。
 * @default false
 * @type boolean
 *
 * @param InvalidSwitchId
 * @desc 指定した番号のスイッチがONになっている場合、すべてのピクチャタッチが無効になります。
 * @default 0
 * @type switch
 *
 * @help When clicked picture, call common event.
 *
 * Plugin Command
 *
 *  P_CALL_CE [Picture number] [Common event ID] [Trigger] [TransparentConsideration]:
 *      When picture was clicked, assign common event id.
 *  　　Trigger are As below(if omit, It is specified to 1)
 *      1  : Left click
 *      2  : Right click
 *      3  : Long click
 *      4  : Mouse over
 *      5  : Mouse out
 *      6  : Mouse release
 *      7  : Mouse repeat click
 *      8  : Mouse press
 *      9  : Wheel click
 *      10 : Double click
 *      11 : Mouse move
 *      12 : Mouse move and press
 *
 *  P_CALL_CE_REMOVE [Picture number] :
 *      break relation from picture to common event.
 *
 *  - Script
 *  $gameScreen.isPointerInnerPicture([ID]);
 *
 *  If mouse pointer inner the picture, return true.
 *
 *  ex：$gameScreen.isPointerInnerPicture(5);
 *
 *  This plugin is released under the MIT License.
 */
(function() {
    'use strict';
    var pluginName = 'PictureCallCommon';

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON' || (value || '').toUpperCase() === 'TRUE';
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };

    var getArgBoolean = function(arg) {
        return (arg || '').toUpperCase() === 'ON';
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var window = SceneManager._scene._windowLayer.children[0];
        return window ? window.convertEscapeCharacters(text) : text;
    };

    var iterate = function(that, handler) {
        Object.keys(that).forEach(function(key, index) {
            handler.call(that, key, that[key], index);
        });
    };

    //=============================================================================
    // パラメータの取得とバリデーション
    //=============================================================================
    var paramGameVariableTouchX       = getParamNumber(['GameVariableTouchX', 'ポインタX座標の変数番号'], 0);
    var paramGameVariableTouchY       = getParamNumber(['GameVariableTouchY', 'ポインタY座標の変数番号'], 0);
    var paramGameVariablePictNum      = getParamNumber(['GameVariablePictureNum', 'ピクチャ番号の変数番号'], 0);
    var paramTransparentConsideration = getParamBoolean(['TransparentConsideration', '透明色を考慮']);
    var paramSuppressTouch            = getParamBoolean(['SuppressTouch', 'タッチ操作抑制']);
    var paramSuppressTouchSwitch      = getParamNumber(['SuppressTouchSwitch', 'タッチ操作抑制スイッチ']);
    var paramAlwaysCommonInBattle     = getParamBoolean(['AlwaysCommonInBattle', '戦闘中常にコモン実行']);
    var paramInvalidSwitchId          = getParamNumber(['InvalidSwitchId', '無効スイッチ'], 0);
    var paramAsParallelCommon         = getParamBoolean(['AsParallelCommon', '並列処理として実行']);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンド[P_CALL_CE]などを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var pictureId, touchParam, trigger, variableNum, transparent;
        switch (getCommandName(command)) {
            case 'P_CALL_CE' :
            case 'ピクチャのボタン化':
                pictureId   = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                touchParam  = getArgNumber(args[1], 1, $dataCommonEvents.length - 1);
                trigger     = getArgNumber(args[2], 1);
                transparent = (args.length > 3 ? getArgBoolean(args[3]) : null);
                $gameScreen.setPictureCallCommon(pictureId, touchParam, trigger, transparent);
                break;
            case 'P_CALL_SWITCH' :
            case 'ピクチャのスイッチ化':
                pictureId   = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                touchParam  = getArgNumber(args[1], 1);
                trigger     = getArgNumber(args[2], 1);
                transparent = (args.length > 3 ? getArgBoolean(args[3]) : null);
                $gameScreen.setPictureCallCommon(pictureId, touchParam * -1, trigger, transparent);
                break;
            case 'P_CALL_KEY_BIND' :
            case 'ピクチャのキーバインド':
                pictureId   = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                touchParam  = convertEscapeCharacters(args[1]);
                trigger     = getArgNumber(args[2], 1);
                transparent = (args.length > 3 ? getArgBoolean(args[3]) : null);
                $gameScreen.setPictureCallCommon(pictureId, touchParam, trigger, transparent);
                break;
            case 'P_CALL_CE_REMOVE' :
            case 'ピクチャのボタン化解除':
                pictureId = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                $gameScreen.setPictureRemoveCommon(pictureId);
                break;
            case 'P_STROKE' :
            case 'ピクチャのなでなで設定':
                pictureId   = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                variableNum = getArgNumber(args[1], 1, $dataSystem.variables.length - 1);
                transparent = (args.length > 2 ? getArgBoolean(args[2]) : null);
                $gameScreen.setPictureStroke(pictureId, variableNum, transparent);
                break;
            case 'P_STROKE_REMOVE' :
            case 'ピクチャのなでなで解除':
                pictureId = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                $gameScreen.removePictureStroke(pictureId);
                break;
            case 'P_POINTER' :
            case 'ピクチャのポインタ化':
                pictureId = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                $gameScreen.setPicturePointer(pictureId);
                break;
            case 'P_POINTER_REMOVE' :
            case 'ピクチャのポインタ化解除':
                pictureId = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                $gameScreen.removePicturePointer(pictureId);
                break;
        }
    };

    var _Game_Interpreter_terminate      = Game_Interpreter.prototype.terminate;
    Game_Interpreter.prototype.terminate = function() {
        _Game_Interpreter_terminate.apply(this, arguments);
        this._setupFromPicture = false;
    };

    Game_Interpreter.prototype.setupFromPicture = function(eventList, commonId) {
        this.setup(eventList, null);
        if (this.setEventInfo) {
            this.setEventInfo({ eventType: 'common_event', commonEventId: commonId });
        }
        this._setupFromPicture = true;
    };

    Game_Interpreter.prototype.isSetupFromPicture = function() {
        return this._setupFromPicture;
    };

    //=============================================================================
    // Game_Temp
    //  呼び出し予定のコモンイベントIDのフィールドを追加定義します。
    //=============================================================================
    var _Game_Temp_initialize      = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this.clearPictureCallInfo();
    };

    Game_Temp.prototype.clearPictureCallInfo = function() {
        this._pictureCommonId = 0;
        this._touchPictureId  = 0;
    };

    Game_Temp.prototype.setPictureCallInfo = function(pictureCommonId) {
        this._pictureCommonId = pictureCommonId;
    };

    Game_Temp.prototype.pictureCommonId = function() {
        if (!$gameScreen.picture(this._touchPictureId)) {
            this.clearPictureCallInfo();
        }
        return this._pictureCommonId;
    };

    Game_Temp.prototype.onTouchPicture = function(param, pictureId) {
        this._touchPictureParam = param;
        if (this.isTouchPictureSetSwitch()) {
            $gameSwitches.setValue(param * -1, true);
        }
        if (this.isTouchPictureCallCommon()) {
            if (!paramAsParallelCommon && $gameMap.isEventRunning() && !$gameParty.inBattle()) {
                this._touchPictureParam = null;
                return;
            }
            this.setPictureCallInfo(param);
        }
        if (this.isTouchPictureButtonTrigger()) {
            Input.bindKeyState(param);
        }
        if (paramGameVariablePictNum > 0) {
            $gameVariables.setValue(paramGameVariablePictNum, pictureId);
        }
        this._touchPictureId = pictureId;
    };

    Game_Temp.prototype.isTouchPictureButtonTrigger = function() {
        return isNaN(this._touchPictureParam);
    };

    Game_Temp.prototype.isTouchPictureSetSwitch = function() {
        return !isNaN(this._touchPictureParam) && this._touchPictureParam < 0;
    };

    Game_Temp.prototype.isTouchPictureCallCommon = function() {
        return !isNaN(this._touchPictureParam) && this._touchPictureParam > 0;
    };

    //=============================================================================
    // Game_System
    //  ロード時にピクチャ関連メンバを初期化します。
    //=============================================================================
    var _Game_System_onAfterLoad      = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function() {
        _Game_System_onAfterLoad.apply(this, arguments);
        $gameScreen.initPictureArray();
    };

    //=============================================================================
    // Game_Map
    //  ピクチャがタッチされたときのコモンイベント呼び出し処理を追加定義します。
    //=============================================================================
    var _Game_Map_setupStartingEvent      = Game_Map.prototype.setupStartingEvent;
    Game_Map.prototype.setupStartingEvent = function() {
        var result = _Game_Map_setupStartingEvent.call(this);
        return result || this.setupPictureCommonEvent();
    };

    var _Game_Map_updateInterpreter = Game_Map.prototype.updateInterpreter;
    Game_Map.prototype.updateInterpreter = function() {
        _Game_Map_updateInterpreter.apply(this, arguments);
        this.setupPictureParallelCommonEvent();
    };

    Game_Map.prototype.setupPictureParallelCommonEvent = function() {
        if (!paramAsParallelCommon) {
            return;
        }
        var commonId = $gameTemp.pictureCommonId();
        var event    = $dataCommonEvents[commonId];
        if (event) {
            if (!this._pictureCommonEvents) {
                this._pictureCommonEvents = [];
            }
            var interpreter = new Game_Interpreter();
            interpreter.setupFromPicture(event.list, commonId);
            this._pictureCommonEvents.push(interpreter);
            $gameTemp.clearPictureCallInfo();
        }
    };

    Game_Map.prototype.setupPictureCommonEvent = function() {
        if (paramAsParallelCommon) {
            return false;
        }
        var commonId = $gameTemp.pictureCommonId();
        var event    = $dataCommonEvents[commonId];
        var result   = false;
        if (!this.isEventRunning() && event) {
            this._interpreter.setupFromPicture(event.list, commonId);
            result = true;
        }
        $gameTemp.clearPictureCallInfo();
        return result;
    };

    var _Game_Map_updateEvents = Game_Map.prototype.updateEvents;
    Game_Map.prototype.updateEvents = function() {
        _Game_Map_updateEvents.apply(this, arguments);
        if (this._pictureCommonEvents && this._pictureCommonEvents.length > 0) {
            this.updatePictureCommonEvents();
        }
    };

    Game_Map.prototype.updatePictureCommonEvents = function() {
        this._pictureCommonEvents.forEach(function(event) {
            event.update();
        });
        this._pictureCommonEvents = this._pictureCommonEvents.filter(function(event) {
            return event.isRunning();
        })
    };

    //=============================================================================
    // Game_Troop
    //  ピクチャがタッチされたときのコモンイベント呼び出し処理を追加定義します。
    //=============================================================================
    Game_Troop.prototype.setupPictureCommonEvent = Game_Map.prototype.setupPictureCommonEvent;
    Game_Troop.prototype.setupPictureParallelCommonEvent = Game_Map.prototype.setupPictureParallelCommonEvent;
    Game_Troop.prototype.updatePictureCommonEvents = Game_Map.prototype.updatePictureCommonEvents;

    Game_Troop.prototype.updateAllPictureCommonEvent = function() {
        this.setupPictureCommonEvent();
        this.setupPictureParallelCommonEvent();
        if (this._pictureCommonEvents && this._pictureCommonEvents.length > 0) {
            this.updatePictureCommonEvents();
        }
    };

    Game_Troop.prototype.isExistPictureCommon = function() {
        return this._interpreter.isSetupFromPicture();
    };

    //=============================================================================
    // Game_Screen
    //  ピクチャに対応するコモンイベント呼び出し用のID配列を追加定義します。
    //=============================================================================
    var _Game_Screen_initialize      = Game_Screen.prototype.initialize;
    Game_Screen.prototype.initialize = function() {
        _Game_Screen_initialize.apply(this, arguments);
        this.initPictureArray();
    };

    Game_Screen.prototype.initPictureArray = function() {
        this._pictureCidArray         = this._pictureCidArray || [];
        this._pictureSidArray         = this._pictureSidArray || [];
        this._picturePidArray         = this._picturePidArray || [];
        this._pictureTransparentArray = this._pictureTransparentArray || [];
    };

    var _Game_Screen_update      = Game_Screen.prototype.update;
    Game_Screen.prototype.update = function() {
        _Game_Screen_update.apply(this, arguments);
        this.updatePointer();
    };

    Game_Screen.prototype.updatePointer = function() {
        if (paramGameVariableTouchX)
            $gameVariables._data[paramGameVariableTouchX] = TouchInput.x;
        if (paramGameVariableTouchY)
            $gameVariables._data[paramGameVariableTouchY] = TouchInput.y;
    };

    Game_Screen.prototype.setPictureCallCommon = function(pictureId, touchParameter, trigger, transparent) {
        var realPictureId = this.realPictureId(pictureId);
        if (this._pictureCidArray[realPictureId] == null) this._pictureCidArray[realPictureId] = [];
        this._pictureCidArray[realPictureId][trigger] = touchParameter;
        this._pictureTransparentArray[realPictureId]  = transparent;
    };

    Game_Screen.prototype.setPictureRemoveCommon = function(pictureId) {
        this._pictureCidArray[this.realPictureId(pictureId)] = null;
    };

    Game_Screen.prototype.setPictureStroke = function(pictureId, variableNum, transparent) {
        var realPictureId = this.realPictureId(pictureId);
        this._pictureSidArray[realPictureId] = variableNum;
        this._pictureTransparentArray[realPictureId] = transparent;
    };

    Game_Screen.prototype.removePictureStroke = function(pictureId) {
        this._pictureSidArray[this.realPictureId(pictureId)] = null;
    };

    Game_Screen.prototype.setPicturePointer = function(pictureId) {
        this._picturePidArray[this.realPictureId(pictureId)] = true;
    };

    Game_Screen.prototype.removePicturePointer = function(pictureId) {
        this._picturePidArray[this.realPictureId(pictureId)] = null;
    };

    Game_Screen.prototype.getPictureCid = function(pictureId) {
        return this._pictureCidArray[this.realPictureId(pictureId)];
    };

    Game_Screen.prototype.getPictureSid = function(pictureId) {
        return this._pictureSidArray[this.realPictureId(pictureId)];
    };

    Game_Screen.prototype.getPicturePid = function(pictureId) {
        return this._picturePidArray[this.realPictureId(pictureId)];
    };

    Game_Screen.prototype.getPictureTransparent = function(pictureId) {
        return this._pictureTransparentArray[this.realPictureId(pictureId)];
    };

    Game_Screen.prototype.disConvertPositionX = function(x) {
        var unshiftX = x - this.zoomX() * (1 - this.zoomScale());
        return Math.round(unshiftX / this.zoomScale());
    };

    Game_Screen.prototype.disConvertPositionY = function(y) {
        var unshiftY = y - this.zoomY() * (1 - this.zoomScale());
        return Math.round(unshiftY / this.zoomScale());
    };

    Game_Screen.prototype.isPointerInnerPicture = function(pictureId) {
        var picture = SceneManager.getPictureSprite(pictureId);
        return picture ? picture.isIncludePointer() : false;
    };

    //=============================================================================
    // SceneManager
    //  ピクチャスプライトを取得します。
    //=============================================================================
    SceneManager.getPictureSprite = function(pictureId) {
        return this._scene.getPictureSprite(pictureId);
    };

    //=============================================================================
    // BattleManager
    //  ピクチャコモンを常に実行できるようにします。
    //=============================================================================
    BattleManager.updatePictureCommon = function() {
        if ($gameTroop.isExistPictureCommon() && paramAlwaysCommonInBattle) {
            this.updateEventMain();
            return true;
        }
        return false;
    };

    //=============================================================================
    // Scene_Base
    //  ピクチャに対する繰り返し処理を追加定義します。
    //=============================================================================
    Scene_Base.prototype.updateTouchPictures = function() {
        if (paramInvalidSwitchId && $gameSwitches.value(paramInvalidSwitchId)) {
            return;
        }
        this._spriteset.iteratePictures(function(picture) {
            if (typeof picture.callTouch === 'function') picture.callTouch();
            return $gameTemp.pictureCommonId() === 0;
        });
    };

    Scene_Base.prototype.getPictureSprite = function(pictureId) {
        var result = null;
        this._spriteset.iteratePictures(function(picture) {
            if (picture.isIdEquals(pictureId)) {
                result = picture;
                return false;
            }
            return true;
        });
        return result;
    };

    //=============================================================================
    // Scene_Map
    //  ピクチャのタッチ状態からのコモンイベント呼び出し予約を追加定義します。
    //=============================================================================
    var _Scene_Map_update      = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        this.updateTouchPictures();
        _Scene_Map_update.apply(this, arguments);
    };

    var _Scene_Map_processMapTouch      = Scene_Map.prototype.processMapTouch;
    Scene_Map.prototype.processMapTouch = function() {
        _Scene_Map_processMapTouch.apply(this, arguments);
        if ($gameTemp.isDestinationValid() && $gameTemp.pictureCommonId() > 0) {
            $gameTemp.clearDestination();
        }
    };

    var _Scene_Map_terminate      = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        _Scene_Map_terminate.apply(this, arguments);
        $gameTemp.clearPictureCallInfo();
    };

    //=============================================================================
    // Scene_Battle
    //  ピクチャのタッチ状態からのコモンイベント呼び出し予約を追加定義します。
    //=============================================================================
    var _Scene_Battle_update      = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        this.updateTouchPictures();
        $gameTroop.updateAllPictureCommonEvent();
        _Scene_Battle_update.apply(this, arguments);
    };

    var _Scene_Battle_updateBattleProcess      = Scene_Battle.prototype.updateBattleProcess;
    Scene_Battle.prototype.updateBattleProcess = function() {
        var result = BattleManager.updatePictureCommon();
        if (result) return;
        _Scene_Battle_updateBattleProcess.apply(this, arguments);
    };

    var _Scene_Battle_terminate      = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function() {
        _Scene_Battle_terminate.apply(this, arguments);
        $gameTemp.clearPictureCallInfo();
    };

    //=============================================================================
    // Spriteset_Base
    //  ピクチャに対するイテレータを追加定義します。
    //=============================================================================
    Spriteset_Base.prototype.iteratePictures = function(callBackFund) {
        var containerChildren = this._pictureContainer.children;
        if (!Array.isArray(containerChildren)) {
            iterate(this._pictureContainer, function(property) {
                if (this._pictureContainer[property].hasOwnProperty('children')) {
                    containerChildren = this._pictureContainer[property].children;
                    this._iteratePicturesSub(containerChildren, callBackFund);
                }
            }.bind(this));
        } else {
            this._iteratePicturesSub(containerChildren, callBackFund);
        }
    };

    Spriteset_Base.prototype._iteratePicturesSub = function(containerChildren, callBackFund) {
        for (var i = containerChildren.length - 1; i >= 0; i--) {
            if (!callBackFund(containerChildren[i])) {
                break;
            }
        }
    };

    //=============================================================================
    // Sprite_Picture
    //  ピクチャのタッチ状態からのコモンイベント呼び出し予約を追加定義します。
    //=============================================================================
    var _Sprite_Picture_initialize      = Sprite_Picture.prototype.initialize;
    Sprite_Picture.prototype.initialize = function(pictureId) {
        _Sprite_Picture_initialize.call(this, pictureId);
        this._triggerHandler     = [];
        this._triggerHandler[1]  = this.isTriggered;
        this._triggerHandler[2]  = this.isCancelled;
        this._triggerHandler[3]  = this.isLongPressed;
        this._triggerHandler[4]  = this.isOnFocus;
        this._triggerHandler[5]  = this.isOutFocus;
        this._triggerHandler[6]  = this.isReleased;
        this._triggerHandler[7]  = this.isRepeated;
        this._triggerHandler[8]  = this.isPressed;
        this._triggerHandler[9]  = this.isWheelTriggered;
        this._triggerHandler[10] = this.isDoubleTriggered;
        this._triggerHandler[11] = this.isMoved;
        this._triggerHandler[12] = this.isMovedAndPressed;
        this._onMouse            = false;
        this._outMouse           = false;
        this._wasOnMouse         = false;
    };

    var _Sprite_update              = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function() {
        _Sprite_update.apply(this, arguments);
        this.updateTouch();
    };

    Sprite_Picture.prototype.updateTouch = function() {
        this.updateMouseMove();
        this.updateStroke();
        this.updatePointer();
    };

    Sprite_Picture.prototype.updateMouseMove = function() {
        if (this.isIncludePointer()) {
            if (!this._wasOnMouse) {
                this._onMouse    = true;
                this._wasOnMouse = true;
            }
        } else if (this._wasOnMouse) {
                this._outMouse   = true;
                this._wasOnMouse = false;
            }
    };

    Sprite_Picture.prototype.isIncludePointer = function() {
        return this.isTouchable() && this.isTouchPosInRect() && !this.isTransparent();
    };

    Sprite_Picture.prototype.updateStroke = function() {
        var strokeNum = $gameScreen.getPictureSid(this._pictureId);
        if (strokeNum > 0 && TouchInput.isPressed() && this.isIncludePointer()) {
            var value = $gameVariables.value(strokeNum);
            $gameVariables.setValue(strokeNum, value + TouchInput.pressedDistance);
        }
    };

    Sprite_Picture.prototype.updatePointer = function() {
        var strokeNum = $gameScreen.getPicturePid(this._pictureId);
        if (strokeNum > 0) {
            this.opacity  = TouchInput.isPressed() ? 255 : 0;
            this.x        = TouchInput.x;
            this.y        = TouchInput.y;
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
        }
    };

    Sprite_Picture.prototype.callTouch = function() {
        var commandIds = $gameScreen.getPictureCid(this._pictureId);
        if (!commandIds || SceneManager.isNextScene(Scene_Battle)) {
            return;
        }
        for (var i = 0, n = this._triggerHandler.length; i < n; i++) {
            var handler = this._triggerHandler[i];
            if (handler && commandIds[i] && handler.call(this) && (this.triggerIsFocus(i) || !this.isTransparent())) {
                this.fireTouchEvent(commandIds, i);
            }
        }
    };

    Sprite_Picture.prototype.fireTouchEvent = function(commandIds, i) {
        if (this.isTouchSuppress()) {
            TouchInput.suppressEvents();
        }
        if (this.triggerIsLongPressed(i)) TouchInput._pressedTime = -60;
        if (this.triggerIsOnFocus(i)) this._onMouse = false;
        if (this.triggerIsOutFocus(i)) this._outMouse = false;
        $gameTemp.onTouchPicture(commandIds[i], this._pictureId);
    };

    Sprite_Picture.prototype.isTouchSuppress = function() {
        return paramSuppressTouchSwitch > 0 ? $gameSwitches.value(paramSuppressTouchSwitch) : paramSuppressTouch;
    };

    Sprite_Picture.prototype.triggerIsLongPressed = function(triggerId) {
        return triggerId === 3;
    };

    Sprite_Picture.prototype.triggerIsOnFocus = function(triggerId) {
        return triggerId === 4;
    };

    Sprite_Picture.prototype.triggerIsOutFocus = function(triggerId) {
        return triggerId === 5;
    };

    Sprite_Picture.prototype.triggerIsFocus = function(triggerId) {
        return this.triggerIsOnFocus(triggerId) || this.triggerIsOutFocus(triggerId);
    };

    Sprite_Picture.prototype.isTransparent = function() {
        if (this.isTouchPosInFrameWindow()) return false;
        if (!this.isValidTransparent()) return false;
        if (this.opacity === 0) return true;
        var dx  = this.getTouchScreenX() - this.x;
        var dy  = this.getTouchScreenY() - this.y;
        var sin = Math.sin(-this.rotation);
        var cos = Math.cos(-this.rotation);
        var bx  = Math.floor(dx * cos + dy * -sin) / this.scale.x + this.anchor.x * this.width;
        var by  = Math.floor(dx * sin + dy * cos) / this.scale.y + this.anchor.y * this.height;
        return this.bitmap.getAlphaPixel(bx, by) === 0;
    };

    Sprite_Picture.prototype.isValidTransparent = function() {
        var transparent = $gameScreen.getPictureTransparent(this._pictureId);
        return transparent !== null ? transparent : paramTransparentConsideration;
    };

    Sprite_Picture.prototype.screenWidth = function() {
        return (this.width || 0) * this.scale.x;
    };

    Sprite_Picture.prototype.screenHeight = function() {
        return (this.height || 0) * this.scale.y;
    };

    Sprite_Picture.prototype.screenX = function() {
        return (this.x || 0) - this.anchor.x * this.screenWidth();
    };

    Sprite_Picture.prototype.screenY = function() {
        return (this.y || 0) - this.anchor.y * this.screenHeight();
    };

    Sprite_Picture.prototype.minX = function() {
        return Math.min(this.screenX(), this.screenX() + this.screenWidth());
    };

    Sprite_Picture.prototype.minY = function() {
        return Math.min(this.screenY(), this.screenY() + this.screenHeight());
    };

    Sprite_Picture.prototype.maxX = function() {
        return Math.max(this.screenX(), this.screenX() + this.screenWidth());
    };

    Sprite_Picture.prototype.maxY = function() {
        return Math.max(this.screenY(), this.screenY() + this.screenHeight());
    };

    Sprite_Picture.prototype.isTouchPosInRect = function() {
        if (this.isTouchPosInFrameWindow()) return true;
        var dx  = this.getTouchScreenX() - this.x;
        var dy  = this.getTouchScreenY() - this.y;
        var sin = Math.sin(-this.rotation);
        var cos = Math.cos(-this.rotation);
        var rx  = this.x + Math.floor(dx * cos + dy * -sin);
        var ry  = this.y + Math.floor(dx * sin + dy * cos);
        return (rx >= this.minX() && rx <= this.maxX() && ry >= this.minY() && ry <= this.maxY());
    };

    Sprite_Picture.prototype.isTouchPosInFrameWindow = function() {
        if (!this._frameWindow) return false;
        var frame = this._frameWindow;
        var x     = this.getTouchScreenX();
        var y     = this.getTouchScreenY();
        return frame.x <= x && frame.x + frame.width >= x && frame.y <= y && frame.y + frame.height >= y;
    };

    Sprite_Picture.prototype.isTouchable = function() {
        return this.bitmap && this.visible && this.scale.x !== 0 && this.scale.y !== 0;
    };

    Sprite_Picture.prototype.isTriggered = function() {
        return this.isTouchEvent(TouchInput.isTriggered);
    };

    Sprite_Picture.prototype.isCancelled = function() {
        return this.isTouchEvent(TouchInput.isCancelled);
    };

    Sprite_Picture.prototype.isLongPressed = function() {
        return this.isTouchEvent(TouchInput.isLongPressed);
    };

    Sprite_Picture.prototype.isPressed = function() {
        return this.isTouchEvent(TouchInput.isPressed);
    };

    Sprite_Picture.prototype.isReleased = function() {
        return this.isTouchEvent(TouchInput.isReleased);
    };

    Sprite_Picture.prototype.isRepeated = function() {
        return this.isTouchEvent(TouchInput.isRepeated);
    };

    Sprite_Picture.prototype.isOnFocus = function() {
        return this._onMouse;
    };

    Sprite_Picture.prototype.isOutFocus = function() {
        return this._outMouse;
    };

    Sprite_Picture.prototype.isMoved = function() {
        return this.isTouchEvent(TouchInput.isMoved);
    };

    Sprite_Picture.prototype.isMovedAndPressed = function() {
        return this.isTouchEvent(TouchInput.isMoved) && TouchInput.isPressed();
    };

    Sprite_Picture.prototype.isWheelTriggered = function() {
        return this.isTouchEvent(TouchInput.isWheelTriggered);
    };

    Sprite_Picture.prototype.isDoubleTriggered = function() {
        return this.isTouchEvent(TouchInput.isDoubleTriggered);
    };

    Sprite_Picture.prototype.isTouchEvent = function(triggerFunc) {
        return this.isTouchable() && triggerFunc.call(TouchInput) && this.isTouchPosInRect();
    };

    Sprite_Picture.prototype.getTouchScreenX = function() {
        return $gameScreen.disConvertPositionX(TouchInput.x);
    };

    Sprite_Picture.prototype.getTouchScreenY = function() {
        return $gameScreen.disConvertPositionY(TouchInput.y);
    };

    Sprite_Picture.prototype.isIdEquals = function(pictureId) {
        return this._pictureId === pictureId;
    };

    //=============================================================================
    // Input
    //  ピクチャクリックをキー入力に紐付けます。
    //=============================================================================
    Input._bindKeyStateFrames = new Map();
    Input.bindKeyState        = function(name) {
        this._currentState[name] = true;
        this._bindKeyStateFrames.set(name, 5);
    };

    var _Input_update = Input.update;
    Input.update      = function() {
        _Input_update.apply(this, arguments);
        this._updateBindKeyState();
    };

    Input._updateBindKeyState = function() {
        this._bindKeyStateFrames.forEach(function(frame, keyName) {
            frame--;
            if (frame === 0 || !this._currentState[keyName]) {
                this._currentState[keyName] = false;
                this._bindKeyStateFrames.delete(keyName);
            } else {
                this._bindKeyStateFrames.set(keyName, frame);
            }
        }, this);
    };

    //=============================================================================
    // TouchInput
    //  ホイールクリック、ダブルクリック等を実装
    //=============================================================================
    TouchInput.keyDoubleClickInterval = 300;
    TouchInput._pressedDistance       = 0;
    TouchInput._prevX                 = -1;
    TouchInput._prevY                 = -1;

    Object.defineProperty(TouchInput, 'pressedDistance', {
        get         : function() {
            return this._pressedDistance;
        },
        configurable: true
    });

    TouchInput.suppressEvents = function() {
        this._triggered       = false;
        this._cancelled       = false;
        this._released        = false;
        this._wheelTriggered  = false;
        this._doubleTriggered = false;
    };

    TouchInput._onMouseMove = function(event) {
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        this._onMove(x, y);
    };

    var _TouchInput_clear = TouchInput.clear;
    TouchInput.clear      = function() {
        _TouchInput_clear.apply(this, arguments);
        this._events.wheelTriggered  = false;
        this._events.doubleTriggered = false;
    };

    var _TouchInput_update = TouchInput.update;
    TouchInput.update      = function() {
        _TouchInput_update.apply(this, arguments);
        this._wheelTriggered         = this._events.wheelTriggered;
        this._doubleTriggered        = this._events.doubleTriggered;
        this._events.wheelTriggered  = false;
        this._events.doubleTriggered = false;
    };

    TouchInput.isWheelTriggered = function() {
        return this._wheelTriggered;
    };

    TouchInput.isDoubleTriggered = function() {
        return this._doubleTriggered;
    };

    var _TouchInput_onMiddleButtonDown = TouchInput._onMiddleButtonDown;
    TouchInput._onMiddleButtonDown     = function(event) {
        _TouchInput_onMiddleButtonDown.apply(this, arguments);
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        if (Graphics.isInsideCanvas(x, y)) {
            this._onWheelTrigger(x, y);
        }
    };

    TouchInput._onWheelTrigger = function(x, y) {
        this._events.wheelTriggered = true;
        this._x                     = x;
        this._y                     = y;
    };

    var _TouchInput_onTrigger = TouchInput._onTrigger;
    TouchInput._onTrigger     = function(x, y) {
        if (this._date && Date.now() - this._date < this.keyDoubleClickInterval)
            this._events.doubleTriggered = true;
        this._pressedDistance = 0;
        this._prevX           = x;
        this._prevY           = y;
        _TouchInput_onTrigger.apply(this, arguments);
    };

    var _TouchInput_onMove = TouchInput._onMove;
    TouchInput._onMove     = function(x, y) {
        if (this.isPressed()) this._pressedDistance = Math.abs(this._prevX - x) + Math.abs(this._prevY - y);
        this._prevX = x;
        this._prevY = y;
        _TouchInput_onMove.apply(this, arguments);
    };

    var _TouchInput_onRelease = TouchInput._onRelease;
    TouchInput._onRelease     = function(x, y) {
        this._pressedDistance = 0;
        this._prevX           = x;
        this._prevY           = y;
        _TouchInput_onRelease.apply(this, arguments);
    };
})();
