/*:
 * @plugindesc 使用WebGL和PIXI来提高性能，从而减少游戏中的卡顿和延迟
 * @author RPG Maker Irina
 *
 * @help
 * *** Introduction ***
 *
 *      This is a "plugin" of mostly performance upgrades shifts away from the
 * usage of bitmap functions to WebGL and PIXI for better performance. Results
 * may vary from computer to computer as PIXI alternatives depend highly on the
 * PC's GPU. For those that this does affect, expect less lag spikes from many
 * things like hue changes for enemies and animations, entering the main menu,
 * or constant pixel grabs from the window skin.
 *
 *
 *
 * *** Plugin Parameters ***
 *
 * Animation Hue
 * 
 *      Animations with hue changes will cause lagspikes up initial loading.
 * This will fix that by utilizing a PIXI filter to rotate the hues instead.
 * Results may vary from PC to PC and if there is WebGL support.
 *
 * Blur Menu Background
 *
 *      Entering the main menu causes lag because it requires taking a snapshot
 * of the current map screen, using a bitmap blur effect, and then using that
 * as a background. The bitmap blur effect will consume immense amounts of
 * processing power depending on how large your game's resolution is. Turning
 * this on will divert that to a filter instead. The first few times you open,
 * there will still be some lag due to loading the assets, but after that,
 * this won't happen anymore.
 * 
 * Cache Text Colors
 *
 *      Grabbing text colors makes the game open and close the windowskin file
 * to do a pixel information grab every single time. The pixel information grab
 * will only occur once per color and after that, it will be cached from that
 * point onward.
 *
 * Enemy Hue
 *
 *      Enemies with hue changes will cause lagspikes depending on how large
 * the enemy bitmap is. A PIXI filter is applied to the enemy to reduce the
 * lagspikes. Results may vary from PC to PC and if there is WebGL support.
 *
 * PIXI Container Flush
 * 
 *      This will remove textures from sprite children whenever they're removed
 * to properly flush them from memory and giving the game more room to work
 * with when new assets are loaded.
 *
 * Skip Unnecessary Snapshots
 *
 *      Some scene changes make unnecessary snapshots of the screen sometimes.
 * The larger the game resolution, the more likely there is of a lagspike. This
 * will bypass those snapshots and only make do with them if there's a need for
 * the snapshot of the screen to occur.
 *
 * 
 *
 * *** RPG Maker Version ***
 *
 * This plugin is made for and tested on RPG Maker MV with version 1.6.2.
 * I cannot guarantee if it works on lower versions.
 *
 *
 *
 * *** Terms of Use ***
 * 
 * 1. These plugins may be used in free or commercial games.
 * 2. 'RPG Maker Irina' must be given credit in your games.
 * 3. You are allowed to edit the code.
 * 4. Do NOT change the filename, parameters, and information of the plugin.
 * 5. You are NOT allowed to redistribute these Plugins.
 * 6. You may NOT take code for your own released Plugins.
 *
 * *** Help End ***
 *
 * @param 
 *
 * @param AnimationHue
 * @text Animation Hue
 * @type boolean
 * @on true
 * @off false
 * @desc Replaces bitmap hue rotation function for battle animations for a filter option if using WebGL mode
 * @default true
 *
 * @param 
 *
 * @param BlurMenuBackground
 * @text Blur Menu Background
 * @type boolean
 * @on true
 * @off false
 * @desc Replaces bitmap blur function for the main menu background for a filter option if using WebGL mode
 * @default true
 *
 * @param BlurIntensity
 * @text Blur Intensity
 * @parent BlurMenuBackground
 * @desc Intensity level of the blur
 * @default 0.5
 *
 * @param 
 *
 * @param CacheTextColors
 * @text Cache Text Colors
 * @type boolean
 * @on true
 * @off false
 * @desc Uses a cache to store text colors and retrieve the text code information
 * @default true
 *
 * @param 
 *
 * @param EnemyHue
 * @text Enemy Hue
 * @type boolean
 * @on true
 * @off false
 * @desc Replaces bitmap hue rotation function for enemies for a filter option if using WebGL mode
 * @default true
 *
 * @param
 *
 * @param PixiContainerFlush
 * @text PIXI Container Flush
 * @type boolean
 * @on true
 * @off false
 * @desc Flushes textures of sprites when removed
 * @default true
 *
 * @param
 *
 * @param SkipUnnecessarySnapshots
 * @text Skip Unnecessary Snapshots
 * @type boolean
 * @on true
 * @off false
 * @desc Skip unnecessary snapshots for scene changes
 * @default true
 * 
 *
 */
