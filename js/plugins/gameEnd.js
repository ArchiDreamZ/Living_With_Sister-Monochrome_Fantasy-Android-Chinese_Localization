//=============================================================================
// ゲーム終了コマンド追加プラグイン
// gamEnd.js
// Copyright (c) 2018 村人Ａ
//=============================================================================

/*:ja
 * @plugindesc このプラグインはタイトル画面にウィンドウを閉じるゲーム終了コマンドを追加します。
 * @author 村人A
 *
 * @param endName
 * @desc ゲーム終了の表記です
 * @default ゲーム終了
 *
 * @help このプラグインにはプラグインコマンドはありません。
 * 「endName」にはタイトルで表記するゲーム終了のコマンド名を入れてください。
 */

(function() {
	
    var parameters = PluginManager.parameters('gameEnd');
    var EndName = String(parameters['endName'] || 'ゲーム終了');
	console.log(parameters['endName'])
	
	Window_TitleCommand.prototype.makeCommandList = function() {
		this.addCommand(TextManager.newGame,   'newGame');
		this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
		//this.addCommand(TextManager.options,   'options');
		this.addCommand(EndName,   'gameEnd');
	};
	
	Scene_Title.prototype.createCommandWindow = function() {
		this._commandWindow = new Window_TitleCommand();
		this._commandWindow.setHandler('newGame',  this.commandNewGame.bind(this));
		this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
		//this._commandWindow.setHandler('options',  this.commandOptions.bind(this));
		this._commandWindow.setHandler('gameEnd',  this.commandGameEnd.bind(this));
		this.addWindow(this._commandWindow);
	};
	
	Scene_Title.prototype.commandGameEnd = function() {
		if(StorageManager.isLocalMode()){
			window.close();
		} else {
			window.open('about:blank', '_self').close();
		}
	};
})();