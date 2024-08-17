//=============================================================================
// AltSaveScreen.js
//=============================================================================

/*:
 * @plugindesc Alternative save/load screen layout.
 * @author Yoji Ojima
 *
 * @help This plugin does not provide plugin commands.
 */

/*:ja
 * @plugindesc セーブ／ロード画面のレイアウトを変更します。
 * @author Yoji Ojima
 *
 * @help このプラグインには、プラグインコマンドはありません。
 */

(function() {

    var _Scene_File_create = Scene_File.prototype.create;
    Scene_File.prototype.create = function() {
        _Scene_File_create.call(this);
        this._listWindow.height = this._listWindow.fittingHeight(8);
        var x = 0;
        var y = this._listWindow.y + this._listWindow.height;
        var width = Graphics.boxWidth;
        var height = Graphics.boxHeight - y;
        this._statusWindow = new Window_SavefileStatus(x, y, width, height);
        this._statusWindow.setMode(this.mode());
        this._listWindow.statusWindow = this._statusWindow;
        this._listWindow.callUpdateHelp();
        this.addWindow(this._statusWindow);
    };

    var _Scene_File_start = Scene_File.prototype.start;
    Scene_File.prototype.start = function() {
        _Scene_File_start.call(this);
        this._listWindow.ensureCursorVisible();
        this._listWindow.callUpdateHelp();
    };

    Window_SavefileList.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };

    Window_SavefileList.prototype.maxCols = function() {
        return 4;
    };

    Window_SavefileList.prototype.numVisibleRows = function() {
        return 5;
    };

    Window_SavefileList.prototype.spacing = function() {
        return 8;
    };

    Window_SavefileList.prototype.itemHeight = function() {
        return this.lineHeight() * 2;
    };

    var _Window_SavefileList_callUpdateHelp =
            Window_SavefileList.prototype.callUpdateHelp;
    Window_SavefileList.prototype.callUpdateHelp = function() {
        _Window_SavefileList_callUpdateHelp.call(this);
        if (this.active && this.statusWindow) {
            this.statusWindow.setId(this.index() + 1);
        }
    };

    function Window_SavefileStatus() {
        this.initialize.apply(this, arguments);
    }

    Window_SavefileStatus.prototype = Object.create(Window_Base.prototype);
    Window_SavefileStatus.prototype.constructor = Window_SavefileStatus;

    Window_SavefileStatus.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._id = 1;
    };

    Window_SavefileStatus.prototype.setMode = function(mode) {
        this._mode = mode;
    };

    Window_SavefileStatus.prototype.setId = function(id) {
        this._id = id;
        this.refresh();
    };

    Window_SavefileStatus.prototype.refresh = function() {
        this.contents.clear();
        var id = this._id;
        var valid = DataManager.isThisGameFile(id);
        var info = DataManager.loadSavefileInfo(id);
        var rect = this.contents.rect;
        this.resetTextColor();
        if (this._mode === 'load') {
            this.changePaintOpacity(valid);
        }
        this.drawFileId(id, rect.x, rect.y);
        if (info) {
            this.changePaintOpacity(valid);
            this.drawContents(info, rect, valid);
            this.changePaintOpacity(true);
        }
    };

    Window_SavefileStatus.prototype.drawFileId = function(id, x, y) {
        this.drawText(TextManager.file + ' ' + id, x, y, 180);
    };

    Window_SavefileStatus.prototype.drawContents = function(info, rect, valid) {
        var bottom = rect.y + rect.height;
        var playtimeY = bottom - this.lineHeight();
        //this.drawText(info.title, rect.x + 192, rect.y, rect.width - 192);

        if (info.title) {
            if(info.hard == 0){
                this.drawText('NORMAL', rect.x + 192, rect.y, 100);
            }else{
                this.drawText('HARD', rect.x + 192, rect.y, 100);
            }
            var str = info.keikanissu + '日　';
            if(info.youbi == 0){
                str += '星期一　';
            }else if(info.youbi == 1){
                str += '星期二　';
            }else if(info.youbi == 2){
                str += '星期三　';
            }else if(info.youbi == 3){
                str += '星期四　';
            }else if(info.youbi == 4){
                str += '星期五　';
            }else if(info.youbi == 5){
                str += '星期六　';
            }else if(info.youbi == 6){
                str += '星期天　';
            }
    
            str += info.jikan + '时　' + info.katagaki + info.katagaki2 + '哥哥';
    
            this.drawText(str, rect.x + 192, rect.y+100, rect.width - 192);
        }


        if (valid) {
            this.drawPartyfaces(info, rect.x, bottom - 144);
        }
        this.drawText(info.playtime, rect.x, playtimeY, rect.width, 'right');
    };

    Window_SavefileStatus.prototype.drawPartyfaces = function(info, x, y) {
        if (info && info.faces) {
            for (var i = 0; i < info.faces.length; i++) {
                var data = info.faces[i];
                this.drawFace(data[0], data[1], x + i * 150, y);
            }
        }
    };

})();
