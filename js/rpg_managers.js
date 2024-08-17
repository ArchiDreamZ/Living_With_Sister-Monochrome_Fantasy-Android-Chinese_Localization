//=============================================================================
// rpg_managers.js v1.6.2
//=============================================================================

//-----------------------------------------------------------------------------
// DataManager
//
// The static class that manages the database and game objects.

function DataManager() {
    throw new Error('This is a static class');
}

var $dataActors       = null;
var $dataClasses      = null;
var $dataSkills       = null;
var $dataItems        = null;
var $dataWeapons      = null;
var $dataArmors       = null;
var $dataEnemies      = null;
var $dataTroops       = null;
var $dataStates       = null;
var $dataAnimations   = null;
var $dataTilesets     = null;
var $dataCommonEvents = null;
var $dataSystem       = null;
var $dataMapInfos     = null;
var $dataMap          = null;
var $gameTemp         = null;
var $gameSystem       = null;
var $gameScreen       = null;
var $gameTimer        = null;
var $gameMessage      = null;
var $gameSwitches     = null;
var $gameVariables    = null;
var $gameSelfSwitches = null;
var $gameActors       = null;
var $gameParty        = null;
var $gameTroop        = null;
var $gameMap          = null;
var $gamePlayer       = null;
var $testEvent        = null;

DataManager._globalId       = 'RPGMV';
DataManager._lastAccessedId = 1;
DataManager._errorUrl       = null;

DataManager._databaseFiles = [
    { name: '$dataActors',       src: 'Actors.json'       },
    { name: '$dataClasses',      src: 'Classes.json'      },
    { name: '$dataSkills',       src: 'Skills.json'       },
    { name: '$dataItems',        src: 'Items.json'        },
    { name: '$dataWeapons',      src: 'Weapons.json'      },
    { name: '$dataArmors',       src: 'Armors.json'       },
    { name: '$dataEnemies',      src: 'Enemies.json'      },
    { name: '$dataTroops',       src: 'Troops.json'       },
    { name: '$dataStates',       src: 'States.json'       },
    { name: '$dataAnimations',   src: 'Animations.json'   },
    { name: '$dataTilesets',     src: 'Tilesets.json'     },
    { name: '$dataCommonEvents', src: 'CommonEvents.json' },
    { name: '$dataSystem',       src: 'System.json'       },
    { name: '$dataMapInfos',     src: 'MapInfos.json'     }
];

DataManager.loadDatabase = function() {
    var test = this.isBattleTest() || this.isEventTest();
    var prefix = test ? 'Test_' : '';
    for (var i = 0; i < this._databaseFiles.length; i++) {
        var name = this._databaseFiles[i].name;
        var src = this._databaseFiles[i].src;
        this.loadDataFile(name, prefix + src);
    }
    if (this.isEventTest()) {
        this.loadDataFile('$testEvent', prefix + 'Event.json');
    }
};

DataManager.loadDataFile = function(name, src) {
    var xhr = new XMLHttpRequest();
    var url = 'data/' + src;
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
        if (xhr.status < 400) {
            window[name] = JSON.parse(xhr.responseText);
            DataManager.onLoad(window[name]);
        }
    };
    xhr.onerror = this._mapLoader || function() {
        DataManager._errorUrl = DataManager._errorUrl || url;
    };
    window[name] = null;
    xhr.send();
};

DataManager.isDatabaseLoaded = function() {
    this.checkError();
    for (var i = 0; i < this._databaseFiles.length; i++) {
        if (!window[this._databaseFiles[i].name]) {
            return false;
        }
    }
    return true;
};

DataManager.loadMapData = function(mapId) {
    if (mapId > 0) {
        var filename = 'Map%1.json'.format(mapId.padZero(3));
        this._mapLoader = ResourceHandler.createLoader('data/' + filename, this.loadDataFile.bind(this, '$dataMap', filename));
        this.loadDataFile('$dataMap', filename);
    } else {
        this.makeEmptyMap();
    }
};

DataManager.makeEmptyMap = function() {
    $dataMap = {};
    $dataMap.data = [];
    $dataMap.events = [];
    $dataMap.width = 100;
    $dataMap.height = 100;
    $dataMap.scrollType = 3;
};

DataManager.isMapLoaded = function() {
    this.checkError();
    return !!$dataMap;
};

DataManager.onLoad = function(object) {
    var array;
    if (object === $dataMap) {
        this.extractMetadata(object);
        array = object.events;
    } else {
        array = object;
    }
    if (Array.isArray(array)) {
        for (var i = 0; i < array.length; i++) {
            var data = array[i];
            if (data && data.note !== undefined) {
                this.extractMetadata(data);
            }
        }
    }
    if (object === $dataSystem) {
        Decrypter.hasEncryptedImages = !!object.hasEncryptedImages;
        Decrypter.hasEncryptedAudio = !!object.hasEncryptedAudio;
        Scene_Boot.loadSystemImages();
    }
};

DataManager.extractMetadata = function(data) {
    var re = /<([^<>:]+)(:?)([^>]*)>/g;
    data.meta = {};
    for (;;) {
        var match = re.exec(data.note);
        if (match) {
            if (match[2] === ':') {
                data.meta[match[1]] = match[3];
            } else {
                data.meta[match[1]] = true;
            }
        } else {
            break;
        }
    }
};

DataManager.checkError = function() {
    if (DataManager._errorUrl) {
        throw new Error('Failed to load: ' + DataManager._errorUrl);
    }
};

DataManager.isBattleTest = function() {
    return Utils.isOptionValid('btest');
};

DataManager.isEventTest = function() {
    return Utils.isOptionValid('etest');
};

DataManager.isSkill = function(item) {
    return item && $dataSkills.contains(item);
};

DataManager.isItem = function(item) {
    return item && $dataItems.contains(item);
};

DataManager.isWeapon = function(item) {
    return item && $dataWeapons.contains(item);
};

DataManager.isArmor = function(item) {
    return item && $dataArmors.contains(item);
};

DataManager.createGameObjects = function() {
    $gameTemp          = new Game_Temp();
    $gameSystem        = new Game_System();
    $gameScreen        = new Game_Screen();
    $gameTimer         = new Game_Timer();
    $gameMessage       = new Game_Message();
    $gameSwitches      = new Game_Switches();
    $gameVariables     = new Game_Variables();
    $gameSelfSwitches  = new Game_SelfSwitches();
    $gameActors        = new Game_Actors();
    $gameParty         = new Game_Party();
    $gameTroop         = new Game_Troop();
    $gameMap           = new Game_Map();
    $gamePlayer        = new Game_Player();
};

DataManager.setupNewGame = function() {
    this.createGameObjects();
    this.selectSavefileForNewGame();
    $gameParty.setupStartingMembers();
    $gamePlayer.reserveTransfer($dataSystem.startMapId,
        $dataSystem.startX, $dataSystem.startY);
    Graphics.frameCount = 0;
};

DataManager.setupBattleTest = function() {
    this.createGameObjects();
    $gameParty.setupBattleTest();
    BattleManager.setup($dataSystem.testTroopId, true, false);
    BattleManager.setBattleTest(true);
    BattleManager.playBattleBgm();
};

DataManager.setupEventTest = function() {
    this.createGameObjects();
    this.selectSavefileForNewGame();
    $gameParty.setupStartingMembers();
    $gamePlayer.reserveTransfer(-1, 8, 6);
    $gamePlayer.setTransparent(false);
};

DataManager.loadGlobalInfo = function() {
    var json;
    try {
        json = StorageManager.load(0);
    } catch (e) {
        console.error(e);
        return [];
    }
    if (json) {
        var globalInfo = JSON.parse(json);
        for (var i = 1; i <= this.maxSavefiles(); i++) {
            if (!StorageManager.exists(i)) {
                delete globalInfo[i];
            }
        }
        return globalInfo;
    } else {
        return [];
    }
};

DataManager.saveGlobalInfo = function(info) {
    StorageManager.save(0, JSON.stringify(info));
};

DataManager.isThisGameFile = function(savefileId) {
    var globalInfo = this.loadGlobalInfo();
    if (globalInfo && globalInfo[savefileId]) {
        if (StorageManager.isLocalMode()) {
            return true;
        } else {
            var savefile = globalInfo[savefileId];
            return (savefile.globalId === this._globalId &&
                    savefile.title === $dataSystem.gameTitle);
        }
    } else {
        return false;
    }
};

DataManager.isAnySavefileExists = function() {
    var globalInfo = this.loadGlobalInfo();
    if (globalInfo) {
        for (var i = 1; i < globalInfo.length; i++) {
            if (this.isThisGameFile(i)) {
                return true;
            }
        }
    }
    return false;
};

DataManager.latestSavefileId = function() {
    var globalInfo = this.loadGlobalInfo();
    var savefileId = 1;
    var timestamp = 0;
    if (globalInfo) {
        for (var i = 1; i < globalInfo.length; i++) {
            if (this.isThisGameFile(i) && globalInfo[i].timestamp > timestamp) {
                timestamp = globalInfo[i].timestamp;
                savefileId = i;
            }
        }
    }
    return savefileId;
};

DataManager.loadAllSavefileImages = function() {
    var globalInfo = this.loadGlobalInfo();
    if (globalInfo) {
        for (var i = 1; i < globalInfo.length; i++) {
            if (this.isThisGameFile(i)) {
                var info = globalInfo[i];
                this.loadSavefileImages(info);
            }
        }
    }
};

DataManager.loadSavefileImages = function(info) {
    if (info.characters) {
        for (var i = 0; i < info.characters.length; i++) {
            ImageManager.reserveCharacter(info.characters[i][0]);
        }
    }
    if (info.faces) {
        for (var j = 0; j < info.faces.length; j++) {
            ImageManager.reserveFace(info.faces[j][0]);
        }
    }
};

DataManager.maxSavefiles = function() {
    return 20;
};

