//=============================================================================
//
//=============================================================================
/*:
 * @target MV MZ
 * @plugindesc 虚拟按键插件[MV/MZ通用][1.1.4]
 * @author Qiu Jiu
 * @help 
 * QJ_VirtualButton.js
 *=============================================================================
 *使用说明
 *=============================================================================
 *1.插件有可自定义的按键，还有可选的方向键和控制键。
 *  (1)方向键:
 *     考虑到用户有多种需求，所以该插件提供三种方向键，包括四方按键，八方按键和摇杆按键。
 *     在游戏内可固定一种，也可作为“选项”让玩家在游戏内自选。
 *     在游戏内固定使用一种时，需要设置好要使用的按键。
 *     让玩家自选的时，您要把三种方向键都设置好。
 *  (2)控制键：
 *     控制键可以控制其他按键的显示与否。
 *  (3)自定义按键。
 *2.游戏内的摇杆和八方按键支持八方移动，但本身不提供八方移动功能，需要使用其他插件来自行实
 *  现八方移动，然后该插件的摇杆和八方按键就能够让玩家进行八方移动。
 *3.关于按键位置：
 *  首先您要注意“锚点”，然后在位置X和Y中您可以使用以下转义字符：
 *  sw:游戏画面宽度Screen Width。
 *  sh:游戏画面高度Screen Height。
 *  以下两个转义字符在特殊情况下使用，正常使用时您不用管：
 *  ww:窗户宽度Window Width，包括整个游戏窗口的大小，在电脑上的话指游戏界面(package.json中指定)，在手机上指整个游戏屏幕。
 *  wh:窗户高度Window Height，同上。
 *4.虚拟按键的图片需要放在img/virtualButton下。
 *  在文件名最前面写$符号后，图片被分为上下两部分，按钮被按下时显示成下面的样子。
 *5.图片加载模式：
 *  传统模式：使用游戏传统的方式读取图片，在游戏图片被加密时仍可正常读取。
 *  特殊模式：直接使用新方式读取图片，无论游戏其他图片是否加密，此选项更适合用于特殊的
 *           用途，比如移植游戏，额外为游戏加按键。
 *6.按钮显示条件的判断顺序：
 *  控制键控制-场景控制-显示文本时是否隐藏按键-显示开关-显示脚本
 *  只要有一个不符合，那么按键就不会显示。
 *7.关于场景控制：
 *  一个按钮有两个特殊的属性  “场景显示模式”  和  “场景列表”  。
 *  “场景显示模式”选择“true-排除不显示”时，你在“场景列表”中就需要写入你不想让这个按钮显示的场景。
 *              这个模式一般用于设计一些每个场景都显示，只在一两个特殊场景中不显示的通用的按键。
 *  “场景显示模式”选择“false-设置显示”时，你在“场景列表”中就需要写入你想让这个按键显示的场景。
 *              这个模式一般用于设计一些只在特殊场景中显示的按钮。
 *
 *  而这里说的“在场景列表中写入你想让这个按键显示的场景”，是说写场景的内部名字。
 *  新插件中场景的名字需要在插件文件里自行寻找，正常来说开头都是Scene_。
 *  插件名举例（游戏内只写左边的英文）：
 *Scene_Map          地图场景
 *Scene_Menu         菜单场景
 *Scene_Battle       战斗场景
 *Scene_Skill        技能场景
 *Scene_Equip        装备场景
 *Scene_Item         物品场景
 *Scene_Shop         商店场景
 *  注意不要有空格！
 *8.您在发布游戏的时候，可能之前的版本已经设置过按键，在新版本中重设置了按键，想让玩家那边
 *  的按键设置自动刷新，那么您就需要打开插件参数“更新游戏版本后是否重置虚拟按键”。
 *9.脚本指令（非插件指令！无论MV还是MZ，您都得写在“脚本”指令里面）
 *
 *QJ.VB.setForBidTwo(true)                          禁用双指取消，双指取消是说手机上两个手指一起点就相当于按下取消键，这是MV和MZ的默认原生功能。
 *QJ.VB.setForBidTwo(false)                         启用双指取消。
 *
 *QJ.VB.setForBidDestination(true)                  彻底禁用点击移动，点击移动是指用鼠标或者手机点击地图后，玩家可自由移动到那个地方。
 *QJ.VB.setForBidDestination(false)                 启用点击移动。
 *
 *QJ.VB.setForBidButtonDes(true)                    按下按钮时临时不进行点击移动。为了防止按下显示在地图画面内的按钮时点击移动同时也被触发。
 *QJ.VB.setForBidButtonDes(false)                   按下按钮时仍旧进行点击移动。
 *
 *QJ.VB.setForBidTouchInputWhenPress(true)          按下按钮时彻底取消掉系统原生的触摸。为了防止在玩家按下虚拟按键时游戏原生的触摸列表被激活影响操作。
 *QJ.VB.setForBidTouchInputWhenPress(false)         按下按钮时系统原生的触摸仍旧正常运行。
 *
 *10.“控制键控制地图点击寻路”：
 *   将此插件参数设置为true时，便可以实现：
 *   在按钮显示时可以让玩家无法通过点击地图来让角色自动移动，在按钮不显示时玩家可以通过点击地图来让角色自动移动。
 *   注意，此选项正常运行的前是插件参数“是否彻底取消点击移动”被设置为false。
 *
 *=============================================================================
 *使用协议
 *=============================================================================
 *MIT协议
 *此插件可被您免费用于商业或非商业游戏。
 *
 *具体使用条款为：
 *https://qiujiu-9.github.io/?file=001-Terms_Of_Use/1-Chinese
 *
 *=================================Warning=====================================
 *！！！此插件的Demo中的按钮素材为付费素材，若您要制作商业游戏，请自行替换按键素材！！！
 *=================================Warning=====================================
 *
 *=============================================================================
 *更新日志
 *=============================================================================
 *23-4-1 V1.1.4
 *  修复设置了“在电脑上不显示”后，在电脑上依旧可以打开按钮设置界面，且进入界面后报错的问题。
 *23-3-8 V1.1.3
 *  1.修复MZ数据位置读取的问题。
 *  2.将有关MZ原生按键的默认值都改为true，并修改部分实现方式，让使用者体验更好。
 *23-3-7 晚 V1.1.2
 *  1.增加“按下按钮时取消原生触摸”的插件参数。且为部分插件参数增加记忆和游戏内调整功能。
 *  2.修复电脑右键时显示设置选项的问题。
 *  3.修复手机摇杆偏移问题。
 *  4.增加“控制键控制地图点击寻路”的功能，在按钮显示时可以让玩家无法通过点击地图来让角色自动移动，在按钮不显示时便可以通过该办法让角色自动移动。
 *23-3-7 V1.1.1
 *  1.删除按钮编辑界面的部分无用绘制。
 *  2.修复XY的公式定义。
 *  3.增加按钮公共事件的特殊模式设置。
 *23-3-6 V1.1.0
 *  1.修复MZ中游戏进不去的问题。
 *  2.增加按键位置的转义字符。
 *  3.扩展“自选方向键模式”，让作者有更多选择，可单独不使用某个样式的方向键。
 *  4.为按键增加公共事件，这样按下按键后就可以执行公共事件。
 *  5.增加“更新游戏版本后是否重置虚拟按键”的功能，这样作者就能在更新游戏后，主动改变玩家存档内的按键数据。
 *23-3-3 V1.0.0发布于Project1
 *=============================================================================
 *
 *=============================================================================
 *
* @param dirButton
 * @text 方向键设置
 *
 * @param dirButtonShow
 * @type boolean
 * @text 是否启用方向键
 * @desc 是否启用方向键
 * @on 显示
 * @off 不显示
 * @default true
 * @parent dirButton
 *
 * @param dirButtonMode
 * @type select
 * @text 方向键默认设置
 * @desc 方向键默认设置,若该设置不起效，则请检查“自选方向键模式”中是否为“不可自选方向键”或“可自选的按键里包含该按键模式”。
 * @option 使用四方按键
 * @value 0
 * @option 使用八方按键
 * @value 1
 * @option 使用虚拟摇杆
 * @value 2
 * @default 2
 * @parent dirButton
 *
 * @param dirButtonOptional
 * @type select
 * @text 自选方向键模式
 * @desc 是否在游戏内添加选项，让玩家自选使用哪种方向键
 * @option 不可自选方向键
 * @value 0
 * @option 在四方和八方按键中切换
 * @value 1
 * @option 在四方和摇杆按键中切换 
 * @value 2
 * @option 在八方和摇杆按键中切换
 * @value 3
 * @option 在摇杆，四方和八方按键中切换
 * @value 4
 * @default 4
 * @parent dirButton
 *
 * @param dirButtonSetting
 * @type struct<dirButtonSettingList>
 * @text 方向键设置
 * @desc 方向键设置
 * @default {"pos":"","xDefault":"0","yDefault":"sh","xAnchor":"0","yAnchor":"1","phoneFitModeLR":"0","phoneFitModeUD":"0","scale":"","scaleDefault":"100","opacity":"","opacityDefault":"255","show":"","controlBy":"true","sceneControlMode":"true","sceneList":"[]","textHide":"false","switch":"0","visibleScript":"\"\"","extra":"","scriptIn":"\"\"","scriptOut":"\"\"","commonEventIn":"0","commonEventOut":"0","commonEventMode":"0"}
 * @parent dirButton
 *
 * @param dirButtonSettingMode0
 * @type struct<dirButtonSettingMode0>
 * @text 四方按键特殊设置
 * @desc 四方按键特殊设置
 * @default {"2":"2","4":"4","6":"6","8":"8"}
 * @parent dirButton
 *
 * @param dirButtonSettingMode1
 * @type struct<dirButtonSettingMode1>
 * @text 八方按键特殊设置
 * @desc 八方按键特殊设置
 * @default {"1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9"}
 * @parent dirButton
 *
 * @param dirButtonSettingMode2
 * @type struct<dirButtonSettingMode2>
 * @text 摇杆按键特殊设置
 * @desc 摇杆按键特殊设置
 * @default {"c1":"$circle1","c2":"circle2","8Dir":"false"}
 * @parent dirButton
 *
* @param controlButton
 * @text 控制键设置
 *
 * @param controlButtonShow
 * @type boolean
 * @text 是否启用控制键
 * @desc 是否启用控制键
 * @on 显示
 * @off 不显示
 * @default true
 * @parent controlButton
 *
 * @param controlButtonDes
 * @type boolean
 * @text 控制键控制地图点击寻路
 * @desc 控制键控制点击移动。是否在显示按键时取消点击移动，不显示按键时恢复点击移动，注意，此选项正常运行的前是插件参数“是否彻底取消点击移动”被设置为false。
 * @on 控制
 * @off 控制
 * @default false
 * @parent controlButton
 *
 * @param controlButtonSetting
 * @type struct<controlButtonList>
 * @text 控制键设置
 * @desc 控制键设置
 * @default {"base":"","img":"control","pos":"","xDefault":"0","yDefault":"0","xAnchor":"0","yAnchor":"0","phoneFitModeLR":"0","phoneFitModeUD":"0","scale":"","scaleDefault":"100","opacity":"","opacityDefault":"255","show":"","controlBy":"true","sceneControlMode":"true","sceneList":"[]","textHide":"false","switch":"0","visibleScript":"\"\"","extra":"","scriptIn":"\"\"","scriptOut":"\"\"","commonEventIn":"0","commonEventOut":"0","commonEventMode":"0"}
 * @parent controlButton
 *
* @param otherButton
 * @text 其他按键设置
 *
 * @param otherButtonSetting
 * @type struct<otherButtonList>[]
 * @text 按钮设置
 * @desc 按钮设置
 * @default ["{\"base\":\"\",\"img\":\"escape\",\"button\":\"escape\",\"pos\":\"\",\"xDefault\":\"sw\",\"yDefault\":\"0\",\"xAnchor\":\"1\",\"yAnchor\":\"0\",\"phoneFitModeLR\":\"0\",\"phoneFitModeUD\":\"0\",\"scale\":\"\",\"scaleDefault\":\"100\",\"opacity\":\"\",\"opacityDefault\":\"255\",\"show\":\"\",\"controlBy\":\"true\",\"sceneControlMode\":\"true\",\"sceneList\":\"[]\",\"textHide\":\"false\",\"switch\":\"0\",\"visibleScript\":\"\\\"\\\"\",\"extra\":\"\",\"scriptIn\":\"\\\"\\\"\",\"scriptOut\":\"\\\"\\\"\",\"commonEventIn\":\"0\",\"commonEventOut\":\"0\",\"commonEventMode\":\"0\"}","{\"base\":\"\",\"img\":\"pageup\",\"button\":\"pageup\",\"pos\":\"\",\"xDefault\":\"sw\",\"yDefault\":\"70\",\"xAnchor\":\"1\",\"yAnchor\":\"0\",\"phoneFitModeLR\":\"0\",\"phoneFitModeUD\":\"0\",\"scale\":\"\",\"scaleDefault\":\"100\",\"opacity\":\"\",\"opacityDefault\":\"255\",\"show\":\"\",\"controlBy\":\"true\",\"sceneControlMode\":\"true\",\"sceneList\":\"[]\",\"textHide\":\"false\",\"switch\":\"0\",\"visibleScript\":\"\\\"\\\"\",\"extra\":\"\",\"scriptIn\":\"\\\"\\\"\",\"scriptOut\":\"\\\"\\\"\",\"commonEventIn\":\"0\",\"commonEventOut\":\"0\",\"commonEventMode\":\"0\"}","{\"base\":\"\",\"img\":\"pagedown\",\"button\":\"pagedown\",\"pos\":\"\",\"xDefault\":\"sw\",\"yDefault\":\"140\",\"xAnchor\":\"1\",\"yAnchor\":\"0\",\"phoneFitModeLR\":\"0\",\"phoneFitModeUD\":\"0\",\"scale\":\"\",\"scaleDefault\":\"100\",\"opacity\":\"\",\"opacityDefault\":\"255\",\"show\":\"\",\"controlBy\":\"true\",\"sceneControlMode\":\"true\",\"sceneList\":\"[]\",\"textHide\":\"false\",\"switch\":\"0\",\"visibleScript\":\"\\\"\\\"\",\"extra\":\"\",\"scriptIn\":\"\\\"\\\"\",\"scriptOut\":\"\\\"\\\"\",\"commonEventIn\":\"0\",\"commonEventOut\":\"0\",\"commonEventMode\":\"0\"}","{\"base\":\"\",\"img\":\"ok\",\"button\":\"ok\",\"pos\":\"\",\"xDefault\":\"sw\",\"yDefault\":\"sh\",\"xAnchor\":\"1\",\"yAnchor\":\"1\",\"phoneFitModeLR\":\"0\",\"phoneFitModeUD\":\"0\",\"scale\":\"\",\"scaleDefault\":\"100\",\"opacity\":\"\",\"opacityDefault\":\"255\",\"show\":\"\",\"controlBy\":\"true\",\"sceneControlMode\":\"true\",\"sceneList\":\"[]\",\"textHide\":\"false\",\"switch\":\"0\",\"visibleScript\":\"\\\"\\\"\",\"extra\":\"\",\"scriptIn\":\"\\\"\\\"\",\"scriptOut\":\"\\\"\\\"\",\"commonEventIn\":\"0\",\"commonEventOut\":\"0\",\"commonEventMode\":\"0\"}"]
 * @parent otherButton
 *
* @param defaulySystemSetting
 * @text 原生系统功能设置
 *
 * @param forBidTwo
 * @type boolean
 * @text 是否禁止双指
 * @desc 是否禁止系统自带的双指取消(手机端)
 * @default false
 * @parent defaulySystemSetting
 *
 * @param forBidDestination
 * @type boolean
 * @text 是否彻底取消点击移动
 * @desc 玩家使用鼠标或手指点击地图时会触发玩家的自动寻路，您是否要取消掉这个功能。
 * @default false
 * @parent defaulySystemSetting
 *
 * @param forBidButtonDes
 * @type boolean
 * @text 按下按钮时取消点击移动
 * @desc 玩家使用鼠标或手指点击地图时会触发玩家的自动寻路，您是否要在按下任意虚拟按键时取消掉这个功能。
 * @default true
 * @parent defaulySystemSetting
 *
 * @param forBidTouchInputWhenPress
 * @type boolean
 * @text 按下按钮时取消原生触摸
 * @desc 按下按钮时取消原生触摸，在按下任意一个按钮时游戏内的原生触控均无效化。
 * @default true
 * @parent defaulySystemSetting
 *
* @param chaos
 * @text 其他设置
 *
 * @param showOnPc
 * @type boolean
 * @text 是否在电脑上显示
 * @desc 是否在电脑上显示
 * @default true
 * @parent chaos
 *
 * @param zIndex
 * @type number
 * @text 按键zIndex层级
 * @desc 查看插件说明
 * @default 1000
 * @parent chaos
 *
 * @param imageLoadMode
 * @type boolean
 * @text 图片加载模式
 * @desc 图片加载模式
 * @on 传统方法
 * @off 特殊方法
 * @default true
 * @parent chaos
 *
 * @param commonEventActiveScene
 * @type text[]
 * @text 按钮公共事件执行场景
 * @desc 按钮公共事件执行场景。在什么场景内按下按键后可以执行按键绑定的公共事件，此参数主要是为了防止按钮在不恰当的地方执行公共事件而报错。
 * @default ["Scene_Map"]
 * @parent chaos
 *
* @param optional
 * @text 选项设置
 *
 * @param optionalShow
 * @type boolean
 * @text 是否显示按键控制场景
 * @desc 是否在游戏内显示按键控制场景
 * @on 显示
 * @off 不显示
 * @default true
 * @parent optional
 *
 * @param optionalName
 * @type text
 * @text 按键设置名称
 * @desc 按键设置名称
 * @default 虚拟按钮设置
 * @parent optional
 *
 * @param optionalText
 * @type text
 * @text 提示语
 * @desc 提示语
 * @default 点击按钮后，可长按以改变其位置。
 * @parent optional
 *
* @param mzButton
 * @text MZ原生按键设置
 *
 * @param mapMenuButton
 * @type boolean
 * @text 显示地图菜单键
 * @desc 显示地图菜单键
 * @on 显示
 * @off 不显示
 * @default true
 * @parent mzButton
 *
 * @param menuCancelButton
 * @type boolean
 * @text 显示菜单取消键
 * @desc 显示菜单取消键
 * @on 显示
 * @off 不显示
 * @default true
 * @parent mzButton
 *
 * @param menuPageButton
 * @type boolean
 * @text 显示菜单翻页键
 * @desc 显示菜单翻页键
 * @on 显示
 * @off 不显示
 * @default true
 * @parent mzButton
 *
 * @param battleCancelButton
 * @type boolean
 * @text 显示战斗取消键
 * @desc 显示战斗取消键
 * @on 显示
 * @off 不显示
 * @default true
 * @parent mzButton
 *
 * @param repairMZBlack
 * @type boolean
 * @text 修复MZ游戏打开后黑屏
 * @desc 修复MZ游戏打开后黑屏
 * @default true
 * @parent mzButton
 *
* @param saveManager
 * @text 存档调控
 *
 * @param giveupVBConfigWhenVersionChange
 * @type boolean
 * @text 更新游戏版本后是否重置虚拟按键
 * @desc 更新游戏版本后，是否自动重置虚拟按键，这样您就能主动改变玩家存档内的按键数据。
 * @on 是
 * @off 否
 * @default false
 * @parent saveManager
 *
 *
*/
/*~struct~dirButtonSettingList:
 *
 * @param pos
 * @text 位置设置
 *
 * @param xDefault
 * @type text
 * @text x坐标
 * @desc x坐标,sw:游戏画面宽度Screen Width。
 * @default 120
 * @parent pos
 *
 * @param yDefault
 * @type text
 * @text y坐标
 * @desc y坐标,sh:游戏画面高度Screen Height。
 * @default 504
 * @parent pos
 *
 * @param xAnchor
 * @type text
 * @text x锚点
 * @desc x锚点，写0到1的小数。0是以左边为锚点，1是以右边为锚点。
 * @default 0
 * @parent pos
 *
 * @param yAnchor
 * @type text
 * @text y锚点
 * @desc y锚点，写0到1的小数。0是以上边为锚点，1是以下边为锚点。
 * @default 1
 * @parent pos
 *
 * @param phoneFitModeLR
 * @type select
 * @text 手机左右靠边适配
 * @desc 手机左右适配模式，向左右适配时，按钮会向左右浮动以贴近手机边缘，这样就不遮挡屏幕了。
 * @option 不适配
 * @value 0
 * @option 按钮向左靠边
 * @value 1
 * @option 按钮向右靠边
 * @value 2
 * @default 0
 * @parent pos
 *
 * @param phoneFitModeUD
 * @type select
 * @text 手机上下靠边适配
 * @desc 手机上下适配模式，向上下适配时，按钮会向上下浮动以贴近手机边缘，这样就不遮挡屏幕了。
 * @option 不适配
 * @value 0
 * @option 按钮向上靠边
 * @value 1
 * @option 按钮向下靠边
 * @value 2
 * @default 0
 * @parent pos
 *
 * @param scale
 * @text 缩放设置
 *
 * @param scaleDefault
 * @type text
 * @text 缩放率%
 * @desc 缩放率%
 * @default 100
 * @parent scale
 *
 * @param opacity
 * @text 透明度设置
 *
 * @param opacityDefault
 * @type text
 * @text 不透明度
 * @desc 不透明度
 * @default 255
 * @parent opacity
 *
 * @param show
 * @text 显示设置
 *
 * @param controlBy
 * @type boolean
 * @on 被控制
 * @off 被控制
 * @text 是否被控制键控制显示
 * @desc 是否被控制键控制显示
 * @default true
 * @parent show
 *
 * @param sceneControlMode
 * @type boolean
 * @text 场景显示模式
 * @desc 场景显示模式。true:在除特殊场景外的其他场景显示。false:只在特殊场景显示。
 * @on true-排除不显示
 * @off false-设置显示
 * @default true
 * @parent show
 *
 * @param sceneList
 * @type text[]
 * @text 场景列表
 * @desc 场景列表,"场景显示模式"是true时,此处写不显示的场景列表;"场景显示模式"是false时,这里写显示的场景的列表。
 * @default []
 * @parent show
 *
 * @param textHide
 * @type boolean
 * @on 隐藏
 * @off 不隐藏
 * @text 显示文本时隐藏
 * @desc 显示文本时隐藏
 * @default false
 * @parent show
 *
 * @param switch
 * @type switch
 * @text 显示按钮的开关
 * @desc 显示按钮的开关，写0时忽略开关因素。
 * @default 0
 * @parent show
 *
 * @param visibleScript
 * @type note
 * @text 更多显示条件
 * @desc 更多显示条件，不用空着就行
 * @default ""
 * @parent show
 *
 * @param extra
 * @text 其他设置
 *
 * @param scriptIn
 * @type note
 * @text 按下后执行的脚本
 * @desc 按下后执行的脚本，不用空着就行
 * @default ""
 * @parent extra
 *
 * @param scriptOut
 * @type note
 * @text 松开后执行的脚本
 * @desc 松开后执行的脚本，不用空着就行
 * @default ""
 * @parent extra
 *
 * @param commonEventIn
 * @type common_event
 * @text 按下后执行的公共事件
 * @desc 按下后执行的公共事件
 * @default 0
 * @parent extra
 *
 * @param commonEventOut
 * @type common_event
 * @text 松开后执行的公共事件
 * @desc 松开后执行的公共事件
 * @default 0
 * @parent extra
 *
 * @param commonEventMode
 * @type select
 * @text 公共事件执行模式
 * @desc 公共事件执行模式
 * @option 使用系统默认接口
 * @value 0
 * @option 无限触发，按一次触发一次
 * @value 1
 * @option 等待触发，上一次执行完后再按时再执行下一次
 * @value 2
 * @default 0
 * @parent extra
 *
 *
*/
/*~struct~dirButtonSettingMode0:
 *
 * @param 8
 * @type file
 * @dir img/virtualButton
 * @text 上键图片
 * @desc 上键图片
 * @default 8
 *
 * @param 4
 * @type file
 * @dir img/virtualButton
 * @text 左键图片
 * @desc 左键图片
 * @default 4
 *
 * @param 6
 * @type file
 * @dir img/virtualButton
 * @text 右键图片
 * @desc 右键图片
 * @default 6
 *
 * @param 2
 * @type file
 * @dir img/virtualButton
 * @text 下键图片
 * @desc 下键图片
 * @default 2
 *
*/
/*~struct~dirButtonSettingMode1:
 *
 * @param 9
 * @type file
 * @dir img/virtualButton
 * @text 右上键图片
 * @desc 右上键图片
 * @default 9
 *
 * @param 8
 * @type file
 * @dir img/virtualButton
 * @text 上键图片
 * @desc 上键图片
 * @default 8
 *
 * @param 7
 * @type file
 * @dir img/virtualButton
 * @text 左上键图片
 * @desc 左上键图片
 * @default 7
 *
 * @param 6
 * @type file
 * @dir img/virtualButton
 * @text 右键图片
 * @desc 右键图片
 * @default 6
 *
 * @param 5
 * @type file
 * @dir img/virtualButton
 * @text 中心键图片
 * @desc 中心键图片
 * @default 5
 *
 * @param 4
 * @type file
 * @dir img/virtualButton
 * @text 左键图片
 * @desc 左键图片
 * @default 4
 *
 * @param 3
 * @type file
 * @dir img/virtualButton
 * @text 右下键图片
 * @desc 右下键图片
 * @default 3
 *
 * @param 2
 * @type file
 * @dir img/virtualButton
 * @text 下键图片
 * @desc 下键图片
 * @default 2
 *
 * @param 1
 * @type file
 * @dir img/virtualButton
 * @text 左下键图片
 * @desc 左下键图片
 * @default 1
 *
*/
/*~struct~dirButtonSettingMode2:
 *
 * @param c1
 * @type file
 * @dir img/virtualButton
 * @text 摇杆
 * @desc 摇杆
 * @default circle1
 *
 * @param c2
 * @type file
 * @dir img/virtualButton
 * @text 摇杆背景
 * @desc 摇杆背景
 * @default circle2
 *
 * @param 8Dir
 * @type boolean
 * @text 是否适配八方移动
 * @desc 是否适配八方移动
 * @default false
 *
*/
/*~struct~otherButtonList:
 *
 * @param base
 * @text 基础设置
 *
 * @param img
 * @type file
 * @dir img/virtualButton
 * @text 图片
 * @desc 图片
 * @default normal
 * @parent base
 *
 * @param button
 * @type select
 * @text 按钮
 * @desc 按下此虚拟按键相当于按下某按钮
 * @option 
 * @value 
 * @option shift
 * @value shift
 * @option control
 * @value control
 * @option escape/cancel
 * @value escape
 * @option space/ok
 * @value ok
 * @option pageup
 * @value pageup
 * @option pagedown
 * @value pagedown
 * @option tab
 * @value tab
 * @option backspace
 * @value backspace
 * @option alt
 * @value alt
 * @option left+up(7)
 * @value left+up
 * @option left+down(1)
 * @value left+down
 * @option right+up(9)
 * @value right+up
 * @option right+down(3)
 * @value right+down
 * @option left(4)
 * @value left
 * @option up(2)
 * @value up
 * @option right(6)
 * @value right
 * @option down(8)
 * @value down
 * @option 0
 * @value numpad 0
 * @option 1
 * @value numpad 1
 * @option 2
 * @value numpad 2
 * @option 3
 * @value numpad 3
 * @option 4
 * @value numpad 4
 * @option 5
 * @value numpad 5
 * @option 6
 * @value numpad 6
 * @option 7
 * @value numpad 7
 * @option 8
 * @value numpad 8
 * @option 9
 * @value numpad 9
 * @option *
 * @value numpad *
 * @option +
 * @value numpad +
 * @option -
 * @value numpad -
 * @option .
 * @value numpad .
 * @option /
 * @value numpad /
 * @option a
 * @value A
 * @option b
 * @value B
 * @option c
 * @value C
 * @option d
 * @value D
 * @option e
 * @value E
 * @option f
 * @value F
 * @option g
 * @value G
 * @option h
 * @value H
 * @option i
 * @value I
 * @option j
 * @value J
 * @option k
 * @value K
 * @option l
 * @value L
 * @option m
 * @value M
 * @option n
 * @value N
 * @option o
 * @value O
 * @option p
 * @value P
 * @option q
 * @value Q
 * @option r
 * @value R
 * @option s
 * @value S
 * @option t
 * @value T
 * @option u
 * @value U
 * @option v
 * @value V
 * @option w
 * @value W
 * @option x
 * @value X
 * @option y
 * @value Y
 * @option z
 * @value Z
 * @option 小键盘0
 * @value num 0
 * @option 小键盘1
 * @value num 1
 * @option 小键盘2
 * @value num 2
 * @option 小键盘3
 * @value num 3
 * @option 小键盘4
 * @value num 4
 * @option 小键盘5
 * @value num 5
 * @option 小键盘6
 * @value num 6
 * @option 小键盘7
 * @value num 7
 * @option 小键盘8
 * @value num 8
 * @option 小键盘9
 * @value num 9
 * @option insert
 * @value insert
 * @option del
 * @value del
 * @default X
 * @parent base
 *
 * @param pos
 * @text 位置设置
 *
 * @param xDefault
 * @type text
 * @text x坐标
 * @desc x坐标,sw:游戏画面宽度Screen Width。
 * @default sw
 * @parent pos
 *
 * @param yDefault
 * @type text
 * @text y坐标
 * @desc y坐标,sh:游戏画面高度Screen Height。
 * @default sh
 * @parent pos
 *
 * @param xAnchor
 * @type text
 * @text x锚点
 * @desc x锚点，写0到1的小数。0是以左边为锚点，1是以右边为锚点。
 * @default 0
 * @parent pos
 *
 * @param yAnchor
 * @type text
 * @text y锚点
 * @desc y锚点，写0到1的小数。0是以上边为锚点，1是以下边为锚点。
 * @default 1
 * @parent pos
 *
 * @param phoneFitModeLR
 * @type select
 * @text 手机左右靠边适配
 * @desc 手机左右适配模式，向左右适配时，按钮会向左右浮动以贴近手机边缘，这样就不遮挡屏幕了。
 * @option 不适配
 * @value 0
 * @option 按钮向左靠边
 * @value 1
 * @option 按钮向右靠边
 * @value 2
 * @default 0
 * @parent pos
 *
 * @param phoneFitModeUD
 * @type select
 * @text 手机上下靠边适配
 * @desc 手机上下适配模式，向上下适配时，按钮会向上下浮动以贴近手机边缘，这样就不遮挡屏幕了。
 * @option 不适配
 * @value 0
 * @option 按钮向上靠边
 * @value 1
 * @option 按钮向下靠边
 * @value 2
 * @default 0
 * @parent pos
 *
 * @param scale
 * @text 缩放设置
 *
 * @param scaleDefault
 * @type text
 * @text 缩放率%
 * @desc 缩放率%
 * @default 100
 * @parent scale
 *
 * @param opacity
 * @text 透明度设置
 *
 * @param opacityDefault
 * @type text
 * @text 不透明度
 * @desc 不透明度
 * @default 255
 * @parent opacity
 *
 * @param show
 * @text 显示设置
 *
 * @param controlBy
 * @type boolean
 * @on 被控制
 * @off 被控制
 * @text 是否被控制键控制显示
 * @desc 是否被控制键控制显示
 * @default true
 * @parent show
 *
 * @param sceneControlMode
 * @type boolean
 * @text 场景显示模式
 * @desc 场景显示模式。true:在除特殊场景外的其他场景显示。false:只在特殊场景显示。
 * @on true-排除不显示
 * @off false-设置显示
 * @default true
 * @parent show
 *
 * @param sceneList
 * @type text[]
 * @text 场景列表
 * @desc 场景列表,"场景显示模式"是true时,此处写不显示的场景列表;"场景显示模式"是false时,这里写显示的场景的列表。
 * @default []
 * @parent show
 *
 * @param textHide
 * @type boolean
 * @on 隐藏
 * @off 不隐藏
 * @text 显示文本时隐藏
 * @desc 显示文本时隐藏
 * @default false
 * @parent show
 *
 * @param switch
 * @type switch
 * @text 显示按钮的开关
 * @desc 显示按钮的开关，写0时忽略开关因素。
 * @default 0
 * @parent show
 *
 * @param visibleScript
 * @type note
 * @text 更多显示条件
 * @desc 更多显示条件，不用空着就行
 * @default ""
 * @parent show
 *
 * @param extra
 * @text 其他设置
 *
 * @param scriptIn
 * @type note
 * @text 按下后执行的脚本
 * @desc 按下后执行的脚本，不用空着就行
 * @default ""
 * @parent extra
 *
 * @param scriptOut
 * @type note
 * @text 松开后执行的脚本
 * @desc 松开后执行的脚本，不用空着就行
 * @default ""
 * @parent extra
 *
 * @param commonEventIn
 * @type common_event
 * @text 按下后执行的公共事件
 * @desc 按下后执行的公共事件
 * @default 0
 * @parent extra
 *
 * @param commonEventOut
 * @type common_event
 * @text 松开后执行的公共事件
 * @desc 松开后执行的公共事件
 * @default 0
 * @parent extra
 *
 * @param commonEventMode
 * @type select
 * @text 公共事件执行模式
 * @desc 公共事件执行模式
 * @option 使用系统默认接口
 * @value 0
 * @option 无限触发，按一次触发一次
 * @value 1
 * @option 等待触发，上一次执行完后再按时再执行下一次
 * @value 2
 * @default 0
 * @parent extra
 *
 *
*/
/*~struct~controlButtonList:
 *
 * @param base
 * @text 基础设置
 *
 * @param img
 * @type file
 * @dir img/virtualButton
 * @text 图片
 * @desc 图片
 * @default control
 * @parent base
 *
 * @param pos
 * @text 位置设置
 *
 * @param xDefault
 * @type text
 * @text x坐标
 * @desc x坐标,sw:游戏画面宽度Screen Width。
 * @default 120
 * @parent pos
 *
 * @param yDefault
 * @type text
 * @text y坐标
 * @desc y坐标,sh:游戏画面高度Screen Height。
 * @default 504
 * @parent pos
 *
 * @param xAnchor
 * @type text
 * @text x锚点
 * @desc x锚点，写0到1的小数。0是以左边为锚点，1是以右边为锚点。
 * @default 0
 * @parent pos
 *
 * @param yAnchor
 * @type text
 * @text y锚点
 * @desc y锚点，写0到1的小数。0是以上边为锚点，1是以下边为锚点。
 * @default 0
 * @parent pos
 *
 * @param phoneFitModeLR
 * @type select
 * @text 手机左右靠边适配
 * @desc 手机左右适配模式，向左右适配时，按钮会向左右浮动以贴近手机边缘，这样就不遮挡屏幕了。
 * @option 不适配
 * @value 0
 * @option 按钮向左靠边
 * @value 1
 * @option 按钮向右靠边
 * @value 2
 * @default 0
 * @parent pos
 *
 * @param phoneFitModeUD
 * @type select
 * @text 手机上下靠边适配
 * @desc 手机上下适配模式，向上下适配时，按钮会向上下浮动以贴近手机边缘，这样就不遮挡屏幕了。
 * @option 不适配
 * @value 0
 * @option 按钮向上靠边
 * @value 1
 * @option 按钮向下靠边
 * @value 2
 * @default 0
 * @parent pos
 *
 * @param scale
 * @text 缩放设置
 *
 * @param scaleDefault
 * @type text
 * @text 缩放率%
 * @desc 缩放率%
 * @default 100
 * @parent scale
 *
 * @param opacity
 * @text 透明度设置
 *
 * @param opacityDefault
 * @type text
 * @text 不透明度
 * @desc 不透明度
 * @default 255
 * @parent opacity
 *
 * @param show
 * @text 显示设置
 *
 * @param controlBy
 * @type boolean
 * @on 被控制
 * @off 被控制
 * @text 是否被控制键控制显示
 * @desc 是否被控制键控制显示
 * @default true
 * @parent show
 *
 * @param sceneControlMode
 * @type boolean
 * @text 场景显示模式
 * @desc 场景显示模式。true:在除特殊场景外的其他场景显示。false:只在特殊场景显示。
 * @on true-排除不显示
 * @off false-设置显示
 * @default true
 * @parent show
 *
 * @param sceneList
 * @type text[]
 * @text 场景列表
 * @desc 场景列表,"场景显示模式"是true时,此处写不显示的场景列表;"场景显示模式"是false时,这里写显示的场景的列表。
 * @default []
 * @parent show
 *
 * @param textHide
 * @type boolean
 * @on 隐藏
 * @off 不隐藏
 * @text 显示文本时隐藏
 * @desc 显示文本时隐藏
 * @default false
 * @parent show
 *
 * @param switch
 * @type switch
 * @text 显示按钮的开关
 * @desc 显示按钮的开关，写0时忽略开关因素。
 * @default 0
 * @parent show
 *
 * @param visibleScript
 * @type note
 * @text 更多显示条件
 * @desc 更多显示条件，不用空着就行
 * @default ""
 * @parent show
 *
 * @param extra
 * @text 其他设置
 *
 * @param scriptIn
 * @type note
 * @text 按下后执行的脚本
 * @desc 按下后执行的脚本，不用空着就行
 * @default ""
 * @parent extra
 *
 * @param scriptOut
 * @type note
 * @text 松开后执行的脚本
 * @desc 松开后执行的脚本，不用空着就行
 * @default ""
 * @parent extra
 *
 * @param commonEventIn
 * @type common_event
 * @text 按下后执行的公共事件
 * @desc 按下后执行的公共事件
 * @default 0
 * @parent extra
 *
 * @param commonEventOut
 * @type common_event
 * @text 松开后执行的公共事件
 * @desc 松开后执行的公共事件
 * @default 0
 * @parent extra
 *
 * @param commonEventMode
 * @type select
 * @text 公共事件执行模式
 * @desc 公共事件执行模式
 * @option 使用系统默认接口
 * @value 0
 * @option 无限触发，按一次触发一次
 * @value 1
 * @option 等待触发，上一次执行完后再按时再执行下一次
 * @value 2
 * @default 0
 * @parent extra
 *
 *
*/
//=============================================================================
//
//=============================================================================
var QJ = QJ || {};
QJ.VB = QJ.VB || {};
QJ.VB.reWrite = {} || {};
//=============================================================================
//
//=============================================================================
var Imported = Imported || {};
Imported.QJVirtualButton = true;
//=============================================================================
//
//=============================================================================
function Game_VB_Base() {
    this.initialize.apply(this, arguments);
}
function Game_VB_Normal() {
    this.initialize.apply(this, arguments);
}
function Game_VB_Control() {
    this.initialize.apply(this, arguments);
}
function Game_VB_Dir() {
    this.initialize.apply(this, arguments);
}
function Scene_VBSetting() {
    this.initialize.apply(this, arguments);
}
function Window_VBSetting() {
    this.initialize.apply(this, arguments);
}
function Window_VBSettingCommand() {
    this.initialize.apply(this, arguments);
}
/*function Window_VBSettingSaveCommand() {
    this.initialize.apply(this, arguments);
}*/
//=============================================================================
//
//=============================================================================
(($ = {})=>{
//=============================================================================
//
//=============================================================================
var QJ = window.QJ;
var VB = QJ.VB;
var loadUrl = "img/virtualButton/";
var isMZ = Utils.RPGMAKER_NAME === 'MZ';
var isMobilePhone = Utils.isMobileDevice();
//=============================================================================
//
//=============================================================================
Math.judgeAndOutAttribute = function(value,defaultValue) {
    if (typeof value !== "number" && !value) return defaultValue;
    value = Number(value);
    if (isNaN(value)) value = defaultValue;
    return value;
};
String.removeMoreBrackets = function(str) {
    if (str[0]==="\""&&str[str.length-1]==="\"") {
        return str.slice(1,str.length-2);
    } else {
        return str;
    }
};
//=============================================================================
//
//=============================================================================
const pluginName = "QJ_VirtualButton";
const parameters = PluginManager.parameters(pluginName);
const imageLoadMode = VB.imageLoadMode = eval(parameters["imageLoadMode"]);
const otherButtonSetting = eval(parameters["otherButtonSetting"]);
const zIndex = Math.judgeAndOutAttribute(parameters["zIndex"],1000);
const showOnPc = parameters["showOnPc"] === "true";
const controlButtonDes = parameters["controlButtonDes"] === "true";
const giveupVBConfigWhenVersionChange = parameters["giveupVBConfigWhenVersionChange"] === "true";
const commonEventActiveScene = parameters["commonEventActiveScene"] ? JsonEx.parse(parameters["commonEventActiveScene"]) : ["Scene_Map"];
//=============================================================================
//
//=============================================================================
VB.buttonList = [];
VB.controlVisible = true;
VB.settingMode = false;
VB.pressButtonTemp = false;
//=============================================================================
//阻止双指   完全阻止点击移动   按下按钮时阻止点击移动   按下按钮时完全阻止触碰
//forBidTwo forBidDestination forBidButtonDes forBidTouchInputWhenPress
//=============================================================================
const forBidTwo = parameters["forBidTwo"] === "true";
VB.forBidTwo = forBidTwo;
//=============================================================================
const forBidDestination = parameters["forBidDestination"] === "true";
VB.forBidDestination = forBidDestination;
//=============================================================================
const forBidButtonDes = parameters["forBidButtonDes"] === "true";
VB.forBidButtonDes = forBidButtonDes;
//=============================================================================
const forBidTouchInputWhenPress = parameters["forBidTouchInputWhenPress"] === "true";
VB.forBidTouchInputWhenPress = forBidTouchInputWhenPress;
//=============================================================================
//
//=============================================================================
QJ.VB.setForBidTwo = function(bool) {
    VB.forBidTwo = !!bool;
    ConfigManager.VBData.forBidTwo = VB.forBidTwo;
    ConfigManager.save();
}
QJ.VB.setForBidDestination = function(bool) {
    VB.forBidDestination = !!bool;
    ConfigManager.VBData.forBidDestination = VB.forBidDestination;
    ConfigManager.save();
}
QJ.VB.setForBidButtonDes = function(bool) {
    VB.forBidButtonDes = !!bool;
    ConfigManager.VBData.forBidButtonDes = VB.forBidButtonDes;
    ConfigManager.save();
}
QJ.VB.setForBidTouchInputWhenPress = function(bool) {
    VB.forBidTouchInputWhenPress = !!bool;
    ConfigManager.VBData.forBidTouchInputWhenPress = VB.forBidTouchInputWhenPress;
    ConfigManager.save();
}
//=============================================================================
//
//=============================================================================
$.TouchInput__onCancel = TouchInput._onCancel;
TouchInput._onCancel = function(x, y) {
    if (isMobilePhone && VB.forBidTwo) {
        if (isMZ) {
            this._newState.cancelled = true;
        } else {
            this._events.cancelled = true;
        }
    }
    $.TouchInput__onCancel.apply(this,arguments);
};
//=============================================================================
//
//=============================================================================
$.Game_Temp_setDestination = Game_Temp.prototype.setDestination
Game_Temp.prototype.setDestination = function(x, y) {
    if (VB.forBidDestination || (VB.forBidButtonDes && VB.pressButtonTemp) || (controlButtonDes && VB.controlVisible)) {
        return;
    }
    $.Game_Temp_setDestination.call(this,x,y);
};
//=============================================================================
//
//=============================================================================
$.TouchInput__onTouchStart = TouchInput._onTouchStart;
TouchInput._onTouchStart = function(event) {
    if (VB.forBidTouchInputWhenPress && VB.pressButtonTemp) {
        return;
    }
    $.TouchInput__onTouchStart.apply(this,arguments);
};
$.TouchInput__onTouchMove = TouchInput._onTouchMove;
TouchInput._onTouchMove = function(event) {
    if (VB.forBidTouchInputWhenPress && VB.pressButtonTemp) {
        return;
    }
    $.TouchInput__onTouchMove.apply(this,arguments);
};
$.TouchInput__onTouchEnd = TouchInput._onTouchEnd;
TouchInput._onTouchEnd = function(event) {
    if (VB.forBidTouchInputWhenPress && VB.pressButtonTemp) {
        return;
    }
    $.TouchInput__onTouchEnd.apply(this,arguments);
};
$.TouchInput__onTrigger = TouchInput._onTrigger;
TouchInput._onTrigger = function(x, y) {
    if (VB.forBidTouchInputWhenPress && VB.pressButtonTemp) {
        return;
    }
    $.TouchInput__onTrigger.apply(this,arguments);
};
$.TouchInput__onMove = TouchInput._onMove;
TouchInput._onMove = function(x, y) {
    if (VB.forBidTouchInputWhenPress && VB.pressButtonTemp) {
        return;
    }
    $.TouchInput__onMove.apply(this,arguments);
};
if (isMZ) {
    $.TouchInput__onHover = TouchInput._onHover;
    TouchInput._onHover = function(x, y) {
        if (VB.forBidTouchInputWhenPress && VB.pressButtonTemp) {
            return;
        }
        $.TouchInput__onHover.apply(this,arguments);
    };
}
$.TouchInput__onRelease = TouchInput._onRelease;
TouchInput._onRelease = function(x, y) {
    if (VB.forBidTouchInputWhenPress && VB.pressButtonTemp) {
        return;
    }
    $.TouchInput__onRelease.apply(this,arguments);
};
//=============================================================================
//
//=============================================================================
VB.findDirButton = function() {
    for (let i of VB.buttonList) {
        if (i._buttonId===-2) {
            return i;
        }
    }
    return null;
};
VB.calculateXYFromTextToNumber = function(text,defaultValue) {
    text = String(text);
    text = text.replace("ww",window.innerWidth);
    text = text.replace("wh",window.innerHeight);
    text = text.replace("sw",Graphics.width);
    text = text.replace("sh",Graphics.height);
    try {
        return eval(text);
    } catch(e) {
        return 0
    }
};
//=============================================================================
//
//=============================================================================
Sprite.prototype.canvasToLocalXVB = function(x) {
    var node = this;
    while (node) {
        x -= node.x;
        node = node.parent;
    }
    return x;
};
Sprite.prototype.canvasToLocalYVB = function(y) {
    var node = this;
    while (node) {
        y -= node.y;
        node = node.parent;
    }
    return y;
};
//=============================================================================
//为了在特殊模式内能使用原生办法解码图片，适配各种加密方式，故此处添加原生接口。
//=============================================================================
if (isMZ) {
    ImageManager.loadVirtualButton = function(filename, hue) {
        return this.loadBitmap(loadUrl, filename, hue, true);
    };
} else {
    ImageManager.loadVirtualButton = function(filename, hue) {
        return this.loadBitmap(loadUrl, filename, hue, true);
    };
}
//=============================================================================
//
//=============================================================================
if (isMZ) {
    if (parameters.mapMenuButton !== "true") {
        $.Scene_Map_updateMenuButton = Scene_Map.prototype.updateMenuButton;
        Scene_Map.prototype.updateMenuButton = function() {
            $.Scene_Map_updateMenuButton.apply(this,arguments);
            if (this._menuButton) {
                this._menuButton.visible = false;
            }
        };
    }
    if (parameters.menuCancelButton !== "true") {
        $.Scene_MenuBase_createCancelButton = Scene_MenuBase.prototype.createCancelButton;
        Scene_MenuBase.prototype.createCancelButton = function() {
            $.Scene_MenuBase_createCancelButton.apply(this,arguments);
            this._cancelButton.visible = false;
        };
    }
    if (parameters.menuPageButton !== "true") {
        $.Scene_MenuBase_updatePageButtons = Scene_MenuBase.prototype.updatePageButtons;
        Scene_MenuBase.prototype.updatePageButtons = function() {
            $.Scene_MenuBase_updatePageButtons.apply(this,arguments);
            if (this._pageupButton) {
                this._pageupButton.visible = false;
            }
            if (this._pagedownButton) {
                this._pagedownButton.visible = false;
            }
        };
    }
    if (parameters.battleCancelButton !== "true") {
        $.Scene_Battle_updateCancelButton = Scene_Battle.prototype.updateCancelButton;
        Scene_Battle.prototype.updateCancelButton = function() {
            $.Scene_Battle_updateCancelButton.apply(this,arguments);
            if (this._cancelButton) {
                this._cancelButton.visible = false;
            }
        };
    }
    if (parameters.repairMZBlack === "true") {
        SceneManager.isGameActive = function() {
            return true;
        };
    }
}
//=============================================================================
//
//=============================================================================
$.Scene_Boot_isReady = Scene_Boot.prototype.isReady;
Scene_Boot.prototype.isReady = function() {
    let result = $.Scene_Boot_isReady.apply(this,arguments);
    this.loadVirtualButton();
    return result && this.isReadyVirtualButton();
};
Scene_Boot.prototype.loadVirtualButton = function() {
    if (VB.loadedVirtualButton) return;
    if (!$dataSystem) {
        return;
    }
    //不可调换顺序，首先检测config数据，然后保证已经完成，然后判断是不是手机。
    //保证系统数据加载完成，以判定游戏版本
    if (isMZ) {
        if (!ConfigManager.VBData) {
            if (ConfigManager.isLoaded()) {
                ConfigManager.VBData = {};
            } else{
                return;
            }
        }
    } else {
        if (!ConfigManager.VBData) {
            return;
        }
    }
    if (giveupVBConfigWhenVersionChange) {
        if (!ConfigManager.VBData.version || ConfigManager.VBData.version!==$dataSystem.versionId) {
            ConfigManager.VBData = {
                version:$dataSystem.versionId
            };
        }
    }
    if (ConfigManager.VBData.version!==$dataSystem.versionId) {
        VB.refreshVersion = true;
    }
    if (forBidTwo in ConfigManager.VBData) VB.forBidTwo = ConfigManager.VBData.forBidTwo;
    if (forBidDestination in ConfigManager.VBData) VB.forBidDestination = ConfigManager.VBData.forBidDestination;
    if (forBidButtonDes in ConfigManager.VBData) VB.forBidButtonDes = ConfigManager.VBData.forBidButtonDes;
    if (forBidTouchInputWhenPress in ConfigManager.VBData) VB.forBidTouchInputWhenPress = ConfigManager.VBData.forBidTouchInputWhenPress;
    VB.loadedVirtualButton = true;
    if (!isMobilePhone && !showOnPc) {
        return;
    }
    //创建组件加载图形并解密
    let list = VB.buttonList;
    if (parameters["dirButtonShow"] === "true") list.push(new Game_VB_Dir(-2));
    if (parameters["controlButtonShow"] === "true") list.push(new Game_VB_Control(-1));
    for (let i=0,il=otherButtonSetting.length;i<il;i++) {
        list.push(new Game_VB_Normal(i));
    }
    VB.settingImage = [ImageManager.loadVirtualButton("line"),ImageManager.loadVirtualButton("point"),ImageManager.loadVirtualButton("pad")];
};
Scene_Boot.prototype.isReadyVirtualButton = function() {
    if (!VB.loadedVirtualButton) return false;
    if (VB.readyVirtualButton) return true;
    //判断加载完毕，然后创建
    let list = VB.buttonList;
    for (let i of list) {
        i.updateImageLoad();
    }
    for (let i of list) {
        if (i.isReady()) {
            //nothing
        } else {
            return false;
        }
    }
    VB.readyVirtualButton = true;
    return true;
};
if (isMZ) {
    $.Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        $.Scene_Boot_start.apply(this,arguments);
        this.updateAllVBSaveData();
    };
}
Scene_Boot.prototype.updateAllVBSaveData = function() {
    let list = VB.buttonList;
    if (VB.refreshVersion) {
        for (let i of list) {
            i.recoveryBaseSaveData();
        }
    } else {
        for (let i of list) {
            i.initBaseSaveData();
        }
    }
};
$.ConfigManager_applyData = ConfigManager.applyData;
ConfigManager.applyData = function(config) {
    $.ConfigManager_applyData.apply(this,arguments);
    this.VBData = config.VBData || {};
};
$.ConfigManager_makeData = ConfigManager.makeData;
ConfigManager.makeData = function() {
    var config = $.ConfigManager_makeData.apply(this,arguments);
    config.VBData = this.VBData;
    return config;
};
//=============================================================================
//
//=============================================================================
$.SceneManager_updateScene = SceneManager.updateScene;
SceneManager.updateScene = function() {
    this.updateVirtualButton();
    $.SceneManager_updateScene.apply(this,arguments);
};
SceneManager.updateVirtualButton = function() {
    for (let button of VB.buttonList) {
        button.update();
    }
};
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
Game_VB_Base.prototype.initialize = function(buttonId) {
    this._buttonId = buttonId;
    this.loadButtonBaseSetting();
    this.loadShowSetting();
    this.loadFiles();
    this.loadCommonData();
};
Game_VB_Base.prototype.loadButtonBaseSetting = function() {
    this._visible = true;
    this._isSetting = false;
};
Game_VB_Base.prototype.loadShowSetting = function() {
    this._visibleSetting = {
        controlBy:true,
        sceneControlMode:true,
        sceneList:[],
        textHide:false,
        switch:0,
        visibleScript:""
    };
    this._visibleSetting.controlBy = this._setting["controlBy"] === "true";
    this._visibleSetting.sceneControlMode = this._setting["sceneControlMode"] === "true";
    this._visibleSetting.sceneList = JsonEx.parse(this._setting["sceneList"]);
    this._visibleSetting.textHide = this._setting["textHide"] === "true";
    this._visibleSetting.switch = Math.judgeAndOutAttribute(this._setting["switch"],0);
    this._visibleSetting.visibleScript = String.removeMoreBrackets(this._setting["visibleScript"] || "");
};
Game_VB_Base.prototype.loadFiles = function() {
    this._fileLoadList = [];
    this._fileLoadedList = {};
    this._isLoadedImage = false;
    //waiting
};
Game_VB_Base.prototype.loadCommonData = function() {
    if (!this._setting) return;
    //this._scriptIn =  String.removeMoreBrackets(this._setting.scriptIn || "");
    //this._scriptOut = String.removeMoreBrackets(this._setting.scriptOut || "");
    this._xAnchor = Math.judgeAndOutAttribute(this._setting.xAnchor,0);
    this._yAnchor = Math.judgeAndOutAttribute(this._setting.yAnchor,0);
    this._scriptIn =  eval(this._setting.scriptIn || "");
    this._scriptOut = eval(this._setting.scriptOut || "");
    this._commonEventIn = Math.judgeAndOutAttribute(this._setting.commonEventIn,0);
    this._commonEventOut = Math.judgeAndOutAttribute(this._setting.commonEventOut,0);
    this._commonEventMode = Math.judgeAndOutAttribute(this._setting.commonEventMode,0);
    this._commonEventMode1List = new Array();
    this._commonEventMode2Interpreter = new Game_Interpreter();
    this._posAuto = [
        this._setting["phoneFitModeUD"] === "2",
        this._setting["phoneFitModeLR"] === "1",
        this._setting["phoneFitModeLR"] === "2",
        this._setting["phoneFitModeUD"] === "1"
    ];
    if (isMZ) {
        //nothing,wait graphics size init 
    } else {
        this.initBaseSaveData();
    }
};
Game_VB_Base.prototype.initBaseSaveData = function() {
    let VBDataDetail = ConfigManager.VBData[this._buttonId];
    if (!VBDataDetail) {
        VBDataDetail = ConfigManager.VBData[this._buttonId] = {
            opacity:Math.judgeAndOutAttribute(this._setting.opacityDefault,255),
            scale:Math.judgeAndOutAttribute(this._setting.scaleDefault,100),
            x:VB.calculateXYFromTextToNumber(this._setting.xDefault,0),
            y:VB.calculateXYFromTextToNumber(this._setting.yDefault,0)
        };
        VBDataDetail.orginX = VBDataDetail.x;
        VBDataDetail.orginY = VBDataDetail.y;
        VBDataDetail.orginOpacity = VBDataDetail.opacity;
        VBDataDetail.orginScale = VBDataDetail.scale;
    }
    this._saveData = VBDataDetail;
};
Game_VB_Base.prototype.recoveryBaseSaveData = function() { 
    ConfigManager.VBData[this._buttonId] = null;
    this.initBaseSaveData();
    /*let saveData = this._saveData;
    saveData.x = saveData.orginX;
    saveData.y = saveData.orginY;
    saveData.opacity = saveData.orginOpacity;
    saveData.scale = saveData.orginScale;*/
};
Game_VB_Base.prototype.confirmBaseSaveData = function() {
    ConfigManager.VBData[this._buttonId] = this._saveData;
};
Game_VB_Base.prototype.loadImage = function(fileName) {
    if (imageLoadMode) {
        let bitmap = ImageManager.loadVirtualButton(fileName);
        bitmap._loadedVirtualButton = false;
        bitmap._remVirtualButtonName = fileName;
        bitmap._remVirtualButtonType = 0;
        bitmap.addLoadListener(this.onLoadedImage.bind(this,bitmap));
        this._fileLoadList.push(bitmap);
    } else {
        let image = new Image();
        image._loadedVirtualButton = false;
        image._remVirtualButtonName = fileName;
        image._remVirtualButtonType = 1;
        image.src = "./" + loadUrl + fileName + ".png";
        image.onload = this.onLoadedImage.bind(this,image);
        this._fileLoadList.push(image);
    }
};
Game_VB_Base.prototype.onLoadedImage = function(data) {
    let imageData = {};
    if (data._remVirtualButtonType === 0) {
        imageData.url = data.canvas.toDataURL('image/png');
        imageData.width  = data.baseTexture.width;
        imageData.height = data.baseTexture.height;
        imageData.name = data._remVirtualButtonName;
    } else if (data._remVirtualButtonType === 1) {
        imageData.url = "./" + loadUrl + data._remVirtualButtonName + ".png";
        imageData.width = data.width;
        imageData.height = data.height;
        imageData.name = data._remVirtualButtonName;
    }
    this._fileLoadedList[data._remVirtualButtonName] = imageData;
    data._loadedVirtualButton = true;
};
Game_VB_Base.prototype.update = function() {
    if (this.isReady()) {
        this.updateShowOrHide();
        this.updateBaseData();
        this.updateSetting();
    }
    this.updateCommonEventMode1();
    this.updateCancelDelay();
};
Game_VB_Base.prototype.updateBaseData = function() {

};
Game_VB_Base.prototype.updateCancelDelay = function() {

};
Game_VB_Base.prototype.updateImageLoad = function() {
    if (this._isLoadedImage) {
        //nothing
    } else {
        let isAllLoaded = true;
        for (let i of this._fileLoadList) {
            if (i._loadedVirtualButton) {
                //nothing
            } else {
                isAllLoaded = false;
            }
        }
        if (isAllLoaded) {
            this.createButtonElement();
            this._isLoadedImage = true;
        }
    }
};
Game_VB_Base.prototype.isReady = function() {
    return !!this._isLoadedImage;
};
Game_VB_Base.prototype.createButtonElement = function() {

};
VB.contextmenuEvent = (e)=>e.preventDefault();
Game_VB_Base.prototype.buildDiv = function(name,imgName,url,w,h,posAuto) {
    let div = document.createElement("div");
    div.id = "VB"+name;
    div.remVBFileName = imgName;
    div.remVBWidth = w;
    div.remVBHeight = h;
    div.posVBAuto = posAuto || [false,false,false,false];
    div.style.position = "fixed";
    div.style.zIndex = zIndex;
    div.style.userSelect = "none";
    //div.style["-webkit-user-select"]="none";
    div.style["-webkit-tap-highlight-color"] = "rgba(0,0,0,0)";
    div.style["background-image"] = "url("+url+")";
    div.style["background-repeat"] = "no-repeat";
    div.style["background-size"] = w+"px"+" "+h+"px";
    div.addEventListener('contextmenu',VB.contextmenuEvent);
    div.remBVData = {
        isPressChange:imgName[0] === "$"
    };
    if (div.remBVData.isPressChange) {
        div.remVBHeight /= 2;
    }
    return div;
};
Graphics.canvasToPageXVB = function(x,posAuto) {
    if (this._canvas) {
        var left = this._canvas.offsetLeft;
        x = this._realScale * x + left;
        if (posAuto[1]) x-=left;
        if (posAuto[2]) x+=left;
        return Math.round(x);
    } else {
        return 0;
    }
};
Graphics.canvasToPageYVB = function(y,posAuto) {
    if (this._canvas) {
        var top = this._canvas.offsetTop;
        y = this._realScale * y + top;
        if (posAuto[0]) y-=top;
        if (posAuto[3]) y+=top;
        return Math.round(y);
    } else {
        return 0;
    }
};
Graphics.offsetXVB = function(posAuto) {
    if (this._canvas) {
        let x = this._canvas.offsetLeft;
        return posAuto[1]?-x:(posAuto[2]?x:0);
    } else {
        return 0;
    }
};
Graphics.offsetYVB = function(posAuto) {
    if (this._canvas) {
        let y = this._canvas.offsetTop;
        return posAuto[0]?-y:(posAuto[3]?y:0);
    } else {
        return 0;
    }
};
Game_VB_Base.prototype.refreshDivAttribute = function(div,visible,x,y,o,s,isPressed,extraData = {}) {
    let graph = Graphics;
    let systemScale = graph._realScale;
    let w = Math.floor(div.remVBWidth * s * systemScale) / 100;
    let h = Math.floor(div.remVBHeight * s * systemScale) / 100;
    let posAuto = div.posVBAuto;
    x = graph.canvasToPageXVB(x,posAuto) - w * (extraData.ax||this._xAnchor) + (extraData.ox||0);
    y = graph.canvasToPageYVB(y,posAuto) - h * (extraData.ay||this._yAnchor) + (extraData.oy||0);
    //===================================================================================
    if (div.remBVData["display"] !== visible) {
        div.remBVData["display"] = visible;
        if (visible) {
            div.style.display = "block";
        } else {
            div.style.display = "none";
        }
    }
    //===================================================================================
    if (div.remBVData["width"] !== w || div.remBVData["height"] !== h) {
        div.style["background-size"] = w+"px"+" "+(div.remBVData.isPressChange?2*h:h)+"px";
    }
    if (div.remBVData["left"] !== x) {
        div.remBVData["left"] = x;
        div.style.left = x+"px";
    }
    if (div.remBVData["width"] !== w) {
        div.remBVData["width"] = w;
        div.style.width = w+"px";
    }
    if (div.remBVData["top"] !== y) {
        div.remBVData["top"] = y;
        div.style.top = y+"px";
    }
    if (div.remBVData["height"] !== h) {
        div.remBVData["height"] = h;
        div.style.height = h+"px";
    }
    //===================================================================================
    if (div.remBVData["opacity"] !== o) {
        div.remBVData["opacity"] = o;
        div.style.opacity = o / 255;
    }
    //===================================================================================
    if (div.remBVData["isPressed"] !== isPressed) {
        div.remBVData["isPressed"] = isPressed;
        if (div.remBVData.isPressChange) {
            if (isPressed) {
                div.style["background-position"]="-0px -"+h+"px";
            } else {
                div.style["background-position"]="-0px -0px";
            }
        } else {
            div.style["background-position"]="-0px -0px";

        }
    }
    //===================================================================================
    return {w:w,h:h,x:x,y:y};
    //===================================================================================
};
Game_VB_Base.prototype.isActive = function() {
    return !SceneManager.isSceneChanging();
};
Game_VB_Base.prototype.isControVisible = function(vs) {
    return VB.controlVisible;
};
Game_VB_Base.prototype.isSceneVisible = function(vs) {
    let sceneName = SceneManager._scene ? SceneManager._scene.constructor.name : "";
    if (vs.sceneControlMode) {
        if (vs.sceneList.includes(sceneName)) {
            return false;
        } else {
            return true;
        }
    } else {
        if (vs.sceneList.includes(sceneName)) {
            return true;
        } else {
            return false;
        }
    }
};
Game_VB_Base.prototype.isTextHideVisible = function(vs) {
    return true;//!$gameMessage.isBusy();
};
Game_VB_Base.prototype.isSwitchVisible = function(vs) {
    if (vs.switch === 0) {
        return true;
    } else {
        return $gameSwitches.value(vs.switch)
    }
};
Game_VB_Base.prototype.isScriptVisible = function(vs) {
    if (!vs.visibleScript||vs.visibleScript.length===0) {
        return true;
    } else {
        return eval(vs.visibleScript);
    }
};
Game_VB_Base.prototype.updateShowOrHide = function() {
    let result = true;
    let vs = this._visibleSetting;
    if (vs.controlBy && !this.isControVisible(vs)) {result = false;}
    else if (!this.isSceneVisible(vs))             {result = false;}
    else if (!this.isTextHideVisible(vs))          {result = false;}
    else if (!this.isSwitchVisible(vs))            {result = false;}
    else if (!this.isScriptVisible(vs))            {result = false;}
    this._visible = result;
};
Game_VB_Base.prototype.scriptIn = function() {
    VB.pressButtonTemp = true;
    if (this._scriptIn && this._scriptIn.length>0) {
        eval(this._scriptIn);
    }
    if (this._commonEventIn>0) {
        let sceneName = SceneManager._scene ? SceneManager._scene.constructor.name : "";
        if (commonEventActiveScene.includes(sceneName)) {
            this.runCommonEvent("in",this._commonEventMode,this._commonEventIn);
        }
    }
};
Game_VB_Base.prototype.scriptMove = function() {
    
};
Game_VB_Base.prototype.scriptOut = function() {
    VB.pressButtonTemp = false;
    if (this._scriptOut && this._scriptOut.length>0) {
        eval(this._scriptOut);
    }
    if (this._commonEventOut>0) {
        let sceneName = SceneManager._scene ? SceneManager._scene.constructor.name : "";
        if (commonEventActiveScene.includes(sceneName)) {
            this.runCommonEvent("out",this._commonEventMode,this._commonEventOut);
        }
    }
};
Game_VB_Base.prototype.runCommonEvent = function(status,mode,id) {
    if (mode===1) {
        let ceData = $dataCommonEvents[id];
        if (ceData) {
            let interpreter = new Game_Interpreter();
            interpreter.setup(ceData.list,0);
            interpreter.VB = {
                status:status,
                mode:mode,
                id:id,
                buttonId:this._buttonId
            };
            this._commonEventMode1List.push(interpreter);
        }
    } else if (mode===2) {
        if (!this._commonEventMode2Interpreter.isRunning()) {
            let ceData = $dataCommonEvents[id];
            if (ceData) {
                this._commonEventMode2Interpreter.VB = {
                    status:status,
                    mode:mode,
                    id:id,
                    buttonId:this._buttonId
                };
                this._commonEventMode2Interpreter.setup(ceData.list,0);
            }
        }
    } else {
        $gameTemp.reserveCommonEvent(id);
    }
};
Game_VB_Base.prototype.updateCommonEventMode1 = function() {
    if (this._commonEventIn===0&&this._commonEventOut===0) {
        return;
    }
    let sceneName = SceneManager._scene ? SceneManager._scene.constructor.name : "";
    if (commonEventActiveScene.includes(sceneName)) {
        this._commonEventMode2Interpreter.update();
        if (this._commonEventMode1List.length>0) {
            let nextList = new Array();
            for (let commonEvent of this._commonEventMode1List) {
                commonEvent.update();
                if (commonEvent.isRunning()) {
                    nextList.push(commonEvent);
                }
            }
            this._commonEventMode1List = nextList;
        }
    }
};
Game_VB_Base.prototype.getEventX = function(e) {
    if (!e) return 0;
    if (isMobilePhone) {
        if (e.targetTouches&&e.targetTouches[0]) {
            return e.targetTouches[0].clientX;
        } else {
            return e.clientX || 0;
        }
    } else {
        return e.clientX || 0;
    }
};
Game_VB_Base.prototype.getEventY = function(e) {
    if (!e) return 0;
    if (isMobilePhone) {
        if (e.targetTouches&&e.targetTouches[0]) {
            return e.targetTouches[0].clientY;
        } else {
            return e.clientY || 0;
        }
    } else {
        return e.clientY || 0;
    }
};
Game_VB_Base.prototype.clearAllPressData = function() {
    VB.pressButtonTemp = false;
};
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
Game_VB_Normal.prototype = Object.create(Game_VB_Base.prototype);
Game_VB_Normal.prototype.constructor = Game_VB_Normal;
Game_VB_Normal.prototype.loadButtonBaseSetting = function() {
    Game_VB_Base.prototype.loadButtonBaseSetting.call(this);
    this._setting = JsonEx.parse(this._buttonId === -1 ? parameters["controlButtonSetting"] : otherButtonSetting[this._buttonId]);
};
Game_VB_Normal.prototype.loadFiles = function() {
    Game_VB_Base.prototype.loadFiles.call(this);
    this.loadImage(this._setting.img);
};
Game_VB_Normal.prototype.createButtonElement = function() {
    Game_VB_Base.prototype.createButtonElement.call(this);
    let divData = this._fileLoadedList[this._setting.img];
    let div = this.buildDiv("o"+this._buttonId,divData.name,divData.url,divData.width,divData.height,this._posAuto);
    div.addEventListener('mousedown',this.startTouch.bind(this));
    div.addEventListener('mousemove',this.moveTouch.bind(this));
    div.addEventListener('mouseup',this.endTouch.bind(this));
    div.addEventListener('touchstart',this.startTouch.bind(this));
    div.addEventListener('touchmove',this.moveTouch.bind(this));
    div.addEventListener('touchend',this.endTouch.bind(this));
    div.addEventListener('touchcancel',this.endTouch.bind(this));
    document.body.appendChild(div);
    this._div = div;
    this.clearAllPressData();
};
Game_VB_Normal.prototype.startTouch = function(e) {
    e.preventDefault();
    if (VB.settingMode) {
        this.updateVBSettingMode(0,this.getEventX(e),this.getEventY(e));
    } else {
        this._isPressed = true;
        this.updateInput();
        this.scriptIn();
    }
};
Game_VB_Normal.prototype.moveTouch = function(e) {
    e.preventDefault();
    if (VB.settingMode) {
        this.updateVBSettingMode(1,this.getEventX(e),this.getEventY(e));
    } else {
        this.scriptMove();
    }
};
/*
this._cancelEventDelay:
在手机屏幕边缘，touchend会在touchstart后直接接着执行，因为边缘默认情况下有系统阻断。
这样在不到1帧内按键的触发状态就会被取消，那些每帧读取按键数据的指令将不会被检测到。
我们使用此属性记录消除数据，在按键更新时再正真执行取消指令。并且我们将按键更新放在游戏
数据刷新的最前面，这样就能保证按键触发状态至少有1帧，这样就可以解决按键持续不足1帧然后游戏
数据无法触发的问题。
*/
Game_VB_Normal.prototype.endTouch = function(e) {
    e.preventDefault();
    if (VB.settingMode) {
        this.updateVBSettingMode(2,this.getEventX(e),this.getEventY(e));
    } else {
        this._cancelEventDelay = e;
    }
};
Game_VB_Base.prototype.updateCancelDelay = function() {
    if (this._cancelEventDelay) {
        this._cancelEventDelay = null;
        this.clearAllPressData();
    }
};
Game_VB_Normal.prototype.clearAllPressData = function() {
    this._isPressed = false;
    this.updateInput();
    this.scriptOut();
};
Game_VB_Normal.prototype.updateInput = function() {
    let buttonName = this._setting["button"];
    if (buttonName) {
        Input._currentState[buttonName] = this._isPressed;
    }
};
Game_VB_Normal.prototype.updateBaseData = function() {
    let data = this._saveData;
    this.refreshDivAttribute(this._div,this._visible,data.x,data.y,this.getProperOpacity(data.opacity),data.scale,this._isPressed);
};
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
Game_VB_Control.prototype = Object.create(Game_VB_Normal.prototype);
Game_VB_Control.prototype.constructor = Game_VB_Control;
Game_VB_Control.prototype.startTouch = function() {
    Game_VB_Normal.prototype.startTouch.apply(this,arguments);
    if (VB.settingMode) {
        //nothing
    } else {
        VB.controlVisible = !VB.controlVisible;
    }
};
Game_VB_Control.prototype.isControVisible = function(vs) {
    return true;
};
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
Game_VB_Dir.prototype = Object.create(Game_VB_Base.prototype);
Game_VB_Dir.prototype.constructor = Game_VB_Dir;
Game_VB_Dir.prototype.loadButtonBaseSetting = function() {
    Game_VB_Base.prototype.loadButtonBaseSetting.call(this);
    if (parameters["dirButtonOptional"]==="true") {
        this._changeDirButtonMode = 4;
    } else if (parameters["dirButtonOptional"]==="false") {
        this._changeDirButtonMode = 0;
    } else {
        this._changeDirButtonMode = Math.judgeAndOutAttribute(parameters["dirButtonOptional"],4);
    }
    let VBDataDetail = ConfigManager.VBData.dirMode;
    if (typeof VBDataDetail !== "number") {
        switch(parameters["dirButtonMode"]) {
        case "0":this._dirMode = 0;break;
        case "1":this._dirMode = 1;break;
        case "2":this._dirMode = 2;break;
        default:this._dirMode = 2;
        }
        ConfigManager.VBData.dirMode = this._dirMode;
    } else {
        this._dirMode = VBDataDetail;
    }
    this._saveData = VBDataDetail;
    this._setting = JsonEx.parse(parameters["dirButtonSetting"]);
    this._dirImageSetting = [
        JsonEx.parse(parameters["dirButtonSettingMode0"]),
        JsonEx.parse(parameters["dirButtonSettingMode1"]),
        JsonEx.parse(parameters["dirButtonSettingMode2"])
    ];
    this._usingDivList = [];
};
Game_VB_Dir.prototype.loadFiles = function() {
    Game_VB_Base.prototype.loadFiles.call(this);
    if (this._changeDirButtonMode===0) {
        this["loadMode"+this._dirMode+"Image"]();
    } else if (this._changeDirButtonMode===1) {
        this.loadMode0Image();
        this.loadMode1Image();
        if (this._dirMode===2) this._dirMode = 0; 
    } else if (this._changeDirButtonMode===2) {
        this.loadMode0Image();
        this.loadMode2Image();
        if (this._dirMode===1) this._dirMode = 2; 
    } else if (this._changeDirButtonMode===3) {
        this.loadMode1Image();
        this.loadMode2Image();
        if (this._dirMode===0) this._dirMode = 1; 
    } else {
        this.loadMode0Image();
        this.loadMode1Image();
        this.loadMode2Image();
    }
};
Game_VB_Dir.prototype.loadMode0Image = function() {
    this.loadImage(this._dirImageSetting[0][2]);
    this.loadImage(this._dirImageSetting[0][4]);
    this.loadImage(this._dirImageSetting[0][6]);
    this.loadImage(this._dirImageSetting[0][8]);
};
Game_VB_Dir.prototype.loadMode1Image = function() {
    this.loadImage(this._dirImageSetting[1][1]);
    this.loadImage(this._dirImageSetting[1][2]);
    this.loadImage(this._dirImageSetting[1][3]);
    this.loadImage(this._dirImageSetting[1][4]);
    this.loadImage(this._dirImageSetting[1][5]);
    this.loadImage(this._dirImageSetting[1][6]);
    this.loadImage(this._dirImageSetting[1][7]);
    this.loadImage(this._dirImageSetting[1][8]);
    this.loadImage(this._dirImageSetting[1][9]);
};
Game_VB_Dir.prototype.loadMode2Image = function() {
    this.loadImage(this._dirImageSetting[2]["c1"]);
    this.loadImage(this._dirImageSetting[2]["c2"]);
};
Game_VB_Dir.prototype.createButtonElement = function() {
    Game_VB_Base.prototype.createButtonElement.call(this);
    for (let i of this._usingDivList) {
        document.body.removeChild(i);
    }
    this._usingDivList = [];
    let mode = this._dirMode;
    this["createDivMode"+mode]();
    for (let i of this["_mode"+mode+"ElementList"]) {
        document.body.appendChild(i);
        this._usingDivList.push(i);
    }
    this.clearAllPressData();
};
Game_VB_Dir.prototype.changeDirMode = function(target = -1) {
    if (this._changeDirButtonMode===0) {
        //nothing
    } else if (this._changeDirButtonMode===1) {
        this._dirMode = this._dirMode === 0 ? 1 : 0;
    } else if (this._changeDirButtonMode===2) {
        this._dirMode = this._dirMode === 2 ? 0 : 2;
    } else if (this._changeDirButtonMode===3) {
        this._dirMode = this._dirMode === 1 ? 2 : 1;
    } else {
        this._dirMode = target === -1 ? (this._dirMode+1)%3 : target;
    }
    this.createButtonElement();
    ConfigManager.VBData.dirMode = this._dirMode;
};
Game_VB_Dir.prototype.getDirMode = function() {
    return this._dirMode;
};
Game_VB_Dir.prototype.clearAllPressData = function() {
    this.clearAllPressDataMode0();
    this.clearAllPressDataMode1();
    this.clearAllPressDataMode2();
    Input._currentState['down'] = false;
    Input._currentState['left'] = false;
    Input._currentState['right'] = false;
    Input._currentState['up'] = false;
};
Game_VB_Dir.prototype.updateBaseData = function() {
    switch(this._dirMode) {
    case 0:this.updateMode0();break;
    case 1:this.updateMode1();break;
    case 2:this.updateMode2();break;
    }
};
//=======================================================================================================
Game_VB_Dir.prototype.updateCancelDelay = function() {
    if (this._cancelEventDelay) {
        if (this._cancelEventMode===0) {
            let div = this._cancelEventDelay.target;
            let index = div.remIndexVB;
            this.updateInputMode0(index,false);
            this.scriptOut();
        } else if (this._cancelEventMode===1) {
            let div = this._cancelEventDelay.target;
            let index = div.remIndexVB;
            this.updateInputMode1(index,false);
            this.scriptOut();
        } else if (this._cancelEventMode===2) {
            this.clearAllPressDataMode2();
            this.updateInputMode2Calculate();
            this.scriptOut();
        }
        this._cancelEventMode = -1;
        this._cancelEventDelay = null;
    } 
};
//=======================================================================================================
Game_VB_Dir.prototype.createDivMode0 = function() {
    if (this._mode0ElementList) return;
    this._mode0ElementList = [];
    let divData,div;
    for (let i=2;i<=8;i+=2) {
        divData = this._fileLoadedList[this._dirImageSetting[0][i]];
        div = this.buildDiv("m0"+i,divData.name,divData.url,divData.width,divData.height,this._posAuto);
        div.remIndexVB = i;
        div.addEventListener('mousedown',this.startTouchMode0.bind(this));
        div.addEventListener('mousemove',this.moveTouchMode0.bind(this));
        div.addEventListener('mouseup',this.endTouchMode0.bind(this));
        div.addEventListener('touchstart',this.startTouchMode0.bind(this));
        div.addEventListener('touchmove',this.moveTouchMode0.bind(this));
        div.addEventListener('touchend',this.endTouchMode0.bind(this));
        div.addEventListener('touchcancel',this.endTouchMode0.bind(this));
        this._mode0ElementList.push(div);
    }
    this._mode0ElementPress = [null,false,false,false,false,false,false,false,false,false];
};
Game_VB_Dir.prototype.clearAllPressDataMode0 = function() {
    this._mode0ElementPress = [null,false,false,false,false,false,false,false,false,false];
};
Game_VB_Dir.prototype.updateMode0 = function() {
    let list = this._mode0ElementList;
    let data = this._saveData;
    let x = data.x;
    let y = data.y;
    for (let i=2,posI;i<=8;i+=2) {
        this.refreshDivAttribute(list[i/2-1],this._visible,
            x+(  (-(9-i)%3)              +  (1-this._xAnchor)*2  )*(list[i/2-1].remVBWidth*data.scale/100),
            y+(  (Math.floor((9-i)/3)-2) +  (1-this._yAnchor)*2  )*(list[i/2-1].remVBHeight*data.scale/100),
            this.getProperOpacity(data.opacity),data.scale,this._mode0ElementPress[i]);
    }
};
Game_VB_Dir.prototype.startTouchMode0 = function(e) {
    e.preventDefault();
    if (VB.settingMode) {
        this.updateVBSettingMode(0,this.getEventX(e),this.getEventY(e));
    } else {
        let div = e.target;
        let index = div.remIndexVB;
        this.updateInputMode0(index,true);
        this.scriptIn();
    }
};
Game_VB_Dir.prototype.moveTouchMode0 = function(e) {
    e.preventDefault();
    if (VB.settingMode) {
        this.updateVBSettingMode(1,this.getEventX(e),this.getEventY(e));
    } else {
        this.scriptMove();
    }
};
Game_VB_Dir.prototype.endTouchMode0 = function(e) {
    e.preventDefault();
    if (VB.settingMode) {
        this.updateVBSettingMode(2,this.getEventX(e),this.getEventY(e));
    } else {
        this._cancelEventDelay = e;
        this._cancelEventMode = 0;
    }
};
Game_VB_Dir.prototype.updateInputMode0 = function(index,status) {
    this._mode0ElementPress[index] = status;
    if (index===2) {
        Input._currentState['down']=status;
    } else if (index===4) {
        Input._currentState['left']=status;
    } else if (index===6) {
        Input._currentState['right']=status;
    } else if (index===8) {
        Input._currentState['up']=status;
    }
};
//=======================================================================================================
Game_VB_Dir.prototype.createDivMode1 = function() {
    if (this._mode1ElementList) return;
    this._mode1ElementList = [];
    let divData,div;
    for (let i=1;i<=9;i++) {
        divData = this._fileLoadedList[this._dirImageSetting[1][i]];
        div = this.buildDiv("m1"+i,divData.name,divData.url,divData.width,divData.height,this._posAuto);
        div.remIndexVB = i;
        div.addEventListener('mousedown',this.startTouchMode1.bind(this));
        div.addEventListener('mousemove',this.moveTouchMode1.bind(this));
        div.addEventListener('mouseup',this.endTouchMode1.bind(this));
        div.addEventListener('touchstart',this.startTouchMode1.bind(this));
        div.addEventListener('touchmove',this.moveTouchMode1.bind(this));
        div.addEventListener('touchend',this.endTouchMode1.bind(this));
        div.addEventListener('touchcancel',this.endTouchMode1.bind(this));
        this._mode1ElementList.push(div);
    }
    this._mode1ElementPress = [null,false,false,false,false,false,false,false,false,false];
};
Game_VB_Dir.prototype.clearAllPressDataMode1 = function() {
    this._mode1ElementPress = [null,false,false,false,false,false,false,false,false,false];
};
Game_VB_Dir.prototype.updateMode1 = function() {
    let list = this._mode1ElementList;
    let data = this._saveData;
    let x = data.x;
    let y = data.y;
    for (let i=1,posI,w,h;i<=9;i++) {
        this.refreshDivAttribute(list[i-1],this._visible,
            x+(  (-(9-i)%3)              +  (1-this._xAnchor)*2  )*(list[i-1].remVBWidth*data.scale/100),
            y+(  (Math.floor((9-i)/3)-2) +  (1-this._yAnchor)*2  )*(list[i-1].remVBHeight*data.scale/100),
            this.getProperOpacity(data.opacity),data.scale,this._mode1ElementPress[i]);
    }
};
Game_VB_Dir.prototype.startTouchMode1 = function(e) {
    e.preventDefault();
    if (VB.settingMode) {
        this.updateVBSettingMode(0,this.getEventX(e),this.getEventY(e));
    } else {
        let div = e.target;
        let index = div.remIndexVB;
        this.updateInputMode1(index,true);
        this.scriptIn();
    }
};
Game_VB_Dir.prototype.moveTouchMode1 = function(e) {
    e.preventDefault();
    if (VB.settingMode) {
        this.updateVBSettingMode(1,this.getEventX(e),this.getEventY(e));
    } else {
        this.scriptMove();
    }
};
Game_VB_Dir.prototype.endTouchMode1 = function(e) {
    e.preventDefault();
    if (VB.settingMode) {
        this.updateVBSettingMode(2,this.getEventX(e),this.getEventY(e));
    } else {
        this._cancelEventDelay = e;
        this._cancelEventMode = 1;
    }
};
Game_VB_Dir.prototype.updateInputMode1 = function(index,status) {
    this._mode1ElementPress[index] = status;
    if (index===2) {
        Input._currentState['down']=status;
    } else if (index===4) {
        Input._currentState['left']=status;
    } else if (index===6) {
        Input._currentState['right']=status;
    } else if (index===8) {
        Input._currentState['up']=status;
    } else if (index===1) {
        Input._currentState['down']=status;
        Input._currentState['left']=status;
    } else if (index===3) {
        Input._currentState['down']=status;
        Input._currentState['right']=status;
    } else if (index===7) {
        Input._currentState['up']=status;
        Input._currentState['left']=status;
    } else if (index===9) {
        Input._currentState['up']=status;
        Input._currentState['right']=status;
    }
};
//=======================================================================================================
Game_VB_Dir.prototype.createDivMode2 = function() {
    if (this._mode2ElementList) return;
    this._mode2ElementList = [];
    //先2后1，让2在下面。
    let divData,div;
    //======================================================================
    divData = this._fileLoadedList[this._dirImageSetting[2]["c2"]];
    div = this.buildDiv("m2c2",divData.name,divData.url,divData.width,divData.height,this._posAuto);
    div.addEventListener('mousedown',this.startTouchMode2.bind(this));
    div.addEventListener('mousemove',this.moveTouchMode2.bind(this));
    div.addEventListener('mouseup',this.endTouchMode2.bind(this));
    div.addEventListener('mouseout',this.outTouchMode2.bind(this));
    div.addEventListener('touchstart',this.startTouchMode2.bind(this));
    div.addEventListener('touchmove',this.moveTouchMode2.bind(this));
    div.addEventListener('touchend',this.endTouchMode2.bind(this));
    div.addEventListener('touchcancel',this.endTouchMode2.bind(this));
    this._mode2ElementList.push(div);
    //======================================================================
    divData = this._fileLoadedList[this._dirImageSetting[2]["c1"]];
    div = this.buildDiv("m2c1",divData.name,divData.url,divData.width,divData.height,this._posAuto);
    div.addEventListener('mousedown',this.startTouchMode2.bind(this));
    div.addEventListener('mousemove',this.moveTouchMode2.bind(this));
    div.addEventListener('mouseup',this.endTouchMode2.bind(this));
    div.addEventListener('mouseout',this.outTouchMode2.bind(this));
    div.addEventListener('touchstart',this.startTouchMode2.bind(this));
    div.addEventListener('touchmove',this.moveTouchMode2.bind(this));
    div.addEventListener('touchend',this.endTouchMode2.bind(this));
    div.addEventListener('touchcancel',this.endTouchMode2.bind(this));
    this._mode2ElementList.push(div);
    //======================================================================
};
Game_VB_Dir.prototype.startTouchMode2 = function(e) {
    e.preventDefault();
    if (VB.settingMode) {
        this.updateVBSettingMode(0,this.getEventX(e),this.getEventY(e));
    } else {
        let graph = Graphics;
        this._mode2X = graph.pageToCanvasX(this.getEventX(e));
        this._mode2Y = graph.pageToCanvasY(this.getEventY(e));
        this._repairXMode2 = -graph.offsetXVB(this._mode2ElementList[1].posVBAuto);
        this._repairYMode2 = -graph.offsetYVB(this._mode2ElementList[1].posVBAuto);
        this._mode2Press = true;
        this.updateInputMode2Calculate();
        this.scriptIn();
    }
};
Game_VB_Dir.prototype.moveTouchMode2 = function(e) {
    e.preventDefault();
    if (VB.settingMode) {
        this.updateVBSettingMode(1,this.getEventX(e),this.getEventY(e));
    } else {
        if (this._mode2Press) {
            let graph = Graphics;
            this._mode2X = graph.pageToCanvasX(this.getEventX(e));
            this._mode2Y = graph.pageToCanvasY(this.getEventY(e));
            this._repairXMode2 = -graph.offsetXVB(this._mode2ElementList[1].posVBAuto);
            this._repairYMode2 = -graph.offsetYVB(this._mode2ElementList[1].posVBAuto);
            this.updateInputMode2Calculate();
        }
        this.scriptMove();
    }
};
Game_VB_Dir.prototype.outTouchMode2 = function(e) {
    e.preventDefault();
    if (VB.settingMode) {
        //nothing
    } else {
        this.endTouchMode2(e);
    }
};
Game_VB_Dir.prototype.endTouchMode2 = function(e) {
    e.preventDefault();
    if (VB.settingMode) {
        this.updateVBSettingMode(2,this.getEventX(e),this.getEventY(e));
    } else {
        this._cancelEventDelay = e;
        this._cancelEventMode = 2;
    }
};
Game_VB_Dir.prototype.clearAllPressDataMode2 = function() {
    this._mode2X = null;
    this._mode2Y = null;
    this._repairXMode2 = null;
    this._repairYMode2 = null;
    this._mode2Press = false;
};
Game_VB_Dir.prototype.updateMode2 = function() {
    let data = this._saveData;
    let padData = this.refreshDivAttribute(this._mode2ElementList[0],this._visible,data.x,data.y,this.getProperOpacity(data.opacity),data.scale,this._mode2Press);
    if (this._mode2X === null) {
        this._padHalfWidth = padData.w*(0.5-this._xAnchor);
        this._padHalfHeight = padData.h*(0.5-this._yAnchor);
        this.refreshDivAttribute(this._mode2ElementList[1],this._visible,data.x,data.y,this.getProperOpacity(data.opacity),data.scale,this._mode2Press,{ax:0.5,ay:0.5,ox:this._padHalfWidth,oy:this._padHalfHeight});
        VB.pressButtonTemp = false;
    } else {
        this.refreshDivAttribute(this._mode2ElementList[1],this._visible,this._mode2X,this._mode2Y,this.getProperOpacity(data.opacity),data.scale,this._mode2Press,{ax:0.5,ay:0.5,ox:this._repairXMode2,oy:this._repairYMode2});
        VB.pressButtonTemp = true;
    }
};
Game_VB_Dir.prototype.updateInputMode2Calculate = function() {
    let data = this._saveData;
    let graph = Graphics._realScale;
    let ox = data.x-this._repairXMode2+this._padHalfWidth/graph;
    let oy = data.y-this._repairYMode2+this._padHalfHeight/graph;
    let x = this._mode2X;
    let y = this._mode2Y;
    if (x===null||y===null) {
        this.updateInputMode2(NaN);
    } else if (x-ox===0&&this._mode2Y-oy===0) {
        this.updateInputMode2(NaN);
    } else {
        let rotation = Math.atan2(y-oy,x-ox);
        let pi = Math.PI;
        if (rotation<0) rotation+=pi*2;
        rotation = (rotation+pi/2)%(pi*2)
        this.updateInputMode2(rotation);
    }
};
Game_VB_Dir.prototype.updateInputMode2 = function(ro) {
    if (this._dirImageSetting[2]["8Dir"]==="true") {
        let range = Math.PI/8;
        if (isNaN(ro)) {
            Input._currentState['down']=false;
            Input._currentState['left']=false;
            Input._currentState['right']=false;
            Input._currentState['up']=false;
        } else if (ro<range||ro>=range*15) {
            Input._currentState['down']=false;
            Input._currentState['left']=false;
            Input._currentState['right']=false;
            Input._currentState['up']=true;
        } else if (ro>=range&&ro<range*3) {
            Input._currentState['down']=false;
            Input._currentState['left']=false;
            Input._currentState['right']=true;
            Input._currentState['up']=true;
        } else if (ro>=range*3&&ro<range*5) {
            Input._currentState['down']=false;
            Input._currentState['left']=false;
            Input._currentState['right']=true;
            Input._currentState['up']=false;
        } else if (ro>=range*5&&ro<range*7) {
            Input._currentState['down']=true;
            Input._currentState['left']=false;
            Input._currentState['right']=true;
            Input._currentState['up']=false;
        } else if (ro>=range*7&&ro<range*9) {
            Input._currentState['down']=true;
            Input._currentState['left']=false;
            Input._currentState['right']=false;
            Input._currentState['up']=false;
        } else if (ro>=range*9&&ro<range*11) {
            Input._currentState['down']=true;
            Input._currentState['left']=true;
            Input._currentState['right']=false;
            Input._currentState['up']=false;
        } else if (ro>=range*11&&ro<range*13) {
            Input._currentState['down']=false;
            Input._currentState['left']=true;
            Input._currentState['right']=false;
            Input._currentState['up']=false;
        } else if (ro>=range*13&&ro<range*15) {
            Input._currentState['down']=false;
            Input._currentState['left']=true;
            Input._currentState['right']=false;
            Input._currentState['up']=true;
        }
    } else {
        let range = Math.PI/4;
        if (isNaN(ro)) {
            Input._currentState['down']=false;
            Input._currentState['left']=false;
            Input._currentState['right']=false;
            Input._currentState['up']=false;
        } else if (ro<range||ro>=range*7) {
            Input._currentState['down']=false;
            Input._currentState['left']=false;
            Input._currentState['right']=false;
            Input._currentState['up']=true;
        } else if (ro>=range&&ro<range*3) {
            Input._currentState['down']=false;
            Input._currentState['left']=false;
            Input._currentState['right']=true;
            Input._currentState['up']=false;
        } else if (ro>=range*3&&ro<range*5) {
            Input._currentState['down']=true;
            Input._currentState['left']=false;
            Input._currentState['right']=false;
            Input._currentState['up']=false;
        } else if (ro>=range*5&&ro<range*7) {
            Input._currentState['down']=false;
            Input._currentState['left']=true;
            Input._currentState['right']=false;
            Input._currentState['up']=false;
        }
    }
};
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
if (parameters["optionalShow"] === "true" && (isMobilePhone || showOnPc)) {
    $.Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        this.addCommand(parameters["optionalName"], 'VBSetting');
        $.Window_Options_addGeneralOptions.apply(this,arguments);
    };
    $.Window_Options_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(index) {
        var symbol = this.commandSymbol(index);
        if (symbol === "VBSetting") {
            return "";
        } else {
            return $.Window_Options_statusText.apply(this,arguments);
        }
    };
    $.Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        var index = this.index();
        var symbol = this.commandSymbol(index);
        if (symbol === "VBSetting") {
            return this.dealOpenVBSettingScene();
        } else {
            return $.Window_Options_processOk.apply(this,arguments);
        }
    };
    Window_Options.prototype.dealOpenVBSettingScene = function() {
        SceneManager.push(Scene_VBSetting);
    };
}
//=============================================================================
//
//=============================================================================
Scene_VBSetting.prototype = Object.create(Scene_Base.prototype);
Scene_VBSetting.prototype.constructor = Scene_VBSetting;
Scene_VBSetting.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
    this.clearVBData();
};
Scene_VBSetting.prototype.clearVBData = function() {
    VB.settingMode = true;
    for (let i of VB.buttonList) {
        i.clearAllPressData();
    }
};
Scene_VBSetting.prototype.create = function() {
    Scene_Base.prototype.create.apply(this,arguments);
    this.createBackground();
    this.addChild(this._settingWindow = new Window_VBSetting());
    this.createCommandWindow();
    //this.createCommandSaveWindow();
};
Scene_VBSetting.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this.addChild(this._backgroundSprite);
};
Scene_VBSetting.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_VBSettingCommand(this._settingWindow.x, this._settingWindow.y+this._settingWindow.height);
    this._commandWindow.setHandler('dirMode',    this.commandDirMode.bind(this));
    this._commandWindow.setHandler('reset',    this.commandReset.bind(this));
    this._commandWindow.setHandler('resetAll',   this.commandResetAll.bind(this));
    this._commandWindow.setHandler('cancel',   this.popScene.bind(this));
    this.addChild(this._commandWindow);
};
/*Scene_VBSetting.prototype.createCommandSaveWindow = function() {
    this._commandSaveWindow = new Window_VBSettingSaveCommand(this._settingWindow.x+250/2, this._commandWindow.y+this._commandWindow.height);
    this._commandSaveWindow.setHandler('save', this.commandSave.bind(this));
    this._commandSaveWindow.setHandler('cancel', this.popScene.bind(this));
    this.addChild(this._commandSaveWindow);
};*/
Scene_VBSetting.prototype.update = function() {
    Scene_Base.prototype.update.apply(this,arguments);

};
Scene_VBSetting.prototype.commandDirMode = function() {
    this._commandWindow.activate();
    //this._commandSaveWindow.activate();
    let dirButton = VB.findDirButton();
    if (dirButton) {
        dirButton.changeDirMode();
    }
};
Scene_VBSetting.prototype.commandReset = function() {
    this._commandWindow.activate();
    //this._commandSaveWindow.activate();
    for (let i of VB.buttonList) {
        if (i._isSetting) {
            i.recoveryBaseSaveData();
            break;
        }
    }
};
Scene_VBSetting.prototype.commandResetAll = function() {
    this._commandWindow.activate();
    //this._commandSaveWindow.activate();
    for (let i of VB.buttonList) {
        i.recoveryBaseSaveData();
    }
};
/*Scene_VBSetting.prototype.commandSave = function() {
    this._commandWindow.activate();
    this._commandSaveWindow.activate();
};*/
Scene_VBSetting.prototype.popScene = function() {
    VB.settingMode = false;
    for (let i of VB.buttonList) {
         i.clearAllSettingData();
         i.confirmBaseSaveData();
    }
    ConfigManager.save();
    Scene_Base.prototype.popScene.apply(this,arguments);
};
//=============================================================================
//
//=============================================================================
Window_VBSetting.prototype = Object.create(Window_Base.prototype);
Window_VBSetting.prototype.constructor = Window_VBSetting;
Window_VBSetting.prototype.initialize = function() {
    let width = 500;
    let height = 160;
    let x = (Graphics.width-width)/2;
    let y = 0;
    if (isMZ) {
        Window_Base.prototype.initialize.call(this,new Rectangle(x, y, width, height));
    } else {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
    }
    this.refresh();
};
Window_VBSetting.prototype.update = function() {
    Window_Base.prototype.update.apply(this,arguments);
    this.refresh();
    this.updateTouch();
};
Window_VBSetting.prototype.updateTouch = function() {
    let x = this[isMZ?"_contentsSprite":"_windowContentsSprite"].canvasToLocalXVB(TouchInput.x);
    let y = this[isMZ?"_contentsSprite":"_windowContentsSprite"].canvasToLocalYVB(TouchInput.y);
    let lr1 = this._lineRect1;
    let lr2 = this._lineRect2;
    let lr3 = this._lineRect3;
    let VBItem = null;
    for (let i of VB.buttonList) {
        if (i._isSetting) {
            VBItem = i;
        }
    }
    let VBData = VBItem?VBItem._saveData:null;
    let scaleStart = 10;
    let scaleEnd = 400;
    let opacityStart = 45;
    let opacityEnd = 255;
    //=====================================================================================
    if (VBData) {
        if (!this._pressStatus) {
            if (TouchInput.isTriggered()) {
                if (this.isPointInRange(x,y,lr1)) {
                    VBData.scale = Math.floor((x-lr1[0])/180*(scaleEnd-scaleStart)+scaleStart).clamp(scaleStart,scaleEnd);
                    this._pressStatus = 1;
                } else if (this.isPointInRange(x,y,lr2)) {
                    VBData.opacity = Math.floor((x-lr2[0])/180*(opacityEnd-opacityStart)+opacityStart).clamp(opacityStart,opacityEnd);
                    this._pressStatus = 2;
                } else if (this.isPointInRange(x,y,lr3)) {
                    this._pressStatus = 3;
                    this._pressDirCount = 0;
                    this.refreshDirMove(x,y,lr3,VBData,1);
                }
            }
        } else {
            if (TouchInput.isPressed()) {
                if (this._pressStatus === 1) {
                    VBData.scale = Math.floor((x-lr1[0])/180*(scaleEnd-scaleStart)+scaleStart).clamp(scaleStart,scaleEnd);
                } else if (this._pressStatus === 2) {
                    VBData.opacity = Math.floor((x-lr2[0])/180*(opacityEnd-opacityStart)+opacityStart).clamp(opacityStart,opacityEnd);
                } else if (this._pressStatus === 3) {
                    if (this.isPointInRange(x,y,lr3)) {
                        this._pressDirCount++;
                        if (this._pressDirCount>30) {
                            this.refreshDirMove(x,y,lr3,VBData,2);
                        }
                    } else {
                        this._pressStatus = 0;
                        this._pressDirCount = 0;
                    }
                }
            } else {
                this._pressStatus = 0;
            }
        }
    }
    //=====================================================================================
    let content = this.contents;
    let imgList = VB.settingImage;
    let lineHeight = imgList[0].height;
    content.blt(imgList[0],0,0,imgList[0].width,imgList[0].height,lr1[0],lr1[1]+lr1[3]/2-lineHeight/2,lr1[2],lineHeight);
    content.blt(imgList[0],0,0,imgList[0].width,imgList[0].height,lr2[0],lr2[1]+lr2[3]/2-lineHeight/2,lr2[2],lineHeight);
    let pointHeight = imgList[1].height;
    content.blt(imgList[1],0,0,imgList[1].width,imgList[1].height, lr1[0]+lr1[2]*(  VBData?(VBData.scale-scaleStart)/(scaleEnd-scaleStart):0         )-imgList[1].width/2 , lr1[1]+lr1[3]/2-pointHeight/2 , imgList[1].width , imgList[1].height);
    content.blt(imgList[1],0,0,imgList[1].width,imgList[1].height, lr2[0]+lr2[2]*(  VBData?(VBData.opacity-opacityStart)/(opacityEnd-opacityStart):0   )-imgList[1].width/2 , lr2[1]+lr2[3]/2-pointHeight/2 , imgList[1].width , imgList[1].height);
    content.blt(imgList[2],0,0,imgList[2].width,imgList[2].height,lr3[0],lr3[1],lr3[2],lr3[3]);
};
Window_VBSetting.prototype.refreshDirMove = function(x,y,lr3,VBData,dis) {
    let cx = lr3[0]+lr3[2]/2;
    let cy = lr3[1]+lr3[3]/2;
    let dx = x - cx;
    let dy = y - cy;
    if (Math.abs(dx)>Math.abs(dy)) {
        if (dx>0) {
            VBData.x+=dis;
        } else if (dx<0) {
            VBData.x-=dis;
        }
    } else {
        if (dy>0) {
            VBData.y+=dis;
        } else if (dy<0) {
            VBData.y-=dis;
        }
    }
};
Window_VBSetting.prototype.isPointInRange = function(x,y,rect) {
    return x >= rect[0] && y >= rect[1] && x < rect[0]+rect[2] && y < rect[1]+rect[3];
};
Window_VBSetting.prototype.refresh = function() {
    let content = this.contents;
    let width = content.width;
    let padSize = content.height - 24;//100
    let mainTextWidth = width-padSize - 4;
    let VBItem = null;
    for (let i of VB.buttonList) {
        if (i._isSetting) {
            VBItem = i;
        }
    }
    let VBData = VBItem?VBItem._saveData:null;
    let y = 0;
    content.clear();
    content.fontSize = 18;
    content.drawText(parameters["optionalText"],0,y,width,24,"left");
    y+=24;
    if (VBData) {
        content.drawText("锚点:("+VBItem._xAnchor+","+VBItem._yAnchor+")",0,y,mainTextWidth/2,24,"left");
        content.drawText("X:"+VBData.x+"   Y:"+VBData.y,mainTextWidth/2,y,mainTextWidth/2,24,"left");
    } else {
        content.drawText("锚点:(NULL,NULL)",0,y,mainTextWidth/2,24,"left");
        content.drawText("X:NULL   Y:NULL",mainTextWidth/2,y,mainTextWidth/2,24,"left");
    }
    y+=24;
    let textRange = 90;
    let lineHeight = padSize - 24;
    //content.fillRect(mainTextWidth,24,4,padSize,"#ffffff");
    this._lineRect1 = [textRange,y,mainTextWidth-textRange*2,lineHeight/2];
    this._lineRect2 = [textRange,y+lineHeight/2,mainTextWidth-textRange*2,lineHeight/2];
    this._lineRect3 = [mainTextWidth+4,24,padSize,padSize];
    content.drawText("缩放率:",0,y,textRange,lineHeight/2,"left");
    content.drawText("不透明度:",0,y+lineHeight/2,textRange,lineHeight/2,"left");
    if (VBData) {
        content.drawText(VBData.scale,mainTextWidth-textRange+4,y,textRange-4,lineHeight/2,"center");
        content.drawText(VBData.opacity,mainTextWidth-textRange+4,y+lineHeight/2,textRange-4,lineHeight/2,"center");
    } else {
        content.drawText("NULL",mainTextWidth-textRange+4,y,textRange-4,lineHeight/2,"center");
        content.drawText("NULL",mainTextWidth-textRange+4,y+lineHeight/2,textRange-4,lineHeight/2,"center");
    }
};
//=============================================================================
//
//=============================================================================
Window_VBSettingCommand.prototype = Object.create(Window_HorzCommand.prototype);
Window_VBSettingCommand.prototype.constructor = Window_VBSettingCommand;
Window_VBSettingCommand.prototype.initialize = function(x,y) {
    this._windowWidth = 500;
    if (isMZ) {
        Window_HorzCommand.prototype.initialize.call(this, new Rectangle(x,y,500,Scene_Base.prototype.calcWindowHeight(1,true)));
    } else {
        Window_HorzCommand.prototype.initialize.call(this, x,y);
    }
};

