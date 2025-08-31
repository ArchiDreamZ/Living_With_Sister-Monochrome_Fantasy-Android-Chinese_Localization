//=============================================================================
// EnemyBook.js
//=============================================================================

/*:
 * @plugindesc Displays detailed statuses of enemies.
 * @author Yoji Ojima
 *
 * @param Unknown Data
 * @desc The index name for an unknown enemy.
 * @default ??????
 *
 * @help
 *
 * Plugin Command:
 *   EnemyBook open         # Open the enemy book screen
 *   EnemyBook add 3        # Add enemy #3 to the enemy book
 *   EnemyBook remove 4     # Remove enemy #4 from the enemy book
 *   EnemyBook complete     # Complete the enemy book
 *   EnemyBook clear        # Clear the enemy book
 *
 * Enemy Note:
 *   <desc1:foobar>         # Description text in the enemy book, line 1
 *   <desc2:blahblah>       # Description text in the enemy book, line 2
 *   <book:no>              # This enemy does not appear in the enemy book
 */

/*:ja
 * @plugindesc モンスター図鑑です。敵キャラの詳細なステータスを表示します。
 * @author Yoji Ojima
 *
 * @param Unknown Data
 * @desc 未確認の敵キャラの索引名です。
 * @default ？？？？？？
 *
 * @help
 *
 * プラグインコマンド:
 *   EnemyBook open         # 図鑑画面を開く
 *   EnemyBook add 3        # 敵キャラ３番を図鑑に追加
 *   EnemyBook remove 4     # 敵キャラ４番を図鑑から削除
 *   EnemyBook complete     # 図鑑を完成させる
 *   EnemyBook clear        # 図鑑をクリアする
 *
 * 敵キャラのメモ:
 *   <desc1:なんとか>       # 説明１行目
 *   <desc2:かんとか>       # 説明２行目
 *   <book:no>              # 図鑑に載せない場合
 */

