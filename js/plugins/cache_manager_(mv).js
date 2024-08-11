//=============================================================================
// Cache Manager
// by Shaz
// Last Updated: 2015.10.30
//=============================================================================

/*:
 * @plugindesc 选择性清除图像缓存以改善内存使用情况。
 * @author Shaz
 *
 * @param Mobile only
 * @desc Cache management only runs on mobile platforms (N to run on all platforms)
 * @default Y
 *
 * @param --------------------------------------------
 *
 * @param Clear All
 * @desc Clears all cached images except System (if Y, ignore remaining parameters)
 * @default Y
 *
 * @param Clear Animations
 * @desc Clear Animation images
 * @default Y
 *
 * @param Clear Battlebacks
 * @desc Clear Battleback images
 * @default Y
 *
 * @param Clear Battlers
 * @desc Clear Battler images
 * @default Y
 *
 * @param Clear Characters
 * @desc Clear Character images
 * @default Y
 *
 * @param Clear Faces
 * @desc Clear Face images
 * @default Y
 *
 * @param Clear Parallaxes
 * @desc Clear Parallax images
 * @default Y
 *
 * @param Clear Pictures
 * @desc Clear Picture images
 * @default Y
 *
 * @param Clear System
 * @desc Clear System images (not recommended)
 * @default N
 *
 * @param Clear Tilesets
 * @desc Clear Tileset images
 * @default Y
 *
 * @param Clear Titles
 * @desc Clear Title images
 * @default Y
 *
 * @param Custom Images
 * @desc List custom image paths to clear, separated by ; (img/fogs; img/busts)
 * @default
 *
 * @help This plugin does not provide plugin commands.
 *
 * This plugin allows you to specify how often the image cache should be
 * cleared, and what kind of images should be cleared.  This can be used
 * to improve memory usage on low-memory platforms, but will also result
 * in more frequent loading delays.
 *
 * If not using the 'clear all' default option, and you have plugins that
 * use their own custom image paths, list those paths in the Custom Images
 * parameter to clear any images cached from those locations.
 *
 */

(function() {
  var params = PluginManager.parameters('CacheManager');
  var mobile = (params['Mobile only'] || 'Y').toUpperCase().substring(0,1) === 'Y';
  var clearAll = (params['Clear All'] || 'Y').toUpperCase().substring(0,1) === 'Y';
  if (!clearAll) {
    pathsToClear = [];
    if ((params['Clear Animations'] || 'Y').toUpperCase().substring(0,1) === 'Y')
      pathsToClear.push('img/animations');
    if ((params['Clear Battlebacks'] || 'Y').toUpperCase().substring(0,1) === 'Y')
      pathsToClear.push('img/battlebacks1', 'img/battlebacks2');
    if ((params['Clear Battlers'] || 'Y').toUpperCase().substring(0,1) === 'Y')
      pathsToClear.push('img/enemies', 'img/sv-actors', 'img/sv-enemies');
    if ((params['Clear Characters'] || 'Y').toUpperCase().substring(0,1) === 'Y')
      pathsToClear.push('img/characters');
    if ((params['Clear Faces'] || 'Y').toUpperCase().substring(0,1) === 'Y')
      pathsToClear.push('img/faces');
    if ((params['Clear Parallaxes'] || 'Y').toUpperCase().substring(0,1) === 'Y')
      pathsToClear.push('img/parallaxes');
    if ((params['Clear Pictures'] || 'Y').toUpperCase().substring(0,1) === 'Y')
      pathsToClear.push('img/pictures');
    if ((params['Clear System'] || 'N').toUpperCase().substring(0,1) === 'Y')
      pathsToClear.push('img/system');
    if ((params['Clear Tilesets'] || 'Y').toUpperCase().substring(0,1) === 'Y')
      pathsToClear.push('img/tilesets');
    if ((params['Clear Titles'] || 'Y').toUpperCase().substring(0,1) === 'Y')
      pathsToClear.push('img/titles1', 'img/titles2');
    (params['Custom Images'] || '').split(';').forEach(function(path) { if (path) pathsToClear.push(path.trim()) }.bind(this));
  }

  ImageManager.clear = function() {
    for (image in this._cache) {
      if (clearAll && image.indexOf('img/system') === -1)
        this.removeFromCache(image);
      else if (!clearAll && pathsToClear.some(function(path) { return image.indexOf(path) > -1}.bind(this)))
        this.removeFromCache(image);
    }
  };

  ImageManager.removeFromCache = function(image) {
    if (image !== 'null') {
      if (this._cache.hasOwnProperty(image) && this._cache[image] instanceof Bitmap) {
        if (this._cache[image].baseTexture) {
          this._cache[image].baseTexture.destroy();
        }
      }
      delete this._cache[image];
    }
  };

  var _Scene_Map_create = Scene_Map.prototype.create;
  Scene_Map.prototype.create = function() {
    _Scene_Map_create.call(this);
    if (this._transfer && (!mobile || Utils.isMobileDevice())) {
      ImageManager.clear();
    }
  };
})();