DataManager.saveGame = function(savefileId) {
    try {
        StorageManager.backup(savefileId);
        return this.saveGameWithoutRescue(savefileId);
    } catch (e) {
        console.error(e);
        try {
            StorageManager.remove(savefileId);
            StorageManager.restoreBackup(savefileId);
        } catch (e2) {
        }
        return false;
    }
};

DataManager.loadGame = function(savefileId) {
    try {
        return this.loadGameWithoutRescue(savefileId);
    } catch (e) {
        console.error(e);
        return false;
    }
};

DataManager.loadSavefileInfo = function(savefileId) {
    var globalInfo = this.loadGlobalInfo();
    return (globalInfo && globalInfo[savefileId]) ? globalInfo[savefileId] : null;
};

DataManager.lastAccessedSavefileId = function() {
    return this._lastAccessedId;
};

DataManager.saveGameWithoutRescue = function(savefileId) {
    var json = JsonEx.stringify(this.makeSaveContents());
    if (json.length >= 200000) {
        console.warn('Save data too big!');
    }
    StorageManager.save(savefileId, json);
    this._lastAccessedId = savefileId;
    var globalInfo = this.loadGlobalInfo() || [];
    globalInfo[savefileId] = this.makeSavefileInfo();
    this.saveGlobalInfo(globalInfo);
    return true;
};

DataManager.loadGameWithoutRescue = function(savefileId) {
    var globalInfo = this.loadGlobalInfo();
    if (this.isThisGameFile(savefileId)) {
        var json = StorageManager.load(savefileId);
        this.createGameObjects();
        this.extractSaveContents(JsonEx.parse(json));
        this._lastAccessedId = savefileId;
        return true;
    } else {
        return false;
    }
};

DataManager.selectSavefileForNewGame = function() {
    var globalInfo = this.loadGlobalInfo();
    this._lastAccessedId = 1;
    if (globalInfo) {
        var numSavefiles = Math.max(0, globalInfo.length - 1);
        if (numSavefiles < this.maxSavefiles()) {
            this._lastAccessedId = numSavefiles + 1;
        } else {
            var timestamp = Number.MAX_VALUE;
            for (var i = 1; i < globalInfo.length; i++) {
                if (!globalInfo[i]) {
                    this._lastAccessedId = i;
                    break;
                }
                if (globalInfo[i].timestamp < timestamp) {
                    timestamp = globalInfo[i].timestamp;
                    this._lastAccessedId = i;
                }
            }
        }
    }
};

DataManager.makeSavefileInfo = function() {
    var info = {};
    info.globalId   = this._globalId;
    info.title      = $dataSystem.gameTitle;
    info.characters = $gameParty.charactersForSavefile();
    info.faces      = $gameParty.facesForSavefile();
    info.playtime   = $gameSystem.playtimeText();
    info.timestamp  = Date.now();
	info.katagaki  = $gameVariables.value(519);
    info.katagaki2  = $gameVariables.value(520);
	info.hard  = $gameVariables.value(216);
	info.keikanissu  = $gameVariables.value(160);
	info.youbi  = $gameVariables.value(6);
	info.jikan  = $gameVariables.value(4);
    return info;
};

DataManager.makeSaveContents = function() {
    // A save data does not contain $gameTemp, $gameMessage, and $gameTroop.
    var contents = {};
    contents.system       = $gameSystem;
    contents.screen       = $gameScreen;
    contents.timer        = $gameTimer;
    contents.switches     = $gameSwitches;
    contents.variables    = $gameVariables;
    contents.selfSwitches = $gameSelfSwitches;
    contents.actors       = $gameActors;
    contents.party        = $gameParty;
    contents.map          = $gameMap;
    contents.player       = $gamePlayer;
    return contents;
};

DataManager.extractSaveContents = function(contents) {
    $gameSystem        = contents.system;
    $gameScreen        = contents.screen;
    $gameTimer         = contents.timer;
    $gameSwitches      = contents.switches;
    $gameVariables     = contents.variables;
    $gameSelfSwitches  = contents.selfSwitches;
    $gameActors        = contents.actors;
    $gameParty         = contents.party;
    $gameMap           = contents.map;
    $gamePlayer        = contents.player;
};

//-----------------------------------------------------------------------------
// ConfigManager
//
// The static class that manages the configuration data.

function ConfigManager() {
    throw new Error('This is a static class');
}

ConfigManager.alwaysDash        = false;
ConfigManager.commandRemember   = false;

Object.defineProperty(ConfigManager, 'bgmVolume', {
    get: function() {
        return AudioManager._bgmVolume;
    },
    set: function(value) {
        AudioManager.bgmVolume = value;
    },
    configurable: true
});

Object.defineProperty(ConfigManager, 'bgsVolume', {
    get: function() {
        return AudioManager.bgsVolume;
    },
    set: function(value) {
        AudioManager.bgsVolume = value;
    },
    configurable: true
});

Object.defineProperty(ConfigManager, 'meVolume', {
    get: function() {
        return AudioManager.meVolume;
    },
    set: function(value) {
        AudioManager.meVolume = value;
    },
    configurable: true
});

Object.defineProperty(ConfigManager, 'seVolume', {
    get: function() {
        return AudioManager.seVolume;
    },
    set: function(value) {
        AudioManager.seVolume = value;
    },
    configurable: true
});

ConfigManager.load = function() {
    var json;
    var config = {};
    try {
        json = StorageManager.load(-1);
    } catch (e) {
        console.error(e);
    }
    if (json) {
        config = JSON.parse(json);
    }
    this.applyData(config);
};

ConfigManager.save = function() {
    StorageManager.save(-1, JSON.stringify(this.makeData()));
};

ConfigManager.makeData = function() {
    var config = {};
    config.alwaysDash = this.alwaysDash;
    config.commandRemember = this.commandRemember;
    config.bgmVolume = this.bgmVolume;
    config.bgsVolume = this.bgsVolume;
    config.meVolume = this.meVolume;
    config.seVolume = this.seVolume;
    return config;
};

ConfigManager.applyData = function(config) {
    this.alwaysDash = this.readFlag(config, 'alwaysDash');
    this.commandRemember = this.readFlag(config, 'commandRemember');
    this.bgmVolume = this.readVolume(config, 'bgmVolume');
    this.bgsVolume = this.readVolume(config, 'bgsVolume');
    this.meVolume = this.readVolume(config, 'meVolume');
    this.seVolume = this.readVolume(config, 'seVolume');
};

ConfigManager.readFlag = function(config, name) {
    return !!config[name];
};

ConfigManager.readVolume = function(config, name) {
    var value = config[name];
    if (value !== undefined) {
        return Number(value).clamp(0, 100);
    } else {
        return 100;
    }
};

//-----------------------------------------------------------------------------
// StorageManager
//
// The static class that manages storage for saving game data.

function StorageManager() {
    throw new Error('This is a static class');
}

StorageManager.save = function(savefileId, json) {
    if (this.isLocalMode()) {
        this.saveToLocalFile(savefileId, json);
    } else {
        this.saveToWebStorage(savefileId, json);
    }
};

StorageManager.load = function(savefileId) {
    if (this.isLocalMode()) {
        return this.loadFromLocalFile(savefileId);
    } else {
        return this.loadFromWebStorage(savefileId);
    }
};

StorageManager.exists = function(savefileId) {
    if (this.isLocalMode()) {
        return this.localFileExists(savefileId);
    } else {
        return this.webStorageExists(savefileId);
    }
};

StorageManager.remove = function(savefileId) {
    if (this.isLocalMode()) {
        this.removeLocalFile(savefileId);
    } else {
        this.removeWebStorage(savefileId);
    }
};

StorageManager.backup = function(savefileId) {
    if (this.exists(savefileId)) {
        if (this.isLocalMode()) {
            var data = this.loadFromLocalFile(savefileId);
            var compressed = LZString.compressToBase64(data);
            var fs = require('fs');
            var dirPath = this.localFileDirectoryPath();
            var filePath = this.localFilePath(savefileId) + ".bak";
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }
            fs.writeFileSync(filePath, compressed);
        } else {
            var data = this.loadFromWebStorage(savefileId);
            var compressed = LZString.compressToBase64(data);
            var key = this.webStorageKey(savefileId) + "bak";
            localStorage.setItem(key, compressed);
        }
    }
};

StorageManager.backupExists = function(savefileId) {
    if (this.isLocalMode()) {
        return this.localFileBackupExists(savefileId);
    } else {
        return this.webStorageBackupExists(savefileId);
    }
};

StorageManager.cleanBackup = function(savefileId) {
	if (this.backupExists(savefileId)) {
		if (this.isLocalMode()) {
			var fs = require('fs');
            var dirPath = this.localFileDirectoryPath();
            var filePath = this.localFilePath(savefileId);
            fs.unlinkSync(filePath + ".bak");
		} else {
		    var key = this.webStorageKey(savefileId);
			localStorage.removeItem(key + "bak");
		}
	}
};

StorageManager.restoreBackup = function(savefileId) {
    if (this.backupExists(savefileId)) {
        if (this.isLocalMode()) {
            var data = this.loadFromLocalBackupFile(savefileId);
            var compressed = LZString.compressToBase64(data);
            var fs = require('fs');
            var dirPath = this.localFileDirectoryPath();
            var filePath = this.localFilePath(savefileId);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }
            fs.writeFileSync(filePath, compressed);
            fs.unlinkSync(filePath + ".bak");
        } else {
            var data = this.loadFromWebStorageBackup(savefileId);
            var compressed = LZString.compressToBase64(data);
            var key = this.webStorageKey(savefileId);
            localStorage.setItem(key, compressed);
            localStorage.removeItem(key + "bak");
        }
    }
};

StorageManager.isLocalMode = function() {
    return Utils.isNwjs();
};

StorageManager.saveToLocalFile = function(savefileId, json) {
    var data = LZString.compressToBase64(json);
    var fs = require('fs');
    var dirPath = this.localFileDirectoryPath();
    var filePath = this.localFilePath(savefileId);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    fs.writeFileSync(filePath, data);
};