//=============================================================================

var parameters=$plugins.filter(function(e){return e.description.contains("<PerformanceUpgrade>")})[0].parameters;var Imported=Imported||{};Imported.Irina_PerformanceUpgrade={AnimationHue:eval(parameters["AnimationHue"]),BlurMenuBackground:eval(parameters["BlurMenuBackground"]),BlurIntensity:Number(parameters["BlurIntensity"]),CacheTextColors:eval(parameters["CacheTextColors"]),EnemyHue:eval(parameters["EnemyHue"]),PixiContainerFlush:eval(parameters["PixiContainerFlush"]),SkipUnnecessarySnapshots:eval(parameters["SkipUnnecessarySnapshots"])};Imported.Irina_PerformanceUpgrade.Graphics_hasWebGL=Graphics.hasWebGL;Graphics.hasWebGL=function(){if(this._cacheHasWebGL!==undefined){return this._cacheHasWebGL}this._cacheHasWebGL=Imported.Irina_PerformanceUpgrade.Graphics_hasWebGL.call(this);return this._cacheHasWebGL};if(Imported.Irina_PerformanceUpgrade.BlurMenuBackground){Imported.Irina_PerformanceUpgrade.Bitmap_snap=Bitmap.snap;Bitmap.snap=function(e){if(Graphics.hasWebGL()){var r=Graphics.width;var a=Graphics.height;if(!Imported.Irina_PerformanceUpgrade.PixiRenderTexture){Imported.Irina_PerformanceUpgrade.PixiRenderTexture=PIXI.RenderTexture.create(r,a)}if(e){Graphics._renderer.render(e,Imported.Irina_PerformanceUpgrade.PixiRenderTexture);e.worldTransform.identity();return new PIXI.Sprite(new PIXI.Texture(Imported.Irina_PerformanceUpgrade.PixiRenderTexture))}return null}else{return Imported.Irina_PerformanceUpgrade.Bitmap_snap.call(this,e)}};Imported.Irina_PerformanceUpgrade.Scene_MenuBase_createBackground=Scene_MenuBase.prototype.createBackground;Scene_MenuBase.prototype.createBackground=function(){if(Graphics.hasWebGL()){var e=Imported.Irina_PerformanceUpgrade.BlurIntensity;this._backgroundSprite=SceneManager.backgroundBitmap();this._backgroundSprite._filters=[new PIXI.filters.BlurFilter(e)];this._backgroundSprite.destroy=function(e){this.filters=null};this.addChild(this._backgroundSprite)}else{Imported.Irina_PerformanceUpgrade.Scene_MenuBase_createBackground.call(this)}};Imported.Irina_PerformanceUpgrade.SceneManager_snapForBackground=SceneManager.snapForBackground;SceneManager.snapForBackground=function(){if(Graphics.hasWebGL()){this._backgroundBitmap=this.snap()}else{Imported.Irina_PerformanceUpgrade.SceneManager_snapForBackground.call(this)}};Imported.Irina_PerformanceUpgrade.Spriteset_Battle_createBackground=Spriteset_Battle.prototype.createBackground;Spriteset_Battle.prototype.createBackground=function(){if(!Graphics.hasWebGL()){Imported.Irina_PerformanceUpgrade.Spriteset_Battle_createBackground.call(this)}}}if(Imported.Irina_PerformanceUpgrade.EnemyHue){Imported.Irina_PerformanceUpgrade.Sprite_Enemy_initMembers=Sprite_Enemy.prototype.initMembers;Sprite_Enemy.prototype.initMembers=function(){Imported.Irina_PerformanceUpgrade.Sprite_Enemy_initMembers.call(this);if(Graphics.hasWebGL()){this._filters=this._filters||[];this._colorMatrix=new PIXI.filters.ColorMatrixFilter;this._filters.push(this._colorMatrix)}};Imported.Irina_PerformanceUpgrade.Sprite_Enemy_loadBitmap=Sprite_Enemy.prototype.loadBitmap;Sprite_Enemy.prototype.loadBitmap=function(e,r){if(Graphics.hasWebGL()){this._colorMatrix.hue(r);r=0}Imported.Irina_PerformanceUpgrade.Sprite_Enemy_loadBitmap.call(this,e,r)}}if(Imported.Irina_PerformanceUpgrade.AnimationHue){Imported.Irina_PerformanceUpgrade.ImageManager_loadAnimation=ImageManager.loadAnimation;ImageManager.loadAnimation=function(e,r){if(Graphics.hasWebGL()){r=0}return Imported.Irina_PerformanceUpgrade.ImageManager_loadAnimation.call(this,e,r)};Imported.Irina_PerformanceUpgrade.Sprite_Animation_initMembers=Sprite_Animation.prototype.initMembers;Sprite_Animation.prototype.initMembers=function(){Imported.Irina_PerformanceUpgrade.Sprite_Animation_initMembers.call(this);if(Graphics.hasWebGL()){this._filters=this._filters||[];this._colorMatrix1=new PIXI.filters.ColorMatrixFilter;this._colorMatrix2=new PIXI.filters.ColorMatrixFilter}};Imported.Irina_PerformanceUpgrade.Sprite_Animation_loadBitmaps=Sprite_Animation.prototype.loadBitmaps;Sprite_Animation.prototype.loadBitmaps=function(){if(Graphics.hasWebGL()){this._colorMatrix1.hue(this._animation.animation1Hue);this._colorMatrix2.hue(this._animation.animation2Hue)}Imported.Irina_PerformanceUpgrade.Sprite_Animation_loadBitmaps.call(this)};Imported.Irina_PerformanceUpgrade.Sprite_Animation_updateCellSprite=Sprite_Animation.prototype.updateCellSprite;Sprite_Animation.prototype.updateCellSprite=function(e,r){Imported.Irina_PerformanceUpgrade.Sprite_Animation_updateCellSprite.call(this,e,r);if(Graphics.hasWebGL()){var a=r[0];if(a>=0&&a<100){this._colorMatrix1.blendMode=e.blendMode;e._filters=[this._colorMatrix1]}else if(a>=0&&a>=100){this._colorMatrix2.blendMode=e.blendMode;e._filters=[this._colorMatrix2]}}}}if(Imported.Irina_PerformanceUpgrade.PixiContainerFlush){PIXI.Container.prototype.destroyAndRemoveChildren=function(){for(var e=this.children.length;e>=0;e--){if(this.children[e]){this.children[e].destroy({children:true,texture:true})}}this.removeChildren()}}if(Imported.Irina_PerformanceUpgrade.SkipUnnecessarySnapshots){}if(Imported.Irina_PerformanceUpgrade.CacheTextColors){Imported.Irina_PerformanceUpgrade.Cache_WindowSkin_Colors={};Imported.Irina_PerformanceUpgrade.Window_Base_textColor=Window_Base.prototype.textColor;Window_Base.prototype.textColor=function(e){if(Imported.Irina_PerformanceUpgrade.Cache_WindowSkin_Colors[e]){var r=Imported.Irina_PerformanceUpgrade.Cache_WindowSkin_Colors[e]}else{var r=Imported.Irina_PerformanceUpgrade.Window_Base_textColor.call(this,e);Imported.Irina_PerformanceUpgrade.Cache_WindowSkin_Colors[e]=r}return r}}