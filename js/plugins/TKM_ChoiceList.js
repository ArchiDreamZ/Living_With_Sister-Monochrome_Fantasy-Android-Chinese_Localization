//=============================================================================
// TKM_ChoiceList.js
// by Tsukimi
// Last Updated: 2018.02.20
//=============================================================================

/*:
 * @plugindesc TKM_ChoiceList
 * @author Tsukimi
 * 
 * @param use
 * @text use TKM choice list
 * @desc use TKM choice list or not.
 * @type boolean
 * @default true
 * 
 * @param -- Choice settings --
 * @desc 
 * @default 
 * 
 * @param image
 * @text window image name
 * @desc The custom image name of choices.
 * blank -> use normal Window image.
 * @default Window_subchoice
 * 
 * @param tone
 * @text selected-window's tone
 * @desc the selected choice's tone
 * in format of: 'r, g, b'. RGB range:(-255, 255)
 * @default 100, -40, 40
 * 
 * @param fontSize
 * @text font size
 * @desc default font size of choices.
 * @default 28
 * 
 * @param okFlashDuration
 * @text ok flash duration
 * @desc the flash duration after ok is pressed.(frame)
 * @default 30
 * 
 * @param okFlashFrequency
 * @text ok flash frequency
 * @desc the flash color changing frequency.(frame)
 * @default 4
 * 
 * @param textAlign
 * @text text alignment
 * @desc the alignment of text in choices.
 * 0=left, 1=center, 2=right
 * @default 0
 * 
 * @param -- Advanced settings --
 * @desc 
 * @default 
 * 
 * @param backOpacity
 * @text window back Opacity
 * @desc back opacity of choice window.
 * MV default: 192
 * @default 255
 * 
 * @param fontOLWidth
 * @text font outline width
 * @desc font outline width of choices.
 * decimal is OK.
 * @default 3
 * 
 * @param fontOLColor
 * @text font outline color
 * @desc font outline color.
 * in format of: 'rgba(r, g, b, a)'.
 * @default rgba(0, 0, 0, 0.5)
 * 
 * @param vertiPadding
 * @text outer vertical padding
 * @desc padding between choices.
 * @type number
 * @min 0
 * @default 8
 * 
 * @param choiceHoriPadding
 * @text inner horizontal padding
 * @desc horizontal padding inside choice.
 * @type number
 * @min 0
 * @default 32
 * 
 * @param choiceVertiPadding
 * @text inner vertical padding
 * @desc vertical padding inside choice.
 * @type number
 * @min 0
 * @default 5
 * 
 * @param maxRows
 * @text max rows
 * @desc max number of shown choices.
 * @type number
 * @min 1
 * @default 4
 * 
 * @param maxRowsC
 * @text max rows(center)
 * @desc max number of shown choices when message window
 * is located center.
 * @type number
 * @min 1
 * @default 3
 * 
 * @param mineLineWidth
 * @text min line width
 * @desc the minimum line width of choices.
 * @type number
 * @min 1
 * @default 96
 * 
 * 
 * @help
 * TKM_ChoiceList
 * Author Tsukimi
 * 
 * Another style of Choice List.
 * each choice has it's own window.
 * 
 * -----------------
 * Plugin Command
 * 
 * choicelist_offset [number] [number]
 * 　move the whole choice list.
 * 
 * 　example: choicelist_offset 0 40
 * 　　move choice list up 40 pixels.
 * 
 * 
 * choicelist_offset [x/y] [number]
 * 　move the whole choice list on x/y coordinate.
 * 
 * 　example: choicelist_offset x 30
 * 　　move choice list right 30 pixels.
 * 
 * 
 * 
 * TKMchoicelist_setting [parameter name] [parameter]
 * 　set plugin parameters dynamically.
 * 
 * 　example: TKMchoicelist_setting backOpacity 128
 * 　　set back opacity to 128.
 * 
 */