StorageManager.loadFromLocalFile = function(savefileId) {
    var data = null;
    var fs = require('fs');
    var filePath = this.localFilePath(savefileId);
    if (fs.existsSync(filePath)) {
        data = fs.readFileSync(filePath, { encoding: 'utf8' });
    }
    return LZString.decompressFromBase64(data);
};

StorageManager.loadFromLocalBackupFile = function(savefileId) {
    var data = null;
    var fs = require('fs');
    var filePath = this.localFilePath(savefileId) + ".bak";
    if (fs.existsSync(filePath)) {
        data = fs.readFileSync(filePath, { encoding: 'utf8' });
    }
    return LZString.decompressFromBase64(data);
};

StorageManager.localFileBackupExists = function(savefileId) {
    var fs = require('fs');
    return fs.existsSync(this.localFilePath(savefileId) + ".bak");
};

StorageManager.localFileExists = function(savefileId) {
    var fs = require('fs');
    return fs.existsSync(this.localFilePath(savefileId));
};

StorageManager.removeLocalFile = function(savefileId) {
    var fs = require('fs');
    var filePath = this.localFilePath(savefileId);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

StorageManager.saveToWebStorage = function(savefileId, json) {
    var key = this.webStorageKey(savefileId);
    var data = LZString.compressToBase64(json);
    localStorage.setItem(key, data);
};

StorageManager.loadFromWebStorage = function(savefileId) {
    var key = this.webStorageKey(savefileId);
    var data = localStorage.getItem(key);
    return LZString.decompressFromBase64(data);
};

StorageManager.loadFromWebStorageBackup = function(savefileId) {
    var key = this.webStorageKey(savefileId) + "bak";
    var data = localStorage.getItem(key);
    return LZString.decompressFromBase64(data);
};

StorageManager.webStorageBackupExists = function(savefileId) {
    var key = this.webStorageKey(savefileId) + "bak";
    return !!localStorage.getItem(key);
};

StorageManager.webStorageExists = function(savefileId) {
    var key = this.webStorageKey(savefileId);
    return !!localStorage.getItem(key);
};

StorageManager.removeWebStorage = function(savefileId) {
    var key = this.webStorageKey(savefileId);
    localStorage.removeItem(key);
};

StorageManager.localFileDirectoryPath = function() {
    var path = require('path');

    var base = path.dirname(process.mainModule.filename);
    return path.join(base, 'save/');
};

StorageManager.localFilePath = function(savefileId) {
    var name;
    if (savefileId < 0) {
        name = 'config.rpgsave';
    } else if (savefileId === 0) {
        name = 'global.rpgsave';
    } else {
        name = 'file%1.rpgsave'.format(savefileId);
    }
    return this.localFileDirectoryPath() + name;
};

StorageManager.webStorageKey = function(savefileId) {
    if (savefileId < 0) {
        return 'RPG Config';
    } else if (savefileId === 0) {
        return 'RPG Global';
    } else {
        return 'RPG File%1'.format(savefileId);
    }
};

//-----------------------------------------------------------------------------
// ImageManager
//
// The static class that loads images, creates bitmap objects and retains them.

function ImageManager() {
    throw new Error('This is a static class');
}

ImageManager.cache = new CacheMap(ImageManager);

ImageManager._imageCache = new ImageCache();
ImageManager._requestQueue = new RequestQueue();
ImageManager._systemReservationId = Utils.generateRuntimeId();

ImageManager._generateCacheKey = function(path, hue){
    return  path + ':' + hue;
};

ImageManager.loadAnimation = function(filename, hue) {
    return this.loadBitmap('img/animations/', filename, hue, true);
};

ImageManager.loadBattleback1 = function(filename, hue) {
    return this.loadBitmap('img/battlebacks1/', filename, hue, true);
};

ImageManager.loadBattleback2 = function(filename, hue) {
    return this.loadBitmap('img/battlebacks2/', filename, hue, true);
};

ImageManager.loadEnemy = function(filename, hue) {
    return this.loadBitmap('img/enemies/', filename, hue, true);
};

ImageManager.loadCharacter = function(filename, hue) {
    return this.loadBitmap('img/characters/', filename, hue, false);
};

ImageManager.loadFace = function(filename, hue) {
    return this.loadBitmap('img/faces/', filename, hue, true);
};

ImageManager.loadParallax = function(filename, hue) {
    return this.loadBitmap('img/parallaxes/', filename, hue, true);
};

ImageManager.loadPicture = function(filename, hue) {
    return this.loadBitmap('img/pictures/', filename, hue, true);
};

ImageManager.loadSvActor = function(filename, hue) {
    return this.loadBitmap('img/sv_actors/', filename, hue, false);
};

ImageManager.loadSvEnemy = function(filename, hue) {
    return this.loadBitmap('img/sv_enemies/', filename, hue, true);
};

ImageManager.loadSystem = function(filename, hue) {
    return this.loadBitmap('img/system/', filename, hue, false);
};

ImageManager.loadTileset = function(filename, hue) {
    return this.loadBitmap('img/tilesets/', filename, hue, false);
};

ImageManager.loadTitle1 = function(filename, hue) {
    return this.loadBitmap('img/titles1/', filename, hue, true);
};

ImageManager.loadTitle2 = function(filename, hue) {
    return this.loadBitmap('img/titles2/', filename, hue, true);
};

ImageManager.loadBitmap = function(folder, filename, hue, smooth) {
    if (filename) {
        var path = folder + encodeURIComponent(filename) + '.png';
        var bitmap = this.loadNormalBitmap(path, hue || 0);
        bitmap.smooth = smooth;
        return bitmap;
    } else {
        return this.loadEmptyBitmap();
    }
};

ImageManager.loadEmptyBitmap = function() {
    var empty = this._imageCache.get('empty');
    if(!empty){
        empty = new Bitmap();
        this._imageCache.add('empty', empty);
        this._imageCache.reserve('empty', empty, this._systemReservationId);
    }

    return empty;
};

ImageManager.loadNormalBitmap = function(path, hue) {
    var key = this._generateCacheKey(path, hue);
    var bitmap = this._imageCache.get(key);
    if (!bitmap) {
        bitmap = Bitmap.load(decodeURIComponent(path));
        bitmap.addLoadListener(function() {
            bitmap.rotateHue(hue);
        });
        this._imageCache.add(key, bitmap);
    }else if(!bitmap.isReady()){
        bitmap.decode();
    }

    return bitmap;
};

ImageManager.clear = function() {
    this._imageCache = new ImageCache();
};

ImageManager.isReady = function() {
    return this._imageCache.isReady();
};

ImageManager.isObjectCharacter = function(filename) {
    var sign = filename.match(/^[\!\$]+/);
    return sign && sign[0].contains('!');
};

ImageManager.isBigCharacter = function(filename) {
    var sign = filename.match(/^[\!\$]+/);
    return sign && sign[0].contains('$');
};

ImageManager.isZeroParallax = function(filename) {
    return filename.charAt(0) === '!';
};


ImageManager.reserveAnimation = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/animations/', filename, hue, true, reservationId);
};

ImageManager.reserveBattleback1 = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/battlebacks1/', filename, hue, true, reservationId);
};

ImageManager.reserveBattleback2 = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/battlebacks2/', filename, hue, true, reservationId);
};

ImageManager.reserveEnemy = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/enemies/', filename, hue, true, reservationId);
};

ImageManager.reserveCharacter = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/characters/', filename, hue, false, reservationId);
};

ImageManager.reserveFace = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/faces/', filename, hue, true, reservationId);
};

ImageManager.reserveParallax = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/parallaxes/', filename, hue, true, reservationId);
};

ImageManager.reservePicture = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/pictures/', filename, hue, true, reservationId);
};

ImageManager.reserveSvActor = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/sv_actors/', filename, hue, false, reservationId);
};

ImageManager.reserveSvEnemy = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/sv_enemies/', filename, hue, true, reservationId);
};

ImageManager.reserveSystem = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/system/', filename, hue, false, reservationId || this._systemReservationId);
};

ImageManager.reserveTileset = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/tilesets/', filename, hue, false, reservationId);
};

ImageManager.reserveTitle1 = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/titles1/', filename, hue, true, reservationId);
};

ImageManager.reserveTitle2 = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/titles2/', filename, hue, true, reservationId);
};

ImageManager.reserveBitmap = function(folder, filename, hue, smooth, reservationId) {
    if (filename) {
        var path = folder + encodeURIComponent(filename) + '.png';
        var bitmap = this.reserveNormalBitmap(path, hue || 0, reservationId || this._defaultReservationId);
        bitmap.smooth = smooth;
        return bitmap;
    } else {
        return this.loadEmptyBitmap();
    }
};

ImageManager.reserveNormalBitmap = function(path, hue, reservationId){
    var bitmap = this.loadNormalBitmap(path, hue);
    this._imageCache.reserve(this._generateCacheKey(path, hue), bitmap, reservationId);

    return bitmap;
};

ImageManager.releaseReservation = function(reservationId){
    this._imageCache.releaseReservation(reservationId);
};

ImageManager.setDefaultReservationId = function(reservationId){
    this._defaultReservationId = reservationId;
};


ImageManager.requestAnimation = function(filename, hue) {
    return this.requestBitmap('img/animations/', filename, hue, true);
};

ImageManager.requestBattleback1 = function(filename, hue) {
    return this.requestBitmap('img/battlebacks1/', filename, hue, true);
};

ImageManager.requestBattleback2 = function(filename, hue) {
    return this.requestBitmap('img/battlebacks2/', filename, hue, true);
};

ImageManager.requestEnemy = function(filename, hue) {
    return this.requestBitmap('img/enemies/', filename, hue, true);
};

ImageManager.requestCharacter = function(filename, hue) {
    return this.requestBitmap('img/characters/', filename, hue, false);
};

ImageManager.requestFace = function(filename, hue) {
    return this.requestBitmap('img/faces/', filename, hue, true);
};

ImageManager.requestParallax = function(filename, hue) {
    return this.requestBitmap('img/parallaxes/', filename, hue, true);
};

ImageManager.requestPicture = function(filename, hue) {
    return this.requestBitmap('img/pictures/', filename, hue, true);
};

