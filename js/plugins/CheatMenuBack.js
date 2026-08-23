/*:
 * @plugindesc [v1.0] 作弊菜单右键/双指返回功能
 * @author 彼梦Archi
 *
 * @param EnableLog
 * @text 开启日志
 * @type boolean
 * @default false
 * @desc 设为true可在控制台查看调试日志。
 *
 * @param TargetEventId
 * @text 目标公共事件ID
 * @type number
 * @default 100
 * @desc 作弊菜单所在的公共事件编号。
 *
 * @help
 * ============================================================================
 * 功能概述
 * ============================================================================
 * 本插件专为嵌套 Show Choices 的作弊菜单（Common Event 100）设计，
 * 实现以下三种场景的正确行为：
 *
 * 1. 右键/双指（主动取消）→ 直接返回上一级菜单，不显示"已生效"
 * 2. 选择选项后（如"有/无"、输入数值后点对勾）→ 先显示"已生效，刷新后显示"，
 *    然后自动返回上一级菜单
 * 3. 最外层菜单取消 → 退出作弊菜单（显示"已生效"）
 *
 * ============================================================================
 * 技术细节
 * ============================================================================
 *
 * 1. 目标事件锁定
 *    - 仅拦截 Common Event 100 的事件列表，通过比对解释器的 _list 与
 *      $dataCommonEvents[100].list 确认，避免误伤其他公共事件。
 *
 * 2. 核心判断依据：_branch[this._indent] 的值
 *    - 当值为 -2 时，表示用户主动取消（右键/双指/ESC）
 *    - 当值为 6 时，表示选项执行完毕后的自动取消（如选择了"有"后自动触发取消分支）
 *    - 当值为其他数字时，表示选择了某个具体选项（如 0、1、2…）
 *    利用这个区别，插件能准确区分"用户想返回"和"选项执行完毕需要显示提示"。
 *
 * 3. 主动取消（branch === -2）的处理
 *    - 在 command403 中直接执行跳转：查找当前指令的父级 102（缩进更浅的 Show Choices），
 *      清除所有缩进 ≥ 当前缩进的 _branch 记录，设置 _index 到父级 102 的前一条指令，
 *      设置 _indent 为父级缩进，返回 false 阻止当前帧继续执行。
 *      下一帧解释器自动 _index++ 后执行父级 102，重新显示上一级菜单。
 *
 * 4. 选项执行完毕后的取消（branch !== -2）的处理
 *    - 在 command403 中设置 _returnAfterApplied = true，并记录当前 _index 到 _cancelIndex，
 *      然后调用原版 command403（走原版取消分支，让事件继续执行）。
 *    - 事件继续执行后会遇到 command230（等待20帧），此时设置 _aboutToShowApplied = true。
 *    - 随后遇到 command101（显示"已生效，刷新后显示"），检测到 _aboutToShowApplied 为 true，
 *      则显示文本后，基于 _cancelIndex（首次记录的位置）查找父级并跳转，最后清除所有标记。
 *
 * 5. 输入数值的特殊处理
 *    - 输入数值（command103）时，设置 _pendingReturn = true 并记录 _inputIndex。
 *    - 后续的 command403 检测到 _pendingReturn 为 true 时，直接走原版。
 *    - 同样经过 command230 → command101 流程，跳转时基于 _inputIndex 查找父级。
 *
 * 6. 多次 command403 触发的保护
 *    - 非输入数值的取消会触发多个层级的 command403（从最深到最浅）。
 *    - 插件只在第一次触发时记录 _cancelIndex（最深层位置），后续触发忽略，
 *      确保跳转基准始终是玩家实际操作的子菜单位置，而不是外层菜单。
 *
 * 7. 跳转算法 findParentChoice(list, baseIndex)
 *    - 从 baseIndex 向前遍历事件列表。
 *    - 寻找第一个 code === 102（Show Choices）且 indent < 当前指令 indent 的指令。
 *    - 返回该指令的 index 和 command 对象。
 *    - 若找不到（已在最外层），返回 null。
 *
 * 8. 跳转执行 jumpToParentFrom(interpreter, baseIndex)
 *    - 调用 findParentChoice 获取父级。
 *    - 清除 _branch 中所有缩进 ≥ 父级缩进的记录（防止残留状态干扰）。
 *    - 设置 interpreter._index = parent.index - 1（下一帧自动 +1 后停在 parent.index）。
 *    - 设置 interpreter._indent = parent.command.indent。
 *    - 返回 false 让解释器停止当前帧。
 *
 * 9. 兼容性
 *    - 使用 ES5 语法，兼容 RMMV 内置的 Chromium 49 内核。
 *    - 所有原生方法别名前均检查 typeof === 'function'，避免崩溃。
 *    - 不修改 Window_ChoiceList、Scene_Map 等核心类。
 *    - 插件需放在 MPP_ChoiceEX 等选项增强插件之后加载。
 *    - 不依赖任何第三方插件。
 *
 * ============================================================================
 * 使用方法
 * ============================================================================
 * 1. 将本插件放入 js/plugins/ 目录。
 * 2. 在 RPG Maker MV 的插件管理器中启用，拖至最底部。
 * 3. 参数说明：
 *    - EnableLog：调试时设为 true，正式发布设为 false。
 *    - TargetEventId：目标公共事件 ID，默认 100（即作弊菜单）。
 * 4. 无需修改 Common Event 100 的任何内容。
 *
 * ============================================================================
 * 常见问题
 * ============================================================================
 * Q: 为什么不用 _branch[this._indent] === 6 来判断取消？
 * A: 早期版本曾尝试使用该条件，但发现在某些场景下 _branch 尚未更新为 6，
 *    而 -2 是 RMMV 原生用于标识"用户主动取消"的稳定值，更为可靠。
 *
 * Q: 为什么右键/双指不显示"已生效"？
 * A: 用户主动取消意味着"我不想改这个了，回去"，直接返回更符合直觉。
 *    只有实际执行了某个选项（修改了数据）后才需要提示"已生效"。
 *
 * Q: 为什么跳转时要设置 _index = parent.index - 1？
 * A: 解释器每帧开始时自动 _index++，因此设到前一条可使下一帧
 *    准确停在父级 102 指令上。
 *
 * Q: 为什么返回 false 而不是 true？
 * A: 返回 true 会让解释器继续执行取消分支后面的指令（通常是空指令），
 *    导致事件流向下冒泡。返回 false 则立即终止当前帧，跳转生效。
 *
 * ============================================================================
 */

