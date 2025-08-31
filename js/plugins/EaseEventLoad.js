//=============================================================================
// Plugin for RPG Maker MV and MZ
// EaseEventLoad.js
//=============================================================================
// [Update History]
// 2021.Mar.31 Ver1.0.0 First Release
// 2021.Apr.01 Ver1.0.1 Fix bug that parallel events didn't work.
// 2021.Apr.13 Ver1.1.0 Add more optimize, and make optimization selectable

/*:
 * @target MV MZ
 * @plugindesc [Ver1.1.0]Optimaize Events' Process To Reduce Their Load
 * @author Sasuke KANNAZUKI
 *
 * @param opt1valid
 * @text Use Optimize 1?
 * @desc Whether to use to get fast eventXy?
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @param opt2valid
 * @text Use Optimize 2?
 * @desc Whether to use to skip movement on fixed event?
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @param opt3valid
 * @text Use Optimize 3?
 * @desc Whether to use to make sprite only graphic is set?
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @param opt4valid
 * @text Use Optimize 4?
 * @desc Whether to skip update frame if it's not need?
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @param opt5valid
 * @text Use Optimize 5?
 * @desc Whether to remove sprite if the event is erased?
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MV(Ver1.6.0 or later) and MZ.
 * This plugin aims to ease the load of event processing.
 *
 * [Summary]
 * On current system, setting many events on the one map is
 * often the burden of the system.
 * This plugin makes to ease the burden by introducing
 * several optimize functions.
 *
 * [How this plugin achieve to reduce load]
 * 1. Get much faster the events at the specified position
 * 2. Skip event move routine if the event neither move nor do animation
 *  except move route forcing.
 * 3. Not make event sprite if the event sets no graphic.
 *  When the event needs sprite, dynamically create it.
 * 4. Not update sprite's frame whose pattern is not changed.
 * 5. When event erase, sprite is also removed.
 *
 * [Options]
 * On some situation, an optimizeation may be the seed of bug.
 * In such case, set option not to use the optimization.
 *
 * As known bug, change switch on move route forcing in parallel event,
 * Option 2 invokes error.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MV MZ
 * @plugindesc [Ver1.1.0]イベント処理軽量化
 * @author 神無月サスケ
 *
 * @param opt1valid
 * @text 最適化１を適用？
 * @desc 特定座標のイベントを高速取得する最適化を行う？
 * @type boolean
 * @on する
 * @off しない
 * @default true
 *
 * @param opt2valid
 * @text 最適化２を適用？
 * @desc 画像が変化しないイベントはフレーム更新しない最適化を行う？
 * @type boolean
 * @on する
 * @off しない
 * @default true
 *
 * @param opt3valid
 * @text 最適化３を適用？
 * @desc 画像未設定のイベントはスプライトを作成しない最適化を行う？
 * @type boolean
 * @on する
 * @off しない
 * @default true
 *
 * @param opt4valid
 * @text 最適化４を適用？
 * @desc 画像が変更しないフレームではスプライト更新を行わない最適化を行う？
 * @type boolean
 * @on する
 * @off しない
 * @default true
 *
 * @param opt5valid
 * @text 最適化５を適用？
 * @desc 一時消去されたイベントのスプライトを削除する最適化を行う？
 * @type boolean
 * @on する
 * @off しない
 * @default true
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMV(Ver1.6.0以降)およびMZに対応しています。
 * このプラグインは、イベントがシステムにかける負荷を軽減します。
 *
 * ■概要
 * ひとつのマップに多くのイベントを置くと、しばしばフレームレートが下がります。
 * 100～200以上の多数のイベントがあるマップでは特にそれが顕著になります。
 * このプラグインは、いくつかの最適化を施し、イベントが多数あるマップでの
 * フレームレートの低下を緩和します。
 *
 * ■軽量化のメカニズム
 * 1. その座標にあるイベントを高速に取得可能にした
 * 2. 移動やアニメをしないイベントは、移動関連の判定処理を行わない
 *   「移動ルートの設定」などで移動中は例外
 * 3. 画像が設定されていないイベントはスプライトを作成しない
 *    画像変更やアニメーションが行われる際はその場で作成する
 * 4. スプライトの画像に変化がない場合は、フレーム更新を行わない
 * 5. イベントの一時消去を行った際、スプライトを消去する
 *
 * ■オプション
 * 状況によっては、軽量化が原因の不具合が発生することがあります。
 * この場合、不具合を起こしている軽量化をオプションからOFFにしてください。
 *
 * 既知の不具合として、並列処理内で、スイッチ変更を伴う移動ルートの設定を行うと
 * 軽量化２が不具合の原因になります。
 *
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'EaseEventLoad';
  //
  // process parameters
  //
  const parameters = PluginManager.parameters(pluginName);
  const opt1valid = eval(parameters['opt1valid'] || 'true');
  const opt2valid = eval(parameters['opt2valid'] || 'true');
  const opt3valid = eval(parameters['opt3valid'] || 'true');
  const opt4valid = eval(parameters['opt4valid'] || 'true');
  const opt5valid = eval(parameters['opt5valid'] || 'true');

  // ----------------------------------------------------------------------
  // Optimize 1: make eventXy much faster
  // ----------------------------------------------------------------------
if (opt1valid) {
  //
  // make event position table to make eventXy much faster.
  //
  const _Game_Temp_initialize = Game_Temp.prototype.initialize
  Game_Temp.prototype.initialize = function() {
    _Game_Temp_initialize.call(this);
    this.eventAt = new EventPositionTable();
  };

  // This is a hash whose key is coord, value is eventIds.
  // Number of event there: 0:null 1:Event >=2:Array of Event
  class EventPositionTable {
    constructor() {
      this.clear();
    }

    clear() {
      this._xyTable = {};
    }

    aToNum(x, y) {
      return (y << 12) + x;
    }

    set(event, x, y) {
      const key = this.aToNum(x, y);
      const value = this._xyTable[key];
	  if (value == null) {
        this._xyTable[key] = event;
      } else if (!Array.isArray(value)) {
        this._xyTable[key] = [value, event];
      } else {
        this._xyTable[key].push(event);
      }
    }

    unset(event, x, y) {
      if (x < 0) { // before the event sets coord
        return;
      }
      const key = this.aToNum(x, y);
      const value = this._xyTable[key];
      if (!Array.isArray(value)) {
        this._xyTable[key] = null;
      } else {
        if (value.length === 2) {
          this._xyTable[key] = value[0] === event ? value[1] : value[0];
        } else {
          this._xyTable[key] = this._xyTable[key].filter(e => e !== event);
        }
      }
    }

    get(x, y) {
      const key = this.aToNum(x, y);
      const value = this._xyTable[key];
      if (value == null) {
        return [];
      } else if (!Array.isArray(value)) {
        return [value];
      } else {
        return value;
      }
    }

    setFirst(events) {
      this.clear();
      for (const event of events) {
        if (event) {
          const x = event.x;
          const y = event.y;
          this.set(event, x, y);
        }
      }
    }
  }

  //
  // at setting the new map, clear event position table
  //
  const _Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function(mapId) {
    $gameTemp.eventAt.clear();
    _Game_Map_setup.call(this, mapId);
  };


  //
  // when load the game, initialize and recreate position table
  //
  const _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
  Game_System.prototype.onAfterLoad = function() {
    _Game_System_onAfterLoad.call(this);
    $gameTemp.eventAt.setFirst($gameMap.events());
  };

  //
  // when an event change the location, modify event position table
  //
  const _Game_Event_initMembers = Game_Event.prototype.initMembers;
  Game_Event.prototype.initMembers = function() {
    _Game_Event_initMembers.call(this);
    // stay invalid coord until the event locate is set.
    this._x = -1;
    this._y = -1;
  };

  const _Game_Event_setPosition = Game_Event.prototype.setPosition;
  Game_Event.prototype.setPosition = function(x, y) {
    $gameTemp.eventAt.unset(this, this.x, this.y);
    _Game_Event_setPosition.call(this, x, y);
    $gameTemp.eventAt.set(this, this.x, this.y);
  };

  const _Game_Event_moveStraight = Game_Event.prototype.moveStraight;
  Game_Event.prototype.moveStraight = function(d) {
    $gameTemp.eventAt.unset(this, this.x, this.y);
    _Game_Event_moveStraight.call(this, d);
    $gameTemp.eventAt.set(this, this.x, this.y);
  };

  const _Game_Event_moveDiagonally = Game_Event.prototype.moveDiagonally;
  Game_Event.prototype.moveDiagonally = function(horz, vert) {
    $gameTemp.eventAt.unset(this, this.x, this.y);
    _Game_Event_moveDiagonally.call(this, horz, vert);
    $gameTemp.eventAt.set(this, this.x, this.y);
  };

  const _Game_Event_jump = Game_Event.prototype.jump;
  Game_Event.prototype.jump = function(xPlus, yPlus) {
    $gameTemp.eventAt.unset(this, this.x, this.y);
    _Game_Event_jump.call(this, xPlus, yPlus);
    $gameTemp.eventAt.set(this, this.x, this.y);
  };

  //
  // obtain events' list there much faster then default
  //
  Game_Map.prototype.eventsXy = function(x, y) {
    return $gameTemp.eventAt.get(x, y);
  };

  Game_Map.prototype.eventsXyNt = function(x, y) {
    return this.eventsXy(x, y).filter(event => event.posNt(x, y));
  };

  Game_Map.prototype.tileEventsXy = function(x, y) {
    return this.eventsXy(x, y).filter(e => e.isTile() && e.posNt(x, y));
  };
}
  // ----------------------------------------------------------------------
  // Optimize 2: Skip move check routine if the event is fixed
  // ----------------------------------------------------------------------
if (opt2valid) {
  //
  // check event is fixed(neither move nor change animation pattern)
  //
  Game_CharacterBase.prototype.isFixed = function() {
    return false;
  };

  Game_Event.prototype.isFixed = function() {
    return this._moveType === 0 && (!this._characterName || !this._stepAnime);
  };

  const _Game_Event_setupPage = Game_Event.prototype.setupPage;
  Game_Event.prototype.setupPage = function() {
    _Game_Event_setupPage.call(this);
    this._fixed = this.isFixed();
  };

  //
  // if the event is fixed, skip all update routine
  //
  const _Game_Character_update = Game_Character.prototype.update;
  Game_Character.prototype.update = function() {
    if (!this._fixed) {
      _Game_Character_update.call(this);
    }
  };

  //
  // process when it sets force movement to fixed event
  //
  const _Game_Event_memorizeMoveRoute =
    Game_Event.prototype.memorizeMoveRoute;
  Game_Event.prototype.memorizeMoveRoute = function() {
    _Game_Event_memorizeMoveRoute.call(this);
    this._fixed = false;
  };

  const _Game_Event_restoreMoveRoute = 
    Game_Event.prototype.restoreMoveRoute;
  Game_Event.prototype.restoreMoveRoute = function() {
    _Game_Event_restoreMoveRoute.call(this);
    this._fixed = this.isFixed();
  };
}
  // ----------------------------------------------------------------------
  // Optimize 3: Not make sprite if the event is not set graphic
  // ----------------------------------------------------------------------
if (opt3valid) {
  //
  // when event's graphic may change, judge whether to need sprite
  //
  Game_Event.prototype._createSprite = function() {
    this._noSprite = false;
    $gameMap.addSpriteRequest(this.eventId());
  };

  Game_Event.prototype.isNoGraphic = function() {
    return !this._tileId && !this._characterName;
  };

  Game_Event.prototype.createSpriteIfNeed = function() {
    if (this._noSprite == null) { // at first
      this._noSprite = this.isNoGraphic();
    } else if (this._noSprite && !this.isNoGraphic()) { // need to create
      this._createSprite();
    }
  };

  //
  // functions that may change the event graphic
  //
  const _Game_Event_setTileImage = Game_Event.prototype.setTileImage;
  Game_Event.prototype.setTileImage = function(tileId) {
    _Game_Event_setTileImage.call(this, tileId);
    this.createSpriteIfNeed();
  };

  const _Game_Event_setImage = Game_Event.prototype.setImage;
  Game_Event.prototype.setImage = function(characterName, characterIndex) {
    _Game_Event_setImage.call(this, characterName, characterIndex);
    this.createSpriteIfNeed();
  };

  //
  // process request for creating event sprite dynamically
  //
  const _Game_Map_setup2 = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function(mapId) {
    _Game_Map_setup2.call(this, mapId);
    this.resetSpriteRequest();
  };

  Game_Map.prototype.resetSpriteRequest = function() {
    this._spriteRequest = null;
  };

  Game_Map.prototype.addSpriteRequest = function(eventId) {
    this._spriteRequest = this._spriteRequest || [];
    this._spriteRequest.push(eventId);
  };

  Game_Map.prototype.spriteRequest = function() {
    return this._spriteRequest;
  };

  //
  // to display animation on map, make sure there's an event sprite.
  //

  if (Game_Temp.prototype.requestAnimation) { // MZ
    const _Game_Temp_requestAnimation = Game_Temp.prototype.requestAnimation;
    Game_Temp.prototype.requestAnimation = function(targets, animationId,
      mirror = false) {
      for (const target of targets) {
        if (target._noSprite) {
          target._createSprite();
        }
      }
      _Game_Temp_requestAnimation.call(this, targets, animationId, mirror);
    };
  } else { // MV
    const _Game_Event_requestAnimation = Game_Event.prototype.requestAnimation;
    Game_Event.prototype.requestAnimation = function(animationId) {
      if (this._noSprite) {
        this._createSprite();
      }
      _Game_Event_requestAnimation.call(this, animationId);
    };
  }

  //
  // when starting the map, make only visible sprites
  //

  if (!Game_Followers.prototype.reverseData) { // MV
    Game_Followers.prototype.reverseData = function() {
      return this._data.clone().reverse();
    };
  }

  // ***overwrite!!!***
  Spriteset_Map.prototype.createCharacters = function() {
    this._characterSprites = [];
    this.addVisibleEventsFirst();
    // following process is the same process as core script
    for (const vehicle of $gameMap.vehicles()) {
      this._characterSprites.push(new Sprite_Character(vehicle));
    }
    for (const follower of $gamePlayer.followers().reverseData()) {
      this._characterSprites.push(new Sprite_Character(follower));
    }
    this._characterSprites.push(new Sprite_Character($gamePlayer));
    for (const sprite of this._characterSprites) {
      this._tilemap.addChild(sprite);
    }
  };

  Spriteset_Map.prototype.addVisibleEventsFirst = function() {
    const events = $gameMap.events().filter(e => !e.isNoGraphic());
    for (const event of events) {
      this.addVisibleEvent(event);
    }
  };

  Spriteset_Map.prototype.addVisibleEvent = function(event) {
    const newSprite = new Sprite_Character(event);
    this._characterSprites.push(newSprite);    
    this._tilemap.addChild(newSprite);
  };

  //
  // create event sprites dynamically
  //
  const _Spriteset_Map_update = Spriteset_Map.prototype.update;
  Spriteset_Map.prototype.update = function() {
    if ($gameMap.spriteRequest()) {
      const eventIds = $gameMap.spriteRequest();
      for (eventId of eventIds) {
        this.addVisibleEvent($gameMap.event(eventId));
      }
      $gameMap.resetSpriteRequest();
    }
    _Spriteset_Map_update.call(this);
  };
}

  // ----------------------------------------------------------------------
  // Optimize 4: update sprites' frame only if it needs to do
  // ----------------------------------------------------------------------
  // Note: I'm afraid this routine might not to reduce load so much.
  // ----------------------------------------------------------------------
if (opt4valid) {
  //
  // reset old patterns to be sure to update frame
  //
  Sprite_Character.prototype.resetOldPatterns = function() {
    this._oldTileId = null;
    this._oldPattern = null;
    this._oldDirection = null;
  };

  const _Sprite_Character_setCharacter =
    Sprite_Character.prototype.setCharacter;
  Sprite_Character.prototype.setCharacter = function(character) {
    _Sprite_Character_setCharacter.call(this, character);
    this.resetOldPatterns();
  };

  const _Sprite_Character_setTileBitmap =
    Sprite_Character.prototype.setTileBitmap;
  Sprite_Character.prototype.setTileBitmap = function() {
    _Sprite_Character_setTileBitmap.call(this);
    this.resetOldPatterns();
  };

  const _Sprite_Character_setCharacterBitmap = 
    Sprite_Character.prototype.setCharacterBitmap;
  Sprite_Character.prototype.setCharacterBitmap = function() {
    _Sprite_Character_setCharacterBitmap.call(this);
    this.resetOldPatterns();
  };

  //
  // if pattern is not changed, skip to modify frame
  //
  Sprite_Character.prototype.isPatternChanged = function() {
    if (this._oldTileId == null) {
      this._atFirst = true;
      return true;
    } else if (this._atFirst) {
      this._atFirst = false;
      return true;
    }
    if (this.isTile()) {
      if (this._character.tileId() !== this._oldTileId) {
        return true;
      }
    } else {
      if (this._character.pattern() !== this._oldPattern ||
        this._character.direction() !== this._oldDirection) {
        return true;
      }
    }
    return false;
  };

  Sprite_Character.prototype.changePattern = function() {
    if (this.isTile()) {
      this._oldTileId = this._character.tileId();
      this._oldPattern = -1;
      this._oldDirection = -1;
    } else {
      this._oldTileId = 0;
      this._oldPattern = this._character.pattern();
      this._oldDirection = this._character.direction();
    }
  };

  const _Sprite_Character_updateFrame = Sprite_Character.prototype.updateFrame;
  Sprite_Character.prototype.updateFrame = function() {
    if (this.isPatternChanged()) {
      _Sprite_Character_updateFrame.call(this);
      this.changePattern();
    }
  };
}

  // ----------------------------------------------------------------------
  // Optimize 5: when event is erased, remove its sprite
  // ----------------------------------------------------------------------
if (opt5valid) {
  //
  // process request for delete event sprite dynamically
  //
  const _Game_Map_setup3 = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function(mapId) {
    _Game_Map_setup3.call(this, mapId);
    this.resetDelSprRequest();
  };

  Game_Map.prototype.resetDelSprRequest = function() {
    this._delSpriteRequest = false;
  };

  Game_Map.prototype.setDelSpriteRequest = function() {
    this._delSpriteRequest = true;
  };

  Game_Map.prototype.delSpriteRequest = function() {
    return this._delSpriteRequest;
  };

  //
  // request for delete sprite
  //
  const _Game_Event_clearPageSettings = Game_Event.prototype.clearPageSettings;
  Game_Event.prototype.clearPageSettings = function() {
    if (this._erased) {
      $gameMap.setDelSpriteRequest();
    }
    _Game_Event_clearPageSettings.call(this);
  };

  //
  // remove event sprites dynamically
  //
  const _Spriteset_Map_update2 = Spriteset_Map.prototype.update;
  Spriteset_Map.prototype.update = function() {
    if ($gameMap.delSpriteRequest()) {
      const needsDelete = this._characterSprites.filter(
        sprite => sprite._character._erased
      );
      for (sprite of needsDelete) {
        this._tilemap.removeChild(sprite);
        sprite._character._noSprite = true;
        const index = this._characterSprites.indexOf(sprite);
        this._characterSprites.splice(index, 1);
      }
      $gameMap.resetDelSprRequest();
    }
    _Spriteset_Map_update2.call(this);
  };
}
})();