ImageManager.requestSvActor = function(filename, hue) {
    return this.requestBitmap('img/sv_actors/', filename, hue, false);
};

ImageManager.requestSvEnemy = function(filename, hue) {
    return this.requestBitmap('img/sv_enemies/', filename, hue, true);
};

ImageManager.requestSystem = function(filename, hue) {
    return this.requestBitmap('img/system/', filename, hue, false);
};

ImageManager.requestTileset = function(filename, hue) {
    return this.requestBitmap('img/tilesets/', filename, hue, false);
};

ImageManager.requestTitle1 = function(filename, hue) {
    return this.requestBitmap('img/titles1/', filename, hue, true);
};

ImageManager.requestTitle2 = function(filename, hue) {
    return this.requestBitmap('img/titles2/', filename, hue, true);
};

ImageManager.requestBitmap = function(folder, filename, hue, smooth) {
    if (filename) {
        var path = folder + encodeURIComponent(filename) + '.png';
        var bitmap = this.requestNormalBitmap(path, hue || 0);
        bitmap.smooth = smooth;
        return bitmap;
    } else {
        return this.loadEmptyBitmap();
    }
};

ImageManager.requestNormalBitmap = function(path, hue){
    var key = this._generateCacheKey(path, hue);
    var bitmap = this._imageCache.get(key);
    if(!bitmap){
        bitmap = Bitmap.request(path);
        bitmap.addLoadListener(function(){
            bitmap.rotateHue(hue);
        });
        this._imageCache.add(key, bitmap);
        this._requestQueue.enqueue(key, bitmap);
    }else{
        this._requestQueue.raisePriority(key);
    }

    return bitmap;
};

ImageManager.update = function(){
    this._requestQueue.update();
};

ImageManager.clearRequest = function(){
    this._requestQueue.clear();
};

//-----------------------------------------------------------------------------
// AudioManager
//
// The static class that handles BGM, BGS, ME and SE.

function AudioManager() {
    throw new Error('This is a static class');
}

AudioManager._masterVolume   = 1;   // (min: 0, max: 1)
AudioManager._bgmVolume      = 100;
AudioManager._bgsVolume      = 100;
AudioManager._meVolume       = 100;
AudioManager._seVolume       = 100;
AudioManager._currentBgm     = null;
AudioManager._currentBgs     = null;
AudioManager._bgmBuffer      = null;
AudioManager._bgsBuffer      = null;
AudioManager._meBuffer       = null;
AudioManager._seBuffers      = [];
AudioManager._staticBuffers  = [];
AudioManager._replayFadeTime = 0.5;
AudioManager._path           = 'audio/';
AudioManager._blobUrl        = null;

Object.defineProperty(AudioManager, 'masterVolume', {
    get: function() {
        return this._masterVolume;
    },
    set: function(value) {
        this._masterVolume = value;
        WebAudio.setMasterVolume(this._masterVolume);
        Graphics.setVideoVolume(this._masterVolume);
    },
    configurable: true
});

Object.defineProperty(AudioManager, 'bgmVolume', {
    get: function() {
        return this._bgmVolume;
    },
    set: function(value) {
        this._bgmVolume = value;
        this.updateBgmParameters(this._currentBgm);
    },
    configurable: true
});

Object.defineProperty(AudioManager, 'bgsVolume', {
    get: function() {
        return this._bgsVolume;
    },
    set: function(value) {
        this._bgsVolume = value;
        this.updateBgsParameters(this._currentBgs);
    },
    configurable: true
});

Object.defineProperty(AudioManager, 'meVolume', {
    get: function() {
        return this._meVolume;
    },
    set: function(value) {
        this._meVolume = value;
        this.updateMeParameters(this._currentMe);
    },
    configurable: true
});

Object.defineProperty(AudioManager, 'seVolume', {
    get: function() {
        return this._seVolume;
    },
    set: function(value) {
        this._seVolume = value;
    },
    configurable: true
});

AudioManager.playBgm = function(bgm, pos) {
    if (this.isCurrentBgm(bgm)) {
        this.updateBgmParameters(bgm);
    } else {
        this.stopBgm();
        if (bgm.name) { 
            if(Decrypter.hasEncryptedAudio && this.shouldUseHtml5Audio()){
                this.playEncryptedBgm(bgm, pos);
            }
            else {
                this._bgmBuffer = this.createBuffer('bgm', bgm.name);
                this.updateBgmParameters(bgm);
                if (!this._meBuffer) {
                    this._bgmBuffer.play(true, pos || 0);
                }
            }
        }
    }
    this.updateCurrentBgm(bgm, pos);
};

AudioManager.playEncryptedBgm = function(bgm, pos) {
    var ext = this.audioFileExt();
    var url = this._path + 'bgm/' + encodeURIComponent(bgm.name) + ext;
    url = Decrypter.extToEncryptExt(url);
    Decrypter.decryptHTML5Audio(url, bgm, pos);
};

AudioManager.createDecryptBuffer = function(url, bgm, pos){
    this._blobUrl = url;
    this._bgmBuffer = this.createBuffer('bgm', bgm.name);
    this.updateBgmParameters(bgm);
    if (!this._meBuffer) {
        this._bgmBuffer.play(true, pos || 0);
    }
    this.updateCurrentBgm(bgm, pos);
};

AudioManager.replayBgm = function(bgm) {
    if (this.isCurrentBgm(bgm)) {
        this.updateBgmParameters(bgm);
    } else {
        this.playBgm(bgm, bgm.pos);
        if (this._bgmBuffer) {
            this._bgmBuffer.fadeIn(this._replayFadeTime);
        }
    }
};

AudioManager.isCurrentBgm = function(bgm) {
    return (this._currentBgm && this._bgmBuffer &&
            this._currentBgm.name === bgm.name);
};

AudioManager.updateBgmParameters = function(bgm) {
    this.updateBufferParameters(this._bgmBuffer, this._bgmVolume, bgm);
};

AudioManager.updateCurrentBgm = function(bgm, pos) {
    this._currentBgm = {
        name: bgm.name,
        volume: bgm.volume,
        pitch: bgm.pitch,
        pan: bgm.pan,
        pos: pos
    };
};

AudioManager.stopBgm = function() {
    if (this._bgmBuffer) {
        this._bgmBuffer.stop();
        this._bgmBuffer = null;
        this._currentBgm = null;
    }
};

AudioManager.fadeOutBgm = function(duration) {
    if (this._bgmBuffer && this._currentBgm) {
        this._bgmBuffer.fadeOut(duration);
        this._currentBgm = null;
    }
};

AudioManager.fadeInBgm = function(duration) {
    if (this._bgmBuffer && this._currentBgm) {
        this._bgmBuffer.fadeIn(duration);
    }
};

AudioManager.playBgs = function(bgs, pos) {
    if (this.isCurrentBgs(bgs)) {
        this.updateBgsParameters(bgs);
    } else {
        this.stopBgs();
        if (bgs.name) {
            this._bgsBuffer = this.createBuffer('bgs', bgs.name);
            this.updateBgsParameters(bgs);
            this._bgsBuffer.play(true, pos || 0);
        }
    }
    this.updateCurrentBgs(bgs, pos);
};

AudioManager.replayBgs = function(bgs) {
    if (this.isCurrentBgs(bgs)) {
        this.updateBgsParameters(bgs);
    } else {
        this.playBgs(bgs, bgs.pos);
        if (this._bgsBuffer) {
            this._bgsBuffer.fadeIn(this._replayFadeTime);
        }
    }
};

AudioManager.isCurrentBgs = function(bgs) {
    return (this._currentBgs && this._bgsBuffer &&
            this._currentBgs.name === bgs.name);
};

AudioManager.updateBgsParameters = function(bgs) {
    this.updateBufferParameters(this._bgsBuffer, this._bgsVolume, bgs);
};

AudioManager.updateCurrentBgs = function(bgs, pos) {
    this._currentBgs = {
        name: bgs.name,
        volume: bgs.volume,
        pitch: bgs.pitch,
        pan: bgs.pan,
        pos: pos
    };
};

AudioManager.stopBgs = function() {
    if (this._bgsBuffer) {
        this._bgsBuffer.stop();
        this._bgsBuffer = null;
        this._currentBgs = null;
    }
};

AudioManager.fadeOutBgs = function(duration) {
    if (this._bgsBuffer && this._currentBgs) {
        this._bgsBuffer.fadeOut(duration);
        this._currentBgs = null;
    }
};

AudioManager.fadeInBgs = function(duration) {
    if (this._bgsBuffer && this._currentBgs) {
        this._bgsBuffer.fadeIn(duration);
    }
};

AudioManager.playMe = function(me) {
    this.stopMe();
    if (me.name) {
        if (this._bgmBuffer && this._currentBgm) {
            this._currentBgm.pos = this._bgmBuffer.seek();
            this._bgmBuffer.stop();
        }
        this._meBuffer = this.createBuffer('me', me.name);
        this.updateMeParameters(me);
        this._meBuffer.play(false);
        this._meBuffer.addStopListener(this.stopMe.bind(this));
    }
};

AudioManager.updateMeParameters = function(me) {
    this.updateBufferParameters(this._meBuffer, this._meVolume, me);
};

AudioManager.fadeOutMe = function(duration) {
    if (this._meBuffer) {
        this._meBuffer.fadeOut(duration);
    }
};

AudioManager.stopMe = function() {
    if (this._meBuffer) {
        this._meBuffer.stop();
        this._meBuffer = null;
        if (this._bgmBuffer && this._currentBgm && !this._bgmBuffer.isPlaying()) {
            this._bgmBuffer.play(true, this._currentBgm.pos);
            this._bgmBuffer.fadeIn(this._replayFadeTime);
        }
    }
};

AudioManager.playSe = function(se) {
    if (se.name) {
        this._seBuffers = this._seBuffers.filter(function(audio) {
            return audio.isPlaying();
        });
        var buffer = this.createBuffer('se', se.name);
        this.updateSeParameters(buffer, se);
        buffer.play(false);
        this._seBuffers.push(buffer);
    }
};