(function() {
    'use strict';

    var parameters = PluginManager.parameters('CheatMenuBack');
    var ENABLE_LOG = parameters['EnableLog'] === 'true';
    var TARGET_EVENT_ID = Number(parameters['TargetEventId']) || 100;

    function log(msg) {
        if (ENABLE_LOG) console.log('[CheatMenuBack] ' + msg);
    }

    // 标记与状态
    var _pendingReturn = false;       // 输入数值后需要返回
    var _returnAfterApplied = false;  // 非输入数值选项执行后需要返回
    var _inputIndex = -1;             // 输入数值时的解释器位置
    var _cancelIndex = -1;            // 非输入数值选项执行时的解释器位置（首次记录）
    var _aboutToShowApplied = false;  // 即将显示"已生效"文本

    function isTargetEvent(interpreter) {
        var ce = $dataCommonEvents[TARGET_EVENT_ID];
        return !!(ce && interpreter._list === ce.list);
    }

    // 查找基于 baseIndex 的父级选项指令（code 102）
    function findParentChoice(list, baseIndex) {
        var cmd = list[baseIndex];
        if (!cmd) return null;
        var currentIndent = cmd.indent;
        for (var i = baseIndex - 1; i >= 0; i--) {
            var c = list[i];
            if (c && c.code === 102 && c.indent < currentIndent) {
                return { index: i, command: c };
            }
        }
        return null;
    }

    // 跳转到基于 baseIndex 的父级菜单
    function jumpToParentFrom(interpreter, baseIndex) {
        var parent = findParentChoice(interpreter._list, baseIndex);
        if (!parent) {
            log('jumpToParentFrom: no parent for baseIndex ' + baseIndex);
            return false;
        }
        var parentIndent = parent.command.indent;
        for (var key in interpreter._branch) {
            if (Number(key) >= parentIndent) {
                delete interpreter._branch[key];
            }
        }
        var newIndex = parent.index - 1;
        if (newIndex < 0) newIndex = 0;
        interpreter._index = newIndex;
        interpreter._indent = parent.command.indent;
        log('Jumped to parent index ' + parent.index + ' (from baseIndex ' + baseIndex + ')');
        return true;
    }

    // 拦截 command103（输入数值）
    var _command103 = Game_Interpreter.prototype.command103;
    if (typeof _command103 === 'function') {
        Game_Interpreter.prototype.command103 = function() {
            if (isTargetEvent(this)) {
                _pendingReturn = true;
                _inputIndex = this._index;
                log('command103: Input Number, _pendingReturn=true, _inputIndex=' + _inputIndex);
            }
            return _command103.call(this);
        };
    }

    // 拦截 command230（等待）
    var _command230 = Game_Interpreter.prototype.command230;
    if (typeof _command230 === 'function') {
        Game_Interpreter.prototype.command230 = function() {
            if (isTargetEvent(this) && (_pendingReturn || _returnAfterApplied)) {
                _aboutToShowApplied = true;
                log('command230: Waiting, about to show applied text');
            }
            return _command230.call(this);
        };
    }

    // 拦截 command101（显示文本）
    var _command101 = Game_Interpreter.prototype.command101;
    if (typeof _command101 === 'function') {
        Game_Interpreter.prototype.command101 = function() {
            var target = isTargetEvent(this);
            if (_aboutToShowApplied && target) {
                log('command101: Showing applied text, will return to parent');
                var result = _command101.call(this);
                var baseIndex;
                if (_pendingReturn) {
                    baseIndex = _inputIndex >= 0 ? _inputIndex : this._index;
                } else if (_returnAfterApplied) {
                    baseIndex = _cancelIndex >= 0 ? _cancelIndex : this._index;
                } else {
                    baseIndex = this._index;
                }
                jumpToParentFrom(this, baseIndex);
                // 清除所有标记
                _pendingReturn = false;
                _returnAfterApplied = false;
                _inputIndex = -1;
                _cancelIndex = -1;
                _aboutToShowApplied = false;
                return false;
            }
            return _command101.call(this);
        };
    }

    // 拦截 command403（取消分支）
    var _command403 = Game_Interpreter.prototype.command403;
    Game_Interpreter.prototype.command403 = function() {
        var target = isTargetEvent(this);
        log('command403: index=' + this._index + ', indent=' + this._indent + 
            ', target=' + target + ', pendingReturn=' + _pendingReturn + 
            ', returnAfterApplied=' + _returnAfterApplied + 
            ', branch=' + this._branch[this._indent]);

        if (!target) {
            return _command403.call(this);
        }

        // 输入数值后的取消：走原版
        if (_pendingReturn) {
            log('command403: Pending return active, using original');
            return _command403.call(this);
        }

        var branchResult = this._branch[this._indent];

        if (branchResult === -2) {
            // 用户主动取消（右键/双指）：直接跳转
            log('command403: User cancel (branch=-2), jumping directly');
            var parent = findParentChoice(this._list, this._index);
            if (parent) {
                var currentIndent = this._list[this._index].indent;
                for (var key in this._branch) {
                    if (Number(key) >= currentIndent) {
                        delete this._branch[key];
                    }
                }
                var newIndex = parent.index - 1;
                if (newIndex < 0) newIndex = 0;
                this._index = newIndex;
                this._indent = parent.command.indent;
                log('command403: Direct jump to parent index ' + parent.index);
                return false;
            } else {
                log('command403: No parent for direct jump, using original');
                return _command403.call(this);
            }
        } else {
            // 选项执行完毕后的自动取消：设置标记等待"已生效"
            if (!_returnAfterApplied) {
                _returnAfterApplied = true;
                _cancelIndex = this._index;
                log('command403: Option executed (branch=' + branchResult + '), set _returnAfterApplied, _cancelIndex=' + _cancelIndex);
            } else {
                log('command403: Additional cancel ignored (keeping _cancelIndex=' + _cancelIndex + ')');
            }
            return _command403.call(this);
        }
    };

    log('CheatMenuBack v1.0 loaded.');

})();