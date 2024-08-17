//=============================================================================
// banner.js
//=============================================================================

/*:
 * @plugindesc HBOX.JPバナー表示
 * @author HBOX.JP
 *
 * @param contentId
 * @desc コンテンツID
 * @default 0
 * 
 * @param bnrWindowX
 * @desc 表示位置 X 座標
 * @default 0
 *
 * @param bnrWindowY
 * @desc 表示位置 Y 座標
 * @default 0
 *
 * @param bnrWindowWdith
 * @desc 幅
 * @default 320
 *
 * @param bnrWindowHeight
 * @desc 高さ
 * @default 115
 * 
 * @param ImageFile
 * @desc アイコン画像
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 * 
 * @param fontsize
 * @desc フォントサイズ
 * @default 18
 *
 * @param OffsetX
 * @desc 背景画像X座標の補正値
 * @default 145
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param OffsetY
 * @desc 背景画像Y座標の補正値
 * @default 55
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param ScaleX
 * @desc 背景画像X方向の拡大率(%指定)
 * @default 600
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param ScaleY
 * @desc 背景画像Y方向の拡大率(%指定)
 * @default 220
 * @type number
 * @min -2000
 * @max 2000
 * 
 * @param BackImageFile
 * @desc 背景画像
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 */

(function() {

    var parameters = PluginManager.parameters('banner');
    var contentId = parameters['contentId'];
    var bnrWindowX = Number(parameters['bnrWindowX']);
    var bnrWindowY = Number(parameters['bnrWindowY']);
    var bnrWindowWdith = Number(parameters['bnrWindowWdith']);
    var bnrWindowHeight = Number(parameters['bnrWindowHeight']);
    var ImageFile = parameters['ImageFile'];
    var fontsize = Number(parameters['fontsize']);
    var OffsetX = Number(parameters['OffsetX']);
    var OffsetY = Number(parameters['OffsetY']);
    var ScaleX = Number(parameters['ScaleX']);
    var ScaleY = Number(parameters['ScaleY']);
    var BackImageFile = parameters['BackImageFile'];
 
    //-------------------------------------------------------------------------
    // Scene_Title
	/** バナー画像URL */
	var bannerImageUrl = "";
	/** バナー飛び先URL */
	var bannerJumpUrl = "";
	/** バナーコンテンツタイトル */
	var bannerText = "人気タイトルリリース中！ここをタップ！";
	/** バナーコンテンツID */
    var bannerContentID = "";

    var bannerWindow;

    function Window_Banner() {
        this.initialize.apply(this, arguments);
    }

    Window_Banner.prototype = Object.create(Window_Base.prototype);
    Window_Banner.prototype.constructor = Window_Banner;

    const getBannerInfo = function() {
        var request = new XMLHttpRequest();
        request.open("GET", `http://hbox.jp/lagoon/app_bnr/info3.php?cid=` + contentId, );
        request.addEventListener("load", () => {
            var resTxt = request.responseText.split(',');
            bannerImageUrl = resTxt[0];
            bannerJumpUrl = resTxt[1];
            if(resTxt[2] != ""){
                bannerText = resTxt[2];
            }
            bannerContentID = resTxt[3];

            createBannerWindow();
        });
        request.addEventListener("error", () => {
            console.error("バナー情報取得に失敗しました。");
            //alert("バナー情報取得に失敗しました。");
        });
        // リクエストを送信する
        request.send();
    };

    const createBannerWindow = function() {
        // ウィンドウ
        bannerWindow = new Window_Banner(bnrWindowX, bnrWindowY, bnrWindowWdith, bnrWindowHeight);
        bannerWindow.openness = 0;
        bannerWindow.open();
        SceneManager._scene.addWindow(bannerWindow);
        // アイコン
        var sprite = new Sprite();
        sprite.bitmap = ImageManager.loadBitmap('img/pictures/', ImageFile);
        sprite.x = 5;
        sprite.y = 5;
        bannerWindow.addChild(sprite);
        // テキスト
        bannerWindow.contents.clear();
        var str = bannerText;
        str = str.slice(0, 27);
        for(;;){
            if(str.indexOf('<br>') > 0){
                str = str.replace( '<br>', '\n' ); 
            }else{
                break;
            }
        }
        bannerWindow.drawTextAutoWrap(str, 105, 0, bannerWindow.contentsWidth());

    }

    Window_Banner.prototype.drawTextAutoWrap = function(text, x, y, width){
        var textState = { index: 0, x: x, y: y, left: x };
        this.contents.fontSize = fontsize;
        textState.text = this.convertEscapeCharacters(text);
        textState.height = this.calcTextHeight(textState, false);
        this.resetFontSettings();
        this.contents.fontSize = fontsize;
        while (textState.index < textState.text.length) {
            this.processCharacter(textState);
            if(textState.x + this.calcCharacterWidth(textState.text[textState.index]) >= width){
                textState.text = textState.text.slice(0, textState.index) + '\n' + 
                textState.text.slice(textState.index, textState.text.length);
            }
        }
    };

    Window_Banner.prototype.calcCharacterWidth = function(c){
        switch (c) {
            case '\n':   return 0;
            case '\f':   return 0;
            case '\x1b': return 0;
            default:     return this.textWidth(c);
        }
    };

    var _update = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function(){
        _update.call(this);
        if (TouchInput.isTriggered()) {
            if(bannerWindow != null){
                if(TouchInput.x > bannerWindow.x && TouchInput.x < (bannerWindow.x + bannerWindow.width) &&
                    TouchInput.y > bannerWindow.y && TouchInput.y < (bannerWindow.y + bannerWindow.height)){
                    TouchInput.clear();
                    Input.clear();
                    var win = window.open(bannerJumpUrl, '_blank');
                    if (win) {
                        win.focus();
                    } else {
                        SceneManager.openPopupBlockerMessage();
                    }
                }
            }
        }
    };

    var getClassName = function(object) {
        return object.constructor.toString().replace(/function\s+(.*)\s*\([\s\S]*/m, '$1');
    };

    var _Window__createAllParts = Window.prototype._createAllParts;
    Window.prototype._createAllParts = function() {
        _Window__createAllParts.apply(this, arguments);
        var className = getClassName(this);
        if(className === 'Window_Banner'){
            this._createBannerBackImage();
        }

    };

    Window.prototype._createBannerBackImage = function() {
        this._windowBackSprite.visible  = false;
        this._windowFrameSprite.visible = false;
        var bitmap = ImageManager.loadPicture(BackImageFile);
        var sprite = new Sprite_WindowBackImage(bitmap);
        sprite.x = OffsetX;
        sprite.y = OffsetY;
        sprite.scale.x = (ScaleX || 100) / 100;
        sprite.scale.y = (ScaleY || 100) / 100;
        this._windowSpriteContainer.addChild(sprite);
    };


    function Sprite_WindowBackImage() {
        this.initialize.apply(this, arguments);
    }

    Sprite_WindowBackImage.prototype             = Object.create(Sprite.prototype);
    Sprite_WindowBackImage.prototype.constructor = Sprite_WindowBackImage;

    Sprite_WindowBackImage.prototype.initialize = function(bitmap) {
        Sprite.prototype.initialize.call(this);
        this.bitmap   = bitmap;
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
    };

    var _Scene_Title_create = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function() {
        _Scene_Title_create.call(this);
        
        //createBannerWindow();

        getBannerInfo();

        /*WindowManager.setFontSize(fontsize);
        WindowManager.show(0, bnrWindowX, bnrWindowY, bnrWindowWdith, bnrWindowHeight);
        //WindowManager.drawPicture(0, ImageFile);
        var sprite = new Sprite();
        sprite.bitmap = ImageManager.loadBitmap('img/pictures/', 'banner_icon');
        sprite.x = 15;
        sprite.y = 20;
        bannerWindow.addChild(sprite);

        var str = "あああああああああいいいいいいいいいうううううううううえええええええええ";
        str = str.slice(0, 27);
        for(;;){
            if(str.indexOf('<br>') > 0){
                str = str.replace( '<br>', '\n' ); 
            }else{
                break;
            }
        }
        WindowManager.drawText(0, str);
        WindowManager.setUrl("https://www.google.co.jp/");*/
 
    };


})();