AudioManager.updateSeParameters = function(buffer, se) {
    this.updateBufferParameters(buffer, this._seVolume, se);
};

AudioManager.stopSe = function() {
    this._seBuffers.forEach(function(buffer) {
        buffer.stop();
    });
    this._seBuffers = [];
};

AudioManager.playStaticSe = function(se) {
    if (se.name) {
        this.loadStaticSe(se);
        for (var i = 0; i < this._staticBuffers.length; i++) {
            var buffer = this._staticBuffers[i];
            if (buffer._reservedSeName === se.name) {
                buffer.stop();
                this.updateSeParameters(buffer, se);
                buffer.play(false);
                break;
            }
        }
    }
};

AudioManager.loadStaticSe = function(se) {
    if (se.name && !this.isStaticSe(se)) {
        var buffer = this.createBuffer('se', se.name);
        buffer._reservedSeName = se.name;
        this._staticBuffers.push(buffer);
        if (this.shouldUseHtml5Audio()) {
            Html5Audio.setStaticSe(buffer._url);
        }
    }
};

AudioManager.isStaticSe = function(se) {
    for (var i = 0; i < this._staticBuffers.length; i++) {
        var buffer = this._staticBuffers[i];
        if (buffer._reservedSeName === se.name) {
            return true;
        }
    }
    return false;
};

AudioManager.stopAll = function() {
    this.stopMe();
    this.stopBgm();
    this.stopBgs();
    this.stopSe();
};

AudioManager.saveBgm = function() {
    if (this._currentBgm) {
        var bgm = this._currentBgm;
        return {
            name: bgm.name,
            volume: bgm.volume,
            pitch: bgm.pitch,
            pan: bgm.pan,
            pos: this._bgmBuffer ? this._bgmBuffer.seek() : 0
        };
    } else {
        return this.makeEmptyAudioObject();
    }
};

AudioManager.saveBgs = function() {
    if (this._currentBgs) {
        var bgs = this._currentBgs;
        return {
            name: bgs.name,
            volume: bgs.volume,
            pitch: bgs.pitch,
            pan: bgs.pan,
            pos: this._bgsBuffer ? this._bgsBuffer.seek() : 0
        };
    } else {
        return this.makeEmptyAudioObject();
    }
};

AudioManager.makeEmptyAudioObject = function() {
    return { name: '', volume: 0, pitch: 0 };
};

AudioManager.createBuffer = function(folder, name) {
    var ext = this.audioFileExt();
    var url = this._path + folder + '/' + encodeURIComponent(name) + ext;
    if (this.shouldUseHtml5Audio() && folder === 'bgm') {
        if(this._blobUrl) Html5Audio.setup(this._blobUrl);
        else Html5Audio.setup(url);
        return Html5Audio;
    } else {
        return new WebAudio(url);
    }
};

AudioManager.updateBufferParameters = function(buffer, configVolume, audio) {
    if (buffer && audio) {
        buffer.volume = configVolume * (audio.volume || 0) / 10000;
        buffer.pitch = (audio.pitch || 0) / 100;
        buffer.pan = (audio.pan || 0) / 100;
    }
};

AudioManager.audioFileExt = function() {
    if (WebAudio.canPlayOgg() && !Utils.isMobileDevice()) {
        return '.ogg';
    } else {
        return '.m4a';
    }
};

AudioManager.shouldUseHtml5Audio = function() {
    // The only case where we wanted html5audio was android/ no encrypt
    // Atsuma-ru asked to force webaudio there too, so just return false for ALL    // return Utils.isAndroidChrome() && !Decrypter.hasEncryptedAudio;
 return false;
};

AudioManager.checkErrors = function() {
    this.checkWebAudioError(this._bgmBuffer);
    this.checkWebAudioError(this._bgsBuffer);
    this.checkWebAudioError(this._meBuffer);
    this._seBuffers.forEach(function(buffer) {
        this.checkWebAudioError(buffer);
    }.bind(this));
    this._staticBuffers.forEach(function(buffer) {
        this.checkWebAudioError(buffer);
    }.bind(this));
};

AudioManager.checkWebAudioError = function(webAudio) {
    if (webAudio && webAudio.isError()) {
        throw new Error('Failed to load: ' + webAudio.url);
    }
};

//-----------------------------------------------------------------------------
// SoundManager
//
// The static class that plays sound effects defined in the database.

function SoundManager() {
    throw new Error('This is a static class');
}

SoundManager.preloadImportantSounds = function() {
    this.loadSystemSound(0);
    this.loadSystemSound(1);
    this.loadSystemSound(2);
    this.loadSystemSound(3);
};

SoundManager.loadSystemSound = function(n) {
    if ($dataSystem) {
        AudioManager.loadStaticSe($dataSystem.sounds[n]);
    }
};

SoundManager.playSystemSound = function(n) {
    if ($dataSystem) {
        AudioManager.playStaticSe($dataSystem.sounds[n]);
    }
};

SoundManager.playCursor = function() {
    this.playSystemSound(0);
};

SoundManager.playOk = function() {
    this.playSystemSound(1);
};

SoundManager.playCancel = function() {
    this.playSystemSound(2);
};

SoundManager.playBuzzer = function() {
    this.playSystemSound(3);
};

SoundManager.playEquip = function() {
    this.playSystemSound(4);
};

SoundManager.playSave = function() {
    this.playSystemSound(5);
};

SoundManager.playLoad = function() {
    this.playSystemSound(6);
};

SoundManager.playBattleStart = function() {
    this.playSystemSound(7);
};

SoundManager.playEscape = function() {
    this.playSystemSound(8);
};

SoundManager.playEnemyAttack = function() {
    this.playSystemSound(9);
};

SoundManager.playEnemyDamage = function() {
    this.playSystemSound(10);
};

SoundManager.playEnemyCollapse = function() {
    this.playSystemSound(11);
};

SoundManager.playBossCollapse1 = function() {
    this.playSystemSound(12);
};

SoundManager.playBossCollapse2 = function() {
    this.playSystemSound(13);
};

SoundManager.playActorDamage = function() {
    this.playSystemSound(14);
};

SoundManager.playActorCollapse = function() {
    this.playSystemSound(15);
};

SoundManager.playRecovery = function() {
    this.playSystemSound(16);
};

SoundManager.playMiss = function() {
    this.playSystemSound(17);
};

SoundManager.playEvasion = function() {
    this.playSystemSound(18);
};

SoundManager.playMagicEvasion = function() {
    this.playSystemSound(19);
};

SoundManager.playReflection = function() {
    this.playSystemSound(20);
};

SoundManager.playShop = function() {
    this.playSystemSound(21);
};

SoundManager.playUseItem = function() {
    this.playSystemSound(22);
};

SoundManager.playUseSkill = function() {
    this.playSystemSound(23);
};

//-----------------------------------------------------------------------------
// TextManager
//
// The static class that handles terms and messages.

function TextManager() {
    throw new Error('This is a static class');
}

TextManager.basic = function(basicId) {
    return $dataSystem.terms.basic[basicId] || '';
};

TextManager.param = function(paramId) {
    return $dataSystem.terms.params[paramId] || '';
};

TextManager.command = function(commandId) {
    return $dataSystem.terms.commands[commandId] || '';
};

TextManager.message = function(messageId) {
    return $dataSystem.terms.messages[messageId] || '';
};

TextManager.getter = function(method, param) {
    return {
        get: function() {
            return this[method](param);
        },
        configurable: true
    };
};

Object.defineProperty(TextManager, 'currencyUnit', {
    get: function() { return $dataSystem.currencyUnit; },
    configurable: true
});