/*:ja
 * @plugindesc ツキミ式選択肢
 * @author ツキミ
 * 
 * @param use
 * @text ツキミ式選択肢を使う
 * @desc ツキミ式選択肢を使う
 * @type boolean
 * @default true
 * 
 * @param -- Choice settings --
 * @text -- 選択肢設定 --
 * @desc 
 * @default 
 * 
 * @param image
 * @text ウィンドウ画像名
 * @desc 選択肢のウィンドウに使われる画像の名前
 * @default Window_subchoice
 * 
 * @param tone
 * @text 選択された選択肢のトーン
 * @desc 選択された選択肢のトーン
 * 記入例: 'r, g, b'. RGB値の範囲:(-255, 255)
 * @default 100, -40, 40
 * 
 * @param fontSize
 * @text フォントサイズ
 * @desc デフォルトのフォントサイズ
 * @default 28
 * 
 * @param okFlashDuration
 * @text 決定後フラッシュの持続時間
 * @desc 決定キーで選択された選択肢をフラッシュさせる
 * フラッシュの持続時間（単位：フレーム）
 * @default 30
 * 
 * @param okFlashFrequency
 * @text 決定後フラッシュの頻度
 * @desc 決定キーで選択された選択肢のフラッシュの変化速度
 * @default 4
 * 
 * @param textAlign
 * @text 文字揃え
 * @desc 文字の揃え位置を指定する。
 * 0=左揃え, 1=中央揃え, 2=右揃え
 * @default 0
 * 
 * @param -- Advanced settings --
 * @text -- 詳細設定 --
 * @desc 
 * @default 
 * 
 * @param backOpacity
 * @text ウィンドウ背景の不透明度
 * @desc ウィンドウ背景の不透明度
 * MV のデフォルトは 192。
 * @default 255
 * 
 * @param fontOLWidth
 * @text 字の枠線の太さ
 * @desc 字の枠線の太さ。小数点OK。
 * @default 3
 * 
 * @param fontOLColor
 * @text 字の枠線の色
 * @desc 字の枠線の色
 * 記入例: 'rgba(r, g, b, a)'.
 * @default rgba(0, 0, 0, 0.5)
 * 
 * @param vertiPadding
 * @text 選択肢間の余白
 * @desc 選択肢間の余白
 * @type number
 * @min 0
 * @default 8
 * 
 * @param choiceHoriPadding
 * @text 選択肢内の余白(横)
 * @desc 選択肢内の横の余白
 * @type number
 * @min 0
 * @default 32
 * 
 * @param choiceVertiPadding
 * @text 選択肢内の余白(縦)
 * @desc 選択肢内の縦の余白
 * @type number
 * @min 0
 * @default 5
 * 
 * @param maxRows
 * @text 表示される選択肢数の上限
 * @desc 一度に表示される選択肢数の上限。
 * この値を超えるとスクロールが出てきます。
 * @type number
 * @min 1
 * @default 4
 * 
 * @param maxRowsC
 * @text 表示される選択肢数の上限（中央）
 * @desc メッセージウィンドウの位置が中央にある時の
 * 一度に表示される選択肢数の上限。
 * @type number
 * @min 1
 * @default 3
 * 
 * @param mineLineWidth
 * @text 最小文字列幅
 * @desc 文字列の幅の下限。これにより選択肢の幅が
 * 一定以上であることが保証される。
 * @type number
 * @min 1
 * @default 96
 * 
 * 
 * 
 * @help
 * ツキミ式選択肢ウィンドウ
 * 作者 ツキミ
 * 
 * ツキミ式の選択肢ウィンドウです。
 * 一つの選択肢ウィンドウの代わりに、各選択肢が自分のウィンドウ
 * を持ち、色々なエフェクトが使えます。
 * 
 * -----------------
 * プラグインコマンド：
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 * 
 * choicelist_offset [数字] [数字]
 * 　選択肢ウィンドウをズレさせる。
 * 
 * 　例：Choicelist_offset 0 40
 * 　　選択肢ウィンドウを上へ40ピクセルズレさせる。
 * 
 * 
 * choicelist_offset [x/y] [数字]
 * 　選択肢ウィンドウをx/y軸にズレさせる。
 * 
 * 　例：Choicelist_offset x 20
 * 　　選択肢ウィンドウを右へ20ピクセルズレさせる。
 * 
 * 
 * 
 * TKMchoicelist_setting [parameter name] [parameter]
 * 　各パラメータの値を設定する。
 * 
 * 　例: TKMchoicelist_setting backOpacity 128
 * 　　ウィンドウ背景の不透明度を128にする。
 * 
 * -----------------
 * 
 */
