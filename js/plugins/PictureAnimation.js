//=============================================================================
// PictureAnimation.js
// ----------------------------------------------------------------------------
// (C) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.6.1 2020/12/06 1.6.0の機能追加で最後のセルの最後のフレームまで到達したときに完了扱いにするよう修正
// 1.6.0 2020/10/24 ピクチャのアニメーション完了まで次の命令に移行しない設定を追加
// 1.5.10 2020/01/30 現在のセル番号を取得できるスクリプトのヘルプを追加
// 1.5.9 2020/01/26 アニメーション中のピクチャを別のピクチャに差し替えて表示したとき、クロスフェード用の半透明ピクチャが残ってしまう場合がある不具合を修正
// 1.5.8 2019/10/27 アニメーションタイプが1以外の場合に、非ループアニメの終了位置が間違っている問題を修正
// 1.5.7 2019/04/20 コマンド「PA_SOUND」にて「1」番目のセルを指定したとき、アニメーション開始直後にも演奏されるよう修正
// 1.5.6 2019/03/03 シーン外のピクチャのアニメーションおよび効果音演奏を無効にするよう修正
// 1.5.5 2019/02/13 コマンド「PA_SET_CELL」において0番(最初のセル)に対する指定が機能しない問題を修正
// 1.5.4 2019/02/09 1.5.3の修正によりセルパターンを指定しないでアニメ再生するとエラーになる問題を修正
// 1.5.3 2019/02/27 セルパターンの直接指定でアニメ再生する際、最初のセルが必ず1番になってしまう現象を修正
// 1.5.2 2018/03/04 縦及び横でアニメーションピクチャを表示した後、同じ番号でピクチャの表示をすると正常に表示されない場合がある不具合を修正
// 1.5.1 2017/08/22 アニメーション再生中に、セル数が少ない別のアニメーションに切り替えたときにエラーが発生する場合がある現象を修正
// 1.5.0 2017/07/03 ループしないアニメーションの終了後に最初のセルに戻るかどうかを選択できる機能を追加
// 1.4.0 2016/09/03 アニメーションに合わせて指定したSEを演奏する機能を追加
// 1.3.2 2016/05/11 クロスフェードを指定していた場合に2回目のアニメ表示でエラーになる場合がある問題を修正
// 1.3.1 2016/03/15 ピクチャ上に戦闘アニメを表示するプラグイン「PictureOnAnimation」との競合を解消
//                  原点を中央したピクチャにクロスフェードを行うと表示位置がずれる問題を修正
// 1.3.0 2016/02/28 セル番号を変数と連動する機能を追加
//                  処理の負荷を少し軽減
// 1.2.3 2016/02/07 戦闘画面でもピクチャのアニメーションができるように修正
// 1.2.2 2016/01/24 空のピクチャを表示しようとした際にエラーが発生する現象を修正
// 1.2.1 2016/01/16 同じ画像を指定してピクチャ表示→アニメーション準備→ピクチャ表示の順で実行した
//                  場合にエラーが発生する現象の修正
// 1.2.0 2016/01/04 セルのパターンを自由に指定できる機能を追加
//                  セルの最大数を100から200に拡大
// 1.1.2 2015/12/24 クロスフェードによる画像切替に対応しました
// 1.1.1 2015/12/21 ピクチャのファイル名を連番方式で指定できる機能を追加
//                  アニメーションの強制終了の機能を追加
// 1.0.0 2015/12/19 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ピクチャのアニメーションプラグイン
 * @author トリアコンタン
 *
 * @param 最初のセルに戻る
 * @desc ループしないアニメーションの終了後、最初のセルに戻ります。無効にすると最後のセルで止まります。
 * @default true
 * @type boolean
 *
 * @help 指定したフレーム間隔でピクチャをアニメーションします。
 * アニメーションしたいセル画像（※）を用意の上
 * 以下のコマンドを入力してください。
 *
 * 1. ピクチャのアニメーション準備（プラグインコマンド）
 * 2. ピクチャの表示（通常のイベントコマンド）
 * 3. ピクチャのアニメーション開始（プラグインコマンド）
 * 4. ピクチャのアニメーション終了（プラグインコマンド）
 *
 * ※配置方法は以下の3通りがあります。
 *  縦　：セルを縦に並べて全体を一つのファイルにします。
 *  横　：セルを横に並べて全体を一つのファイルにします。
 *  連番：連番のセル画像を複数用意します。(original部分は任意の文字列)
 *   original00.png(ピクチャの表示で指定するオリジナルファイル)
 *   original01.png
 *   original02.png...
 *
 * 要注意！　配置方法の連番を使う場合、デプロイメント時に
 * 未使用ファイルとして除外される可能性があります。
 * その場合、削除されたファイルを入れ直す等の対応が必要です。
 *
 * また、単にアニメーションさせる以外にも、プラグインコマンドから
 * セル番号を直接指定したり、変数の値とセル番号を連動させたりできます。
 * 紙芝居のような演出や、条件次第で立ち絵の表示状態を変化させたりする場合に
 * 有効です。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 *  PA_INIT or
 *  ピクチャのアニメーション準備 [セル数] [フレーム数] [セル配置方法] [フェード時間]
 *  　ピクチャをアニメーション対象にする準備をします。
 *  　「ピクチャの表示」の直前に実行してください。
 *  　セル数　　　：アニメーションするセル画の数（最大200枚）
 *  　フレーム数　：アニメーション間隔のフレーム数（最低でも1を設定）
 *  　セル配置方向：セルの配置（縦 or 横 or 連番）
 *  　フェード時間：画像切替に掛かるフレーム数（0にするとフェードしない）
 *  使用例：PA_INIT 4 10 連番 20
 *
 *  PA_START or
 *  ピクチャのアニメーション開始 [ピクチャ番号] [アニメーションタイプ] [カスタムパターン配列]
 *  　指定したピクチャ番号のピクチャをアニメーションを開始します。
 *  　一周するとアニメーションは自動で止まります。
 *
 *  　アニメーションのタイプは以下の3パターンがあります。
 *  　　例：セル数が 4 の場合
 *  　　　タイプ1: 1→2→3→4→1→2→3→4...
 *  　　　タイプ2: 1→2→3→4→3→2→1→2...
 *  　　　タイプ3: 好きな順番を配列で指定（セルの最小値は 1 です）
 *  使用例：PA_START 1 2
 *  　　　　PA_START 1 3 [1,2,1,3,1,4]
 *
 *  PA_START_LOOP or
 *  ピクチャのループアニメーション開始 [ピクチャ番号] [アニメーションタイプ] [カスタムパターン配列]
 *  　指定したピクチャ番号のピクチャをアニメーションを開始します。
 *  　明示的に終了するまでアニメーションが続きます。
 *  使用例：PA_START_LOOP 1 2
 *  　　　　PA_START_LOOP 1 3 [1,2,1,3,1,4]
 *
 *  PA_STOP or
 *  ピクチャのアニメーション終了 [ピクチャ番号]
 *  　指定したピクチャ番号のピクチャをアニメーションを終了します。
 *  　一番上のセルに戻った時点でアニメーションが止まります。
 *  使用例：PA_STOP 1
 *
 *  PA_STOP_FORCE or
 *  ピクチャのアニメーション強制終了 [ピクチャ番号]
 *  　指定したピクチャ番号のピクチャをアニメーションを終了します。
 *  　現在表示しているセルでアニメーションが止まります。
 *  使用例：PA_STOP_FORCE 1
 *
 *  PA_SET_CELL or
 *  ピクチャのアニメーションセル設定 [ピクチャ番号] [セル番号] [ウェイトあり]
 *  　アニメーションのセルを直接設定します。（セルの最小値は 1 です）
 *  　任意のタイミングでアニメーションしたい場合に有効です。
 *  　ウェイトありを設定すると、クロスフェード中はイベントの実行を待機します。
 *  使用例：PA_SET_CELL 1 3 ウェイトあり
 *
 *  PA_PROG_CELL or
 *  ピクチャのアニメーションセル進行 [ピクチャ番号] [ウェイトあり]
 *  　アニメーションのセルをひとつ先に進めます。
 *  　任意のタイミングでアニメーションしたい場合に有効です。
 *  　ウェイトありを設定すると、クロスフェード中はイベントの実行を待機します。
 *  使用例：PA_PROG_CELL 1 ウェイトあり
 *
 *  PA_SET_VARIABLE or
 *  ピクチャのアニメーションセル変数の設定 [ピクチャ番号] [変数番号]
 *  　アニメーションのセルを指定した変数と連動させます。
 *  　変数の値が変化すると表示しているセルも自動的に変化します。
 *  使用例：PA_SET_VARIABLE 1 2
 *
 *  PA_SOUND or
 *  ピクチャのアニメーション効果音予約 [セル番号]
 *  　アニメーションのセルが切り替わったタイミングで効果音を演奏します。
 *  　このコマンドの直後にイベントコマンド「SEの演奏」を実行すると
 *  　その場でSEは演奏されず、ピクチャのアニメーション開始後に指定のタイミングで
 *  　演奏されるようになります。
 *  　必ずピクチャのアニメーション開始前に実行してください。
 *
 *  PA_WAIT or
 *  ピクチャのアニメーションウェイト [ピクチャ番号]
 * 　　指定したピクチャ番号のアニメーション再生が終了するまでウェイトします。
 *
 * スクリプト詳細
 *
 * アニメーション中のピクチャに対して現在のセル番号を取得します。
 * イベントコマンド「変数の操作」や「条件分岐」で使用できます。
 * ピクチャを表示していないときに実行するとエラーになります。
 * $gameScreen.picture(1).cell; // ピクチャ番号[1]のセルを取得
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function() {
    'use strict';
    var pluginName = 'PictureAnimation';

    var settings = {
        /* maxCellAnimation:セル数の最大値 */
        maxCellAnimation: 200
    };

    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamString(paramNames);
        return value.toUpperCase() === 'ON' || value.toUpperCase() === 'TRUE';
    };

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getArgArrayString = function(args, upperFlg) {
        var values = getArgString(args, upperFlg);
        return (values || '').split(',');
    };

    var getArgArrayNumber = function(args, min, max) {
        if (!args) {
            return [];
        }
        var values = getArgArrayString(args.substring(1, args.length - 1), false);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
        return values;
    };

    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var window = SceneManager._scene._windowLayer.children[0];
        return window ? window.convertEscapeCharacters(text) : text;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param               = {};
    param.returnToFirstCell = getParamBoolean(['ReturnToFirstCell', '最初のセルに戻る']);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        this.pluginCommandPictureAnimation(command, args);
    };

    Game_Interpreter.prototype.pluginCommandPictureAnimation = function(command, args) {
        var pictureNum, animationType, picture, cellNumber, frameNumber, direction, fadeDuration, wait, customArray;
        switch (getCommandName(command)) {
            case 'PA_INIT' :
            case 'ピクチャのアニメーション準備':
                cellNumber   = getArgNumber(args[0], 1, settings.maxCellAnimation);
                frameNumber  = getArgNumber(args[1], 1, 9999);
                direction    = getArgString(args[2], true) || '縦';
                fadeDuration = getArgNumber(args[3], 0, 9999) || 0;
                $gameScreen.setPicturesAnimation(cellNumber, frameNumber, direction, fadeDuration);
                break;
            case 'PA_SOUND' :
            case 'ピクチャのアニメーション効果音予約':
                cellNumber = getArgNumber(args[0], 1, settings.maxCellAnimation);
                this.reservePaSound(cellNumber);
                break;
            case 'PA_START' :
            case 'ピクチャのアニメーション開始':
                pictureNum    = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                animationType = getArgNumber(args[1], 1, 3);
                customArray   = getArgArrayNumber(args[2], 1, settings.maxCellAnimation);
                picture       = $gameScreen.picture(pictureNum);
                if (picture) picture.startAnimationFrame(animationType, false, customArray);
                break;
            case 'PA_START_LOOP' :
            case 'ピクチャのループアニメーション開始':
                pictureNum    = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                animationType = getArgNumber(args[1], 1, 3);
                customArray   = getArgArrayNumber(args[2], 1, settings.maxCellAnimation);
                picture       = $gameScreen.picture(pictureNum);
                if (picture) picture.startAnimationFrame(animationType, true, customArray);
                break;
            case 'PA_STOP' :
            case 'ピクチャのアニメーション終了':
                pictureNum = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                picture    = $gameScreen.picture(pictureNum);
                if (picture) picture.stopAnimationFrame(false);
                break;
            case 'PA_STOP_FORCE' :
            case 'ピクチャのアニメーション強制終了':
                pictureNum = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                picture    = $gameScreen.picture(pictureNum);
                if (picture) picture.stopAnimationFrame(true);
                break;
            case 'PA_SET_CELL' :
            case 'ピクチャのアニメーションセル設定':
                pictureNum = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                cellNumber = getArgNumber(args[1], 0, settings.maxCellAnimation);
                wait       = getArgString(args[2]);
                picture    = $gameScreen.picture(pictureNum);
                if (picture) {
                    if (wait === 'ウェイトあり' || wait.toUpperCase() === 'WAIT') this.wait(picture._fadeDuration);
                    picture.cell = cellNumber;
                }
                break;
            case 'PA_PROG_CELL' :
            case 'ピクチャのアニメーションセル進行':
                pictureNum = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                wait       = getArgString(args[1]);
                picture    = $gameScreen.picture(pictureNum);
                if (picture) {
                    if (wait === 'ウェイトあり' || wait.toUpperCase() === 'WAIT') this.wait(picture._fadeDuration);
                    picture.addCellCount();
                }
                break;
            case 'PA_SET_VARIABLE' :
            case 'ピクチャのアニメーションセル変数の設定':
                pictureNum = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                picture    = $gameScreen.picture(pictureNum);
                if (picture) picture.linkToVariable(getArgNumber(args[1]));
                break;
            case 'PA_WAIT':
            case 'ピクチャのアニメーションウェイト':
                pictureNum = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                picture    = $gameScreen.picture(pictureNum);
                if (picture) {
                    this.waitForPictureAnimation(pictureNum);
                }
                break;
        }
    };

    Game_Interpreter.prototype.reservePaSound = function(cellNumber) {
        this._paSoundFrame = cellNumber;
    };

    var _Game_Interpreter_command250      = Game_Interpreter.prototype.command250;
    Game_Interpreter.prototype.command250 = function() {
        if (this._paSoundFrame) {
            var se = this._params[0];
            AudioManager.loadStaticSe(se);
            $gameScreen.addPaSound(se, this._paSoundFrame);
            this._paSoundFrame = null;
            return true;
        }
        return _Game_Interpreter_command250.apply(this, arguments);
    };

    const _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function() {
        if (this._waitMode === 'pictureAnimation') {
            const picture = $gameScreen.picture(this._waitPictureId);
            if (picture && picture.isAnimationPlaying()) {
                return true;
            } else {
                this._waitPictureId = 0;
                this._waitMode = '';
                return false;
            }
        } else {
            return _Game_Interpreter_updateWaitMode.apply(this, arguments);
        }
    };

    Game_Interpreter.prototype.waitForPictureAnimation = function(pictureId) {
        this.setWaitMode('pictureAnimation');
        this._waitPictureId = pictureId;
    };

    //=============================================================================
    // Game_Screen
    //  アニメーション関連の情報を追加で保持します。
    //=============================================================================
    Game_Screen.prototype.setPicturesAnimation = function(cellNumber, frameNumber, direction, fadeDuration) {
        this._paCellNumber   = cellNumber;
        this._paFrameNumber  = frameNumber;
        this._paDirection    = direction;
        this._paFadeDuration = fadeDuration;
    };

    Game_Screen.prototype.addPaSound = function(sound, frame) {
        if (!this._paSounds) this._paSounds = [];
        this._paSounds[frame] = sound;
    };

    Game_Screen.prototype.clearPicturesAnimation = function() {
        this._paCellNumber   = 1;
        this._paFrameNumber  = 1;
        this._paDirection    = '';
        this._paFadeDuration = 0;
        this._paSounds       = null;
    };

    var _Game_Screen_showPicture      = Game_Screen.prototype.showPicture;
    Game_Screen.prototype.showPicture = function(pictureId, name, origin, x, y,
                                                 scaleX, scaleY, opacity, blendMode) {
        _Game_Screen_showPicture.apply(this, arguments);
        var realPictureId = this.realPictureId(pictureId);
        if (this._paCellNumber > 1) {
            this._pictures[realPictureId].setAnimationFrameInit(
                this._paCellNumber, this._paFrameNumber, this._paDirection, this._paFadeDuration, this._paSounds);
            this.clearPicturesAnimation();
        }
    };

    Game_Screen.prototype.isActivePicture = function(picture) {
        var realId = this._pictures.indexOf(picture);
        return realId > this.maxPictures() === $gameParty.inBattle();
    };

    //=============================================================================
    // Game_Picture
    //  アニメーション関連の情報を追加で保持します。
    //=============================================================================
    var _Game_Picture_initialize      = Game_Picture.prototype.initialize;
    Game_Picture.prototype.initialize = function() {
        _Game_Picture_initialize.call(this);
        this.initAnimationFrameInfo();
    };

    Game_Picture.prototype.initAnimationFrameInfo = function() {
        this._cellNumber        = 1;
        this._frameNumber       = 1;
        this._cellCount         = 0;
        this._frameCount        = 0;
        this._animationType     = 0;
        this._customArray       = null;
        this._loopFlg           = false;
        this._direction         = '';
        this._fadeDuration      = 0;
        this._fadeDurationCount = 0;
        this._prevCellCount     = 0;
        this._animationFlg      = false;
        this._linkedVariable    = 0;
        this._cellSes           = [];
    };

    Game_Picture.prototype.direction = function() {
        return this._direction;
    };

    Game_Picture.prototype.cellNumber = function() {
        return this._cellNumber;
    };

    Game_Picture.prototype.prevCellCount = function() {
        return this._prevCellCount;
    };

    Game_Picture.prototype.isMulti = function() {
        var dir = this.direction();
        return dir === '連番' || dir === 'N';
    };

    /**
     * The cellCount of the Game_Picture (0 to cellNumber).
     *
     * @property cellCount
     * @type Number
     */
    Object.defineProperty(Game_Picture.prototype, 'cell', {
        get: function() {
            if (this._linkedVariable > 0) {
                return $gameVariables.value(this._linkedVariable) % this._cellNumber;
            }
            switch (this._animationType) {
                case 3:
                    return (this._customArray[this._cellCount] - 1).clamp(0, this._cellNumber - 1);
                case 2:
                    return this._cellNumber - 1 - Math.abs(this._cellCount - (this._cellNumber - 1));
                case 1:
                    return this._cellCount;
                default:
                    return this._cellCount;
            }
        },
        set: function(value) {
            var newCellCount = value % this.getCellNumber();
            if (this._cellCount !== newCellCount) {
                this._prevCellCount     = this.cell;
                this._fadeDurationCount = this._fadeDuration;
            }
            this._cellCount = newCellCount;
        }
    });

    Game_Picture.prototype.getCellNumber = function() {
        switch (this._animationType) {
            case 3:
                return this._customArray.length;
            case 2:
                return (this._cellNumber - 1) * 2;
            case 1:
                return this._cellNumber;
            default:
                return this._cellNumber;
        }
    };

    var _Game_Picture_update      = Game_Picture.prototype.update;
    Game_Picture.prototype.update = function() {
        _Game_Picture_update.call(this);
        if (this.isFading()) {
            this.updateFading();
        } else if (this.hasAnimationFrame() && this.isActive()) {
            this.updateAnimationFrame();
        } else if (this._lastFrameCount > 0) {
            this._lastFrameCount--;
        }
    };

    Game_Picture.prototype.linkToVariable = function(variableNumber) {
        this._linkedVariable = variableNumber.clamp(1, $dataSystem.variables.length);
    };

    Game_Picture.prototype.updateAnimationFrame = function() {
        this._frameCount = (this._frameCount + 1) % this._frameNumber;
        if (this._frameCount === 0) {
            this.addCellCount();
            this.playCellSe();
            if (this.isEndFirstLoop() && !this._loopFlg) {
                this._animationFlg = false;
                this._lastFrameCount = this._frameNumber;
            }
        }
    };

    Game_Picture.prototype.isEndFirstLoop = function() {
        return this._cellCount === (param.returnToFirstCell ? 0 : this.getCellNumber() - 1);
    };

    Game_Picture.prototype.updateFading = function() {
        this._fadeDurationCount--;
    };

    Game_Picture.prototype.prevCellOpacity = function() {
        if (this._fadeDuration === 0) return 0;
        return this.opacity() / this._fadeDuration * this._fadeDurationCount;
    };

    Game_Picture.prototype.addCellCount = function() {
        this.cell = this._cellCount + 1;
    };

    Game_Picture.prototype.playCellSe = function() {
        var se = this._cellSes[this.cell + 1];
        if (se) {
            AudioManager.playSe(se);
        }
    };

    Game_Picture.prototype.setAnimationFrameInit = function(cellNumber, frameNumber, direction, fadeDuration, cellSes) {
        this._cellNumber   = cellNumber;
        this._frameNumber  = frameNumber;
        this._frameCount   = 0;
        this._cellCount    = 0;
        this._direction    = direction;
        this._fadeDuration = fadeDuration;
        this._cellSes      = cellSes || [];
    };

    Game_Picture.prototype.startAnimationFrame = function(animationType, loopFlg, customArray) {
        this._animationType = animationType;
        this._customArray   = customArray;
        this._animationFlg  = true;
        this._loopFlg       = loopFlg;
        if (this._cellNumber <= this._cellCount) {
            this._cellCount = this._cellNumber - 1;
        }
        this.playCellSe();
    };

    Game_Picture.prototype.stopAnimationFrame = function(forceFlg) {
        this._loopFlg = false;
        if (forceFlg) {
            this._animationFlg = false;
        }
    };

    Game_Picture.prototype.hasAnimationFrame = function() {
        return this._animationFlg;
    };

    Game_Picture.prototype.isFading = function() {
        return this._fadeDurationCount !== 0;
    };

    Game_Picture.prototype.isAnimationPlaying = function() {
        return this.hasAnimationFrame() || this.isFading() || this._lastFrameCount > 0;
    };

    Game_Picture.prototype.isNeedFade = function() {
        return this._fadeDuration !== 0;
    };

    Game_Picture.prototype.isActive = function() {
        return $gameScreen.isActivePicture(this);
    };

    //=============================================================================
    // Sprite_Picture
    //  アニメーション関連の情報を追加で保持します。
    //=============================================================================
    var _Sprite_Picture_initialize      = Sprite_Picture.prototype.initialize;
    Sprite_Picture.prototype.initialize = function(pictureId) {
        this._prevSprite = null;
        _Sprite_Picture_initialize.apply(this, arguments);
    };

    var _Sprite_Picture_update      = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function() {
        _Sprite_Picture_update.apply(this, arguments);
        var picture = this.picture();
        if (picture && picture.name()) {
            if (picture.isMulti() && !this._bitmaps) {
                this.loadAnimationBitmap();
            }
            if (this.isBitmapReady()) {
                this.updateAnimationFrame(this, picture.cell);
                if (picture.isNeedFade()) this.updateFading();
            }
        }
    };

    var _Sprite_Picture_updateBitmap      = Sprite_Picture.prototype.updateBitmap;
    Sprite_Picture.prototype.updateBitmap = function() {
        _Sprite_Picture_updateBitmap.apply(this, arguments);
        if (!this.picture()) {
            this._bitmaps = null;
            if (this._prevSprite) {
                this._prevSprite.bitmap = null;
            }
        }
    };

    Sprite_Picture.prototype.updateFading = function() {
        if (!this._prevSprite) {
            this.makePrevSprite();
        }
        if (!this._prevSprite.bitmap) {
            this.makePrevBitmap();
        }
        var picture = this.picture();
        if (picture.isFading()) {
            this._prevSprite.visible = true;
            this.updateAnimationFrame(this._prevSprite, picture.prevCellCount());
            this._prevSprite.opacity = picture.prevCellOpacity();
        } else {
            this._prevSprite.visible = false;
        }
    };

    Sprite_Picture.prototype.updateAnimationFrame = function(sprite, cellCount) {
        switch (this.picture().direction()) {
            case '連番':
            case 'N':
                sprite.bitmap = this._bitmaps[cellCount];
                sprite.setFrame(0, 0, sprite.bitmap.width, sprite.bitmap.height);
                break;
            case '縦':
            case 'V':
                var height = sprite.bitmap.height / this.picture().cellNumber();
                var y      = cellCount * height;
                sprite.setFrame(0, y, sprite.bitmap.width, height);
                break;
            case '横':
            case 'H':
                var width = sprite.bitmap.width / this.picture().cellNumber();
                var x     = cellCount * width;
                sprite.setFrame(x, 0, width, sprite.bitmap.height);
                break;
            default:
                sprite.setFrame(0, 0, this.bitmap.width, this.bitmap.height);
        }
    };

    var _Sprite_Picture_loadBitmap      = Sprite_Picture.prototype.loadBitmap;
    Sprite_Picture.prototype.loadBitmap = function() {
        _Sprite_Picture_loadBitmap.apply(this, arguments);
        this._bitmapReady = false;
        this._bitmaps     = null;
        if (this._prevSprite) {
            this._prevSprite.visible = false;
        }
    };

    Sprite_Picture.prototype.loadAnimationBitmap = function() {
        var cellNumber = this.picture().cellNumber();
        var cellDigit  = cellNumber.toString().length;
        this._bitmaps  = [this.bitmap];
        for (var i = 1; i < cellNumber; i++) {
            var filename     = this._pictureName.substr(0, this._pictureName.length - cellDigit) + i.padZero(cellDigit);
            this._bitmaps[i] = ImageManager.loadPicture(filename);
        }
        this._bitmapReady = false;
    };

    Sprite_Picture.prototype.makePrevSprite = function() {
        this._prevSprite         = new Sprite();
        this._prevSprite.visible = false;
        this.addChild(this._prevSprite);
    };

    Sprite_Picture.prototype.makePrevBitmap = function() {
        this._prevSprite.bitmap   = this.bitmap;
        this._prevSprite.anchor.x = this.anchor.x;
        this._prevSprite.anchor.y = this.anchor.y;
    };

    Sprite_Picture.prototype.isBitmapReady = function() {
        if (!this.bitmap) return false;
        if (this._bitmapReady) return true;
        var result;
        if (this.picture().isMulti()) {
            result = this._bitmaps.every(function(bitmap) {
                return bitmap.isReady();
            });
        } else {
            result = this.bitmap.isReady();
        }
        this._bitmapReady = result;
        return result;
    };
})();