Object.defineProperties(TextManager, {
    level           : TextManager.getter('basic', 0),
    levelA          : TextManager.getter('basic', 1),
    hp              : TextManager.getter('basic', 2),
    hpA             : TextManager.getter('basic', 3),
    mp              : TextManager.getter('basic', 4),
    mpA             : TextManager.getter('basic', 5),
    tp              : TextManager.getter('basic', 6),
    tpA             : TextManager.getter('basic', 7),
    exp             : TextManager.getter('basic', 8),
    expA            : TextManager.getter('basic', 9),
    fight           : TextManager.getter('command', 0),
    escape          : TextManager.getter('command', 1),
    attack          : TextManager.getter('command', 2),
    guard           : TextManager.getter('command', 3),
    item            : TextManager.getter('command', 4),
    skill           : TextManager.getter('command', 5),
    equip           : TextManager.getter('command', 6),
    status          : TextManager.getter('command', 7),
    formation       : TextManager.getter('command', 8),
    save            : TextManager.getter('command', 9),
    gameEnd         : TextManager.getter('command', 10),
    options         : TextManager.getter('command', 11),
    weapon          : TextManager.getter('command', 12),
    armor           : TextManager.getter('command', 13),
    keyItem         : TextManager.getter('command', 14),
    equip2          : TextManager.getter('command', 15),
    optimize        : TextManager.getter('command', 16),
    clear           : TextManager.getter('command', 17),
    newGame         : TextManager.getter('command', 18),
    continue_       : TextManager.getter('command', 19),
    toTitle         : TextManager.getter('command', 21),
    cancel          : TextManager.getter('command', 22),
    buy             : TextManager.getter('command', 24),
    sell            : TextManager.getter('command', 25),
    alwaysDash      : TextManager.getter('message', 'alwaysDash'),
    commandRemember : TextManager.getter('message', 'commandRemember'),
    bgmVolume       : TextManager.getter('message', 'bgmVolume'),
    bgsVolume       : TextManager.getter('message', 'bgsVolume'),
    meVolume        : TextManager.getter('message', 'meVolume'),
    seVolume        : TextManager.getter('message', 'seVolume'),
    possession      : TextManager.getter('message', 'possession'),
    expTotal        : TextManager.getter('message', 'expTotal'),
    expNext         : TextManager.getter('message', 'expNext'),
    saveMessage     : TextManager.getter('message', 'saveMessage'),
    loadMessage     : TextManager.getter('message', 'loadMessage'),
    file            : TextManager.getter('message', 'file'),
    partyName       : TextManager.getter('message', 'partyName'),
    emerge          : TextManager.getter('message', 'emerge'),
    preemptive      : TextManager.getter('message', 'preemptive'),
    surprise        : TextManager.getter('message', 'surprise'),
    escapeStart     : TextManager.getter('message', 'escapeStart'),
    escapeFailure   : TextManager.getter('message', 'escapeFailure'),
    victory         : TextManager.getter('message', 'victory'),
    defeat          : TextManager.getter('message', 'defeat'),
    obtainExp       : TextManager.getter('message', 'obtainExp'),
    obtainGold      : TextManager.getter('message', 'obtainGold'),
    obtainItem      : TextManager.getter('message', 'obtainItem'),
    levelUp         : TextManager.getter('message', 'levelUp'),
    obtainSkill     : TextManager.getter('message', 'obtainSkill'),
    useItem         : TextManager.getter('message', 'useItem'),
    criticalToEnemy : TextManager.getter('message', 'criticalToEnemy'),
    criticalToActor : TextManager.getter('message', 'criticalToActor'),
    actorDamage     : TextManager.getter('message', 'actorDamage'),
    actorRecovery   : TextManager.getter('message', 'actorRecovery'),
    actorGain       : TextManager.getter('message', 'actorGain'),
    actorLoss       : TextManager.getter('message', 'actorLoss'),
    actorDrain      : TextManager.getter('message', 'actorDrain'),
    actorNoDamage   : TextManager.getter('message', 'actorNoDamage'),
    actorNoHit      : TextManager.getter('message', 'actorNoHit'),
    enemyDamage     : TextManager.getter('message', 'enemyDamage'),
    enemyRecovery   : TextManager.getter('message', 'enemyRecovery'),
    enemyGain       : TextManager.getter('message', 'enemyGain'),
    enemyLoss       : TextManager.getter('message', 'enemyLoss'),
    enemyDrain      : TextManager.getter('message', 'enemyDrain'),
    enemyNoDamage   : TextManager.getter('message', 'enemyNoDamage'),
    enemyNoHit      : TextManager.getter('message', 'enemyNoHit'),
    evasion         : TextManager.getter('message', 'evasion'),
    magicEvasion    : TextManager.getter('message', 'magicEvasion'),
    magicReflection : TextManager.getter('message', 'magicReflection'),
    counterAttack   : TextManager.getter('message', 'counterAttack'),
    substitute      : TextManager.getter('message', 'substitute'),
    buffAdd         : TextManager.getter('message', 'buffAdd'),
    debuffAdd       : TextManager.getter('message', 'debuffAdd'),
    buffRemove      : TextManager.getter('message', 'buffRemove'),
    actionFailure   : TextManager.getter('message', 'actionFailure'),
});

//-----------------------------------------------------------------------------
// SceneManager
//
// The static class that manages scene transitions.

function SceneManager() {
    throw new Error('This is a static class');
}

/*
 * Gets the current time in ms without on iOS Safari.
 * @private
 */
SceneManager._getTimeInMsWithoutMobileSafari = function() {
    return performance.now();
};

SceneManager._scene             = null;
SceneManager._nextScene         = null;
SceneManager._stack             = [];
SceneManager._stopped           = false;
SceneManager._sceneStarted      = false;
SceneManager._exiting           = false;
SceneManager._previousClass     = null;
SceneManager._backgroundBitmap  = null;
SceneManager._screenWidth       = 816;
SceneManager._screenHeight      = 624;
SceneManager._boxWidth          = 816;
SceneManager._boxHeight         = 624;
SceneManager._deltaTime = 1.0 / 60.0;
if (!Utils.isMobileSafari()) SceneManager._currentTime = SceneManager._getTimeInMsWithoutMobileSafari();
SceneManager._accumulator = 0.0;

SceneManager.run = function(sceneClass) {
    try {
        this.initialize();
        this.goto(sceneClass);
        this.requestUpdate();
    } catch (e) {
        this.catchException(e);
    }
};

SceneManager.initialize = function() {
    this.initGraphics();
    this.checkFileAccess();
    this.initAudio();
    this.initInput();
    this.initNwjs();
    this.checkPluginErrors();
    this.setupErrorHandlers();
};

SceneManager.initGraphics = function() {
    var type = this.preferableRendererType();
    Graphics.initialize(this._screenWidth, this._screenHeight, type);
    Graphics.boxWidth = this._boxWidth;
    Graphics.boxHeight = this._boxHeight;
    Graphics.setLoadingImage('img/system/Loading.png');
    if (Utils.isOptionValid('showfps')) {
        Graphics.showFps();
    }
    if (type === 'webgl') {
        this.checkWebGL();
    }
};

SceneManager.preferableRendererType = function() {
    if (Utils.isOptionValid('canvas')) {
        return 'canvas';
    } else if (Utils.isOptionValid('webgl')) {
        return 'webgl';
    } else {
        return 'auto';
    }
};

SceneManager.shouldUseCanvasRenderer = function() {
    return Utils.isMobileDevice();
};

SceneManager.checkWebGL = function() {
    if (!Graphics.hasWebGL()) {
        throw new Error('Your browser does not support WebGL.');
    }
};

SceneManager.checkFileAccess = function() {
    if (!Utils.canReadGameFiles()) {
        throw new Error('Your browser does not allow to read local files.');
    }
};

SceneManager.initAudio = function() {
    var noAudio = Utils.isOptionValid('noaudio');
    if (!WebAudio.initialize(noAudio) && !noAudio) {
        throw new Error('Your browser does not support Web Audio API.');
    }
};

SceneManager.initInput = function() {
    Input.initialize();
    TouchInput.initialize();
};

SceneManager.initNwjs = function() {
    if (Utils.isNwjs()) {
        var gui = require('nw.gui');
        var win = gui.Window.get();
        if (process.platform === 'darwin' && !win.menu) {
            var menubar = new gui.Menu({ type: 'menubar' });
            var option = { hideEdit: true, hideWindow: true };
            menubar.createMacBuiltin('Game', option);
            win.menu = menubar;
        }
    }
};

SceneManager.checkPluginErrors = function() {
    PluginManager.checkErrors();
};

SceneManager.setupErrorHandlers = function() {
    window.addEventListener('error', this.onError.bind(this));
    document.addEventListener('keydown', this.onKeyDown.bind(this));
};

SceneManager.requestUpdate = function() {
    if (!this._stopped) {
        requestAnimationFrame(this.update.bind(this));
    }
};

SceneManager.update = function() {
    try {
        this.tickStart();
        if (Utils.isMobileSafari()) {
            this.updateInputData();
        }
        this.updateManagers();
        this.updateMain();
        this.tickEnd();
    } catch (e) {
        this.catchException(e);
    }
};

SceneManager.terminate = function() {
    window.close();
};

SceneManager.onError = function(e) {
    console.error(e.message);
    console.error(e.filename, e.lineno);
    try {
        this.stop();
        Graphics.printError('Error', e.message);
        AudioManager.stopAll();
    } catch (e2) {
    }
};

SceneManager.onKeyDown = function(event) {
    if (!event.ctrlKey && !event.altKey) {
        switch (event.keyCode) {
        case 116:   // F5
            if (Utils.isNwjs()) {
                location.reload();
            }
            break;
        case 119:   // F8
            if (Utils.isNwjs() && Utils.isOptionValid('test')) {
                require('nw.gui').Window.get().showDevTools();
            }
            break;
        }
    }
};

SceneManager.catchException = function(e) {
    if (e instanceof Error) {
        Graphics.printError(e.name, e.message);
        console.error(e.stack);
    } else {
        Graphics.printError('UnknownError', e);
    }
    AudioManager.stopAll();
    this.stop();
};

SceneManager.tickStart = function() {
    Graphics.tickStart();
};

SceneManager.tickEnd = function() {
    Graphics.tickEnd();
};

SceneManager.updateInputData = function() {
    Input.update();
    TouchInput.update();
};

SceneManager.updateMain = function() {
    if (Utils.isMobileSafari()) {
        this.changeScene();
        this.updateScene();
    } else {
        var newTime = this._getTimeInMsWithoutMobileSafari();
        var fTime = (newTime - this._currentTime) / 1000;
        if (fTime > 0.25) fTime = 0.25;
        this._currentTime = newTime;
        this._accumulator += fTime;
        while (this._accumulator >= this._deltaTime) {
            this.updateInputData();
            this.changeScene();
            this.updateScene();
            this._accumulator -= this._deltaTime;
        }
    }
    this.renderScene();
    this.requestUpdate();
};

SceneManager.updateManagers = function() {
    ImageManager.update();
};

SceneManager.changeScene = function() {
    if (this.isSceneChanging() && !this.isCurrentSceneBusy()) {
        if (this._scene) {
            this._scene.terminate();
            this._scene.detachReservation();
            this._previousClass = this._scene.constructor;
        }
        this._scene = this._nextScene;
        if (this._scene) {
            this._scene.attachReservation();
            this._scene.create();
            this._nextScene = null;
            this._sceneStarted = false;
            this.onSceneCreate();
        }
        if (this._exiting) {
            this.terminate();
        }
    }
};

SceneManager.updateScene = function() {
    if (this._scene) {
        if (!this._sceneStarted && this._scene.isReady()) {
            this._scene.start();
            this._sceneStarted = true;
            this.onSceneStart();
        }
        if (this.isCurrentSceneStarted()) {
            this._scene.update();
        }
    }
};

SceneManager.renderScene = function() {
    if (this.isCurrentSceneStarted()) {
        Graphics.render(this._scene);
    } else if (this._scene) {
        this.onSceneLoading();
    }
};

SceneManager.onSceneCreate = function() {
    Graphics.startLoading();
};

SceneManager.onSceneStart = function() {
    Graphics.endLoading();
};

SceneManager.onSceneLoading = function() {
    Graphics.updateLoading();
};

SceneManager.isSceneChanging = function() {
    return this._exiting || !!this._nextScene;
};

