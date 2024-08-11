//=============================================================================
// SA_CoreSpeedImprovement.js
// ----------------------------------------------------------------------------
// Created by seea
// License: MIT License  https://opensource.org/licenses/mit-license.php
//
// Plugin author:
//  Contact: https://nekono.org
//=============================================================================
// History
// 18.0 2018/01/27 Initial release.
// 18.1 2018/01/27 Cache the result of isCollidedWithCharacters.
//=============================================================================
// 更新履歴
// 18.0 2018/01/27 初版
// 18.1 2018/01/27 isCollidedWithCharactersの結果をキャッシュする機能を追加

/*:
 * ==============================================================================
 * @plugindesc v18.1 SA Core Speed Improvement
 * @author seea
 * @require rpg_core.js v1.5.1
 *
 * @help
 * SA Core Speed Improvement -- コアスクリプト速度改善
 *
 * 必須 - rpg_core.js v1.5.1
 *
 * コアスクリプトのうち、ボトルネックとなっている部分の実行速度を改善します。
 *
 * 画面内に表示されるイベントの数が多くなると、RPGツクールMV バージョン 1.5.1 の
 * 実行速度の低下が目立つ場合があります。
 *
 * 本プラグインは、コードの見通しは良いが実ゲームの速度を遅くするコードを
 * 見通しは悪いが機能は同等の、Chromeブラウザが高速に処理するコードに置き換え、
 * ゲームの速度の改善を目指します。
 *
 * Chromeブラウザのプロファイラを用いて検出した、ゲームの速度に特に影響の大きい
 * コードに限り、置き換えています。
 *
 * 【使用方法】
 * ・他の全てのプラグインよりも先に定義してください。
 *
 * 【補足】
 * ・制作者は、本プラグインの内容がコミュニティ版コアスクリプトに適用されることを
 *   望みます。（CWCキャッシュは特殊な手法なので除きます）
 * ・将来、RPGツクールMV本体のバージョンアップにともない、改善内容が反映されて
 *   このプラグインが不要となる場合があります。
 *   その際は、プラグインを削除してください。
 *
 * 【追加機能】
 *   v18.1+
 *   CWCキャッシュ（実験的）
 *     半歩移動プラグイン(HalfMove.js) (By トリアコンタン様) と
 *     8方向移動(タッチパネル対応版)(Yami_8DirEx.js) (By 神無月サスケ様, Yami様)
 *     の二つを導入している時、マウス移動すると非常に重たくなる場合があります。
 *
 *     マウス移動時にキャラクター衝突判定処理が5桁の回数に到達することがあり、
 *     これが動作を重たくして、FPSを低下させる要因の一つになっています。
 *     一つ一つの判定処理を高速化すると効果はありますが、それも限界があります。
 *
 *     そこで、この機能は衝突判定結果をキャッシュして、一定時間以内の同じ座標
 *     についての判定を省略することにより、応答速度を上げてFPS低下を抑えます。
 *
 *     CWCキャッシュをONにすると副作用が発生する可能性があります。
 *     次のようなケースです。
 *
 *       - NPCが高速で走り回っている場合
 *       - シンボルエンカウント方式を使用し、かつシンボルの動きが高速の場合
 *
 *     一瞬ですがキャッシュが古い位置情報を元に判定結果を返す時間帯があるため、
 *     主人公キャラクターがNPCやシンボルをすり抜けて移動したり、
 *     タイミングをはかって一瞬の隙間の発生を狙って操作したのに通れなかった、
 *     というケースが考えられます。
 *
 *     特にマウスを使ったキャラクターの動きがゲームの戦闘の勝敗に直接繋がる場合は
 *     CWCキャッシュを利用するかどうかは慎重に検討してください。
 *
 *     また、マウスやタッチパネルに対応する予定がない場合は、速度が低下しないため
 *     CWCキャッシュをONにする必要は全くありません。
 *
 *     設定項目 Minimum CWC-cache holding count は、キャッシュの最小の保持期間を
 *     指定します。
 *     キャッシュは2つの箱があり、保持期間が経過すると片方ずつ空になります。
 *     高速化のため、個々のキャッシュの寿命は管理しません。箱ごと管理します。
 *     そのため、設定した最小保持期間の1倍 ～ 2倍の寿命があります。
 *
 *     設定値を増やすと、キャッシュが長時間保持されるため効果が高いですが、
 *     おかしな移動をする場合があります。NPCやシンボルがあまり動かない静かな
 *     ゲームは、値を増やしても違和感は少ないでしょう。
 *
 *     設定値を減らすと、キャッシュが短時間で消されるため効果は薄くなりますが、
 *     副作用の発生を抑える効果があります。
 *
 * @param Enable CWC-cache
 * @desc CWCキャッシュを有効にします。（実験的）（ON/OFF）
 * @default false
 * @type boolean
 *
 * @param Minimum CWC-cache holding count
 * @desc CWCキャッシュの保持期間の最小値（単位：Frame）
 * 最大で設定値の2倍の時間まで保持します。既定値：15
 * @default 15
 * @type number
 *
 * @param Logging level
 * @desc ログ出力量を指定します  0:No Log 1:Fatal 2:+Error 3:+Warning 4:+Info 5:+Debug
 * @default 4
 * @type number
 */

