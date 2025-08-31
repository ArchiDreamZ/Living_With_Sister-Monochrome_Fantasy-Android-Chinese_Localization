//=============================================================================
// TMPlugin - 戻るボタン
// バージョン: 1.0.0
// 最終更新日: 2016/10/28
// 配布元    : http://hikimoki.sakura.ne.jp/
//-----------------------------------------------------------------------------
// Copyright (c) 2016 tomoaky
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc メニューシーンにタップ操作用の戻るボタンを表示します。
 *
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @param buttonImage
 * @desc ボタンとして表示する画像。
 * 初期値: backButton
 * @default backButton
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param sceneMenuX
 * @desc Scene_Menuの戻るボタンＸ座標。
 * 初期値: 0
 * @default 0
 *
 * @param sceneMenuY
 * @desc Scene_Menuの戻るボタンＹ座標。
 * 初期値: 0
 * @default 0
 *
 * @param sceneItemX
 * @desc Scene_Itemの戻るボタンＸ座標。
 * 初期値: 0
 * @default 0
 *
 * @param sceneItemY
 * @desc Scene_Itemの戻るボタンＹ座標。
 * 初期値: 0
 * @default 0
 *
 * @param sceneSkillX
 * @desc Scene_Skillの戻るボタンＸ座標。
 * 初期値: 0
 * @default 0
 *
 * @param sceneSkillY
 * @desc Scene_Skillの戻るボタンＹ座標。
 * 初期値: 0
 * @default 0
 *
 * @param sceneEquipX
 * @desc Scene_Equipの戻るボタンＸ座標。
 * 初期値: 0
 * @default 0
 *
 * @param sceneEquipY
 * @desc Scene_Equipの戻るボタンＹ座標。
 * 初期値: 0
 * @default 0
 *
 * @param sceneStatusX
 * @desc Scene_Statusの戻るボタンＸ座標。
 * 初期値: 0
 * @default 0
 *
 * @param sceneStatusY
 * @desc Scene_Statusの戻るボタンＹ座標。
 * 初期値: 0
 * @default 0
 *
 * @param sceneOptionsX
 * @desc Scene_Optionsの戻るボタンＸ座標。
 * 初期値: 0
 * @default 0
 *
 * @param sceneOptionsY
 * @desc Scene_Optionsの戻るボタンＹ座標。
 * 初期値: 0
 * @default 0
 *
 * @param sceneSaveX
 * @desc Scene_Saveの戻るボタンＸ座標。
 * 初期値: 0
 * @default 0
 *
 * @param sceneSaveY
 * @desc Scene_Saveの戻るボタンＹ座標。
 * 初期値: 0
 * @default 0
 *
 * @param sceneLoadX
 * @desc Scene_Loadの戻るボタンＸ座標。
 * 初期値: 0
 * @default 0
 *
 * @param sceneLoadY
 * @desc Scene_Loadの戻るボタンＹ座標。
 * 初期値: 0
 * @default 0
 *
 * @param sceneGameEndX
 * @desc Scene_GameEndの戻るボタンＸ座標。
 * 初期値: 0
 * @default 0
 *
 * @param sceneGameEndY
 * @desc Scene_GameEndの戻るボタンＹ座標。
 * 初期値: 0
 * @default 0
 *
 * @param sceneShopX
 * @desc Scene_Shopの戻るボタンＸ座標。
 * 初期値: 0
 * @default 0
 *
 * @param sceneShopY
 * @desc Scene_Shopの戻るボタンＹ座標。
 * 初期値: 0
 * @default 0
 *
 * @param sceneNameX
 * @desc Scene_Nameの戻るボタンＸ座標。
 * 初期値: 0
 * @default 0
 *
 * @param sceneNameY
 * @desc Scene_Nameの戻るボタンＹ座標。
 * 初期値: 0
 * @default 0
 *
 * @help
 * 準備:
 *
 *   プラグインと一緒に配布しているボタン画像を img/system フォルダに
 *   保存してください。ファイル名は backButton.png となっています。
 *   オリジナルのボタン画像を使用する場合は上記ファイル名と同名のものを
 *   用意するか、プラグインパラメータ buttonImage を変更してください。
 *
 *
 * 使い方:
 *
 *   ボタン画像を img/system フォルダ内に置いた状態で、このプラグインを
 *   導入すれば、自動的に戻るボタンが表示されるようになります。
 *
 *   プラグインパラメータでボタンの表示位置をシーンごとに調節できますので
 *   お好みで変更してください。
 *
 *   ボタン画像の透過部分（アルファ値が 0 ）はタップに反応しません。
 *
 *   プラグインコマンドはありません。
 *
 *   このプラグインは RPGツクールMV Version 1.3.3 で動作確認をしています。
 */