SceneManager.isCurrentSceneBusy = function() {
    return this._scene && this._scene.isBusy();
};

SceneManager.isCurrentSceneStarted = function() {
    return this._scene && this._sceneStarted;
};

SceneManager.isNextScene = function(sceneClass) {
    return this._nextScene && this._nextScene.constructor === sceneClass;
};

SceneManager.isPreviousScene = function(sceneClass) {
    return this._previousClass === sceneClass;
};

SceneManager.goto = function(sceneClass) {
    if (sceneClass) {
        this._nextScene = new sceneClass();
    }
    if (this._scene) {
        this._scene.stop();
    }
};

SceneManager.push = function(sceneClass) {
    this._stack.push(this._scene.constructor);
    this.goto(sceneClass);
};

SceneManager.pop = function() {
    if (this._stack.length > 0) {
        this.goto(this._stack.pop());
    } else {
        this.exit();
    }
};

SceneManager.exit = function() {
    this.goto(null);
    this._exiting = true;
};

SceneManager.clearStack = function() {
    this._stack = [];
};

SceneManager.stop = function() {
    this._stopped = true;
};

SceneManager.prepareNextScene = function() {
    this._nextScene.prepare.apply(this._nextScene, arguments);
};

SceneManager.snap = function() {
    return Bitmap.snap(this._scene);
};

SceneManager.snapForBackground = function() {
    this._backgroundBitmap = this.snap();
    this._backgroundBitmap.blur();
};

SceneManager.backgroundBitmap = function() {
    return this._backgroundBitmap;
};

SceneManager.resume = function() {
    this._stopped = false;
    this.requestUpdate();
    if (!Utils.isMobileSafari()) {
        this._currentTime = this._getTimeInMsWithoutMobileSafari();
        this._accumulator = 0;
    }
};

//-----------------------------------------------------------------------------
// BattleManager
//
// The static class that manages battle progress.

function BattleManager() {
    throw new Error('This is a static class');
}

BattleManager.setup = function(troopId, canEscape, canLose) {
    this.initMembers();
    this._canEscape = canEscape;
    this._canLose = canLose;
    $gameTroop.setup(troopId);
    $gameScreen.onBattleStart();
    this.makeEscapeRatio();
};

BattleManager.initMembers = function() {
    this._phase = 'init';
    this._canEscape = false;
    this._canLose = false;
    this._battleTest = false;
    this._eventCallback = null;
    this._preemptive = false;
    this._surprise = false;
    this._actorIndex = -1;
    this._actionForcedBattler = null;
    this._mapBgm = null;
    this._mapBgs = null;
    this._actionBattlers = [];
    this._subject = null;
    this._action = null;
    this._targets = [];
    this._logWindow = null;
    this._statusWindow = null;
    this._spriteset = null;
    this._escapeRatio = 0;
    this._escaped = false;
    this._rewards = {};
    this._turnForced = false;
};

BattleManager.isBattleTest = function() {
    return this._battleTest;
};

BattleManager.setBattleTest = function(battleTest) {
    this._battleTest = battleTest;
};

BattleManager.setEventCallback = function(callback) {
    this._eventCallback = callback;
};

BattleManager.setLogWindow = function(logWindow) {
    this._logWindow = logWindow;
};

BattleManager.setStatusWindow = function(statusWindow) {
    this._statusWindow = statusWindow;
};

BattleManager.setSpriteset = function(spriteset) {
    this._spriteset = spriteset;
};

BattleManager.onEncounter = function() {
    this._preemptive = (Math.random() < this.ratePreemptive());
    this._surprise = (Math.random() < this.rateSurprise() && !this._preemptive);
};

BattleManager.ratePreemptive = function() {
    return $gameParty.ratePreemptive($gameTroop.agility());
};

BattleManager.rateSurprise = function() {
    return $gameParty.rateSurprise($gameTroop.agility());
};

BattleManager.saveBgmAndBgs = function() {
    this._mapBgm = AudioManager.saveBgm();
    this._mapBgs = AudioManager.saveBgs();
};

BattleManager.playBattleBgm = function() {
    AudioManager.playBgm($gameSystem.battleBgm());
    AudioManager.stopBgs();
};

BattleManager.playVictoryMe = function() {
    AudioManager.playMe($gameSystem.victoryMe());
};

BattleManager.playDefeatMe = function() {
    AudioManager.playMe($gameSystem.defeatMe());
};

BattleManager.replayBgmAndBgs = function() {
    if (this._mapBgm) {
        AudioManager.replayBgm(this._mapBgm);
    } else {
        AudioManager.stopBgm();
    }
    if (this._mapBgs) {
        AudioManager.replayBgs(this._mapBgs);
    }
};

BattleManager.makeEscapeRatio = function() {
    this._escapeRatio = 0.5 * $gameParty.agility() / $gameTroop.agility();
};

BattleManager.update = function() {
    if (!this.isBusy() && !this.updateEvent()) {
        switch (this._phase) {
        case 'start':
            this.startInput();
            break;
        case 'turn':
            this.updateTurn();
            break;
        case 'action':
            this.updateAction();
            break;
        case 'turnEnd':
            this.updateTurnEnd();
            break;
        case 'battleEnd':
            this.updateBattleEnd();
            break;
        }
    }
};

BattleManager.updateEvent = function() {
    switch (this._phase) {
        case 'start':
        case 'turn':
        case 'turnEnd':
            if (this.isActionForced()) {
                this.processForcedAction();
                return true;
            } else {
                return this.updateEventMain();
            }
    }
    return this.checkAbort();
};

BattleManager.updateEventMain = function() {
    $gameTroop.updateInterpreter();
    $gameParty.requestMotionRefresh();
    if ($gameTroop.isEventRunning() || this.checkBattleEnd()) {
        return true;
    }
    $gameTroop.setupBattleEvent();
    if ($gameTroop.isEventRunning() || SceneManager.isSceneChanging()) {
        return true;
    }
    return false;
};

BattleManager.isBusy = function() {
    return ($gameMessage.isBusy() || this._spriteset.isBusy() ||
            this._logWindow.isBusy());
};

BattleManager.isInputting = function() {
    return this._phase === 'input';
};

BattleManager.isInTurn = function() {
    return this._phase === 'turn';
};

BattleManager.isTurnEnd = function() {
    return this._phase === 'turnEnd';
};

BattleManager.isAborting = function() {
    return this._phase === 'aborting';
};

BattleManager.isBattleEnd = function() {
    return this._phase === 'battleEnd';
};

BattleManager.canEscape = function() {
    return this._canEscape;
};

BattleManager.canLose = function() {
    return this._canLose;
};

BattleManager.isEscaped = function() {
    return this._escaped;
};

BattleManager.actor = function() {
    return this._actorIndex >= 0 ? $gameParty.members()[this._actorIndex] : null;
};

BattleManager.clearActor = function() {
    this.changeActor(-1, '');
};

BattleManager.changeActor = function(newActorIndex, lastActorActionState) {
    var lastActor = this.actor();
    this._actorIndex = newActorIndex;
    var newActor = this.actor();
    if (lastActor) {
        lastActor.setActionState(lastActorActionState);
    }
    if (newActor) {
        newActor.setActionState('inputting');
    }
};

BattleManager.startBattle = function() {
    this._phase = 'start';
    $gameSystem.onBattleStart();
    $gameParty.onBattleStart();
    $gameTroop.onBattleStart();
    this.displayStartMessages();
};

BattleManager.displayStartMessages = function() {
    $gameTroop.enemyNames().forEach(function(name) {
        $gameMessage.add(TextManager.emerge.format(name));
    });
    if (this._preemptive) {
        $gameMessage.add(TextManager.preemptive.format($gameParty.name()));
    } else if (this._surprise) {
        $gameMessage.add(TextManager.surprise.format($gameParty.name()));
    }
};

BattleManager.startInput = function() {
    this._phase = 'input';
    $gameParty.makeActions();
    $gameTroop.makeActions();
    this.clearActor();
    if (this._surprise || !$gameParty.canInput()) {
        this.startTurn();
    }
};

BattleManager.inputtingAction = function() {
    return this.actor() ? this.actor().inputtingAction() : null;
};

BattleManager.selectNextCommand = function() {
    do {
        if (!this.actor() || !this.actor().selectNextCommand()) {
            this.changeActor(this._actorIndex + 1, 'waiting');
            if (this._actorIndex >= $gameParty.size()) {
                this.startTurn();
                break;
            }
        }
    } while (!this.actor().canInput());
};

BattleManager.selectPreviousCommand = function() {
    do {
        if (!this.actor() || !this.actor().selectPreviousCommand()) {
            this.changeActor(this._actorIndex - 1, 'undecided');
            if (this._actorIndex < 0) {
                return;
            }
        }
    } while (!this.actor().canInput());
};

BattleManager.refreshStatus = function() {
    this._statusWindow.refresh();
};

BattleManager.startTurn = function() {
    this._phase = 'turn';
    this.clearActor();
    $gameTroop.increaseTurn();
    this.makeActionOrders();
    $gameParty.requestMotionRefresh();
    this._logWindow.startTurn();
};

BattleManager.updateTurn = function() {
    $gameParty.requestMotionRefresh();
    if (!this._subject) {
        this._subject = this.getNextSubject();
    }
    if (this._subject) {
        this.processTurn();
    } else {
        this.endTurn();
    }
};

BattleManager.processTurn = function() {
    var subject = this._subject;
    var action = subject.currentAction();
    if (action) {
        action.prepare();
        if (action.isValid()) {
            this.startAction();
        }
        subject.removeCurrentAction();
    } else {
        subject.onAllActionsEnd();
        this.refreshStatus();
        this._logWindow.displayAutoAffectedStatus(subject);
        this._logWindow.displayCurrentState(subject);
        this._logWindow.displayRegeneration(subject);
        this._subject = this.getNextSubject();
    }
};

