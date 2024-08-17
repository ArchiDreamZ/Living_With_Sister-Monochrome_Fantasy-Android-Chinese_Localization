//=============================================================================
// EventDebugger.js
// ----------------------------------------------------------------------------
// (C)2015-2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.5.3 2022/06/19 一部のパラメータの初期値を変更
// 1.5.2 2022/06/19 イベントの最後がコモンイベントの呼び出しで終わっているときにエラーになる現象を修正
//                  自動で開発者ツールを開く仕様を廃止
// 1.5.1 2019/01/25 本体バージョン1.6.0で正常に動作しない問題を修正
// 1.5.0 2018/03/06 各種ファンクションキーにCtrlおよびAltの同時押し要否の設定を追加しました。
// 1.4.1 2017/10/29 アイテムからコモンイベントを実行した後にマップイベントを実行したときのスクリプトエラー情報が間違っていた問題を修正
// 1.4.0 2017/10/28 スクリプトエラーが発生したときの行番号を出力する機能を追加
//                  型指定機能に対応
// 1.3.1 2017/07/20 一部プラグインとの競合対策
// 1.3.0 2017/05/04 イベント「スクリプト」で発生したエラーを無視できる機能を追加
// 1.2.0 2017/03/13 イベント「スクリプト」でエラーが起きたら、発生箇所をログ出力してステップ実行を開始する機能を追加
//                  Ctrlキーを押している間はステップ実行を行わないようにする機能を追加
// 1.1.0 2017/01/27 自動ブレークポイント機能を追加
// 1.0.2 2017/01/23 変数を修正しても監視ウィンドウに反映されない場合がある問題を修正
// 1.0.1 2017/01/22 ステップ実行を最後まで実行するとエラーになっていた問題を修正
// 1.0.0 2017/01/11 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc EventDebuggerPlugin
 * @author triacontane
 *
 * @param StepStart
 * @desc 次に実行されたイベントコマンドからステップ実行を開始するためのファンクションキーです。
 * @default F7
 * @type select
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param StepIn
 * @desc ステップ実行時にステップイン(1コマンド実行)するためのファンクションキーです。
 * @default F11
 * @type select
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param StepOver
 * @desc ステップ実行時にステップオーバー(1コマンド実行)するためのファンクションキーです。コモンイベントを飛ばします。
 * @default F10
 * @type select
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param Continue
 * @desc ステップ実行を中断して続行するためのファンクションキーです。
 * @default F6
 * @type select
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param ToggleWindow
 * @desc デバッグ用ウィンドウの表示状態を切り替えます。Shiftキーでも切り替えることができます。
 * @default F6
 * @type select
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param WatchVariable
 * @desc 常駐して監視するゲーム変数もしくはスクリプトを入力するダイアログが表示されます。
 * @default F1
 * @type select
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param MaxWatchNum
 * @desc 監視する変数の最大数です。あまりに大きな値を指定するとパフォーマンスが低下する可能性があります。
 * @default 3
 * @type number
 *
 * @param EventTest
 * @desc イベントテストを行うと自動でステップ実行になります。
 * @default true
 * @type boolean
 *
 * @param SuppressFunc
 * @desc ファンクションキー押下時、デフォルトや他のプラグインの動作を抑制します。
 * @default false
 * @type boolean
 *
 * @param OkHandler
 * @desc ステップ実行時に決定ボタンを押した場合のファンクションキーの動作を設定します。
 * @default F11
 * @type select
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param CancelHandler
 * @desc ステップ実行時にキャンセルボタンを押した場合のファンクションキーの動作を設定します。
 * @default F6
 * @type select
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param SimultaneousCtrl
 * @desc 各機能を利用する際にCtrlキーの同時押しが必要かどうかです。他のプラグインと対象キーが競合する場合に利用します。
 * @default false
 * @type boolean
 *
 * @param SimultaneousAlt
 * @desc 各機能を利用する際にAltキーの同時押しが必要かどうかです。他のプラグインと対象キーが競合する場合に利用します。
 * @default false
 * @type boolean
 *
 * @param ScriptDebug
 * @desc イベントコマンドの「スクリプト」でエラーが発生した際の動作を設定します。0:エラー(通常通り) 1:ステップ実行 2:無視
 * @default 1
 * @type select
 * @option エラー（通常通り）
 * @value 0
 * @option ステップ実行
 * @value 1
 * @option 無視
 * @value 2
 *
 * @param DisableDebugCtrlKey
 * @desc CTRL(Macの場合はoption)キーを押している間はステップ実行の条件を満たしてもステップ実行しません。
 * @default false
 * @type boolean
 *
 * @help 任意の箇所でイベントの実行を一時停止して、1行ずつ実行(ステップ実行)が
 * できるようになります。開始方法は以下の3通りです。
 *
 * 1. 指定されたキー(デフォルトF7)を押下する。(※1)
 * 2. プラグインコマンド[BREAK_POINT]を実行する。（条件が指定可能です）
 * 3. イベントテストを実行する。
 * ※1 並列イベントが複数実行されている場合、どこで止まるかは不確定です。
 *
 * 止めている間は以下の操作が可能です。
 *
 * 1. ステップ実行（イベントを1コマンドずつ実行）
 * 2. 実行中のイベントリスト確認
 * 3. 実行したイベントのパラメータ確認
 * 4. デバッグ画面(F9)を開いてスイッチや変数の操作(※2)
 * 5. コンソールから任意のJavaScriptを実行
 * ※2 マップ画面でのみ有効です。
 *
 * ステップ実行には以下の種類があり、対応するファンクションキーを指定できます。
 *
 * ステップイン:1行実行する。コモンイベントの呼び出し先もステップ実行する。
 * ステップオーバー:1行実行する。コモンイベントの呼び出しは一括実行する。
 * 再開:ステップ実行を終了し、通常のイベント実行に戻る。
 *
 * また、各イベントコマンドの実行にどのくらい時間が掛かったかを出力します。
 *
 * さらに、変数やスクリプトの評価結果を常時監視することができます。
 * 監視対象が登録されている場合、右上にウィンドウが表示されます。
 * 数値を指定した場合は変数値が、文字列を指定した場合はスクリプトの
 * 評価結果が表示されます。
 * 所定のファンクションキーを押下するか、以下のスクリプトを
 * デベロッパツールから実行すると監視対象を登録できます。
 *
 * DebugManager.watchVariable(5); # 変数[5]の値を常に監視します。
 *
 * このプラグインはテストモードでのみ動作し製品版にはなんら影響を与えません。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * BREAK_POINT \v[1] === 3 # 条件式[v[1] === 3]を満たしたらステップ実行開始
 * B \v[1] === 3           # 同上
 *
 * This plugin is released under the MIT License.
 */