(function() {

    var parameters = PluginManager.parameters('EnemyBook');
    var unknownData = String(parameters['Unknown Data'] || '??????');

    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'EnemyBook') {
            switch (args[0]) {
            case 'open':
                SceneManager.push(Scene_EnemyBook);
                break;
            case 'add':
                $gameSystem.addToEnemyBook(Number(args[1]));
                break;
            case 'remove':
                $gameSystem.removeFromEnemyBook(Number(args[1]));
                break;
            case 'complete':
                $gameSystem.completeEnemyBook();
                break;
            case 'clear':
                $gameSystem.clearEnemyBook();
                break;
            }
        }
    };

    Game_System.prototype.addToEnemyBook = function(enemyId) {
        if (!this._enemyBookFlags) {
            this.clearEnemyBook();
        }
        this._enemyBookFlags[enemyId] = true;
    };

    Game_System.prototype.removeFromEnemyBook = function(enemyId) {
        if (this._enemyBookFlags) {
            this._enemyBookFlags[enemyId] = false;
        }
    };

    Game_System.prototype.completeEnemyBook = function() {
        this.clearEnemyBook();
        for (var i = 1; i < $dataEnemies.length; i++) {
            this._enemyBookFlags[i] = true;
        }
    };

    Game_System.prototype.clearEnemyBook = function() {
        this._enemyBookFlags = [];
    };

    Game_System.prototype.isInEnemyBook = function(enemy) {
        if (this._enemyBookFlags && enemy) {
            return !!this._enemyBookFlags[enemy.id];
        } else {
            return false;
        }
    };

    var _Game_Troop_setup = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function(troopId) {
        _Game_Troop_setup.call(this, troopId);
        this.members().forEach(function(enemy) {
            if (enemy.isAppeared()) {
                $gameSystem.addToEnemyBook(enemy.enemyId());
            }
        }, this);
    };

    var _Game_Enemy_appear = Game_Enemy.prototype.appear;
    Game_Enemy.prototype.appear = function() {
        _Game_Enemy_appear.call(this);
        $gameSystem.addToEnemyBook(this._enemyId);
    };

    var _Game_Enemy_transform = Game_Enemy.prototype.transform;
    Game_Enemy.prototype.transform = function(enemyId) {
        _Game_Enemy_transform.call(this, enemyId);
        $gameSystem.addToEnemyBook(enemyId);
    };

    function Scene_EnemyBook() {
        this.initialize.apply(this, arguments);
    }

    Scene_EnemyBook.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_EnemyBook.prototype.constructor = Scene_EnemyBook;

    Scene_EnemyBook.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_EnemyBook.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this._indexWindow = new Window_EnemyBookIndex(0, 0);
        this._indexWindow.setHandler('cancel', this.popScene.bind(this));
        var wy = this._indexWindow.height;
        var ww = Graphics.boxWidth;
        var wh = Graphics.boxHeight - wy;
        this._statusWindow = new Window_EnemyBookStatus(0, wy, ww, wh);
        this.addWindow(this._indexWindow);
        this.addWindow(this._statusWindow);
        this._indexWindow.setStatusWindow(this._statusWindow);
    };

    function Window_EnemyBookIndex() {
        this.initialize.apply(this, arguments);
    }

    Window_EnemyBookIndex.prototype = Object.create(Window_Selectable.prototype);
    Window_EnemyBookIndex.prototype.constructor = Window_EnemyBookIndex;

    Window_EnemyBookIndex.lastTopRow = 0;
    Window_EnemyBookIndex.lastIndex  = 0;

    Window_EnemyBookIndex.prototype.initialize = function(x, y) {
        var width = Graphics.boxWidth;
        var height = this.fittingHeight(6);
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
        this.setTopRow(Window_EnemyBookIndex.lastTopRow);
        this.select(Window_EnemyBookIndex.lastIndex);
        this.activate();
    };

    Window_EnemyBookIndex.prototype.maxCols = function() {
        return 3;
    };

    Window_EnemyBookIndex.prototype.maxItems = function() {
        return this._list ? this._list.length : 0;
    };

    Window_EnemyBookIndex.prototype.setStatusWindow = function(statusWindow) {
        this._statusWindow = statusWindow;
        this.updateStatus();
    };

    Window_EnemyBookIndex.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);
        this.updateStatus();
    };

    Window_EnemyBookIndex.prototype.updateStatus = function() {
        if (this._statusWindow) {
            var enemy = this._list[this.index()];
            this._statusWindow.setEnemy(enemy);
        }
    };

    Window_EnemyBookIndex.prototype.refresh = function() {
        this._list = [];
        for (var i = 1; i < $dataEnemies.length; i++) {
            var enemy = $dataEnemies[i];
            if (enemy.name && enemy.meta.book !== 'no') {
                this._list.push(enemy);
            }
        }
        this.createContents();
        this.drawAllItems();
    };

    Window_EnemyBookIndex.prototype.drawItem = function(index) {
        var enemy = this._list[index];
        var rect = this.itemRectForText(index);
        var name;
        if ($gameSystem.isInEnemyBook(enemy)) {
            name = enemy.name;
        } else {
            name = unknownData;
        }
        this.drawText(name, rect.x, rect.y, rect.width);
    };

    Window_EnemyBookIndex.prototype.processCancel = function() {
        Window_Selectable.prototype.processCancel.call(this);
        Window_EnemyBookIndex.lastTopRow = this.topRow();
        Window_EnemyBookIndex.lastIndex = this.index();
    };

    function Window_EnemyBookStatus() {
        this.initialize.apply(this, arguments);
    }

    Window_EnemyBookStatus.prototype = Object.create(Window_Base.prototype);
    Window_EnemyBookStatus.prototype.constructor = Window_EnemyBookStatus;

    Window_EnemyBookStatus.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._enemy = null;
        this._enemySprite = new Sprite();
        this._enemySprite.anchor.x = 0.5;
        this._enemySprite.anchor.y = 0.5;
        this._enemySprite.x = width / 2 - 20;
        this._enemySprite.y = height / 2;
        this.addChildToBack(this._enemySprite);
        this.refresh();
    };

    Window_EnemyBookStatus.prototype.setEnemy = function(enemy) {
        if (this._enemy !== enemy) {
            this._enemy = enemy;
            this.refresh();
        }
    };

    Window_EnemyBookStatus.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if (this._enemySprite.bitmap) {
            var bitmapHeight = this._enemySprite.bitmap.height;
            var contentsHeight = this.contents.height;
            var scale = 1;
            if (bitmapHeight > contentsHeight) {
                scale = contentsHeight / bitmapHeight;
            }
            this._enemySprite.scale.x = scale;
            this._enemySprite.scale.y = scale;
        }
    };

    Window_EnemyBookStatus.prototype.refresh = function() {
        var enemy = this._enemy;
        var x = 0;
        var y = 0;
        var lineHeight = this.lineHeight();

        this.contents.clear();

        if (!enemy || !$gameSystem.isInEnemyBook(enemy)) {
            this._enemySprite.bitmap = null;
            return;
        }

        var name = enemy.battlerName;
        var hue = enemy.battlerHue;
        var bitmap;
        if ($gameSystem.isSideView()) {
            bitmap = ImageManager.loadSvEnemy(name, hue);
        } else {
            bitmap = ImageManager.loadEnemy(name, hue);
        }
        this._enemySprite.bitmap = bitmap;

        this.resetTextColor();
        this.drawText(enemy.name, x, y);

        x = this.textPadding();
        y = lineHeight + this.textPadding();

        for (var i = 0; i < 8; i++) {
            this.changeTextColor(this.systemColor());
            this.drawText(TextManager.param(i), x, y, 160);
            this.resetTextColor();
            this.drawText(enemy.params[i], x + 160, y, 60, 'right');
            y += lineHeight;
        }

        var rewardsWidth = 280;
        x = this.contents.width - rewardsWidth;
        y = lineHeight + this.textPadding();

        this.resetTextColor();
        this.drawText(enemy.exp, x, y);
        x += this.textWidth(enemy.exp) + 6;
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.expA, x, y);
        x += this.textWidth(TextManager.expA + '  ');

        this.resetTextColor();
        this.drawText(enemy.gold, x, y);
        x += this.textWidth(enemy.gold) + 6;
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.currencyUnit, x, y);

        x = this.contents.width - rewardsWidth;
        y += lineHeight;

        for (var j = 0; j < enemy.dropItems.length; j++) {
            var di = enemy.dropItems[j];
            if (di.kind > 0) {
                var item = Game_Enemy.prototype.itemObject(di.kind, di.dataId);
                this.drawItemName(item, x, y, rewardsWidth);
                y += lineHeight;
            }
        }

        var descWidth = 480;
        x = this.contents.width - descWidth;
        y = this.textPadding() + lineHeight * 7;
        this.drawTextEx(enemy.meta.desc1, x, y + lineHeight * 0, descWidth);
        this.drawTextEx(enemy.meta.desc2, x, y + lineHeight * 1, descWidth);
    };

})();