Window_VBSettingCommand.prototype.windowWidth = function() {
    return this._windowWidth;
};
Window_VBSettingCommand.prototype.canChangeDirMode = function() {
    return ["true","1","2","3","4"].includes(parameters["dirButtonOptional"]);
};
Window_VBSettingCommand.prototype.maxCols = function() {
    return this.canChangeDirMode()?4:3;
};
Window_VBSettingCommand.prototype.makeCommandList = function() {
    if (this.canChangeDirMode()) {
        this.addCommand('改变方向键样式','dirMode');
    }
    this.addCommand('重置该按钮','reset');
    this.addCommand('重置全部按钮','resetAll');
    this.addCommand('返回','cancel');
};
//=============================================================================
//
//=============================================================================
/*Window_VBSettingCommand.prototype.processTouch = function() {
    if (this.isOpenAndActive()) {
        if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
            this.onTouch(true);
        } else if (TouchInput.isCancelled()) {
            if (this.isCancelEnabled()) {
                this.processCancel();
            }
        }
    } else {
        this._touching = false;
    }
};
Window_VBSettingCommand.prototype.onTouch = function(triggered) {
    var x = this.canvasToLocalX(TouchInput.x);
    var y = this.canvasToLocalY(TouchInput.y);
    var hitIndex = this.hitTest(x, y);
    if (hitIndex >= 0) {
        this._index = hitIndex;
        this.processOk();
    }
};
Window_VBSettingCommand.prototype.updateCursor = function() {
    this.setCursorRect(0, 0, 0, 0);
};*/
//=============================================================================
//
//=============================================================================
/*Window_VBSettingSaveCommand.prototype = Object.create(Window_HorzCommand.prototype);
Window_VBSettingSaveCommand.prototype.constructor = Window_VBSettingSaveCommand;
Window_VBSettingSaveCommand.prototype.initialize = function(x,y) {
    this._windowWidth = 250;
    Window_HorzCommand.prototype.initialize.call(this, x,y);
};

Window_VBSettingSaveCommand.prototype.windowWidth = function() {
    return this._windowWidth;
};
Window_VBSettingSaveCommand.prototype.maxCols = function() {
    return 2;
};
Window_VBSettingSaveCommand.prototype.makeCommandList = function() {
    this.addCommand('储存','save');
    this.addCommand('取消','cancel');
};
Window_VBSettingSaveCommand.prototype.processTouch = Window_VBSettingCommand.prototype.processTouch;
Window_VBSettingSaveCommand.prototype.onTouch = Window_VBSettingCommand.prototype.onTouch;
Window_VBSettingSaveCommand.prototype.updateCursor = Window_VBSettingCommand.prototype.updateCursor;*/
//=============================================================================
//
//=============================================================================
Game_VB_Base.prototype.clearAllSettingData = function() {
    this._isSetting = false;
    this._settingPressCount = 0;
    this._settingPressed = false;
    this._shakingCount = 0;
};
Game_VB_Base.prototype.updateVBSettingMode = function(type,x,y) {
    if (type===2) {
        for (let i of VB.buttonList) {
            i.clearAllSettingData();
        }
        this._isSetting = true;
    } else if (type===0) {
        this._settingPressed = true;
    }
};
Game_VB_Base.prototype.updateSetting = function() {
    if (this._isSetting) {
        this._shakingCount++;
        if (this._settingPressed) {
            if (TouchInput.isPressed()) {
                if (this._settingPressCount>10) {
                    this._saveData.x = TouchInput.x;
                    this._saveData.y = TouchInput.y;
                } else if (this._settingPressCount>0) {
                    this._settingPressCount++;
                } else {
                    this._settingPressCount = 1;
                }
            } else {
                this._settingPressCount = 0;
                this._settingPressed = false;
            }
        } else {
            this._settingPressCount = 0;
        }
    }
};
Game_VB_Base.prototype.getProperOpacity = function(opacity) {
    if (this._isSetting) {
        let time = 40;
        let turn = this._shakingCount%time;
        let opacityRate = Math.abs(time/2-turn)/(time/2);
        return Math.round(opacity*opacityRate);
    } else {
        return opacity;
    }
};
//=============================================================================
//
//=============================================================================
})(QJ.VB.reWrite);
//=============================================================================
//
//=============================================================================