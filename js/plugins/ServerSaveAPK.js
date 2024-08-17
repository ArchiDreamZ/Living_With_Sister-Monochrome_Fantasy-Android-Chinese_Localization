//=============================================================================
// ServerSave.js
//=============================================================================

/*:
 * @plugindesc セーブデータサーバー保存
 * @author HBOX.JP
 * 
 * @param contentId
 * @desc コンテンツID
 * @default 0
 */

var ServerSave = ServerSave || (ServerSave = {});

var $contentId = '';
var $loginUserID = '';
var $loadData = '';

(function(ServerSave){
    var ServerSaveManager = (function(){
        var saveSuccess = false;

        function ServerSaveManager(){
            this.initialize();
        }

        ServerSaveManager.prototype.initialize = function(){
            var parameters = PluginManager.parameters('ServerSaveAPK');
            $contentId = parameters['contentId'];
        }

        ServerSaveManager.prototype.createWebSaveFolder = function(uid) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = checkReadyState;
            var url = `https://hbox.jp/appdata/ios/` + $contentId + '/www/create_savefolder.php?uid=' + uid;
            request.open("POST", url, false);
            request.send(null);
            function checkReadyState(){
                if (request.readyState == 4){
                    if(request.status == 200){
                        //alert("セーフフォルダ作成　" + uid);
                        return true;
                    }else{
                        //console.error("セーブフォルダの作成に失敗しました。");
                        alert('request.status = ' + request.status + ' セーブフォルダの作成に失敗しました。');
                        return false;
                    }
                }
            }
        };

        ServerSaveManager.prototype.saveToWebServer = function(key, data) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = checkReadyState;
            var url = `https://hbox.jp/appdata/ios/` + $contentId + '/www/server_save.php';
            request.open("POST", url, false);
            // セーブデータをurlの引数に含めると長すぎ（414）になる
            var fd = new FormData();
            fd.append('uid', $loginUserID);
            fd.append('name', key);
            fd.append('data', data);
            //var sendText = "uid=" + loginUserID + "&name=" + key + "&data=" + data + '&mode=' + mode;
            request.send(fd);
            function checkReadyState(){
                if (request.readyState == 4){
                    if(request.status == 200){
                        //alert("セーブデータの作成　" + key + "　+　" + data);
                        this.saveSuccess = true;
                    }else{
                        //console.error("セーブデータの作成に失敗しました。");
                        alert('request.status = ' + request.status + ' key = ' + key + ' セーブデータの作成に失敗しました。');
                        this.saveSuccess = false;
                    }
                }
            }
        };
        
        ServerSaveManager.prototype.loadFromWebServer = function(key) {
            $loadData = '';
            var request = new XMLHttpRequest();
            request.onreadystatechange = checkReadyState;
            var url = `https://hbox.jp/appdata/ios/` + $contentId + '/www/server_load.php?uid='+ $loginUserID + '&name=' + key;
            request.open("GET", url, false);
            request.send(null);
            function checkReadyState(){
                if (request.readyState == 4){
                    if(request.status == 200){
                        //alert("セーフデータ取得　" + uid);
                        $loadData = request.responseText;
                        //alert("セーフデータ取得　" + key + "　+　" + $loadData);
                    }else{
                        alert('key=' + key + ' セーブデータの読込みに失敗しました。');
                    }
                }
            }
            return $loadData;
        };

        return ServerSaveManager;
    })();
    ServerSave.ServerSaveManager = new ServerSaveManager();
    
})(ServerSave || (ServerSave = {}));

(function(){

    StorageManager.loadFromWebStorage = function(savefileId) {
        var key = this.webStorageKey(savefileId);
        var data = '';
        if($loginUserID !== ''){
            data = ServerSave.ServerSaveManager.loadFromWebServer(key);
            //alert("loadFromWebStorage　" + data);
            data = data.replace(' ', '+');
        }/*else{
            data = localStorage.getItem(key);
        }*/
        return LZString.decompressFromBase64(data);
    };

    StorageManager.saveToWebStorage = function(savefileId, json) {
        var key = this.webStorageKey(savefileId);
        var data = LZString.compressToBase64(json);
        //localStorage.setItem(key, data);
        if($loginUserID !== ''){
            ServerSave.ServerSaveManager.saveToWebServer(key, data);
        }
    };

    StorageManager.webStorageExists = function(savefileId) {
        $loadData = '';
        var key = this.webStorageKey(savefileId);
        var request = new XMLHttpRequest();
        request.onreadystatechange = checkReadyState;
        var url = `https://hbox.jp/appdata/ios/` + $contentId + '/www/server_load.php?uid='+ $loginUserID + '&name=' + key;
        request.open("GET", url, false);
        request.send(null);
        function checkReadyState(){
            if (request.readyState == 4){
                if(request.status == 200){
                    $loadData = request.responseText;
                    //alert("webStorageExists　" + uid + "　+　" + $loadData);
                }else{
                    alert('key=' + key + '\n指定したセーブデータの存在確認に失敗しました。');
                }
            }
        }
        return $loadData;
        //return !!localStorage.getItem(key);
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
            /*for (var i = 1; i <= this.maxSavefiles(); i++) {
                if (!StorageManager.exists(i)) {
                    delete globalInfo[i];
                }
            }*/
            return globalInfo;
        } else {
            return [];
        }
    };

    var _ServerSaveAPKCreate = Scene_Boot.prototype.create;
    Scene_Boot.prototype.create = function() {
        _ServerSaveAPKCreate.call(this);
        // MainActivity.javaにログインしているユーザIDを取得
        var sharedPreferences = window.plugins.SharedPreferences.getInstance("LICENSE");
        var successCallback = function(value) {
            $loginUserID = value;
            ServerSave.ServerSaveManager.createWebSaveFolder($loginUserID);
            ConfigManager.load();
        }
        var errorCallback = function(err) {
            alert("ユーザID取得失敗：" + err);
        }
        sharedPreferences.get('userId', '', successCallback, errorCallback);
        
        DataManager.loadDatabase();
        this.loadSystemWindowImage();

    };

})();