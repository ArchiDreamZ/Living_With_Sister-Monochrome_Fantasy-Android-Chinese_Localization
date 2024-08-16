//=============================================================================
// DataCacheBlocker.js
// PUBLIC DOMAIN
//=============================================================================

/*:
 * @plugindesc キャッシュを阻止します。（dataフォルダのみ）
 * @author くらむぼん
 *
 * @help
 * ブラウザ版でゲームを公開すると、たとえアップデートしても
 * 前のバージョンのキャッシュが残っていて誤動作を引き起こしてしまったりします。
 * 
 * このプラグインを導入すると、特にアップデートによる改変が多いdataフォルダの
 * ファイル（要は絵、音、プラグイン以外のファイル）のキャッシュを阻止します。
 * これにより頻繁にゲームをアップデートしてもキャッシュで困ることは無くなります。
 * 
 * なお、ブラウザ版以外で公開予定の場合はキャッシュに関する心配はまったく無いので、
 * その場合はこのプラグインを導入する必要はありません。
 * 
 * おまけ：
 * 「IEでは遊べません」とゲームの外に注意書きしても気づかない人がいるようなので、
 * IEで遊び始めると「IEでは遊べません」とエラーを表示する機能を追加しました。
 * 元々のWebAudio非対応云々なエラーメッセージよりは伝わりやすいはず。
 * 
 * ライセンス：
 * このプラグインの利用法に制限はありません。お好きなようにどうぞ。
 */

(function() {
	'use strict';
	var _DataManager_loadDataFile = DataManager.loadDataFile;
	DataManager.loadDataFile = function(name, src) {
		_DataManager_loadDataFile.call(this, name, src + '?' + Date.now());
	};

	SceneManager.initAudio = function() {
		var noAudio = Utils.isOptionValid('noaudio');
		if (!WebAudio.initialize(noAudio) && !noAudio) {
			var ua = navigator.userAgent.toLowerCase();
			if (ua.indexOf('msie') > -1 || ua.indexOf('trident/7') > -1) throw new Error('このゲームはInternet Explorerでは遊べません。他のブラウザで遊んでね！');
			else throw new Error('Your browser does not support Web Audio API.');
		}
	};
})();