var Imported = Imported || {};
Imported.TMBackButton = true;

var TMPlugin = TMPlugin || {};
TMPlugin.BackButton = {};
TMPlugin.BackButton.Parameters = PluginManager.parameters('TMBackButton');
TMPlugin.BackButton.ButtonImage = TMPlugin.BackButton.Parameters['buttonImage'] || 'backButton';
TMPlugin.BackButton.SceneMenuX = +(TMPlugin.BackButton.Parameters['sceneMenuX'] || 0);
TMPlugin.BackButton.SceneMenuY = +(TMPlugin.BackButton.Parameters['sceneMenuY'] || 0);
TMPlugin.BackButton.SceneItemX = +(TMPlugin.BackButton.Parameters['sceneItemX'] || 0);
TMPlugin.BackButton.SceneItemY = +(TMPlugin.BackButton.Parameters['sceneItemY'] || 0);
TMPlugin.BackButton.SceneSkillX = +(TMPlugin.BackButton.Parameters['sceneSkillX'] || 0);
TMPlugin.BackButton.SceneSkillY = +(TMPlugin.BackButton.Parameters['sceneSkillY'] || 0);
TMPlugin.BackButton.SceneEquipX = +(TMPlugin.BackButton.Parameters['sceneEquipX'] || 0);
TMPlugin.BackButton.SceneEquipY = +(TMPlugin.BackButton.Parameters['sceneEquipY'] || 0);
TMPlugin.BackButton.SceneStatusX = +(TMPlugin.BackButton.Parameters['sceneStatusX'] || 0);
TMPlugin.BackButton.SceneStatusY = +(TMPlugin.BackButton.Parameters['sceneStatusY'] || 0);
TMPlugin.BackButton.SceneOptionsX = +(TMPlugin.BackButton.Parameters['sceneOptionsX'] || 0);
TMPlugin.BackButton.SceneOptionsY = +(TMPlugin.BackButton.Parameters['sceneOptionsY'] || 0);
TMPlugin.BackButton.SceneSaveX = +(TMPlugin.BackButton.Parameters['sceneSaveX'] || 0);
TMPlugin.BackButton.SceneSaveY = +(TMPlugin.BackButton.Parameters['sceneSaveY'] || 0);
TMPlugin.BackButton.SceneLoadX = +(TMPlugin.BackButton.Parameters['sceneLoadX'] || 0);
TMPlugin.BackButton.SceneLoadY = +(TMPlugin.BackButton.Parameters['sceneLoadY'] || 0);
TMPlugin.BackButton.SceneGameEndX = +(TMPlugin.BackButton.Parameters['sceneGameEndX'] || 0);
TMPlugin.BackButton.SceneGameEndY = +(TMPlugin.BackButton.Parameters['sceneGameEndY'] || 0);
TMPlugin.BackButton.SceneShopX = +(TMPlugin.BackButton.Parameters['sceneShopX'] || 0);
TMPlugin.BackButton.SceneShopY = +(TMPlugin.BackButton.Parameters['sceneShopY'] || 0);
TMPlugin.BackButton.SceneNameX = +(TMPlugin.BackButton.Parameters['sceneNameX'] || 0);
TMPlugin.BackButton.SceneNameY = +(TMPlugin.BackButton.Parameters['sceneNameY'] || 0);

