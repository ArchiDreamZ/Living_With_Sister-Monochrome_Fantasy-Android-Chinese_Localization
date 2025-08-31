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
var $auth = '';

var ginfo = null;

(function(ServerSave){
    var ServerSaveManager = (function(){
        function ServerSaveManager(){
            this.initialize();
        }

        ServerSaveManager.prototype.initialize = function(){
            var parameters = PluginManager.parameters('ServerSave');
            $contentId = parameters['contentId'];
        }

        ServerSaveManager.prototype.getLoginUserID = function() {
            var request = new XMLHttpRequest();
            request.onreadystatechange = checkReadyState;
            request.open("GET", `https://hbox.jp/user/user_id`, false);
            request.send(null);
            function checkReadyState(){
                if (request.readyState == 4){
                    if(request.status == 200){
                        var resTxt = request.responseText.replace('{"id":', '');
                        resTxt = resTxt.replace('}', '');
                        $loginUserID = resTxt;
                    }else{
                        alert('ログインユーザID取得に失敗しました。\nHBOX.JPのサイトにログインしているかご確認ください。');
                        var win = window.open('https://hbox.jp/home', '_blank');
                        if (win) {
                            win.focus();
                        }
                        window.open('about:blank','_self').close();
                    }
                }
            }
        };

        ServerSaveManager.prototype.getAuth = function() {
            var request = new XMLHttpRequest();
            request.onreadystatechange = checkReadyState;
            request.open("GET", `https://hbox.jp/appdata/ninsyou6.php?id=` + $loginUserID + '&content_id=' + $contentId, false);
            request.send(null);
            function checkReadyState(){
                if (request.readyState == 4){
                    if(request.status == 200){
                        var resTxt = request.responseText;
                        if(resTxt.indexOf('OK') > 0){
                            $auth = 'OK';
                        }else{
                            $auth = 'NO';
                        }
                        
                    }else{
                        alert('購入確認に失敗しました。');
                    }
                }
            }
        };

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
                    }else{
                        //console.error("セーブフォルダの作成に失敗しました。");
                        alert('request.status = ' + request.status + '\nセーブフォルダの作成に失敗しました。');
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
                        //alert("セーブデータの作成　" + uid);
                    }else{
                        //console.error("セーブデータの作成に失敗しました。");
                        alert('request.status = ' + request.status + '\nセーブデータの作成に失敗しました。');
                    }
                }
            }
        };
        
        ServerSaveManager.prototype.loadFromWebServer = function(key) {
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
                    }else{
                        alert('key=' + key + '\nセーブデータの読込みに失敗しました。');
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

    DataManager.isThisGameFile = function(savefileId) {
        if(ginfo == null){
            ginfo = this.loadGlobalInfo();
        }
        if (ginfo && ginfo[savefileId]) {
            if (StorageManager.isLocalMode()) {
                return true;
            } else {
                var savefile = ginfo[savefileId];
                return (savefile.globalId === this._globalId &&
                        savefile.title === $dataSystem.gameTitle);
            }
        } else {
            return false;
        }
    };
    
    DataManager.saveGlobalInfo = function(info) {
        ginfo = info;
        StorageManager.save(0, JSON.stringify(info));
    };

    StorageManager.loadFromWebStorage = function(savefileId) {
        var key = this.webStorageKey(savefileId);
        var data = '';
        if($loginUserID !== ''){
            data = ServerSave.ServerSaveManager.loadFromWebServer(key);
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
        var key = this.webStorageKey(savefileId);

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
                }else{
                    //alert('key=' + key + '\n指定したセーブデータの存在確認に失敗しました。');
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

    Scene_Boot.prototype.initialize = function() {
        const flag = true;
        var agent = navigator.userAgent;
        if(!agent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mac OS/)){
            alert('PCブラウザでは起動できません。');
            window.open('https://hbox.jp/contents/' + $contentId,'_self').close();
            return;
        }

        if(agent.match(/Android/)){
            if(!(agent.match(/Android/) && agent.match(/Chrome/)) || agent.match(/SamsungBrowser/)){
                prompt('Androidは現在Chromeのみプレイ可能です。\n下記からURLをコピーし、「Chrome」で起動をお願いします。', 
                    'https://hbox.jp/appdata/ios/' + $contentId + '/www/index.html');

                window.open('https://hbox.jp/contents/' + $contentId,'_self').close();
                return;
            }
        }else{
            if(!(agent.match(/iPhone|iPad|iPod/) && agent.match(/AppleWebKit/) && !agent.match('CriOS')) || agent.match('Macintosh')){
                prompt('iosは現在iPhoneかつsafariでのみプレイ可能です。\n下記からURLをコピーし、「safari」で起動をお願いします。', 
                    'https://hbox.jp/appdata/ios/' + $contentId + '/www/index.html');

                window.open('https://hbox.jp/contents/' + $contentId,'_self').close();
                return;
            }
        }
        // HBOX.JPにログインしているユーザIDを取得
        ServerSave.ServerSaveManager.getLoginUserID();
        ServerSave.ServerSaveManager.getAuth();
        // 購入していな場合終了
        if($auth != 'OK'){
            try {
                if (flag) {
                    alert('コンテンツID：' + $contentId + 'は未購入です。');
                    var win = window.open('https://hbox.jp/contents/' + $contentId, '_blank');
                    if (win) {
                        win.focus();
                    }
                    window.open('about:blank','_self').close();
                }
            } catch (e) {
                console.log(e.message);
            }
            return;
        }
        if($loginUserID !== ''){
            ServerSave.ServerSaveManager.createWebSaveFolder($loginUserID);
        }
        Scene_Base.prototype.initialize.call(this);
        this._startDate = Date.now();
    };

})();