var Imported = Imported || {};
Imported.TKM_ChoiceList = true;
var $TKMvar = $TKMvar || {};


function Window_TKMChoiceList() {
    this.initialize.apply(this, arguments);
}
Window_TKMChoiceList.prototype = Object.create(Window_ChoiceList.prototype);
Window_TKMChoiceList.prototype.constructor = Window_TKMChoiceList;

function Window_TKMChoice() {
    this.initialize.apply(this, arguments);
}
Window_TKMChoice.prototype = Object.create(Window_Base.prototype);
Window_TKMChoice.prototype.constructor = Window_TKMChoice;


(function() {
    'use strict';
    
    var pluginName = 'TKM_ChoiceList';
    var parameters = PluginManager.parameters(pluginName);
    var getParam = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };
    var getNumber = function(paramNames) {
        var num = Number(getParam(paramNames)) || 0;
        return num;
    };
    
    $TKMvar.choiceList = {};
    var choiceList = $TKMvar.choiceList;
    // PARAMETER
    
    choiceList.use = (getParam("use") === 'true') ? true : false;
    
    // *** window
    choiceList.image = getParam("image");
    if(choiceList.image === '') choiceList.image = 'Window';
    
    choiceList.tone = getParam("tone").split(',');
    for(var i = 0; i < choiceList.tone.length; i++) 
        choiceList.tone[i] = Number(choiceList.tone[i]) || 0;
    
    choiceList.backOpacity = getNumber("backOpacity") || 192;
    
    // *** font
    choiceList.fontSize    = getNumber("fontSize") || 28;
    choiceList.fontOLWidth = getNumber("fontOLWidth") || 3;
    choiceList.fontOLColor = getParam("fontOLColor");
    
    // *** padding
    choiceList.vertiPadding       = getNumber("vertiPadding");
    choiceList.choiceHoriPadding  = getNumber("choiceHoriPadding");
    choiceList.choiceVertiPadding = getNumber("choiceVertiPadding");
    
    // *** flash after choosed
    choiceList.okFlashDuration    = getNumber("okFlashDuration"); // duration
    choiceList.okFlashFrequency   = getNumber("okFlashFrequency"); // frequency
    
    // *** other
    choiceList.maxRows  = getNumber("maxRows") || 1;
    choiceList.maxRowsC = getNumber("maxRowsC") || 1;
    choiceList.mineLineWidth = getNumber("mineLineWidth") || 96;
    choiceList.textAlign = getNumber("textAlign");
    
    choiceList.offsetX = 0;
    choiceList.offsetY = 0;
    
    //=======================
    // コマンドの処理
    //=======================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        
        // command の処理
        switch ((command || '').toUpperCase()) {
            case 'CHOICELIST_OFFSET':
                var coord = args[0].toUpperCase();
                if(coord === 'X') 
                    $TKMvar.choiceList.offsetX = Number(args[1]) || 0;
                else if(coord === 'Y') 
                    $TKMvar.choiceList.offsetY = Number(args[1]) || 0;
                else {
                    $TKMvar.choiceList.offsetX = Number(args[0]) || 0;
                    $TKMvar.choiceList.offsetY = Number(args[1]) || 0;
                }
                break;
                
            case 'TKMCHOICELIST_SETTING':
                switch(args[0]) {
                    case 'use':
                        var use = (args[1] === 'true');
                        if(use !== $TKMvar.choiceList.use) {
                            $TKMvar.choiceList.use = use;
                            if(SceneManager._scene._messageWindow) 
                                SceneManager._scene._messageWindow.recreateChoiceWindow();
                        }
                        break;
                        
                    case 'image':
                        $TKMvar.choiceList.image = args[1];
                        if($TKMvar.choiceList.use && SceneManager._scene._messageWindow) {
                            var itemWindows = SceneManager._scene._messageWindow._choiceWindow._itemWindows;
                            for(var i = 0; i < itemWindows.length; i++) itemWindows[i].loadWindowskin();
                        }
                        break;
                        
                    case 'tone':
                        $TKMvar.choiceList.tone = [];
                        var tone = args.slice(1).join(' ').split(',');
                        for(var i = 0; i < tone.length; i++) 
                             $TKMvar.choiceList.tone[i] = Number(tone[i]) || 0;
                        break;
                        
                    case 'fontOLColor':
                        $TKMvar.choiceList.fontOLColor = args.slice(1).join(' ');
                        break;
                        
                    default:
                        $TKMvar.choiceList[args[0]] = Number(args[1]);
                        break;
                              }
                break;
        }
    };
    
    //-----------------------------------------------------------------------------
    // Window_ChoiceList
    //
    // offset settings
    
    var _Window_ChoiceList_updatePlacement = Window_ChoiceList.prototype.updatePlacement;
    Window_ChoiceList.prototype.updatePlacement = function() {
        _Window_ChoiceList_updatePlacement.apply(this, arguments);
        this.x += $TKMvar.choiceList.offsetX;
        this.y += $TKMvar.choiceList.offsetY;
    };
    
    //-----------------------------------------------------------------------------
    // Window_TKMChoiceList
    //
    // The window used for the event command [Show Choices].

    Window_TKMChoiceList.prototype.initialize = function(messageWindow) {
        this._itemWindows = [];
        this.previousTopIndex = null;
        Window_ChoiceList.prototype.initialize.apply(this, arguments);
        this._oked = false;
        this._okWait = 0;
    };

    // set rect of each choice, including size, padding, etc.

    Window_TKMChoiceList.prototype.itemRect = function(index) {
        var rect = Window_ChoiceList.prototype.itemRect.apply(this, arguments);
        var hp = this.horiPadding(), vp = this.vertiPadding();
        rect.x += hp;
        rect.y += vp;
        rect.width -= hp*2;
        rect.height -= vp*2;
        return rect;
    };

    Window_TKMChoiceList.prototype.itemRectForText = function(index) {
        var rect = Window_ChoiceList.prototype.itemRectForText.apply(this, arguments);
        var hp = this.choiceHoriPadding(), vp = this.choiceVertiPadding();
        rect.x += hp;
        rect.y += vp;
        rect.width -= hp*2;
        rect.height -= vp*2;
        return rect;
    };
    
    Window_TKMChoiceList.prototype.lineHeight = function() {
        // var height = Window_ChoiceList.prototype.lineHeight.apply(this, arguments);
        //return height + Min( ($TKMvar.choiceList.fontSize - 28), 0 );
        return Math.max(($TKMvar.choiceList.fontSize + 8), 36);
    };

    Window_TKMChoiceList.prototype.itemHeight = function() {
        var height = Window_ChoiceList.prototype.itemHeight.apply(this, arguments);
        return height + (this.choiceVertiPadding() + this.vertiPadding()) * 2;
    };

    Window_TKMChoiceList.prototype.choiceHoriPadding = function() {
        return $TKMvar.choiceList.choiceHoriPadding; // padding in choice - horizontal
    };

    Window_TKMChoiceList.prototype.choiceVertiPadding = function() {
        return $TKMvar.choiceList.choiceVertiPadding; // padding in choice - vertical
    };

    Window_TKMChoiceList.prototype.horiPadding = function() {
        return 0; // padding between choice - horizontal
    };

    Window_TKMChoiceList.prototype.vertiPadding = function() {
        return $TKMvar.choiceList.vertiPadding; // padding between choice - vertical
    };

    Window_TKMChoiceList.prototype.fittingHeight = function(numLines) {
        return numLines * this.itemHeight() + this.standardPadding() * 2;
    };

    // choice width

    Window_TKMChoiceList.prototype.maxChoiceWidth = function() {
        var maxWidth = Window_ChoiceList.prototype.maxChoiceWidth.apply(this, arguments);
        maxWidth += (this.horiPadding() + this.choiceHoriPadding()) * 2;
        var minWidth = $TKMvar.choiceList.mineLineWidth;
        if(maxWidth < minWidth) maxWidth = minWidth;
        return maxWidth;
    };

    Window_TKMChoiceList.prototype.numVisibleRows = function() {
        var positionType = $gameMessage.positionType();
        var choices = $gameMessage.choices();
        var numLines = choices.length;
        var maxLines = $TKMvar.choiceList.maxRows;
        if (positionType === 1) {
            maxLines = $TKMvar.choiceList.maxRowsC;
        }
        if (numLines > maxLines) {
            numLines = maxLines;
        }
        return numLines;
    };

    /*
    Window_TKMChoiceList.prototype.windowWidth = function() {
        var width = Window_ChoiceList.prototype.windowWidth.apply(this, arguments);
        width += this.choiceHoriPadding() * 2;
        return Math.min(width, Graphics.boxWidth);
    };*/

    // open sub-windows instead of this window

    Window_TKMChoiceList.prototype.open = function() {
        Window_ChoiceList.prototype.open.apply(this, arguments);
        this.openness = 255;
        this._windowContentsSprite.opacity = 0;
        var maxItems = this.maxPageItems();
        for (var i = 0; i < maxItems; i++) {
            if(this._itemWindows[i] && !this._itemWindows[i]._opening) {
                this._itemWindows[i].openness = 0;
                this._itemWindows[i].open();
            }
        }
    };

    Window_TKMChoiceList.prototype.close = function() {
        Window_ChoiceList.prototype.close.apply(this, arguments);
        this.previousTopIndex = null;
        var maxItems = this.maxPageItems();
        for(var i = 0; i < maxItems; i++) {
            if(this._itemWindows[i] && !this._itemWindows[i]._closing) this._itemWindows[i].close();
        }
    };

    Window_TKMChoiceList.prototype.updateOpen = function() {
        if (this._opening) {
            if (!this._itemWindows[0] || this._itemWindows[0].isOpen()) {
                this._opening = false;
            }
        }
    };

    Window_TKMChoiceList.prototype.updateClose = function() {
        if (this._closing) {
            var index = this._index - this.topIndex();
            if(index < 0 || index >= this._itemWindows.length) index = 0;
            if (!this._itemWindows[index] || this._itemWindows[index].isClosed()) {
                this._closing = false;
                this.openness = 0;
            }
        }
    };

    Window_TKMChoiceList.prototype.isOpen = function() {
        return ( !this._itemWindows[0] || this._itemWindows[0].isOpen() );
    };

    Window_TKMChoiceList.prototype.isClosed = function() {
        var index = this._index - this.topIndex();
        if(index < 0 || index >= this._itemWindows.length) index = 0;
        return ( !this._itemWindows[index] || this._itemWindows[index].isClosed() );
    };

    Window_TKMChoiceList.prototype.setBackgroundType = function(type) {
        Window_ChoiceList.prototype.setBackgroundType.apply(this, [2]);
        for(var i = 0; i < this._itemWindows.length; i++) {
            this._itemWindows[i].setBackgroundType(type);
        }
    };

    Window_TKMChoiceList.prototype.drawAllItems = function() {
        var topIndex = this.topIndex();
        if(this.previousTopIndex !== topIndex) {
            this.previousTopIndex = topIndex;
            for(var i = 0; i < this._itemWindows.length; i++) 
                this._itemWindows[i]._windowContentsSprite.opacity = 96;
            //this._windowContentsSprite.opacity = 96;
        }
        var i = 0;
        for (; i < this.maxPageItems(); i++) {
            var index = topIndex + i;
            if (index < this.maxItems()) {
                this.drawItemWindow(index, i);
                //this.drawItem(index);
            }
            else break;
        }
        for(; i < this._itemWindows.length; i++) {
            this._itemWindows[i].openness = 0;
        }
    };
