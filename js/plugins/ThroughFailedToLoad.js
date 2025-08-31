//=============================================================================
// ThroughFailedToLoad.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.3.1 2017/10/30 アニメーション画像に対するエラーが無視が無効になっていた問題を修正
// 2.3.0 2017/10/29 音声ファイルと画像ファイルのいずれかのみ無視する機能を追加
// 2.2.0 2017/06/18 本体v1.5.0で機能しなくなる問題を修正
// 2.1.1 2017/03/11 通常版1.3.5でエラーになる問題を修正
// 2.1.0 2017/03/11 本体v1.3.5(コミュニティ版)で機能しなくなる問題を修正
// 2.0.0 2016/08/05 本体v1.3.0対応（1.2.0では使えなくなります）
// 1.0.0 2016/06/25 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Through Failed to load
 * @author triacontane
 *
 * @param InvalidIfTest
 * @desc Not through if test play.
 * @default true
 * @type boolean
 *
 * @param InvalidIfWeb
 * @desc Not through if Web mode.
 * @default false
 * @type boolean
 *
 * @param ThroughType
 * @desc 無視する素材の種別です。
 * @default 3
 * @type select
 * @option Audio Only
 * @value 1
 * @option Image Only
 * @value 2
 * @option All
 * @value 3
 *
 * @help Through error of Failed to load.
 * Image not found, Audio not found.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ロード失敗エラーのすり抜けプラグイン
 * @author トリアコンタン
 *
 * @param テストプレー時無効
 * @desc テストプレー時は本プラグインの機能が無効になります。
 * @default true
 * @type boolean
 *
 * @param Web版で無効
 * @desc Web版実行時は本プラグインの機能が無効になります。
 * @default false
 * @type boolean
 *
 * @param 無視種別
 * @desc 無視する素材の種別です。
 * @default 3
 * @type select
 * @option 音声のみ
 * @value 1
 * @option 画像のみ
 * @value 2
 * @option 全て
 * @value 3
 *
 * @help 存在しない画像、音声素材が指定された場合に発生するエラーを無視します。
 * 音声の場合は何も再生されず、画像の場合は空の透明画像がセットされます。
 *
 * エラーログは通常通り出力されます。
 *
 * 本体v1.5.0より正式に実装されたロード失敗時に3回までリロードする機能については
 * 当プラグインの機能と競合するため、無効化されます。
 *
 * フォント、データベースまたはプラグインで追加されたファイルの読み込みに
 * 失敗した場合は、通常通りエラーが発生します。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName = 'ThroughFailedToLoad';

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamBoolean = function(paramNames) {
        var value = (getParamOther(paramNames) || '').toUpperCase();
        return value === 'ON' || value === 'TRUE';
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramInvalidIfTest = getParamBoolean(['InvalidIfTest', 'テストプレー時無効']);
    var paramInvalidIfWeb  = getParamBoolean(['InvalidIfWeb', 'Web版で無効']);
    var paramThroughType   = getParamNumber(['ThroughType', '無視種別'], 1, 3);

    //=============================================================================
    // プラグイン無効条件の判定
    //=============================================================================
    if (paramInvalidIfTest && Utils.isOptionValid('test')) {
        return;
    } else if (paramInvalidIfWeb && !Utils.isNwjs()) {
        return;
    }

    if (paramThroughType !== 1) {
        //=============================================================================
        // Bitmap
        //  エラー発生用のフラグをキャンセルします。
        //=============================================================================
        var _Bitmap_isReady = Bitmap.prototype.isReady;
        Bitmap.prototype.isReady = function() {
            if (this.isError()) {
                this.eraseError();
            }
            return _Bitmap_isReady.apply(this, arguments);
        };

        var _Bitmap_decode = Bitmap.prototype.decode;
        Bitmap.prototype.decode = function(){
            _Bitmap_decode.apply(this, arguments);
            if (this._loadingState === 'requesting') {
                this._image.addEventListener('error', this._onError.bind(this));
            }
        };

        Bitmap.prototype.eraseError = function() {
            this._hasError     = false;
            this._isLoading    = false;
            this._loadingState = 'loaded';
        };

        //=============================================================================
        // Graphics
        //  エラーイベントを登録します。
        //=============================================================================
        var _Graphics__playVideo = Graphics._playVideo;
        Graphics._playVideo      = function(src) {
            _Graphics__playVideo.apply(this, arguments);
            this._video.onerror = this._videoLoader || this._onVideoError.bind(this);
        };
    }

    if (paramThroughType !== 2) {
        //=============================================================================
        // AudioManager
        //  エラーチェック処理を無視します。
        //=============================================================================
        AudioManager.checkErrors = function() {};
    }

    if (typeof ResourceHandler !== 'undefined') {
        //=============================================================================
        // ResourceHandler
        //  リトライ機能の仕様を変更します。
        //=============================================================================
        var _ResourceHandler_createLoader = ResourceHandler.createLoader;
        ResourceHandler.createLoader = function(url, retryMethod, resignMethod, retryInterval) {
            return this.isNeedLoader(url) ? _ResourceHandler_createLoader.apply(this, arguments) : null;
        };

        ResourceHandler.isNeedLoader = function(url) {
            if (paramThroughType === 1 && !url.match(/^audio\//)) {
                return true;
            } else if (paramThroughType === 2 && (!url.match(/^img\//) && !url.match(/^movie\//))) {
                return true;
            } else {
                return false;
            }
        };
    }
})();

