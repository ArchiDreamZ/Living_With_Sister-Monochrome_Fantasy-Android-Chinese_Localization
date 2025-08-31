//=============================================================================
// TitleImageChange.js
// ----------------------------------------------------------------------------
// (C) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.4.5 2020/03/01 進行度変数の値を戻したときに、リロードするまで元のタイトル画面に戻らない問題を修正
// 1.4.4 2018/07/11 1.4.3の修正でタイトル画面が変更される条件を満たした状態でセーブ後にタイトルに戻るで再表示しても変更が反映されない問題を修正
// 1.4.3 2018/06/09 セーブファイル数の上限を大きく増やしている場合にタイトル画面の表示が遅くなる現象を修正
// 1.4.2 2018/04/26 ニューゲーム開始後、一度もセーブしていないデータで進行状況のみをセーブするスクリプトを実行しても設定が反映されない問題を修正
// 1.4.1 2017/07/20 1.4.0で追加した機能で画像やBGMを4つ以上しないとタイトルがずれてしまう問題を修正
// 1.4.0 2017/02/12 画像やBGMを4つ以上指定できる機能を追加
// 1.3.1 2017/02/04 簡単な競合対策
// 1.3.0 2017/02/04 どのセーブデータの進行度を優先させるかを決めるための優先度変数を追加
// 1.2.1 2016/12/17 進行状況のみセーブのスクリプトを実行した場合に、グローバル情報が更新されてしまう問題を修正
// 1.2.0 2016/08/27 進行状況に応じてタイトルBGMを変更できる機能を追加
// 1.1.0 2016/06/05 セーブデータに歯抜けがある場合にエラーが発生する問題を修正
//                  進行状況のみをセーブする機能を追加
// 1.0.0 2016/04/06 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc タイトル画面変更プラグイン
 * @author トリアコンタン
 *
 * @param 進行度変数
 * @desc ゲームの進行度に対応する変数番号(1...)
 * @default 1
 * @type variable
 *
 * @param 優先度変数
 * @desc 複数のセーブデータが存在するとき、どのセーブデータの進行度を優先するかを決める変数番号(1...)
 * @default 0
 * @type variable
 *
 * @param タイトル1の進行度
 * @desc 進行度変数の値がこの値以上ならタイトル1の画像が表示されます。
 * @default 1
 *
 * @param タイトル1の画像
 * @desc 進行度変数の値がタイトル1の進行度以上のときに表示される画像(img/titles1)のファイル名です。
 * @default
 * @require 1
 * @dir img/titles1/
 * @type file
 *
 * @param タイトル1のBGM
 * @desc 進行度変数の値がタイトル1の進行度以上のときに演奏されるBGM(audio/bgm)のファイル名です。
 * @default
 * @require 1
 * @dir audio/bgm/
 * @type file
 *
 * @param タイトル2の進行度
 * @desc 進行度変数の値がこの値以上ならタイトル2の画像が表示されます。
 * @default 2
 *
 * @param タイトル2の画像
 * @desc 進行度変数の値がタイトル2の進行度以上のときに表示される画像(img/titles1)のファイル名です。
 * @default
 * @require 1
 * @dir img/titles1/
 * @type file
 *
 * @param タイトル2のBGM
 * @desc 進行度変数の値がタイトル2の進行度以上のときに演奏されるBGM(audio/bgm)のファイル名です。
 * @default
 * @require 1
 * @dir audio/bgm/
 * @type file
 *
 * @param タイトル3の進行度
 * @desc 進行度変数の値がこの値以上ならタイトル3の画像が表示されます。
 * @default 3
 *
 * @param タイトル3の画像
 * @desc 進行度変数の値がタイトル3の進行度以上のときに表示される画像(img/titles1)のファイル名です。
 * @default
 * @require 1
 * @dir img/titles1/
 * @type file
 *
 * @param タイトル3のBGM
 * @desc 進行度変数の値がタイトル3の進行度以上のときに演奏されるBGM(audio/bgm)のファイル名です。
 * @default
 * @require 1
 * @dir audio/bgm/
 * @type file
 *
 * @param 以降の進行度
 * @desc タイトルを4パターン以上使いたい場合はカンマ区切りで進行度を指定します。例(4,5,6)
 * @default
 *
 * @param 以降の画像
 * @desc タイトルを4パターン以上使いたい場合はカンマ区切りで画像(img/titles1)のファイル名を指定します。例(aaa,bbb,ccc)
 * @default
 *
 * @param 以降のBGM
 * @desc タイトルを4パターン以上使いたい場合はカンマ区切りでBGM(audio/bgm)のファイル名を指定します。例(aaa,bbb,ccc)
 * @default
 *
 * @help ゲームの進行度に応じてタイトル画面の画像およびBGMを変更します。
 * 進行度には任意の変数が指定でき、通常は全セーブデータの中の最大値が反映されます。
 *
 * ただし、優先度変数が別途指定されている場合は、その変数値が最も大きい
 * セーブデータの進行度をもとに画像及びBGMが決まります。
 *
 * タイトル画像は最大3つまで指定可能で、複数の条件を満たした場合は
 * 以下のような優先順位になります。
 *
 * 1. 4以降の画像及びBGM
 * 2. タイトル3の画像およびBGM
 * 3. タイトル2の画像およびBGM
 * 4. タイトル1の画像およびBGM
 * 5. デフォルトのタイトル画像およびBGM
 *
 * ゲームデータをセーブせず進行状況のみをセーブしたい場合は、
 * イベントコマンドの「スクリプト」から以下を実行してください。
 * DataManager.saveOnlyGradeVariable();
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
    var pluginName = 'TitleImageChange';

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value == null ? '' : value;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamArrayString = function(paramNames) {
        var valuesText = getParamString(paramNames);
        if (!valuesText) return [];
        var values = valuesText.split(',');
        for (var i = 0; i < values.length; i++) {
            values[i] = values[i].trim();
        }
        return values;
    };

    var getParamArrayNumber = function(paramNames, min, max) {
        var values = getParamArrayString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) {
            if (!isNaN(parseInt(values[i], 10))) {
                values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
            } else {
                values.splice(i--, 1);
            }
        }
        return values;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramGradeVariable    = getParamNumber(['GradeVariable', '進行度変数'], 1, 5000);
    var paramPriorityVariable = getParamNumber(['PriorityVariable', '優先度変数'], 0, 5000);
    var paramTitleGrades      = [];
    paramTitleGrades.push(getParamNumber(['TitleGrade1', 'タイトル1の進行度']));
    paramTitleGrades.push(getParamNumber(['TitleGrade2', 'タイトル2の進行度']));
    paramTitleGrades.push(getParamNumber(['TitleGrade3', 'タイトル3の進行度']));
    var paramTitleImages = [];
    paramTitleImages.push(getParamString(['TitleImage1', 'タイトル1の画像']));
    paramTitleImages.push(getParamString(['TitleImage2', 'タイトル2の画像']));
    paramTitleImages.push(getParamString(['TitleImage3', 'タイトル3の画像']));
    var paramTitleBgms = [];
    paramTitleBgms.push(getParamString(['TitleBgm1', 'タイトル1のBGM']));
    paramTitleBgms.push(getParamString(['TitleBgm2', 'タイトル2のBGM']));
    paramTitleBgms.push(getParamString(['TitleBgm3', 'タイトル3のBGM']));
    paramTitleGrades = paramTitleGrades.concat(getParamArrayNumber(['TitleGradeAfter', '以降の進行度'])).reverse();
    paramTitleImages = paramTitleImages.concat(getParamArrayString(['TitleImageAfter', '以降の画像'])).reverse();
    paramTitleBgms   = paramTitleBgms.concat(getParamArrayString(['TitleBgmAfter', '以降のBGM'])).reverse();

    //=============================================================================
    // DataManager
    //  ゲーム進行状況を保存します。
    //=============================================================================
    var _DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
    DataManager.makeSavefileInfo      = function() {
        var info = _DataManager_makeSavefileInfo.apply(this, arguments);
        this.setGradeVariable(info);
        return info;
    };

    DataManager.getFirstPriorityGradeVariable = function() {
        this._loadGrade = true;
        var globalInfo    = this.loadGlobalInfo().filter(function(data, id) {
            return this.isThisGameFile(id);
        }, this);
        this._loadGrade = false;
        var gradeVariable = 0;
        if (globalInfo && globalInfo.length > 0) {
            var sortedGlobalInfo = globalInfo.clone().sort(this._compareOrderForGradeVariable);
            if (sortedGlobalInfo[0]) {
                gradeVariable = sortedGlobalInfo[0].gradeVariable || 0;
            }
        }
        return gradeVariable;
    };

    var _DataManager_loadGlobalInfo = DataManager.loadGlobalInfo;
    DataManager.loadGlobalInfo = function() {
        if (this._loadGrade) {
            if (!this._globalInfo) {
                try {
                    var json = StorageManager.load(0);
                    this._globalInfo = json ? JSON.parse(json) : [];
                } catch (e) {
                    console.error(e);
                    this._globalInfo = [];
                }
            }
            return this._globalInfo;
        } else {
            return _DataManager_loadGlobalInfo.apply(this, arguments);
        }
    };

    DataManager._compareOrderForGradeVariable = function(a, b) {
        if (!a) {
            return 1;
        } else if (!b) {
            return -1;
        } else if (a.priorityVariable !== b.priorityVariable && paramPriorityVariable > 0) {
            return (b.priorityVariable || 0) - (a.priorityVariable || 0);
        } else {
            return (b.gradeVariable || 0) - (a.gradeVariable || 0);
        }
    };

    DataManager.saveOnlyGradeVariable = function() {
        var saveFileId = this.lastAccessedSavefileId();
        var globalInfo = this.loadGlobalInfo() || [];
        if (globalInfo[saveFileId]) {
            this.setGradeVariable(globalInfo[saveFileId]);
        } else {
            globalInfo[saveFileId] = this.makeSavefileInfo();
        }
        this.saveGlobalInfo(globalInfo);
    };

    DataManager.setGradeVariable = function(info) {
        info.gradeVariable = $gameVariables.value(paramGradeVariable);
        if (paramPriorityVariable > 0) {
            info.priorityVariable = $gameVariables.value(paramPriorityVariable);
        }
    };

    var _DataManager_saveGlobalInfo = DataManager.saveGlobalInfo;
    DataManager.saveGlobalInfo = function(info) {
        _DataManager_saveGlobalInfo.apply(this, arguments);
        this._globalInfo = null;
    };

    //=============================================================================
    // Scene_Title
    //  進行状況が一定以上の場合、タイトル画像を差し替えます。
    //=============================================================================
    var _Scene_Title_initialize      = Scene_Title.prototype.initialize;
    Scene_Title.prototype.initialize = function() {
        _Scene_Title_initialize.apply(this, arguments);
        this.changeTitleImage();
        this.changeTitleBgm();
    };

    Scene_Title.prototype.changeTitleImage = function() {
        var gradeVariable = DataManager.getFirstPriorityGradeVariable();
        if ($dataSystem.originalTitle1Name !== undefined) {
            $dataSystem.title1Name = $dataSystem.originalTitle1Name;
        }
        for (var i = 0, n = paramTitleGrades.length; i < n; i++) {
            if (paramTitleImages[i] && gradeVariable >= paramTitleGrades[i]) {
                $dataSystem.originalTitle1Name = $dataSystem.title1Name;
                $dataSystem.title1Name = paramTitleImages[i];
                break;
            }
        }
    };

    Scene_Title.prototype.changeTitleBgm = function() {
        var gradeVariable = DataManager.getFirstPriorityGradeVariable();
        if ($dataSystem.titleBgm.originalName !== undefined) {
            $dataSystem.titleBgm.name = $dataSystem.titleBgm.originalName;
        }
        for (var i = 0, n = paramTitleGrades.length; i < n; i++) {
            if (paramTitleBgms[i] && gradeVariable >= paramTitleGrades[i]) {
                $dataSystem.titleBgm.originalName = $dataSystem.titleBgm.name;
                $dataSystem.titleBgm.name = paramTitleBgms[i];
                break;
            }
        }
    };
})();

