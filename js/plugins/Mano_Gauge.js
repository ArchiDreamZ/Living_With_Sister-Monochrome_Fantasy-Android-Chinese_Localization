/*:
 * @plugindesc ピクチャを利用してゲージを表示します。
 * @author しぐれん
 * 
 * @param list
 * @desc 最もシンプルなゲージです。
 * 画像の幅を基準にします。
 * @type struct<GaugeVariable>[]
 * @default []
 * 
 * 
 * @help
 * 1.プラグインパラメータでゲージの設定を登録します。
 * 2.イベントコマンドでゲージとなるピクチャーを表示します。
 * 3.GAUGE_PICTURE ピクチャ番号 名前でゲージ扱いのパラメータを追加します。
 * 
 * ゲージは伸縮タイプとスクロールタイプの2種類です。
 * 
 * ピクチャの一部分を切り取ることでゲージとして使います。
 * 
 * ピクチャの消去を行うと、関連付けられたデータが解除されます。
 * これによって再び普通のピクチャとして使えるようになります。
 * 
 * 
 * ■プラグインコマンド一覧
 * GAUGE_PICTURE ピクチャ番号 ゲージ名称
 * ピクチャに対してゲージ用の設定を取り付けます
 * 
 * GAUGE_REMOVE ピクチャ番号
 * ゲージとピクチャの関連付けを解除します
*/

/*~struct~GaugeVariable:
 * 
 * @param name
 * @text ゲージ識別子
 * @desc ゲージの名前です。
 * プラグインコマンドで使います。
 * 
 * @param valueId
 * @text 変数番号(現在値)
 * @desc ゲージに使う数値の変数番号です。
 * @type variable
 * @default 0
 * 
 * @param maxValueId
 * @text 変数番号(最大値)
 * @desc ゲージの最大値の変数番号です。
 * 変数の状態にかかわらず、数値は最低でも1です。
 * @type variable
 * @default 0
 * 
 * @param maxWidth
 * @text ゲージの最大幅
 * @desc ここで指定した数値と画像の大きさの内、小さい値が使われます。
 * スクロールタイプの時に使います。
 * @type number
 * @default 12345
 * 
 * @param maxHeight
 * @text ゲージの最大高さ
 * @desc ここで指定した数値と画像の大きさの内、小さい値が使われます。
 * スクロールタイプの時に使います。
 * @type number
 * @default 12345
 * 
 * @param filter
 * @text ゲージの種類
 * @desc ゲージの動く方向を指定します。
 * leftとupでゲージがプルプルするのは修整不可です。
 * @type combo
 * @option right
 * @option left
 * @option up
 * @option down
 * @option ScrollLeft
 * @option ScrollUp
 * @default right
 */