/*:ja
 * @plugindesc イベントデバッグプラグイン
 * @author トリアコンタン
 *
 * @param ステップ開始
 * @desc 次に実行されたイベントコマンドからステップ実行を開始するためのファンクションキーです。
 * @default F7
 * @type select
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param ステップイン
 * @desc ステップ実行時にステップイン(1コマンド実行)するためのファンクションキーです。
 * @default F11
 * @type select
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param ステップオーバー
 * @desc ステップ実行時にステップオーバー(1コマンド実行)するためのファンクションキーです。コモンイベントを飛ばします。
 * @default F10
 * @type select
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param 続行
 * @desc ステップ実行を中断して続行するためのファンクションキーです。
 * @default F6
 * @type select
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param 表示切替
 * @desc デバッグ用ウィンドウの表示状態を切り替えます。Shiftキーでも切り替えることができます。
 * @default F6
 * @type select
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param 変数監視
 * @desc 常駐して監視するゲーム変数もしくはスクリプトを入力するダイアログが表示されます。
 * @default F1
 * @type select
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param 監視最大数
 * @desc 監視する変数の最大数です。あまりに大きな値を指定するとパフォーマンスが低下する可能性があります。
 * @default 3
 * @type number
 *
 * @param イベントテスト
 * @desc イベントテストを行うと自動でステップ実行になります。
 * @default true
 * @type boolean
 *
 * @param 機能キー抑制
 * @desc ファンクションキー押下時、デフォルトや他のプラグインの動作を抑制します。
 * @default false
 * @type boolean
 *
 * @param OK動作
 * @desc ステップ実行時に決定ボタンを押した場合のファンクションキーの動作を設定します。
 * @default F11
 * @type select
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param キャンセル動作
 * @desc ステップ実行時にキャンセルボタンを押した場合のファンクションキーの動作を設定します。
 * @default F6
 * @type select
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param Ctrl同時押し
 * @desc 各機能を利用する際にCtrlキーの同時押しが必要かどうかです。他のプラグインと対象キーが競合する場合に利用します。
 * @default false
 * @type boolean
 *
 * @param Alt同時押し
 * @desc 各機能を利用する際にAltキーの同時押しが必要かどうかです。他のプラグインと対象キーが競合する場合に利用します。
 * @default false
 * @type boolean
 *
 * @param スクリプトデバッグ
 * @desc イベントコマンドの「スクリプト」でエラーが発生した際の動作を設定します。0:エラー(通常通り) 1:ステップ実行 2:無視
 * @default 1
 * @type select
 * @option エラー（通常通り）
 * @value 0
 * @option ステップ実行
 * @value 1
 * @option 無視
 * @value 2
 *
 * @param CTRLで無効化
 * @desc CTRL(Macの場合はoption)キーを押している間はステップ実行の条件を満たしてもステップ実行しません。
 * @default false
 * @type boolean
 *
 * @help 任意の箇所でイベントの実行を一時停止して、1行ずつ実行(ステップ実行)が
 * できるようになります。開始方法は以下の3通りです。
 *
 * 1. 指定されたキー(デフォルトF7)を押下する。(※1)
 * 2. プラグインコマンド[BREAK_POINT]を実行する。（条件が指定可能です）
 * 3. イベントテストを実行する。
 * 4. プラグインコマンド[AUTO_BREAK]で指定した条件を満たす。(※2)
 * ※1 並列イベントが複数実行されている場合、どこで止まるかは不確定です。
 * ※2 条件を満たした次のイベント命令からステップ実行が開始します。
 *     1フレーム中で実行しているイベント数が多い場合、この機能はパフォーマンスを
 *     低下させる可能性があります。
 *
 * 止めている間は以下の操作が可能です。
 *
 * 1. ステップ実行（イベントを1コマンドずつ実行）
 * 2. 実行中のイベントリスト確認
 * 3. 実行したイベントのパラメータ確認
 * 4. デバッグ画面(F9)を開いてスイッチや変数の操作(※2)
 * 5. コンソールから任意のJavaScriptを実行
 * ※2 マップ画面でのみ有効です。
 *
 * ステップ実行には以下の種類があり、対応するファンクションキーを指定できます。
 *
 * ステップイン:1行実行する。コモンイベントの呼び出し先もステップ実行する。
 * ステップオーバー:1行実行する。コモンイベントの呼び出しは一括実行する。
 * 再開:ステップ実行を終了し、通常のイベント実行に戻る。
 *
 * また、各イベントコマンドの実行にどのくらい時間が掛かったかを出力します。
 *
 * さらに、変数やスクリプトの評価結果を常時監視することができます。
 * 監視対象が登録されている場合、右上にウィンドウが表示されます。
 * 数値を指定した場合は変数値が、文字列を指定した場合はスクリプトの
 * 評価結果が表示されます。
 * 所定のファンクションキーを押下するか、以下のスクリプトを
 * デベロッパツールから実行すると監視対象を登録できます。
 *
 * DebugManager.watchVariable(5); # 変数[5]の値を常に監視します。
 *
 * このプラグインはテストモードでのみ動作し製品版にはなんら影響を与えません。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * BREAK_POINT \v[1] === 3 # 条件式[\v[1] === 3]を満たしていたらステップ実行開始
 * B \v[1] === 3           # 同上
 * AUTO_BREAK \v[1] === 3  # 条件式[\v[1] === 3]を満たした時点でステップ実行開始
 * AB \v[1] === 3          # 同上
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

function DebugManager() {
    throw new Error('This is a static class');
}

(function() {
    'use strict';
    const pluginName = 'EventDebugger';
    //=============================================================================
    // ユーザ設定
    //=============================================================================
    const settings = {
        /* デバッグウィンドウのプロパティ */
        debugWindow      : {width: 360, fontSize: 20, padding: 12},
        /* インタプリタウィンドウのプロパティ */
        interpreterWindow: {width: 280, lines: 12, fontSize: 18, padding: 12},
        /* 監視ウィンドウの横幅 */
        watcherWindow    : {width: 400, fontSize: 18, padding: 12}
    };

    if (!Utils.isOptionValid('test')) {
        console.log(`${pluginName} is valid only test play!`);
        return;
    }

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    const getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (let i = 0; i < paramNames.length; i++) {
            const name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    const getParamNumber = function(paramNames, min, max) {
        const value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    const getParamBoolean = function(paramNames) {
        const value = getParamString(paramNames);
        return value.toUpperCase() === 'ON' || value.toUpperCase() === 'TRUE';
    };

    const convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        const windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    const convertAllArguments = function(args) {
        for (let i = 0; i < args.length; i++) {
            args[i] = convertEscapeCharacters(args[i]);
        }
        return args;
    };

    const concatAllArguments = function(args) {
        return args.reduce(function(prevValue, arg) {
            return prevValue + ' ' + arg;
        }, '');
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    const param               = {};
    param.stepStart           = getParamString(['StepStart', 'ステップ開始']);
    param.stepIn              = getParamString(['StepIn', 'ステップイン']);
    param.stepOver            = getParamString(['StepOver', 'ステップオーバー']);
    param.continue            = getParamString(['Continue', '続行']);
    param.toggleWindow        = getParamString(['ToggleWindow', '表示切替']);
    param.stepStart           = getParamString(['StepStart', 'ステップ開始']);
    param.watchVariable       = getParamString(['WatchVariable', '変数監視']);
    param.maxWatchNum         = getParamNumber(['MaxWatchNum', '監視最大数'], 1);
    param.eventTest           = getParamBoolean(['EventTest', 'イベントテスト']);
    param.suppressFunc        = getParamBoolean(['SuppressFunc', '機能キー抑制']);
    param.okHandler           = getParamString(['OkHandler', 'OK動作']);
    param.cancelHandler       = getParamString(['CancelHandler', 'キャンセル動作']);
    param.scriptDebug         = getParamNumber(['ScriptDebug', 'スクリプトデバッグ'], 0, 2);
    param.disableDebugCtrlKey = getParamBoolean(['DisableDebugCtrlKey', 'CTRLで無効化']);
    param.simultaneousCtrl    = getParamBoolean(['SimultaneousCtrl', 'Ctrl同時押し']);
    param.simultaneousAlt     = getParamBoolean(['SimultaneousAlt', 'Alt同時押し']);

    const pluginCommandMap = new Map([
        ['B', 'setBreakPoint'],
        ['BREAK_POINT', 'setBreakPoint'],
        ['AB', 'setAutoBreakPoint'],
        ['AUTO_BREAK', 'setAutoBreakPoint'],
    ]);

    //=============================================================================
    // Input
    //  ファンクションキーのキーコードを定義します。
    //=============================================================================
    Input.functionReverseMapper = {
        F1 : 112,
        F2 : 113,
        F3 : 114,
        F4 : 115,
        F5 : 116,
        F6 : 117,
        F7 : 118,
        F8 : 119,
        F9 : 120,
        F10: 121,
        F11: 122,
        F12: 123
    };

    //=============================================================================
    // SceneManager
    //  デバッグ実行のためのキー入力を受け付けます。
    //=============================================================================
    const _SceneManager_onKeyDown = SceneManager.onKeyDown;
    SceneManager.onKeyDown        = function(event) {
        _SceneManager_onKeyDown.apply(this, arguments);
        if (param.simultaneousCtrl === event.ctrlKey && param.simultaneousAlt === event.altKey) {
            this.onKeyDownForEventDebugger(event);
        }
    };

    SceneManager.onKeyDownForEventDebugger = function(event) {
        let keyDownValid = false;
        switch (event.keyCode) {
            case Input.functionReverseMapper[param.stepStart]:
                this._stepStart = true;
                keyDownValid    = true;
                break;
            case Input.functionReverseMapper[param.watchVariable]:
                this.showDialogWatchVariable();
                keyDownValid = true;
                break;
        }
        if (DebugManager.isValid()) {
            DebugManager.onKeyDownForDebugMode(event.keyCode);
            keyDownValid = true;
        }
        return keyDownValid ? !param.suppressFunc : true;
    };

    SceneManager.showDialogWatchVariable = function() {
        const watchTarget = prompt('監視したい変数またはスクリプトを入力してください。未入力の場合、監視停止します。', '');
        Input.clear();
        window.focus();
        if (watchTarget === null) return;
        DebugManager.watchVariable(watchTarget);
        SoundManager.playOk();
    };

    SceneManager.isStepStart = function() {
        const result    = this._stepStart;
        this._stepStart = false;
        return result;
    };

    const _SceneManager_changeScene = SceneManager.changeScene;
    SceneManager.changeScene        = function() {
        if (DebugManager.isValid()) {
            this.stopDebug();
        }
        _SceneManager_changeScene.apply(this, arguments);
    };

    SceneManager.stopDebug = function() {
        if (this.isSceneChanging() && !this.isCurrentSceneBusy()) {
            if (this._scene instanceof Scene_Debug || this._nextScene instanceof Scene_Debug) {
                return;
            }
            DebugManager.forceStop();
        }
    };

    //=============================================================================
    // DebugManager
    //  デバッグ実行を状態を管理します。
    //=============================================================================
    DebugManager._debugCount        = 0;
    DebugManager._autoBreakFormulas = [];
    DebugManager._eventNamesMap     = {
        101: '文章の表示',
        102: '選択肢の表示',
        103: '数値入力の処理',
        104: 'アイテム選択の処理',
        402: '選択肢の表示(**のとき)',
        403: '選択肢の表示(キャンセルのとき)',
        105: '文章のスクロール表示',
        405: '文章のスクロール表示(メッセージ内容)',
        108: '注釈',
        111: '条件分岐',
        411: '条件分岐(それ以外の場合)',
        412: '条件分岐(分岐終了)',
        112: 'ループ',
        413: 'ループ(以上繰り返し)',
        113: 'ループの中断',
        115: 'イベント処理の中断',
        117: 'コモンイベント',
        118: 'ラベル',
        119: 'ラベルジャンプ',
        121: 'スイッチの操作',
        122: '変数の操作',
        123: 'セルフスイッチの操作',
        124: 'タイマーの操作',
        125: '所持金の増減',
        126: 'アイテムの増減',
        127: '武器の増減',
        128: '防具の増減',
        129: 'メンバーの入れ替え',
        132: '戦闘BGMの変更',
        133: '勝利MEの変更',
        134: 'セーブ禁止の変更',
        135: 'メニュー禁止の変更',
        136: 'エンカウント禁止の変更',
        137: '並べ替え禁止の変更',
        138: 'ウィンドウカラーの変更',
        139: '敗北MEの変更',
        140: '乗り物BGMの変更',
        201: '場所移動',
        202: '乗り物位置の設定',
        203: 'イベント位置の設定',
        204: 'マップのスクロール',
        205: '移動ルートの設定',
        206: '乗り物の乗降',
        211: '透明状態の変更',
        212: 'アニメーションの表示',
        213: 'フキダシアイコンの表示',
        214: 'イベントの一時消去',
        216: '隊列歩行の変更',
        217: '隊列メンバーの集合',
        221: '画面のフェードアウト',
        222: '画面のフェードイン',
        223: '画面の色調変更',
        224: '画面のフラッシュ',
        225: '画面のシェイク',
        230: 'ウェイト',
        231: 'ピクチャの表示',
        232: 'ピクチャの移動',
        233: 'ピクチャの回転',
        234: 'ピクチャの色調変更',
        235: 'ピクチャの消去',
        236: '天候の設定',
        241: 'BGMの設定',
        242: 'BGMのフェードアウト',
        243: 'BGMの保存',
        244: 'BGMの再開',
        245: 'BGSの演奏',
        246: 'BGSのフェードアウト',
        249: 'MEの演奏',
        250: 'SEの演奏',
        251: 'SEの停止',
        261: 'ムービーの再生',
        281: 'マップ名表示の変更',
        282: 'タイルセットの変更',
        283: '戦闘背景の変更',
        284: '遠景の変更',
        285: '指定位置の情報取得',
        301: '戦闘の処理',
        601: '戦闘の処理(勝ったとき)',
        602: '戦闘の処理(逃げたとき)',
        603: '戦闘の処理(負けたとき)',
        302: 'ショップの処理',
        303: '名前入力の処理',
        311: 'HPの増減',
        312: 'MPの増減',
        326: 'TPの増減',
        313: 'ステートの変更',
        314: '全回復',
        315: '経験値の増減',
        316: 'レベルの増減',
        317: '能力値の増減',
        318: 'スキルの増減',
        319: '装備の変更',
        320: '名前の変更',
        321: '職業の変更',
        322: 'アクター画像の変更',
        323: '乗り物画像の変更',
        324: '二つ名の変更',
        325: 'プロフィールの変更',
        331: '敵キャラのHP増減',
        332: '敵キャラのMP増減',
        342: '敵キャラのTP増減',
        333: '敵キャラのステート変更',
        334: '敵キャラの全回復',
        335: '敵キャラの出現',
        336: '敵キャラの変身',
        337: '戦闘アニメーションの表示',
        339: '戦闘行動の強制',
        340: 'バトルの中断',
        351: 'メニュー画面を開く',
        352: 'セーブ画面を開く',
        353: 'ゲームオーバー',
        354: 'タイトル画面に戻す',
        355: 'スクリプト',
        356: 'プラグインコマンド'
    };
    DebugManager._startDescription  = [
        '-------------------ステップ実行を開始します。-------------------\n',
        'ブレークポイントを検知したため、イベントの実行を中断しました。\n',
        '☆操作方法\n',
        param.stepIn,
        ':ステップイン(1コマンド実行する。コモンイベントの呼び出しがあれば内部でもデバッグ実行する)\n',
        param.stepOver,
        ':ステップオーバー(1コマンド実行する。コモンイベントの呼び出し先は一括実行する)\n',
        param.continue,
        ':再開(ステップ実行を終了し処理を再開する)\n',
        'F9:デバッグ画面を開く(マップ画面のみ)\n'
    ];
    DebugManager._stopDescription   = [
        '-------------------ステップ実行を終了します。-------------------\n',
    ];

    DebugManager._timeCounterName = 'Execute time';

    DebugManager._watchList = [];

    DebugManager.getEventName = function(code) {
        return this._eventNamesMap[code];
    };

    DebugManager.onKeyDownForDebugMode = function(keyCode) {
        switch (keyCode) {
            case Input.functionReverseMapper[param.stepIn]:
                this._stepIn = true;
                break;
            case Input.functionReverseMapper[param.stepOver]:
                this._stepOver = true;
                break;
            case Input.functionReverseMapper[param.continue]:
                this._continue = true;
                break;
            case Input.functionReverseMapper[param.toggleWindow]:
                this._toggleWindow = true;
                break;
        }
    };

    DebugManager.clearStepFlags = function() {
        this._stepIn   = false;
        this._stepOver = false;
        this._continue = false;
    };

    DebugManager.start = function(interpreter) {
        this._interpreter = interpreter;
        if (this._debugCount === 0) {
            this.outputDebugDescription(this._startDescription);
        }
        this.clearStepFlags();
        Graphics.hideFps();
        this._debugCount++;
    };

    DebugManager.outputDebugDescription = function(descriptions) {
        console.log.apply(console, descriptions);
    };

    DebugManager.stop = function() {
        this._debugCount--;
        if (this._debugCount <= 0) {
            this.outputDebugDescription(this._stopDescription);
        }
        this.clearStepFlags();
    };

    DebugManager.forceStop = function() {
        this._debugCount = 1;
        this.stop();
        this._interpreter = null;
    };

    DebugManager.isValid = function() {
        return this._debugCount > 0;
    };

    DebugManager.isStepIn = function() {
        return this._stepIn;
    };

    DebugManager.isStepOver = function() {
        return this._stepOver;
    };

    DebugManager.isContinue = function() {
        return this._continue;
    };

    DebugManager.isToggleWindow = function() {
        const toggle       = this._toggleWindow;
        this._toggleWindow = false;
        return toggle || Input.isTriggered('shift');
    };

    DebugManager.isAnyStep = function() {
        return this.isStepIn() || this.isStepOver() || this.isContinue();
    };

    DebugManager.getInterpreter = function() {
        return this._interpreter;
    };

    DebugManager.update = function(interpreter, commandFunc) {
        this._interpreter = interpreter;
        this._command     = interpreter.currentCommand();
        this._commandFunc = commandFunc;
        this.stopCountEventTime();
        return this.updateExecInterpreter();
    };

    DebugManager.isStepTargetCommand = function(code) {
        return code > 0 && code < 401;
    };

    DebugManager.updateExecInterpreter = function() {
        let result;
        if (this._command && this.isStepTargetCommand(this._command.code)) {
            result = this.updateExecMainCommand();
        } else {
            result = this.execInterpreter();
            if (!this._command) this.updateEndInterpreter();
        }
        this.clearStepFlags();
        return result;
    };

    DebugManager.updateEndInterpreter = function() {
        console.log(`${this._interpreter.getProcessNumber()} Interpreter End`);
        this._interpreter.disableStepExecute();
    };

    DebugManager.updateExecMainCommand = function() {
        this.updateTouchInput();
        if (this.isAnyStep()) {
            this.updateContinue();
            return this.execInterpreterWithLog();
        } else {
            return false;
        }
    };

    DebugManager.updateTouchInput = function() {
        if (TouchInput.isTriggered()) {
            TouchInput.clear();
            this._stepIn = true;
        }
    };

    DebugManager.execInterpreterWithLog = function() {
        this.outputCommandInfo();
        this.startCountEventTime();
        const result = this.execInterpreter();
        if (this._interpreter.isWait()) {
            this.stopCountEventTime();
        }
        return result;
    };

    DebugManager.execInterpreter = function() {
        return this._commandFunc.call(this._interpreter);
    };

    DebugManager.updateContinue = function() {
        if (this.isContinue()) {
            this._interpreter.disableStepExecute();
        }
    };

    DebugManager.outputCommandInfo = function() {
        console.log(this.getInterpreterAddress());
        console.log(this._command.parameters);
    };

    DebugManager.getInterpreterAddress = function() {
        const code = this._command.code;
        return `${this._interpreter.getProcessNumber()} Code:${code} Name:${this._eventNamesMap[code]}`;
    };

    DebugManager.startCountEventTime = function() {
        this._eventTimeCounter = true;
        console.time(this._timeCounterName);
    };

    DebugManager.stopCountEventTime = function() {
        if (!this._eventTimeCounter) return;
        this._eventTimeCounter = false;
        console.timeEnd(this._timeCounterName);
    };

    DebugManager.watchVariable = function(watchTarget) {
        if (watchTarget === '') {
            this.unwatchVariable();
            return;
        }
        if (!this._watchList.contains(watchTarget)) {
            if (this._watchList.length >= param.maxWatchNum) {
                this._watchList.shift();
            }
            this._watchList.push(watchTarget);
        }
    };

    DebugManager.isScriptWatcher = function(watchTarget) {
        return isNaN(Number(watchTarget));
    };

    DebugManager.unwatchVariable = function() {
        this._watchList = [];
    };

    DebugManager.iterateWatcher = function(callBackFunc) {
        this._watchList.forEach(callBackFunc);
    };

    DebugManager.getWatcherSize = function() {
        return this._watchList.length;
    };

    DebugManager.setAutoBreakPoint = function(formula) {
        if (this._autoBreakFormulas.contains(formula)) return;
        this._autoBreakFormulas.push(formula);
    };

    DebugManager.isAutoBreak = function() {
        return this._autoBreakFormulas.some(function(formula) {
            return eval(convertEscapeCharacters(formula));
        });
    };

    //=============================================================================
    // Game_Interpreter
    //  ステップ実行の場合は、デバッガに自身を渡します。
    //=============================================================================
    const _Game_Interpreter_pluginCommand    = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        const pluginCommandMethod = pluginCommandMap.get(command.toUpperCase());
        if (pluginCommandMethod) {
            this[pluginCommandMethod](args);
        }
    };

    Game_Interpreter.prototype.setBreakPoint = function(args) {
        if (DebugManager.isValid()) return;
        if (args.length === 0 || eval(concatAllArguments(convertAllArguments(args)))) {
            this.enableStepExecute();
        }
    };

    Game_Interpreter.prototype.setAutoBreakPoint = function(args) {
        DebugManager.setAutoBreakPoint(concatAllArguments(args));
    };

    const _Game_Interpreter_setup    = Game_Interpreter.prototype.setup;
    Game_Interpreter.prototype.setup = function(list, eventId) {
        _Game_Interpreter_setup.apply(this, arguments);
        if (this._depth === 0 && param.eventTest && DataManager.isEventTest()) {
            this.enableStepExecute();
        }
        this.setPageIndex();
    };

    const _Game_Interpreter_terminate    = Game_Interpreter.prototype.terminate;
    Game_Interpreter.prototype.terminate = function() {
        _Game_Interpreter_terminate.apply(this, arguments);
        this._commonEventId = 0;
    };

    Game_Interpreter.prototype.setPageIndex = function() {
        var event = $gameMap.event(this._eventId);
        if (event) {
            this._pageIndex = event.getPageIndex() + 1;
            this._eventName = event.event().name;
        } else {
            this._pageIndex = 0;
            this._eventName = '';
        }
    };

    Game_Interpreter.prototype.setBattleEventPageIndex = function(value, span) {
        this._battlePageIndex = value;
        this._battleSpan      = span;
    };

    Game_Interpreter.prototype.enableStepExecute = function() {
        if (param.disableDebugCtrlKey && Input.isPressed('control')) return;
        this._debugging = true;
        DebugManager.start(this);
    };

    Game_Interpreter.prototype.disableStepExecute = function() {
        this._debugging = false;
        DebugManager.stop();
    };

    const _Game_Interpreter_executeCommand    = Game_Interpreter.prototype.executeCommand;
    Game_Interpreter.prototype.executeCommand = function() {
        if ((SceneManager.isStepStart() || DebugManager.isAutoBreak()) && !DebugManager.isValid()) {
            this.enableStepExecute();
        }
        if (this.isDebugging()) {
            return DebugManager.update(this, _Game_Interpreter_executeCommand);
        } else {
            return _Game_Interpreter_executeCommand.apply(this, arguments);
        }
    };

    Game_Interpreter.prototype.isDebugging = function() {
        return this._debugging && DebugManager.isValid();
    };

    const _Game_Interpreter_setupReservedCommonEvent    = Game_Interpreter.prototype.setupReservedCommonEvent;
    Game_Interpreter.prototype.setupReservedCommonEvent = function() {
        if ($gameTemp.isCommonEventReserved()) {
            this.setCommonEventId($gameTemp._commonEventId);
        }
        return _Game_Interpreter_setupReservedCommonEvent.apply(this, arguments);
    };

    const _Game_Interpreter_command117    = Game_Interpreter.prototype.command117;
    Game_Interpreter.prototype.command117 = function() {
        const result = _Game_Interpreter_command117.apply(this, arguments);
        if (this._childInterpreter) {
            const commonEventId = this._params[0];
            this._childInterpreter.setCommonEventId(commonEventId);
            if (this.isDebugging() && DebugManager.isStepIn()) {
                this._childInterpreter.enableStepExecute();
            }
        }
        return result;
    };

    const _Game_Interpreter_command122    = Game_Interpreter.prototype.command122;
    Game_Interpreter.prototype.command122 = function() {
        return this._params[3] === 4 ? this.execScriptCommandWithRescue(this._params[4], _Game_Interpreter_command122) :
            _Game_Interpreter_command122.apply(this, arguments);
    };

    const _Game_Interpreter_command355    = Game_Interpreter.prototype.command355;
    Game_Interpreter.prototype.command355 = function() {
        return this.execScriptCommandWithRescue(this.getScriptString(), _Game_Interpreter_command355);
    };

    Game_Interpreter.prototype.execScriptCommandWithRescue = function(script, process) {
        var result = true;
        try {
            result = process.apply(this, arguments);
        } catch (e) {
            var logValue = [
                '----- スクリプトエラーを検知しました。----- \n',
                `- Error Process Id   : ${this.getProcessNumber()}\n`,
                `- Error Process Line : ${this.getProcessLine()}\n`,
                `- Error Process Name : ${this.getProcessName()}\n`,
                `- Error Script Text\n${script}`,
                '- Error Detail'
            ];
            console.log.apply(console, logValue);
            console.error(e.stack);
            if (param.scriptDebug === 1) {
                this.enableStepExecute();
            } else if (param.scriptDebug === 0) {
                throw e;
            }
        }
        return result;
    };

    Game_Interpreter.prototype.getScriptString = function() {
        var script = this.currentCommand().parameters[0] + '\n';
        var index  = this._index + 1;
        while (this._list[index] && this._list[index].code === 655) {
            script += this._list[index].parameters[0] + '\n';
            index++;
        }
        return script;
    };

    Game_Interpreter.prototype.getProcessNumber = function() {
        if (this._commonEventId) {
            return `Common Event ID:${this._commonEventId}`;
        } else if (this._battlePageIndex) {
            return `Battle Event Page:${this._battlePageIndex}`;
        } else if (DataManager.isEventTest()) {
            return 'Event Test';
        } else {
            return `Map ID:${this._mapId} Event ID:${this._eventId} Page:${this._pageIndex}`;
        }
    };

    Game_Interpreter.prototype.getProcessLine = function() {
        var line = 0;
        this._list.some(function(command, index) {
            if (command.code < 400 && command.code > 0) {
                line++;
            }
            return this._index <= index;
        }, this);
        return line;
    };

    Game_Interpreter.prototype.getProcessName = function() {
        if (this._commonEventId) {
            return $dataCommonEvents[this._commonEventId].name;
        } else if (this._battlePageIndex) {
            return `バトルイベント　スパン : ${Game_Interpreter.battleSpanNames[this._battleSpan]}`;
        } else if (DataManager.isEventTest()) {
            return 'イベントテスト';
        } else {
            return this._eventName;
        }
    };

    Game_Interpreter.battleSpanNames = {
        0: 'バトル',
        1: 'ターン',
        2: 'モーメント'
    };

    Game_Interpreter.prototype.setCommonEventId = function(id) {
        this._commonEventId = id;
    };

    Game_Interpreter.prototype.isWait = function() {
        return this._waitCount > 0 || this._waitMode;
    };

    Game_Interpreter.prototype.getIndex = function() {
        return this._index;
    };

    Game_Interpreter.prototype.getVisibleList = function() {
        return this._list.filter(function(command) {
            return !!DebugManager.getEventName(command.code);
        });
    };

    //=============================================================================
    // Game_CommonEvent
    //  実行中のコモンイベントIDを保持します。
    //=============================================================================
    const _Game_CommonEvent_refresh    = Game_CommonEvent.prototype.refresh;
    Game_CommonEvent.prototype.refresh = function() {
        _Game_CommonEvent_refresh.apply(this, arguments);
        if (this._interpreter) {
            this._interpreter.setCommonEventId(this._commonEventId);
        }
    };

    const _Game_Troop_setupBattleEvent    = Game_Troop.prototype.setupBattleEvent;
    Game_Troop.prototype.setupBattleEvent = function() {
        const prevRunning = this._interpreter.isRunning();
        _Game_Troop_setupBattleEvent.apply(this, arguments);
        if (!prevRunning && this._interpreter.isRunning()) {
            this.setupBattleEventPage();
        }
    };

    Game_Troop.prototype.setupBattleEventPage = function() {
        const pages = this.troop().pages;
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            if (this.meetsConditions(page)) {
                this._interpreter.setBattleEventPageIndex(i + 1, page.span);
                break;
            }
        }
    };

    //=============================================================================
    // Game_Event
    //  ページインデックスを設定します。
    //=============================================================================
    Game_Event.prototype.getPageIndex = function() {
        return this._pageIndex;
    };

    //=============================================================================
    // Scene_Base
    //  インタプリタウィンドウを作成します
    //=============================================================================
    const _Scene_Base_update    = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        _Scene_Base_update.apply(this, arguments);
        this.updateDebug();
        this.updateWatcher();
    };

    Scene_Base.prototype.updateDebug = function() {
        if (DebugManager.isValid()) {
            this.updateDebugWindows();
        } else if (this._debugWindow) {
            this.removeInterpreterWindow();
            this.removeDebugWindow();
        }
        if (DebugManager.isToggleWindow()) {
            this._debugWindowHidden = !this._debugWindowHidden;
            this.toggleDebugWindow();
        }
    };

    Scene_Base.prototype.updateDebugWindows = function() {
        if (!this._debugWindow) {
            this.createDebugWindow();
            this.createInterpreterWindow();
            this.toggleDebugWindow();
        }
    };

    Scene_Base.prototype.updateWatcher = function() {
        if (DebugManager.getWatcherSize() > 0) {
            if (!this._watcherWindow) {
                this.createWatcherWindow();
                this.toggleDebugWindow();
            }
        } else if (this._watcherWindow) this.removeWatcherWindow();
    };

    Scene_Base.prototype.createInterpreterWindow = function() {
        this._interpreterWindow = new Window_Interpreter(this._debugWindow);
        this._interpreterWindow.setHandler('ok', this.onInterpreterWindowOk.bind(this));
        this._interpreterWindow.setHandler('cancel', this.onInterpreterWindowCancel.bind(this));
        this.addWindow(this._interpreterWindow);
    };

    Scene_Base.prototype.createDebugWindow = function() {
        this._debugWindow = new Window_DebugInfo();
        this.addWindow(this._debugWindow);
    };

    Scene_Base.prototype.createWatcherWindow = function() {
        this._watcherWindow = new Window_Watcher();
        this.addWindow(this._watcherWindow);
    };

    Scene_Base.prototype.onInterpreterWindowOk = function() {
        DebugManager.onKeyDownForDebugMode(Input.functionReverseMapper[param.okHandler]);
        this._interpreterWindow.activate();
    };

    Scene_Base.prototype.onInterpreterWindowCancel = function() {
        DebugManager.onKeyDownForDebugMode(Input.functionReverseMapper[param.cancelHandler]);
        this._interpreterWindow.activate();
    };

    Scene_Base.prototype.removeInterpreterWindow = function() {
        this._windowLayer.removeChild(this._interpreterWindow);
        this._interpreterWindow = null;
    };

    Scene_Base.prototype.removeDebugWindow = function() {
        this._windowLayer.removeChild(this._debugWindow);
        this._debugWindow = null;
    };

    Scene_Base.prototype.removeWatcherWindow = function() {
        this._windowLayer.removeChild(this._watcherWindow);
        this._watcherWindow = null;
    };

    Scene_Base.prototype.toggleDebugWindow = function() {
        if (this._interpreterWindow) {
            this._interpreterWindow.visible = !this._debugWindowHidden;
        }
        if (this._debugWindow) {
            this._debugWindow.visible = !this._debugWindowHidden;
        }
        if (this._watcherWindow) {
            this._watcherWindow.visible = !this._debugWindowHidden;
        }
    };

    //=============================================================================
    // Scene_Debug
    //  デバッグ画面にはデバッグ関連ウィンドウを表示しません。
    //=============================================================================
    Scene_Debug.prototype.updateDebug = function() {};

    //=============================================================================
    // Scene_MenuBase
    //  メニュー系画面には監視ウィンドウを表示しません。
    //=============================================================================
    Scene_MenuBase.prototype.updateWatcher = function() {};

    //=============================================================================
    // Window_DebugInfo
    //  デバッグ情報ウィンドウを扱うクラスです。
    //=============================================================================
    class Window_DebugInfo extends Window_Base {
        constructor() {
            super(0, 0, 1, 1);
            this.width  = this.windowWidth();
            this.height = this.windowHeight();
            this.createContents();
            this.refresh();
        }

        refresh() {
            this._interpreter = DebugManager.getInterpreter();
            this.contents.clear();
            this.drawText(this._interpreter.getProcessName(), 0);
            this.drawText(this._interpreter.getProcessNumber(), 1);
        }

        windowWidth() {
            return settings.debugWindow.width;
        }

        windowHeight() {
            return this.fittingHeight(2);
        }

        standardFontSize() {
            return settings.debugWindow.fontSize;
        }

        standardPadding() {
            return settings.debugWindow.padding;
        }

        lineHeight() {
            return this.standardFontSize() + 8;
        }

        drawText(text, line) {
            this.contents.drawText(text, 0, this.lineHeight() * line, this.contentsWidth(), this.lineHeight(), 1);
        }

        update() {
            super.update();
            if (this._interpreter !== DebugManager.getInterpreter()) {
                this.refresh();
            }
        }
    }

    //=============================================================================
    // Window_Interpreter
    //  インタプリタウィンドウを扱うクラスです。
    //=============================================================================
    class Window_Interpreter extends Window_Command {
        constructor(debugWindow) {
            super(debugWindow.x, debugWindow.y + debugWindow.height);
            this.setCursorFixed(true);
            this.setup();
        }

        setup() {
            this._interpreterIndex = -1;
            this._interpreter      = DebugManager.getInterpreter();
            this.refresh();
            this.updateIndex();
        }

        windowWidth() {
            return settings.interpreterWindow.width;
        }

        numVisibleRows() {
            return settings.interpreterWindow.lines;
        }

        standardFontSize() {
            return settings.interpreterWindow.fontSize;
        }

        standardPadding() {
            return settings.interpreterWindow.padding;
        }

        lineHeight() {
            return this.standardFontSize() + 8;
        }

        makeCommandList() {
            if (!this._interpreter || !this._interpreter.isRunning()) {
                this._list = [];
                return;
            }
            this._list = this._interpreter.getVisibleList();
        }

        update() {
            super.update();
            if (this._interpreter !== DebugManager.getInterpreter()) {
                this.setup();
            }
            if (this._interpreterIndex !== this._interpreter.getIndex()) {
                this._interpreterIndex = this._interpreter.getIndex();
                if (this._interpreter.isRunning()) {
                    this.updateIndex();
                }
            }
        }

        updateIndex() {
            if (!this._interpreter.isRunning()) {
                return;
            }
            this.select(this.getCurrentIndex());
            const halfRow = Math.floor(this.numVisibleRows() / 2);
            if (this.index() - this.topRow() > halfRow) {
                this.setTopRow(this.index() - halfRow);
            }
        }

        getCurrentIndex() {
            const command = this._interpreter.currentCommand();
            for (let i = 0; i < this._list.length; i++) {
                if (this._list[i] === command) {
                    return i;
                }
            }
            return -1;
        }

        commandName(index) {
            let commandValue = '';
            for (let i = 0; i < this._list[index].indent; i++) {
                commandValue += '  ';
            }
            commandValue += DebugManager.getEventName(this._list[index].code) || '';
            return commandValue;
        }

        isCommandEnabled(index) {
            return DebugManager.isStepTargetCommand(this._list[index].code);
        }

        isCurrentItemEnabled() {
            return this.isCommandEnabled(this.index());
        }

        playOkSound() {}
    }

    //=============================================================================
    // Window_Watcher
    //  監視ウィンドウを扱うクラスです。
    //=============================================================================
    class Window_Watcher extends Window_Command {
        constructor() {
            super(0, 0);
            this.refresh();
            this.select(-1);
            this.deactivate();
            this.x = SceneManager._boxWidth - this.windowWidth();
        }

        windowWidth() {
            return settings.watcherWindow.width;
        }

        numVisibleRows() {
            return param.maxWatchNum;
        }

        standardFontSize() {
            return settings.watcherWindow.fontSize;
        }

        lineHeight() {
            return this.standardFontSize() + 8;
        }

        standardPadding() {
            return settings.watcherWindow.padding;
        }

        makeCommandList() {
            if (this._newList) {
                this._list = this._newList;
            }
        }

        makeNewCommandList() {
            const newList = [];
            DebugManager.iterateWatcher(function(watchTarget) {
                newList.push(this.makeCommandItem(watchTarget));
            }.bind(this));
            if (newList.toString() !== this._list.toString()) {
                this._newList = newList;
            } else {
                this._newList = null;
            }
        }

        makeCommandItem(watchTarget) {
            if (!DebugManager.isScriptWatcher(watchTarget)) {
                const variableName = $dataSystem.variables[watchTarget];
                return `変数[${watchTarget.padZero(4)}]:[${$gameVariables.value(watchTarget).padZero(6)}](${variableName})`;
            } else {
                let result;
                try {
                    result = eval(watchTarget);
                } catch (e) {
                    result = e.message;
                }
                return `${watchTarget} : ${result}`;
            }
        }

        update() {
            super.update();
            this.makeNewCommandList();
            if (this._newList) {
                super.refresh();
            }
        }

        commandName(index) {
            return this._list[index];
        }

        isCommandEnabled() {
            return true;
        }
    }
})();