/*
    Window_TKMChoiceList.prototype.drawItem = function(index) {
        var rect = this.itemRectForText(index);
        this.drawTextEx(this.commandName(index), rect.x, rect.y+Math.max((28-$TKMvar.choiceList.fontSize)/2, 0) );
    };
    Window_TKMChoiceList.prototype.drawItemBackGround = function(index, i) {
        var rect = this.itemRect(index);
        var p = this.padding;
        if(!this._itemWindows[i]) {
            this._itemWindows[i] = new Window_TKMChoice();
            this.addChildToBack(this._itemWindows[i]);
        }
        this._itemWindows[i].move(rect.x+p, rect.y+p, rect.width, rect.height);
    };*/

    Window_TKMChoiceList.prototype.drawItemWindow = function(index, i) {
        var rect = this.itemRect(index);
        var p = this.padding;
        if(!this._itemWindows[i]) {
            this._itemWindows[i] = new Window_TKMChoice();
            this.addChildToBack(this._itemWindows[i]);
        }
        this._itemWindows[i].move(rect.x+p, rect.y+p, rect.width, rect.height);
        this._itemWindows[i].refresh();
        var centerPadding = Math.max((28-$TKMvar.choiceList.fontSize)/2, 0);
        var hp = this.choiceHoriPadding(), vp = this.choiceVertiPadding();
        var textWidth = this._itemWindows[i].textWidthEx(this.commandName(index));
        var alignPadding = (rect.width-2*hp-textWidth)*$TKMvar.choiceList.textAlign/2;
        this._itemWindows[i].drawTextEx(this.commandName(index), hp+alignPadding, vp+centerPadding );
    };


    // select changes sub-window's tone
    Window_TKMChoiceList.prototype.select = function(index) {
        var visualIndex = this._index - this.topIndex();
        if(this._itemWindows[visualIndex]) this._itemWindows[visualIndex].unselect();
        Window_ChoiceList.prototype.select.apply(this, arguments);
        visualIndex = this._index - this.topIndex();
        if(this._itemWindows[visualIndex]) this._itemWindows[visualIndex].select();
    };

    Window_TKMChoiceList.prototype.updateCursor = function() {
        // Window_ChoiceList.prototype.updateCursor.apply(this, arguments);
    };

    // change font settings
    // for measure text width
    Window_TKMChoiceList.prototype.resetFontSettings = function() {
        Window_ChoiceList.prototype.resetFontSettings.call(this);
        this.contents.fontSize = $TKMvar.choiceList.fontSize;
    };

    Window_TKMChoiceList.prototype.refresh = function() {
        //for(var i = 0; i < this._itemWindows.length; i++) this._itemWindows[i].contents.clear();
        Window_ChoiceList.prototype.refresh.call(this);
    };

    /*
    Window_TKMChoiceList.prototype.processHandling = function() {
        if(this._oked) return;
        Window_ChoiceList.prototype.processHandling.apply(this, arguments);
    };*/
    
    Window_TKMChoiceList.prototype.processOk = function() {
        if (this.isCurrentItemEnabled()) {
            this.playOkSound();
            this.updateInputData();
            // this.deactivate();
            this.oked();
            // this.callOkHandler();
        } else {
            this.playBuzzerSound();
        }
    };
    
    Window_TKMChoiceList.prototype.oked = function() {
        this._oked = true;
        this._okWait = this.okFlashDuration();
        var visualIndex = this._index - this.topIndex();
        for(var i = 0; i < this._itemWindows.length; i++) {
            if(i===visualIndex) continue;
            this._itemWindows[i].close();
        }
    };
    
    Window_TKMChoiceList.prototype.update = function() {
        if(this._oked) {
            Window.prototype.update.apply(this, arguments);
            this.processAfterOk();
        }
        else {
            Window_ChoiceList.prototype.update.apply(this, arguments);
        }
    };
    
    Window_TKMChoiceList.prototype.processAfterOk = function() {
        if(this._oked) {
            var visualIndex = this._index - this.topIndex();
            var item = this._itemWindows[visualIndex];
            if(this._okWait <= 0) {
                this._oked = false;
                item.select();
                this.deactivate();
                this.callOkHandler();
            }
            else {
                if( (this._okWait % this.okFlashFrequency()) === 0) {
                    if(item._selected) item.unselect();
                    else item.select();
                }
                this._okWait--;
            }
        }
    };
    
    Window_TKMChoiceList.prototype.okFlashDuration = function() {
        return $TKMvar.choiceList.okFlashDuration;
    };
    
    Window_TKMChoiceList.prototype.okFlashFrequency = function() {
        return $TKMvar.choiceList.okFlashFrequency;
    };
    
    //-----------------------------------------------------------------------------
    // Window_Message
    //
    // create TKMChoiceWindow

    var _Window_Message_createSubWindows = Window_Message.prototype.createSubWindows;
    Window_Message.prototype.createSubWindows = function() {
        _Window_Message_createSubWindows.apply(this, arguments);
        this.recreateChoiceWindow();
    };
        
    Window_Message.prototype.recreateChoiceWindow = function() {
        var old = this._choiceWindow;
        if($TKMvar.choiceList.use) this._choiceWindow = new Window_TKMChoiceList(this);
        else this._choiceWindow = new Window_ChoiceList(this);
        if(old) {
            var index = SceneManager._scene._windowLayer.children.indexOf(old);
            if(index>=0) {
                SceneManager._scene._windowLayer.removeChild(old);
                SceneManager._scene._windowLayer.addChildAt(this._choiceWindow, index);
            }
        }
    };

    //-----------------------------------------------------------------------------
    // Window_TKMChoice
    //
    // The sub window used for TKM Choice List.

    Window_TKMChoice.prototype.initialize = function() {
        Window_Base.prototype.initialize.call(this, 0, 0, 1, 1);
        this.padding = 0;
        this._selected = false;
        var u = this._windowContentsSprite.update;
        this._windowContentsSprite.update = function() {
            u.apply(this, arguments);
            if(this.opacity<255) this.opacity = (this.opacity+15).clamp(0, 255);
        };
    };

    Window_TKMChoice.prototype.standardPadding = function() {
        return 0;
    };
    
    Window_TKMChoice.prototype.loadWindowskin = function() {
        if($TKMvar.choiceList.image === '') Window_Base.prototype.loadWindowskin.apply(this, arguments);
        else this.windowskin = ImageManager.loadSystem($TKMvar.choiceList.image);
    };

    Window_TKMChoice.prototype.select = function() {
        var tone = this.selectedTone();
        this.setTone(tone[0], tone[1], tone[2]);
        this._selected = true;
    };

    Window_TKMChoice.prototype.unselect = function() {
        var tone = this.selectedTone();
        this.setTone(0, 0, 0);
        this._selected = false;
    };

    Window_TKMChoice.prototype.updateTone = function() {
        // var tone = $gameSystem.windowTone();
        // this.setTone(tone[0], tone[1], tone[2]);
    };

    Window_TKMChoice.prototype.refresh = function() {
        if (this.contents) {
            this.contents.clear();
            this.contents.resize(this.width, this.height);
            this.resetFontSettings();
        }
        this.updateBackOpacity();
    };
    
    Window_TKMChoice.prototype.selectedTone = function() {
        return $TKMvar.choiceList.tone;
    };

    Window_TKMChoice.prototype.standardBackOpacity = function() {
        return $TKMvar.choiceList.backOpacity;
    };

    Window_TKMChoice.prototype.resetFontSettings = function() {
        Window_Base.prototype.resetFontSettings.call(this);
        this.contents.fontSize = $TKMvar.choiceList.fontSize;
        this.contents.outlineWidth = $TKMvar.choiceList.fontOLWidth; // CHANGED
        this.contents.outlineColor = $TKMvar.choiceList.fontOLColor;
    };

    Window_TKMChoice.prototype.textWidthEx = function(text) {
        return this.drawTextEx(text, 0, this.contents.height);
    };
    
    //-----------------------------------------------------------------------------
    // Scene_Boot
    //
    // preload window image
    
    var _Scene_Boot_loadSystemImages = Scene_Boot.loadSystemImages;
    Scene_Boot.loadSystemImages = function() {
        _Scene_Boot_loadSystemImages.apply(this, arguments);
        ImageManager.reserveSystem($TKMvar.choiceList.image);
    };
    
    //-----------------------------------------------------------------------------
    // DataManager
    //
    // make save/load contents
    
    var makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        var contents = makeSaveContents.call(this);
        contents.TKMvar_choiceList = $TKMvar.choiceList;
        return contents;
    };
    
    // セーブデータの読み込み
    // 生成時と同じ形でデータがcontentsに入っているので、変数に格納する
    var extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        extractSaveContents.call(this, contents);
        if(contents.TKMvar_choiceList) $TKMvar.choiceList = contents.TKMvar_choiceList;
    };
    
})();