BattleManager.endTurn = function() {
    this._phase = 'turnEnd';
    this._preemptive = false;
    this._surprise = false;
    this.allBattleMembers().forEach(function(battler) {
        battler.onTurnEnd();
        this.refreshStatus();
        this._logWindow.displayAutoAffectedStatus(battler);
        this._logWindow.displayRegeneration(battler);
    }, this);
    if (this.isForcedTurn()) {
        this._turnForced = false;
    }
};

BattleManager.isForcedTurn = function () {
    return this._turnForced;
};

BattleManager.updateTurnEnd = function() {
    this.startInput();
};

BattleManager.getNextSubject = function() {
    for (;;) {
        var battler = this._actionBattlers.shift();
        if (!battler) {
            return null;
        }
        if (battler.isBattleMember() && battler.isAlive()) {
            return battler;
        }
    }
};

BattleManager.allBattleMembers = function() {
    return $gameParty.members().concat($gameTroop.members());
};

BattleManager.makeActionOrders = function() {
    var battlers = [];
    if (!this._surprise) {
        battlers = battlers.concat($gameParty.members());
    }
    if (!this._preemptive) {
        battlers = battlers.concat($gameTroop.members());
    }
    battlers.forEach(function(battler) {
        battler.makeSpeed();
    });
    battlers.sort(function(a, b) {
        return b.speed() - a.speed();
    });
    this._actionBattlers = battlers;
};

BattleManager.startAction = function() {
    var subject = this._subject;
    var action = subject.currentAction();
    var targets = action.makeTargets();
    this._phase = 'action';
    this._action = action;
    this._targets = targets;
    subject.useItem(action.item());
    this._action.applyGlobal();
    this.refreshStatus();
    this._logWindow.startAction(subject, action, targets);
};

BattleManager.updateAction = function() {
    var target = this._targets.shift();
    if (target) {
        this.invokeAction(this._subject, target);
    } else {
        this.endAction();
    }
};

BattleManager.endAction = function() {
    this._logWindow.endAction(this._subject);
    this._phase = 'turn';
};

BattleManager.invokeAction = function(subject, target) {
    this._logWindow.push('pushBaseLine');
    if (Math.random() < this._action.itemCnt(target)) {
        this.invokeCounterAttack(subject, target);
    } else if (Math.random() < this._action.itemMrf(target)) {
        this.invokeMagicReflection(subject, target);
    } else {
        this.invokeNormalAction(subject, target);
    }
    subject.setLastTarget(target);
    this._logWindow.push('popBaseLine');
    this.refreshStatus();
};

BattleManager.invokeNormalAction = function(subject, target) {
    var realTarget = this.applySubstitute(target);
    this._action.apply(realTarget);
    this._logWindow.displayActionResults(subject, realTarget);
};

BattleManager.invokeCounterAttack = function(subject, target) {
    var action = new Game_Action(target);
    action.setAttack();
    action.apply(subject);
    this._logWindow.displayCounter(target);
    this._logWindow.displayActionResults(target, subject);
};

BattleManager.invokeMagicReflection = function(subject, target) {
	this._action._reflectionTarget = target;
    this._logWindow.displayReflection(target);
    this._action.apply(subject);
    this._logWindow.displayActionResults(target, subject);
};

BattleManager.applySubstitute = function(target) {
    if (this.checkSubstitute(target)) {
        var substitute = target.friendsUnit().substituteBattler();
        if (substitute && target !== substitute) {
            this._logWindow.displaySubstitute(substitute, target);
            return substitute;
        }
    }
    return target;
};

BattleManager.checkSubstitute = function(target) {
    return target.isDying() && !this._action.isCertainHit();
};

BattleManager.isActionForced = function() {
    return !!this._actionForcedBattler;
};

BattleManager.forceAction = function(battler) {
    this._actionForcedBattler = battler;
    var index = this._actionBattlers.indexOf(battler);
    if (index >= 0) {
        this._actionBattlers.splice(index, 1);
    }
};

BattleManager.processForcedAction = function() {
    if (this._actionForcedBattler) {
        this._turnForced = true;
        this._subject = this._actionForcedBattler;
        this._actionForcedBattler = null;
        this.startAction();
        this._subject.removeCurrentAction();
    }
};

BattleManager.abort = function() {
    this._phase = 'aborting';
};

BattleManager.checkBattleEnd = function() {
    if (this._phase) {
        if (this.checkAbort()) {
            return true;
        } else if ($gameParty.isAllDead()) {
            this.processDefeat();
            return true;
        } else if ($gameTroop.isAllDead()) {
            this.processVictory();
            return true;
        }
    }
    return false;
};

BattleManager.checkAbort = function() {
    if ($gameParty.isEmpty() || this.isAborting()) {
        SoundManager.playEscape();
        this._escaped = true;
        this.processAbort();
    }
    return false;
};

BattleManager.processVictory = function() {
    $gameParty.removeBattleStates();
    $gameParty.performVictory();
    this.playVictoryMe();
    this.replayBgmAndBgs();
    this.makeRewards();
    this.displayVictoryMessage();
    this.displayRewards();
    this.gainRewards();
    this.endBattle(0);
};

BattleManager.processEscape = function() {
    $gameParty.performEscape();
    SoundManager.playEscape();
    var success = this._preemptive ? true : (Math.random() < this._escapeRatio);
    if (success) {
        this.displayEscapeSuccessMessage();
        this._escaped = true;
        this.processAbort();
    } else {
        this.displayEscapeFailureMessage();
        this._escapeRatio += 0.1;
        $gameParty.clearActions();
        this.startTurn();
    }
    return success;
};

BattleManager.processAbort = function() {
    $gameParty.removeBattleStates();
    this.replayBgmAndBgs();
    this.endBattle(1);
};

BattleManager.processDefeat = function() {
    this.displayDefeatMessage();
    this.playDefeatMe();
    if (this._canLose) {
        this.replayBgmAndBgs();
    } else {
        AudioManager.stopBgm();
    }
    this.endBattle(2);
};

BattleManager.endBattle = function(result) {
    this._phase = 'battleEnd';
    if (this._eventCallback) {
        this._eventCallback(result);
    }
    if (result === 0) {
        $gameSystem.onBattleWin();
    } else if (this._escaped) {
        $gameSystem.onBattleEscape();
    }
};

BattleManager.updateBattleEnd = function() {
    if (this.isBattleTest()) {
        AudioManager.stopBgm();
        SceneManager.exit();
    } else if (!this._escaped && $gameParty.isAllDead()) {
        if (this._canLose) {
            $gameParty.reviveBattleMembers();
            SceneManager.pop();
        } else {
            SceneManager.goto(Scene_Gameover);
        }
    } else {
        SceneManager.pop();
    }
    this._phase = null;
};

BattleManager.makeRewards = function() {
    this._rewards = {};
    this._rewards.gold = $gameTroop.goldTotal();
    this._rewards.exp = $gameTroop.expTotal();
    this._rewards.items = $gameTroop.makeDropItems();
};

BattleManager.displayVictoryMessage = function() {
    $gameMessage.add(TextManager.victory.format($gameParty.name()));
};

BattleManager.displayDefeatMessage = function() {
    $gameMessage.add(TextManager.defeat.format($gameParty.name()));
};

BattleManager.displayEscapeSuccessMessage = function() {
    $gameMessage.add(TextManager.escapeStart.format($gameParty.name()));
};

BattleManager.displayEscapeFailureMessage = function() {
    $gameMessage.add(TextManager.escapeStart.format($gameParty.name()));
    $gameMessage.add('\\.' + TextManager.escapeFailure);
};

BattleManager.displayRewards = function() {
    this.displayExp();
    this.displayGold();
    this.displayDropItems();
};

BattleManager.displayExp = function() {
    var exp = this._rewards.exp;
    if (exp > 0) {
        var text = TextManager.obtainExp.format(exp, TextManager.exp);
        $gameMessage.add('\\.' + text);
    }
};

BattleManager.displayGold = function() {
    var gold = this._rewards.gold;
    if (gold > 0) {
        $gameMessage.add('\\.' + TextManager.obtainGold.format(gold));
    }
};

BattleManager.displayDropItems = function() {
    var items = this._rewards.items;
    if (items.length > 0) {
        $gameMessage.newPage();
        items.forEach(function(item) {
            $gameMessage.add(TextManager.obtainItem.format(item.name));
        });
    }
};

BattleManager.gainRewards = function() {
    this.gainExp();
    this.gainGold();
    this.gainDropItems();
};

BattleManager.gainExp = function() {
    var exp = this._rewards.exp;
    $gameParty.allMembers().forEach(function(actor) {
        actor.gainExp(exp);
    });
};

BattleManager.gainGold = function() {
    $gameParty.gainGold(this._rewards.gold);
};

BattleManager.gainDropItems = function() {
    var items = this._rewards.items;
    items.forEach(function(item) {
        $gameParty.gainItem(item, 1);
    });
};

//-----------------------------------------------------------------------------
// PluginManager
//
// The static class that manages the plugins.

function PluginManager() {
    throw new Error('This is a static class');
}

PluginManager._path         = 'js/plugins/';
PluginManager._scripts      = [];
PluginManager._errorUrls    = [];
PluginManager._parameters   = {};

PluginManager.setup = function(plugins) {
    plugins.forEach(function(plugin) {
        if (plugin.status && !this._scripts.contains(plugin.name)) {
            this.setParameters(plugin.name, plugin.parameters);
            this.loadScript(plugin.name + '.js');
            this._scripts.push(plugin.name);
        }
    }, this);
};

PluginManager.checkErrors = function() {
    var url = this._errorUrls.shift();
    if (url) {
        throw new Error('Failed to load: ' + url);
    }
};

PluginManager.parameters = function(name) {
    return this._parameters[name.toLowerCase()] || {};
};

PluginManager.setParameters = function(name, parameters) {
    this._parameters[name.toLowerCase()] = parameters;
};

PluginManager.loadScript = function(name) {
    var url = this._path + name;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.async = false;
    script.onerror = this.onError.bind(this);
    script._url = url;
    document.body.appendChild(script);
};

PluginManager.onError = function(e) {
    this._errorUrls.push(e.target._url);
};