(function() {

  //-----------------------------------------------------------------------------
  // Window_Selectable
  //

  var _Window_Selectable_processTouch = Window_Selectable.prototype.processTouch;
  Window_Selectable.prototype.processTouch = function() {
    if (this.isOpenAndActive() && TouchInput.isTriggered()) {
      var backButton = SceneManager._scene._backButtonSprite;
      if (this.isCancelEnabled() && backButton && backButton.width) {
        var x = backButton.x;
        var y = backButton.y;
        if (TouchInput.x >= x && TouchInput.x < x + backButton.width &&
            TouchInput.y >= y && TouchInput.y < y + backButton.height &&
            +backButton.bitmap.getAlphaPixel(TouchInput.x - x, TouchInput.y - y) > 0) {
          this.processCancel();
          return;
        }
      }
    }
    _Window_Selectable_processTouch.call(this);
  };

  //-----------------------------------------------------------------------------
  // Scene_MenuBase
  //

  var _Scene_MenuBase_create = Scene_MenuBase.prototype.create;
  Scene_MenuBase.prototype.create = function() {
    _Scene_MenuBase_create.call(this);
    this.createBackButton();
  };

  Scene_MenuBase.prototype.createBackButton = function() {
    this._backButtonSprite = new Sprite();
    this._backButtonSprite.bitmap = ImageManager.loadSystem(TMPlugin.BackButton.ButtonImage);
    this._backButtonSprite.x = this.backButtonX();
    this._backButtonSprite.y = this.backButtonY();
    this.addChild(this._backButtonSprite);
  };

  Scene_MenuBase.prototype.backButtonX = function() {
    return 0;
  };

  Scene_MenuBase.prototype.backButtonY = function() {
    return 0;
  };

  //-----------------------------------------------------------------------------
  // Scene_Menu
  //

  Scene_Menu.prototype.backButtonX = function() {
    return TMPlugin.BackButton.SceneMenuX;
  };

  Scene_Menu.prototype.backButtonY = function() {
    return TMPlugin.BackButton.SceneMenuY;
  };

  //-----------------------------------------------------------------------------
  // Scene_Item
  //

  Scene_Item.prototype.backButtonX = function() {
    return TMPlugin.BackButton.SceneItemX;
  };

  Scene_Item.prototype.backButtonY = function() {
    return TMPlugin.BackButton.SceneItemY;
  };

  //-----------------------------------------------------------------------------
  // Scene_Skill
  //

  Scene_Skill.prototype.backButtonX = function() {
    return TMPlugin.BackButton.SceneSkillX;
  };

  Scene_Skill.prototype.backButtonY = function() {
    return TMPlugin.BackButton.SceneSkillY;
  };

  //-----------------------------------------------------------------------------
  // Scene_Equip
  //

  Scene_Equip.prototype.backButtonX = function() {
    return TMPlugin.BackButton.SceneEquipX;
  };

  Scene_Equip.prototype.backButtonY = function() {
    return TMPlugin.BackButton.SceneEquipY;
  };

  //-----------------------------------------------------------------------------
  // Scene_Status
  //

  Scene_Status.prototype.backButtonX = function() {
    return TMPlugin.BackButton.SceneStatusX;
  };

  Scene_Status.prototype.backButtonY = function() {
    return TMPlugin.BackButton.SceneStatusY;
  };

  //-----------------------------------------------------------------------------
  // Scene_Options
  //

  Scene_Options.prototype.backButtonX = function() {
    return TMPlugin.BackButton.SceneOptionsX;
  };

  Scene_Options.prototype.backButtonY = function() {
    return TMPlugin.BackButton.SceneOptionsY;
  };

  //-----------------------------------------------------------------------------
  // Scene_Save
  //

  Scene_Save.prototype.backButtonX = function() {
    return TMPlugin.BackButton.SceneSaveX;
  };

  Scene_Save.prototype.backButtonY = function() {
    return TMPlugin.BackButton.SceneSaveY;
  };

  //-----------------------------------------------------------------------------
  // Scene_Load
  //

  Scene_Load.prototype.backButtonX = function() {
    return TMPlugin.BackButton.SceneLoadX;
  };

  Scene_Load.prototype.backButtonY = function() {
    return TMPlugin.BackButton.SceneLoadY;
  };

  //-----------------------------------------------------------------------------
  // Scene_GameEnd
  //

  Scene_GameEnd.prototype.backButtonX = function() {
    return TMPlugin.BackButton.SceneGameEndX;
  };

  Scene_GameEnd.prototype.backButtonY = function() {
    return TMPlugin.BackButton.SceneGameEndY;
  };

  //-----------------------------------------------------------------------------
  // Scene_Shop
  //

  Scene_Shop.prototype.backButtonX = function() {
    return TMPlugin.BackButton.SceneShopX;
  };

  Scene_Shop.prototype.backButtonY = function() {
    return TMPlugin.BackButton.SceneShopY;
  };

  //-----------------------------------------------------------------------------
  // Scene_Name
  //

  Scene_Name.prototype.backButtonX = function() {
    return TMPlugin.BackButton.SceneNameX;
  };

  Scene_Name.prototype.backButtonY = function() {
    return TMPlugin.BackButton.SceneNameY;
  };

})();