(function(){
    'use strict';

class PictureSetting_V2{
    constructor(obj){
//        this.image=String(obj.image);
        this.valueId=Number(obj.valueId);
        this.maxValueId=Number(obj.maxValueId);
        this._filter =String(obj.filter);
        this.maxWidth =Number(obj.maxWidth);
        this.maxheight =Number(obj.maxHeight);
    }
    create(){
        const result = new GaugeValue_Variable();
        result.setValueId(this.valueId);
        result.setMaxValueId(this.maxValueId);
        result._setwidth(this.maxWidth);
        result._setHeight(this.maxheight);
        const filter = FilterFactory.create(this._filter)
        if(filter){
            result.setFilter(filter);
        }
        return result;
    }        
}

/**
 * @param {String[]} textList 
 */
function craeteGaugeImageMap(textList){
    /**
     * @type {Map<String,PictureSetting_V2>} 
     */
    const result = new Map();
    for (const iterator of textList) {
        const obj =JSON.parse(iterator);
        const value = new PictureSetting_V2(obj);
        const key =obj.name;
        result.set(key,value);    
    }
    return result;
}

function getParam(){ return PluginManager.parameters('Mano_Gauge');  }
const setting = (function(){
    const param =getParam();
    /**
     * @type {String[]}
     */
    const imageList=JSON.parse(param.list);
    const result ={
        imageMap:craeteGaugeImageMap(imageList),
    };
    return result;
})();


class GaugeManager_T{
    constructor(){

        /**
         * @type {GaugeValueBase[]}
         */
        this._list =[]
        /**
         * @type {Number[]}
         */
        this._reserved =[];
    }
    clear(){
        for (const iterator of this._list) {
            iterator.setSprite(null);
        }
        this._list.length=0;
        this._reserved.length=0;
    }
    /**
     * @param {Sprite} sprite 
     */
    remove(sprite){
        for (let index = 0; index < this._list.length; index++) {
            const value = this._list[index];
            if(value.sprite ===sprite){
                value.setSprite(null);
                this._list.splice(index,1);
            }
        }
    }

    /**
     * @param {Sprite} sprite 
     */
    add(sprite){
        /**
         * @type {String}
         */
        const name = sprite.gaugeName();
        if(name ===""){
            this.remove(sprite);
            return;
        }
        if(!sprite.bitmap){
            return;
        }

        const data= setting.imageMap.get(name);
        const gaugeValue = data.create();

        const _this=this;
        sprite.bitmap.addLoadListener(function(){
            gaugeValue.setSprite(sprite);
            _this._list.push(gaugeValue);
        });
    }
    update(){
        for (const iterator of this._list) {
            iterator.update();
        }

        for (let index = 0; index < this._list.length; index++) {
            const element = this._list[index];
            if(!element.sprite){
                this._list.splice(index,1);
            }
        }
    }
    /**
     * @param {Spriteset_Base} spriteset 
     */
    bindSprite(spriteset){
        if(this._reserved.length >0){
            for (const iterator of this._reserved) {
                spriteset.bindGaugeAt(iterator);
            }
            this._reserved.length =0;
        }
    }
    /**
     * @param {Number} picutureid 
     */
    reservePicuture(picutureid){
        this._reserved.push(picutureid);
    }
}

function onLoadOrNewGame() {
    GaugeManager.clear();
}

const DataManager_createGameObjects=DataManager.createGameObjects;
DataManager.createGameObjects=function() {
    DataManager_createGameObjects.call(this);
    onLoadOrNewGame();
};
const DataManager_extractSaveContents =DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents){
    DataManager_extractSaveContents.call(this,contents);
    onLoadOrNewGame();
};

class ReadOnly_GaugeValueBase{
    /**
     * @returns {Sprite}
     * @desc 所持しているSpriteを返す 実際の実行時には常にnullでないものを返す
     */
    get sprite(){
        return null;
    }
    get time(){
        return 0;
    }

    get value(){
        return 5;
    }
    get maxValue(){
        return 10;
    }
    get gaugeRate(){
        const m =Math.max(this.maxValue,1);
        return this.value/m;
    }
    get maxWidth(){
        return 1024;
    }
    get maxheight(){
        return 1024;
    }
    get bitmapWidth(){
        return 2048;
    }
    get bitmapHeight(){
        return 2048;
    }
}

class GaugeValueBase extends ReadOnly_GaugeValueBase{
    constructor(){
        super();
        this._setwidth(1024);
        this._setHeight(1024);
        this._timer=0;
        /**
         * @type {GaugeFilterBase[]}
         */
        this._filters=[];
        this.setFilter(null);
        this.setSprite(null);
    }
    /**
     * @param {GaugeFilterBase} filter 
     */
    setFilter(filter){
        this._filter =filter;
    }

    get bitmapWidth(){
        return this._sprite.bitmap.width;
    }
    get bitmapHeight(){
        return this._sprite.bitmap.height;
    }

    get sprite(){
        return this._sprite;
    }

    get time(){
        return this._timer;
    }
    update(){
        if(this.name()===""){
            this.setSprite(null);
            return;
        }
        if(this._filter && this._sprite){
            const baseRect = new Rectangle(0,0,this.bitmapWidth,this.bitmapHeight);
            this._filter.update(this,baseRect);
            // for (const iterator of this._filters) {
            //     iterator.update(this,baseRect);
            // }
            this._sprite.setFrame(baseRect.x,baseRect.y,baseRect.width,baseRect.height);
        }
    }
    /**
     * @param {Number} w 
     */
    _setwidth(w){
        this._width=w;
    }

    get maxWidth(){
        return this._width;
    }
    /**
     * @param {Number} h 
     */
    _setHeight(h){
        this._height=h;
    }

    get maxheight(){
        return this._height;
    }
    /**
     * @param {Sprite} sprite 
     */
    setSprite(sprite){
        this._sprite=sprite;
        if(sprite){
            if(sprite.bitmap){
                this._setwidth(Math.min(this._width , sprite.bitmap.width));
                this._setHeight(Math.min( this._height, sprite.bitmap.height));
            }
            this.onLoad();
        }
    }
    /**
     * @returns {String}
     */
    name(){
        if(this._sprite){
            return this._sprite.gaugeName();
        }
        return "";
    }
    onLoad(){}
}

class GaugeValue_Variable extends GaugeValueBase{
    constructor(){
        super();
        this.setValueId(0);
        this.setMaxValueId(0);
    }
    onLoad(){
        super.onLoad();
    }
    /**
     * @param {Number} id 
     */
    setValueId(id){
        this._valueId =id;
    }
    /**
     * @param {Number} id 
     */
    setMaxValueId(id){
        this._maxValueId =id;
    }
    get value(){
        return $gameVariables.value(this._valueId);
    }
    get maxValue(){
        return $gameVariables.value(this._maxValueId);
    }
}

class GaugeFilterBase{
    /**
     * @param {ReadOnly_GaugeValueBase} gaugeValue 
     * @param {Rectangle} rect 
     */
    update(gaugeValue,rect){}
}


class FilterFactory_T {
    constructor(){
        /**
         * @type {Map<String,()=>GaugeFilterBase}
         */
        this._map = new Map();
    }
    /**
     * 
     * @param {String} key 
     */
    create(key){
        const func = this._map.get(key);
        if(func){
            return func();
        }
        return null;
    }
    /**
     * @param {String} key 
     * @param {()=> GaugeFilterBase} func 
     */
    addFunction(key,func){
        this._map.set(key,func);
    }
    /**
     * @param {String} key 
     * @param {typeof GaugeFilterBase} filterType 
     */
    addClass(key,filterType){
        const filterMakeFunction =(function(){
            return new filterType();
        });
        this.addFunction(key,filterMakeFunction);
    }
}

const FilterFactory= new FilterFactory_T();

class GaugeFilter_Up extends GaugeFilterBase{
    /**
     * @param {ReadOnly_GaugeValueBase} gaugeValue 
     * @param {Rectangle} rect 
     */
    update(gaugeValue,rect){
        rect.height *= gaugeValue.gaugeRate;
        rect.y = gaugeValue.maxheight - rect.height;
        gaugeValue.sprite.y += rect.y;
    }
}
FilterFactory.addClass("up",GaugeFilter_Up);

class GaugeFilter_Down extends GaugeFilterBase{
    /**
     * @param {ReadOnly_GaugeValueBase} gaugeValue 
     * @param {Rectangle} rect 
     */
    update(gaugeValue,rect){
        rect.height *= gaugeValue.gaugeRate;
    }
}
FilterFactory.addClass("down",GaugeFilter_Down);

class GaugeFilter_Left extends GaugeFilterBase{
    /**
     * @param {ReadOnly_GaugeValueBase} gaugeValue 
     * @param {Rectangle} rect 
     */
    update(gaugeValue,rect){
        rect.width *= gaugeValue.gaugeRate;
        rect.x = gaugeValue.maxWidth - rect.width;
        gaugeValue.sprite.x += rect.x;
    }
}
FilterFactory.addClass("left",GaugeFilter_Left);

class GaugeFilter_Right extends GaugeFilterBase{
    /**
     * @param {ReadOnly_GaugeValueBase} gaugeValue 
     * @param {Rectangle} rect 
     */
    update(gaugeValue,rect){
        rect.width *= gaugeValue.gaugeRate;
    }
}
FilterFactory.addClass("right",GaugeFilter_Right);

class GaugeFilter_ScrollLeft extends GaugeFilterBase{
    /**
     * @param {ReadOnly_GaugeValueBase} gaugeValue 
     * @param {Rectangle} rect 
     */
    update(gaugeValue,rect){
        const x_Base= gaugeValue.bitmapWidth -gaugeValue.maxWidth;
        rect.x = x_Base *gaugeValue.gaugeRate;
        rect.width = gaugeValue.maxWidth;
    }
}
FilterFactory.addClass("ScrollLeft",GaugeFilter_ScrollLeft);
class GaugeFilter_ScrollUp extends GaugeFilterBase{
    /**
     * @param {ReadOnly_GaugeValueBase} gaugeValue 
     * @param {Rectangle} rect 
     */
    update(gaugeValue,rect){
        const y_Base= gaugeValue.bitmapHeight -gaugeValue.maxheight;

        rect.y = y_Base *gaugeValue.gaugeRate;  // Math.min(x_test,x_Max);
        rect.height = gaugeValue.maxheight;
    }
}
FilterFactory.addClass("ScrollUp",GaugeFilter_ScrollUp);

Sprite.prototype.gaugeName =function(){
    return "";
};
const Spriteset_Base_update=Spriteset_Base.prototype.update;
Spriteset_Base.prototype.update =function(){
    Spriteset_Base_update.call(this);
    GaugeManager.bindSprite(this);
    GaugeManager.update();
};
Spriteset_Base.prototype.bindGaugeAt =function(picutureid){
    const sprite= this._pictureContainer.getChildAt(picutureid-1);
    if(sprite ){
        sprite.bindGauge();
    }
}

const Spriteset_Base_createPictures=Spriteset_Base.prototype.createPictures;
Spriteset_Base.prototype.createPictures=function(){
    Spriteset_Base_createPictures.call(this);
    this.addListener("removed",function(){
        GaugeManager.clear();
    });
};
/**
 *  * @param {Number} id 
 * @param {String} name 
 */
function gaugePicture(id,name){
    const pic = $gameScreen.picture(id);
    if(!pic){return false;}

    const o=  setting.imageMap.get(name);
    if(o){
        pic.setGaugeName(name);
        GaugeManager.reservePicuture(id);
        return true;
    }
    return false;
}
/**
 * @param {Number} id 
 */
function gaugeRemove(id){
    const pic = $gameScreen.picture(id);
    if(!pic){return false;}
    pic.setGaugeName("");
    GaugeManager.reservePicuture(id);
}


const Game_Interpreter_pluginCommand =Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(cmd,args){

    if(cmd[0]!=='G'){
        Game_Interpreter_pluginCommand.call(this,cmd,args);
        return;
    }
    switch (cmd) {
        case "GAUGE_PICTURE":
            gaugePicture(Number(args[0]),args[1]);
            break;
        case "GAUGE_REMOVE":
            gaugeRemove(Number(args[0]));
            break;
        default:
            break;
    }
};


const GaugeManager = new GaugeManager_T();
/**
 * @param {String} name
 */
Game_Picture.prototype.setGaugeName =function(name){
    this._gaugeName=name;
};
Game_Picture.prototype.getGaugeName =function(){
    return this._gaugeName ||"";
};

Game_Picture.prototype.isGaugePicture_MA=function(){
    return !!(this._gaugeName );
};


Sprite_Picture.prototype.gaugeName =function(){
    const p = this.picture();
    if(p){
        return p.getGaugeName();
    }
    return "";
};
// const Sprite_Picture_initialize=Sprite_Picture.prototype.initialize;
// Sprite_Picture.prototype.initialize =function(picId){
//     Sprite_Picture_initialize.call(this,picId);
//     this.bindGauge();
// }

Sprite_Picture.prototype.bindGauge =function(){
    GaugeManager.add(this);
};
})();