var Imported = Imported || {};
Imported.SA_CoreSpeedImprovement = true;

//-----------------------------------------------------------------------------
(function() {
'use strict';

	// Get parameters
	var params = PluginManager.parameters('SA_CoreSpeedImprovement');
	const paramEnableCacheCWC = (params['Enable CWC-cache'] === 'true');
	const paramMinCacheCWCHoldingCount = Number(params['Minimum CWC-cache holding count'] || 15);
	const paramLoggingLevel = Number(params['Logging level'] || 4);
	const LDEBUG = paramLoggingLevel >= 5 ? true : false;
	const LINFO  = paramLoggingLevel >= 4 ? true : false;
	const LWARN  = paramLoggingLevel >= 3 ? true : false;
	const LERROR = paramLoggingLevel >= 2 ? true : false;
	const LFATAL = paramLoggingLevel >= 1 ? true : false;

	// Log parameters
	if (LINFO) {
		console.log('== SA_CoreSpeedImprovement ==');
		console.log('paramEnableCacheCWC = ' + paramEnableCacheCWC);
		console.log('paramMinCacheCWCHoldingCount = ' + paramMinCacheCWCHoldingCount);
	}

	//-----------------------------------------------------------------------------
	// Game_Map
	//

	/**
	 * セットアップ [EXPANDED]
	 */
	var _Game_Map_setup = Game_Map.prototype.setup;
	Game_Map.prototype.setup = function(mapId) {
		_Game_Map_setup.call(this, mapId);
		if (paramEnableCacheCWC) {
			this.clearCacheCWCMem1();
			this.clearCacheCWCMem2();
			this._cacheCWCIndex = 1;
			this._cacheCWCClearTiming = 0;
			this._cacheCWCHitCnt = 0;
			this._cacheCWCLookupCnt = 0;
			if (LDEBUG) {
				console.log('CWC cache setup cmpl');
			}
		}
	};

	Game_Map.prototype.events = function() {
		var filtered = [];
		for (var i = 0; i < this._events.length; i++) {
			var event = this._events[i];
			if (!!event) {
				filtered.push(event);
			}
		}
		return filtered;
	};

	Game_Map.prototype.eventsXyNt = function(x, y) {
		var events = this.events();
		var filtered = [];
		for (var i = 0; i < events.length; i++) {
			if (events[i].posNt(x, y)) {
				filtered.push(events[i]);
			}
		}
		return filtered;
	};

	/**
	 * CWCキャッシュから値を取得する。キャッシュ内に見つからない場合は undefined を返す。
	 */
	Game_Map.prototype.getValueCacheCWC = function(key) {
		this._cacheCWCLookupCnt++;
		var value;
		if (this._cacheCWCIndex === 1) {
			value = this._cacheCWCMem1[key];
			if (typeof value === 'undefined') {
				value = this._cacheCWCMem2[key];
			}
		} else {
			value = this._cacheCWCMem2[key];
			if (typeof value === 'undefined') {
				value = this._cacheCWCMem1[key];
			}
		}
		if (typeof value !== 'undefined') {
			this._cacheCWCHitCnt++;
		}
		return value;
	};

	/**
	 * CWCキャッシュに新しい値を追加する
	 */
	Game_Map.prototype.addCacheCWC = function(key, value) {
		if (this._cacheCWCIndex === 1) {
			this._cacheCWCMem1[key] = value;
		} else {
			this._cacheCWCMem2[key] = value;
		}
	};

	/**
	 * 古くなったCWCキャッシュを消去する
	 */
	Game_Map.prototype.clearOldCacheCWC = function() {
		if (!paramEnableCacheCWC) {
			return;
		}
		this._cacheCWCClearTiming++;
		if (this._cacheCWCClearTiming >= paramMinCacheCWCHoldingCount) {
			// 一定時間ごとに、古くなったキャッシュを消去する
			this._cacheCWCClearTiming = 0;
			// キャッシュヒット率
			var hitRatio = 100 * this._cacheCWCHitCnt / this._cacheCWCLookupCnt;
			// キャッシュミス件数
			var cacheMiss = this._cacheCWCLookupCnt - this._cacheCWCHitCnt;
			// 古くなったキャッシュを消去する（連想配列を作り直す）
			if (this._cacheCWCIndex === 1) {
				this._cacheCWCIndex = 2;
				this.clearCacheCWCMem2();
			} else {
				this._cacheCWCIndex = 1;
				this.clearCacheCWCMem1();
			}
			if (this._cacheCWCLookupCnt > 0) {
				if (LINFO) {
					// 統計情報を出力
					console.log('CWC cache hit ratio:' + hitRatio.toFixed(1) + '% hit:' + this._cacheCWCHitCnt + ' miss:' + cacheMiss);
				}
			}
			this._cacheCWCHitCnt = 0;
			this._cacheCWCLookupCnt = 0;
		}
	};

	/**
	 * CWCキャッシュ#1を消去する
	 */
	Game_Map.prototype.clearCacheCWCMem1 = function() {
		// ここまで丁寧にしなくても最近のエンジンならGCで解放されるが、実行時のコストは僅かのため残しておく。
		if (typeof this._cacheCWCMem1 !== 'undefined') {
			for (var key in this._cacheCWCMem1) {
				delete this._cacheCWCMem1[key];
			}
			delete this._cacheCWCMem1;
		}
		this._cacheCWCMem1 = {};
	};

	/**
	 * CWCキャッシュ#2を消去する
	 */
	Game_Map.prototype.clearCacheCWCMem2 = function() {
		if (typeof this._cacheCWCMem2 !== 'undefined') {
			for (var key in this._cacheCWCMem2) {
				delete this._cacheCWCMem2[key];
			}
			delete this._cacheCWCMem2;
		}
		this._cacheCWCMem2 = {};
	};

	if (paramEnableCacheCWC) {
		/**
		 * Game_Map updater
		 *
		 * @method update
		 */
		var _Game_Map_update = Game_Map.prototype.update;
		Game_Map.prototype.update = function(sceneActive) {
			_Game_Map_update.call(this, sceneActive);
			this.clearOldCacheCWC();
		};
	}

	//-----------------------------------------------------------------------------
	// Game_CharacterBase
	//

	if (paramEnableCacheCWC) {
		Game_CharacterBase.prototype.isCollidedWithCharacters = function(x, y) {
			var key = x + '_' + y;
			var value = $gameMap.getValueCacheCWC(key);
			if (typeof value === 'undefined') {
				// キャッシュ内に見つからない場合
				value = this.isCollidedWithEvents(x, y) || this.isCollidedWithVehicles(x, y);
				// キャッシュに値を追加する
				$gameMap.addCacheCWC(key, value);
			}
			return value;
		};
	}

	Game_CharacterBase.prototype.isCollidedWithEvents = function(x, y) {
		var events = $gameMap.eventsXyNt(x, y);
		for (var i = 0; i < events.length; i++) {
			if (events[i].isNormalPriority()) {
				return true;
			}
		}
		return false;
	};

})();
