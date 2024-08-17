//=============================================================================
//
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 
 * @author Qiu Jiu
 * @help QJ-Button.js
 *
 *====================================
 *1.支持开关控制和场景显示。
 *  显示条件分为三种：a.额外脚本显示设置 b开关显示设置. c.场景显示设置
 *  只有这三个都为true时按键才会显示。
 *
 *2.自适应手机窗口，可使用bw,bh,w,h,sx,sw,sy进行设计。
 *  在手机上时w和h读取的是手机《整个屏幕大小》。
 *  在电脑上时w和h读取的是游戏窗口大小(package.json中指定)。
 *  bw和bh读取的是按钮的绝对大小，这个大小会随着按键的缩放率，按键整体的缩放率进行自动调整。
 *  sw和sh代表游戏画面的宽度和高度。
 *  sx代表游戏画面的x坐标，等效于(w-sw)/2
 *
 *3.在游戏菜单的“选项”一栏可以对选项进行调节。
 *
 *4.方向键中的圆可作为摇杆进行拖动。
 *  也可以直接点击方向键进行移动，且可适配八方移动。
 *
 *5.支持多点触控。
 *
 *6.需要将按键图片放入img/button下。
 *
 *7.禁用鼠标/手指点击移动的脚本指令：QJ.B.setMove(false);
 *  启用鼠标/手指点击移动的脚本指令：QJ.B.setMove(true);
 *
 *8.禁用鼠标右键/双指的脚本指令：QJ.B.setTwo(false);
 *  启用鼠标右键/双指的脚本指令：QJ.B.setTwo(true);
 *
 *9.修改按键大小，位置和不透明度可以用指令：
 *  QJ.B.setButton(id,scale,x,y,opacity);
 *  其中：
 *  id代表在插件参数中指定的按钮名称。
 *  scale代表大小。
 *  x和y代表位置，既可以写数字，也可以用bw,w,bh,h等，注意加上半角(英文)引号。
 *  opacity代表不透明度，范围为0-255。
 *
 *10.“是否记忆按键设置”：不记忆的话，每次载入存档后，使用QJ.B.setButton修改的指令和玩家在设置中
 *  设置的按键大小将进行重置。
 *
 *11.方向键中有一个值叫直线移动角度，此值只在八方移动中有效。
 *  若此值为15，则按键相对中心的角度为-15~15中时只会向上移动而不会向左上或者右上移动。
 *
 *12.按键选项中的“按钮”的意思是：
 *  按下此虚拟按键相当于按下键盘上的某按钮，但是按下键盘上的此按钮不代表着按下此虚拟按键。
 *
 *13.使用此插件时，若要扩展按键使用，建议使用Q－S.T.写的Add Input.js这个按键扩展插件。
 *  可以直接使用D本插件的Demo中附带的那个Add Input.js插件，我修改了此插件的说明，更易理解和使用。
 *
 *14.有时我们想在现实文本时，暂时自动隐藏按钮，则可以打开“显示文本时隐藏”选项。
 *  打开后，在显示文本时，按钮就会自动隐藏。
 *  为了避免连续文本显示时按钮的闪现，在由“显示文本”至“不显示文本”这一段期间内，按钮会延迟10帧才出现，此功能不会影响什么，单纯防止了按钮闪现。
 *
 *15.特殊模式：
 *  一般情况下，我们在加密游戏时对按键图片也会加密，使用RMMV原生的读取文件的方式便可正常读取。在不加密时，也可以使用RMMV原生的读取文件的方式
 *  来正常读取按键图片。
 *
 *  但有时我们需要做移植工作，其他图片加密，而按键图片不加密，且可能此工程的加密秘钥我们无法得知，无法以与其他图片同样的秘钥或者加密方式
 *  来加密按键图片。此时使用RMMV原生的读取文件的方式时，读取图片就会出错，因为默认情况下还是会按那个秘钥来解析图片。
 *
 *  此时我们便需要打开这个模式（在右方的插件参数中），来使用浏览器原生的方式来正常读取未加密的图片，而不是使用原生的方式。
 *
 *16.MV和MZ通用。
 *
 *17.同步模式：
 *   此插件的按钮是在webview中单独的一些Div组件，并非原生的RM按钮。
 *   因为手机在webview中的显示分辨率普遍与电脑屏幕不同，所以若不使用转义字符去设计按钮位置，那么按钮在手机和电脑上显示时，大小和位置就会有偏差。
 *   开启此处的同步模式就便可以解决这个问题。
 *   大小同步:保证电脑上的按钮大小与手机上的相同。
 *   坐标同步:保证电脑上的按钮位置与手机上的相同。
 *   (启用 坐标同步 模式后,转义字符中的w和h均会转为读取游戏画面分辨率(即w会和sw的值一样，h和sh的值一样)，而非读取package.json配置文件中的参数)
 *
 *
 *
 *====================================
 *
 * @param button
 * @type struct<buttonList>[]
 * @text 按钮设置
 * @desc 按钮设置
 * @default ["{\"id\":\"Button_Visible_Control\",\"namex\":\"TZ1\",\"pressChange\":\"false\",\"x\":\"0\",\"y\":\"0\",\"scale\":\"100\",\"opacity\":\"200\",\"type\":\"pressed\",\"commonevent\":\"0\",\"script\":\"\\\"window['TZButtonVisible'] = !window['TZButtonVisible'];\\\"\",\"textHide\":\"false\",\"switch\":\"0\",\"switchScript\":\"\",\"button\":\"\",\"showOnScene_Title\":\"true\",\"showOnScene_Map\":\"true\",\"showOnScene_Menu\":\"true\",\"showOnScene_Item\":\"true\",\"showOnScene_Skill\":\"true\",\"showOnScene_Equip\":\"true\",\"showOnScene_Save\":\"true\",\"showOnScene_Load\":\"true\",\"showOnScene_GameEnd\":\"true\",\"showOnScene_Shop\":\"true\",\"showOnScene_Name\":\"true\",\"showOnScene_Battle\":\"true\",\"showOnScene_Gameover\":\"true\",\"showOnScene_Options\":\"true\",\"showOn\":\"\"}","{\"id\":\"A\",\"namex\":\"TZ3\",\"pressChange\":\"false\",\"x\":\"w-bw-24\",\"y\":\"bh*1.4\",\"scale\":\"100\",\"opacity\":\"200\",\"type\":\"pressed\",\"commonevent\":\"0\",\"script\":\"\\\"\\\"\",\"textHide\":\"false\",\"switch\":\"0\",\"switchScript\":\"\\\"!window['TZButtonVisible']\\\"\",\"button\":\"A\",\"showOnScene_Title\":\"true\",\"showOnScene_Map\":\"true\",\"showOnScene_Menu\":\"true\",\"showOnScene_Item\":\"true\",\"showOnScene_Skill\":\"true\",\"showOnScene_Equip\":\"true\",\"showOnScene_Save\":\"true\",\"showOnScene_Load\":\"true\",\"showOnScene_GameEnd\":\"true\",\"showOnScene_Shop\":\"true\",\"showOnScene_Name\":\"true\",\"showOnScene_Battle\":\"true\",\"showOnScene_Gameover\":\"true\",\"showOnScene_Options\":\"true\",\"showOn\":\"\"}","{\"id\":\"pageup\",\"namex\":\"TZ4\",\"pressChange\":\"false\",\"x\":\"w-bw-24\",\"y\":\"bh*2*1.4\",\"scale\":\"100\",\"opacity\":\"200\",\"type\":\"pressed\",\"commonevent\":\"0\",\"script\":\"\\\"\\\"\",\"textHide\":\"false\",\"switch\":\"0\",\"switchScript\":\"\\\"!window['TZButtonVisible']\\\"\",\"button\":\"pageup\",\"showOnScene_Title\":\"true\",\"showOnScene_Map\":\"true\",\"showOnScene_Menu\":\"true\",\"showOnScene_Item\":\"true\",\"showOnScene_Skill\":\"true\",\"showOnScene_Equip\":\"true\",\"showOnScene_Save\":\"true\",\"showOnScene_Load\":\"true\",\"showOnScene_GameEnd\":\"true\",\"showOnScene_Shop\":\"true\",\"showOnScene_Name\":\"true\",\"showOnScene_Battle\":\"true\",\"showOnScene_Gameover\":\"true\",\"showOnScene_Options\":\"true\",\"showOn\":\"\"}","{\"id\":\"pagedown\",\"namex\":\"TZ5\",\"pressChange\":\"false\",\"x\":\"w-bw-24\",\"y\":\"bh*3*1.4\",\"scale\":\"100\",\"opacity\":\"200\",\"type\":\"pressed\",\"commonevent\":\"0\",\"script\":\"\\\"\\\"\",\"textHide\":\"false\",\"switch\":\"0\",\"switchScript\":\"\\\"!window['TZButtonVisible']\\\"\",\"button\":\"pagedown\",\"showOnScene_Title\":\"true\",\"showOnScene_Map\":\"true\",\"showOnScene_Menu\":\"true\",\"showOnScene_Item\":\"true\",\"showOnScene_Skill\":\"true\",\"showOnScene_Equip\":\"true\",\"showOnScene_Save\":\"true\",\"showOnScene_Load\":\"true\",\"showOnScene_GameEnd\":\"true\",\"showOnScene_Shop\":\"true\",\"showOnScene_Name\":\"true\",\"showOnScene_Battle\":\"true\",\"showOnScene_Gameover\":\"true\",\"showOnScene_Options\":\"true\",\"showOn\":\"\"}","{\"id\":\"move5\",\"namex\":\"TZ-Center\",\"pressChange\":\"false\",\"x\":\"bw\",\"y\":\"h-bh*2\",\"scale\":\"100\",\"opacity\":\"200\",\"type\":\"pressed\",\"commonevent\":\"0\",\"script\":\"\\\"\\\"\",\"textHide\":\"false\",\"switch\":\"0\",\"switchScript\":\"\\\"!window['TZButtonVisible']\\\"\",\"button\":\"\",\"showOnScene_Title\":\"true\",\"showOnScene_Map\":\"true\",\"showOnScene_Menu\":\"true\",\"showOnScene_Item\":\"true\",\"showOnScene_Skill\":\"true\",\"showOnScene_Equip\":\"true\",\"showOnScene_Save\":\"true\",\"showOnScene_Load\":\"true\",\"showOnScene_GameEnd\":\"true\",\"showOnScene_Shop\":\"true\",\"showOnScene_Name\":\"true\",\"showOnScene_Battle\":\"true\",\"showOnScene_Gameover\":\"true\",\"showOnScene_Options\":\"true\",\"showOn\":\"\"}","{\"id\":\"move8\",\"namex\":\"TZ-Up\",\"pressChange\":\"false\",\"x\":\"bw\",\"y\":\"h-bh*3\",\"scale\":\"100\",\"opacity\":\"200\",\"type\":\"pressed\",\"commonevent\":\"0\",\"script\":\"\\\"\\\"\",\"textHide\":\"false\",\"switch\":\"0\",\"switchScript\":\"\\\"!window['TZButtonVisible']\\\"\",\"button\":\"up\",\"showOnScene_Title\":\"true\",\"showOnScene_Map\":\"true\",\"showOnScene_Menu\":\"true\",\"showOnScene_Item\":\"true\",\"showOnScene_Skill\":\"true\",\"showOnScene_Equip\":\"true\",\"showOnScene_Save\":\"true\",\"showOnScene_Load\":\"true\",\"showOnScene_GameEnd\":\"true\",\"showOnScene_Shop\":\"true\",\"showOnScene_Name\":\"true\",\"showOnScene_Battle\":\"true\",\"showOnScene_Gameover\":\"true\",\"showOnScene_Options\":\"true\",\"showOn\":\"\"}","{\"id\":\"move4\",\"namex\":\"TZ-Left\",\"pressChange\":\"false\",\"x\":\"0\",\"y\":\"h-bh*2\",\"scale\":\"100\",\"opacity\":\"200\",\"type\":\"pressed\",\"commonevent\":\"0\",\"script\":\"\\\"\\\"\",\"textHide\":\"false\",\"switch\":\"0\",\"switchScript\":\"\\\"!window['TZButtonVisible']\\\"\",\"button\":\"left\",\"showOnScene_Title\":\"true\",\"showOnScene_Map\":\"true\",\"showOnScene_Menu\":\"true\",\"showOnScene_Item\":\"true\",\"showOnScene_Skill\":\"true\",\"showOnScene_Equip\":\"true\",\"showOnScene_Save\":\"true\",\"showOnScene_Load\":\"true\",\"showOnScene_GameEnd\":\"true\",\"showOnScene_Shop\":\"true\",\"showOnScene_Name\":\"true\",\"showOnScene_Battle\":\"true\",\"showOnScene_Gameover\":\"true\",\"showOnScene_Options\":\"true\",\"showOn\":\"\"}","{\"id\":\"move6\",\"namex\":\"TZ-Right\",\"pressChange\":\"false\",\"x\":\"bw*2\",\"y\":\"h-bh*2\",\"scale\":\"100\",\"opacity\":\"200\",\"type\":\"pressed\",\"commonevent\":\"0\",\"script\":\"\\\"\\\"\",\"textHide\":\"false\",\"switch\":\"0\",\"switchScript\":\"\\\"!window['TZButtonVisible']\\\"\",\"button\":\"right\",\"showOnScene_Title\":\"true\",\"showOnScene_Map\":\"true\",\"showOnScene_Menu\":\"true\",\"showOnScene_Item\":\"true\",\"showOnScene_Skill\":\"true\",\"showOnScene_Equip\":\"true\",\"showOnScene_Save\":\"true\",\"showOnScene_Load\":\"true\",\"showOnScene_GameEnd\":\"true\",\"showOnScene_Shop\":\"true\",\"showOnScene_Name\":\"true\",\"showOnScene_Battle\":\"true\",\"showOnScene_Gameover\":\"true\",\"showOnScene_Options\":\"true\",\"showOn\":\"\"}","{\"id\":\"move2\",\"namex\":\"TZ-Down\",\"pressChange\":\"false\",\"x\":\"bw\",\"y\":\"h-bh\",\"scale\":\"100\",\"opacity\":\"200\",\"type\":\"pressed\",\"commonevent\":\"0\",\"script\":\"\\\"\\\"\",\"textHide\":\"false\",\"switch\":\"0\",\"switchScript\":\"\\\"!window['TZButtonVisible']\\\"\",\"button\":\"down\",\"showOnScene_Title\":\"true\",\"showOnScene_Map\":\"true\",\"showOnScene_Menu\":\"true\",\"showOnScene_Item\":\"true\",\"showOnScene_Skill\":\"true\",\"showOnScene_Equip\":\"true\",\"showOnScene_Save\":\"true\",\"showOnScene_Load\":\"true\",\"showOnScene_GameEnd\":\"true\",\"showOnScene_Shop\":\"true\",\"showOnScene_Name\":\"true\",\"showOnScene_Battle\":\"true\",\"showOnScene_Gameover\":\"true\",\"showOnScene_Options\":\"true\",\"showOn\":\"\"}","{\"id\":\"ctrl\",\"namex\":\"TZ7\",\"pressChange\":\"false\",\"x\":\"w-bw*2-24\",\"y\":\"h-bh*3\",\"scale\":\"100\",\"opacity\":\"200\",\"type\":\"pressed\",\"commonevent\":\"0\",\"script\":\"\\\"\\\"\",\"textHide\":\"false\",\"switch\":\"0\",\"switchScript\":\"\\\"!window['TZButtonVisible']\\\"\",\"button\":\"control\",\"showOnScene_Title\":\"true\",\"showOnScene_Map\":\"true\",\"showOnScene_Menu\":\"true\",\"showOnScene_Item\":\"true\",\"showOnScene_Skill\":\"true\",\"showOnScene_Equip\":\"true\",\"showOnScene_Save\":\"true\",\"showOnScene_Load\":\"true\",\"showOnScene_GameEnd\":\"true\",\"showOnScene_Shop\":\"true\",\"showOnScene_Name\":\"true\",\"showOnScene_Battle\":\"true\",\"showOnScene_Gameover\":\"true\",\"showOnScene_Options\":\"true\",\"showOn\":\"\"}","{\"id\":\"shift\",\"namex\":\"TZ8\",\"pressChange\":\"false\",\"x\":\"w-bw*3-24\",\"y\":\"h-bh*2\",\"scale\":\"100\",\"opacity\":\"200\",\"type\":\"pressed\",\"commonevent\":\"0\",\"script\":\"\\\"\\\"\",\"textHide\":\"false\",\"switch\":\"0\",\"switchScript\":\"\\\"!window['TZButtonVisible']\\\"\",\"button\":\"shift\",\"showOnScene_Title\":\"true\",\"showOnScene_Map\":\"true\",\"showOnScene_Menu\":\"true\",\"showOnScene_Item\":\"true\",\"showOnScene_Skill\":\"true\",\"showOnScene_Equip\":\"true\",\"showOnScene_Save\":\"true\",\"showOnScene_Load\":\"true\",\"showOnScene_GameEnd\":\"true\",\"showOnScene_Shop\":\"true\",\"showOnScene_Name\":\"true\",\"showOnScene_Battle\":\"true\",\"showOnScene_Gameover\":\"true\",\"showOnScene_Options\":\"true\",\"showOn\":\"\"}","{\"id\":\"ok\",\"namex\":\"TZ9\",\"pressChange\":\"false\",\"x\":\"w-bw*2-24\",\"y\":\"h-bh\",\"scale\":\"100\",\"opacity\":\"200\",\"type\":\"pressed\",\"commonevent\":\"0\",\"script\":\"\\\"\\\"\",\"textHide\":\"false\",\"switch\":\"0\",\"switchScript\":\"\\\"!window['TZButtonVisible']\\\"\",\"button\":\"ok\",\"showOnScene_Title\":\"true\",\"showOnScene_Map\":\"true\",\"showOnScene_Menu\":\"true\",\"showOnScene_Item\":\"true\",\"showOnScene_Skill\":\"true\",\"showOnScene_Equip\":\"true\",\"showOnScene_Save\":\"true\",\"showOnScene_Load\":\"true\",\"showOnScene_GameEnd\":\"true\",\"showOnScene_Shop\":\"true\",\"showOnScene_Name\":\"true\",\"showOnScene_Battle\":\"true\",\"showOnScene_Gameover\":\"true\",\"showOnScene_Options\":\"true\",\"showOn\":\"\"}","{\"id\":\"cancel\",\"namex\":\"TZ10\",\"pressChange\":\"false\",\"x\":\"w-bw-24\",\"y\":\"h-bh*2\",\"scale\":\"100\",\"opacity\":\"200\",\"type\":\"pressed\",\"commonevent\":\"0\",\"script\":\"\\\"\\\"\",\"textHide\":\"false\",\"switch\":\"0\",\"switchScript\":\"\\\"!window['TZButtonVisible']\\\"\",\"button\":\"escape\",\"showOnScene_Title\":\"true\",\"showOnScene_Map\":\"true\",\"showOnScene_Menu\":\"true\",\"showOnScene_Item\":\"true\",\"showOnScene_Skill\":\"true\",\"showOnScene_Equip\":\"true\",\"showOnScene_Save\":\"true\",\"showOnScene_Load\":\"true\",\"showOnScene_GameEnd\":\"true\",\"showOnScene_Shop\":\"true\",\"showOnScene_Name\":\"true\",\"showOnScene_Battle\":\"true\",\"showOnScene_Gameover\":\"true\",\"showOnScene_Options\":\"true\",\"showOn\":\"\"}"]
 *
 * @param dirButton
 * @type struct<dirButtonList>
 * @text 方向键按钮设置
 * @desc 方向键按钮设置
 * @default {"id":"dir","name":"TZ6","namex":"TZ6","pressChange":"false","straightDegree":"45","x":"0","y":"0","scale":"100","opacity":"100","type":"pressed","commonevent":"0","script":"","textHide":"false","switch":"0","switchScript":"\"false\"","showOnScene_Title":"false","showOnScene_Map":"false","showOnScene_Menu":"false","showOnScene_Item":"false","showOnScene_Skill":"false","showOnScene_Equip":"false","showOnScene_Save":"false","showOnScene_Load":"false","showOnScene_GameEnd":"false","showOnScene_Shop":"false","showOnScene_Name":"false","showOnScene_Battle":"false","showOnScene_Gameover":"false","showOnScene_Options":"false","showOn":""}
 *
 * @param showOnPc
 * @type boolean
 * @text 是否在电脑上显示
 * @desc 是否在电脑上显示
 * @default true
 *
 * @param mobile
 * @type number
 * @min 0
 * @text 初始放大率
 * @desc 初始放大率
 * @default 80
 *
 * @param forBidTwo
 * @type boolean
 * @text 是否禁止双指
 * @desc是否禁止系统自带的双指取消(手机端)
 * @default false
 *
 * @param forBidTwoWhenPress
 * @type boolean
 * @text 按下按键时禁止双指
 * @desc 按下按键时禁止双指取消(手机端)
 * @default true
 *
 * @param forBidDestination
 * @type boolean
 * @text 是否取消点击移动
 * @desc 初始时是否取消掉点击移动，注意，取消掉后也无法再直接与事件进行互动，但可以用指令恢复。
 * @default false
 *
 * @param forBidButtonDes
 * @type boolean
 * @text 按下按钮时取消点击移动
 * @desc 在按下任意按钮时是否取消掉点击移动。
 * @default true
 *
 * @param option
 * @type boolean
 * @text 是否可调整大小
 * @desc 是否在设置页面增加让玩家调整按钮大小的选项
 * @default true
 *
 * @param remember
 * @type boolean
 * @text 是否记忆按键设置
 * @desc 是否记忆按键设置，详情请看插件说明
 * @default true
 *
 * @param defaultSceneShow
 * @type boolean
 * @text 在新的场景中默认显示
 * @desc 一些插件会创建新的场景，打开此选择可以使新的场景都默认显示此按键
 * @default true
 *
 * @param specialMode
 * @type boolean
 * @text 特殊模式
 * @desc 是否设置为特殊模式，具体请查看插件说明。
 * @default false
 *
 * @param synPCAndAndroidScale
 * @type boolean
 * @text 大小同步模式
 * @desc 是否让手机按钮大小(因电脑和手机分辨率不同故在手机上会进行缩放)强制与电脑相同。
 * @default false
 *
 * @param synPCAndAndroidXy
 * @type boolean
 * @text 坐标同步模式
 * @desc 是否让手机按钮坐标(因电脑和手机分辨率不同故在手机上会有偏移)强制与电脑相同。
 * @default false
 *
*/
/*~struct~buttonList:
 *
 * @param id
 * @type text
 * @text 按钮名字
 * @desc 按钮名字，不能重复
 * @default 
 *
 * @param namex
 * @type file
 * @dir img/button
 * @text 按钮图片文件名
 * @desc 按钮图片文件名，分上下两部分，上面为未按下，下面为按下。如果不想区分这个，则将下面的开关关掉。
 * @default 
 *
 * @param pressChange
 * @type boolean
 * @text 图片分为两部分
 * @desc 是否将图片分为两部分，上面为未按下下面为按下时的图，具体可看上面的“按钮图片文件名”。
 * @default true
 *
 * @param x
 * @type text
 * @text x坐标
 * @desc x坐标，使用w代表窗口整体高度（包括黑边），使用bw代表按钮整体宽度，sx代表游戏页面x坐标
 * @default 0
 *
 * @param y
 * @type text
 * @text y坐标 
 * @desc y坐标，使用h代表窗口整体高度（包括黑边），使用bh代表按钮整体高度
 * @default 0
 *
 * @param scale
 * @type number
 * @min 0
 * @text 放大率
 * @desc 放大率
 * @default 100
 *
 * @param opacity
 * @type number
 * @min 0
 * @max 255
 * @text 不透明度
 * @desc 不透明度
 * @default 255
 *
 * @param type
 * @type select
 * @text 触发方式
 * @desc 触发方式
 * @option 单击(松手后执行)triggered
 * @value triggered
 * @option 按下(按下后执行)pressed
 * @value pressed
 * @default pressed
 *
 * @param commonevent
 * @type common_event
 * @text 按下后执行的公共事件
 * @desc 按下后执行的公共事件，写0时不触发公共事件
 * @default 0
 *
 * @param script
 * @type note
 * @text 按下后执行的脚本
 * @desc 按下后执行的脚本，不用空着就行
 * @default 
 *
 * @param textHide
 * @type boolean
 * @on 隐藏
 * @off 不隐藏
 * @text 显示文本时隐藏
 * @desc 显示文本时隐藏
 * @default false
 *
 * @param switch
 * @type switch
 * @text 显示按钮的开关
 * @desc 显示按钮的开关
 * @default 0
 *
 * @param switchScript
 * @type note
 * @text 更多显示条件
 * @desc 更多显示条件，不用空着就行
 * @default 
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
 * @default 
 *
 * @param showOnScene_Title
 * @type boolean
 * @text 标题界面
 * @desc 是否在标题界面显示
 * @default true
 *
 * @param showOnScene_Map
 * @type boolean
 * @text 地图界面
 * @desc 是否在地图界面显示
 * @default true
 *
 * @param showOnScene_Menu
 * @type boolean
 * @text 菜单界面
 * @desc 是否在菜单界面显示
 * @default true
 *
 * @param showOnScene_Item
 * @type boolean
 * @text 物品栏
 * @desc 是否在物品栏显示
 * @default true
 *
 * @param showOnScene_Skill
 * @type boolean
 * @text 技能界面
 * @desc 是否在技能界面显示
 * @default true
 *
 * @param showOnScene_Equip
 * @type boolean
 * @text 装备界面
 * @desc 是否在装备界面显示
 * @default true
 *
 * @param showOnScene_Save
 * @type boolean
 * @text 存档界面
 * @desc 是否在存档界面显示
 * @default true
 *
 * @param showOnScene_Load
 * @type boolean
 * @text 加载界面
 * @desc 是否在加载界面显示
 * @default true
 *
 * @param showOnScene_GameEnd
 * @type boolean
 * @text 退出界面
 * @desc 是否在退出界面显示
 * @default true
 *
 * @param showOnScene_Shop
 * @type boolean
 * @text 商店界面
 * @desc 是否在商店界面显示
 * @default true
 *
 * @param showOnScene_Name
 * @type boolean
 * @text 写名字
 * @desc 是否在写名字界面显示
 * @default true
 *
 * @param showOnScene_Battle
 * @type boolean
 * @text 战斗界面
 * @desc 是否在战斗界面显示
 * @default true
 *
 * @param showOnScene_Gameover
 * @type boolean
 * @text 游戏结束界面
 * @desc 是否在游戏结束界面显示
 * @default true
 *
 * @param showOnScene_Options
 * @type boolean
 * @text 设置界面
 * @desc 是否在设置界面显示
 * @default true
 *
 * @param showOn
 * @type text
 * @text 其余显示设置
 * @desc 要在“Scene_Happy”场景显示，则写Scene_Happy，若有多个用|分割，例如：Scene_Happy|Scene_Sad。
 * @default 
 *
*/
/*~struct~dirButtonList:
 *
 * @param id
 * @type text
 * @text 按钮名字
 * @desc 按钮名字，尽量不要修改 
 * @default dir
 *
 * @param name
 * @type file
 * @dir img/button
 * @text 按钮图片文件名
 * @desc 按钮图片文件名
 * @default 
 *
 * @param namex
 * @type file
 * @dir img/button
 * @text 中间被拖动的圈的图片
 * @desc 中间被拖动的圈的图片
 * @default 
 *
 * @param pressChange
 * @type boolean
 * @text 圈的图片分为两部分
 * @desc 是否将圈的图片分为两部分，上面为未按下下面为按下时的图
 * @default true
 *
 * @param straightDegree
 * @type number
 * @min 0
 * @max 45
 * @text 直线移动角度
 * @desc 直线移动角度，只在八方移动中有效。若此值为15，则按键相对中心的角度为-15~15中时只会向上移动而不会向左上或者右上移动。
 * @default 15
 *
 * @param x
 * @type text
 * @text x坐标
 * @desc x坐标，使用w代表窗口整体高度（包括黑边），使用bw代表按钮整体宽度，sx代表游戏页面x坐标
 * @default 0
 *
 * @param y
 * @type text
 * @text y坐标
 * @desc y坐标，使用h代表窗口整体高度（包括黑边），使用bh代表按钮整体宽度
 * @default 0
 *
 * @param scale
 * @type number
 * @min 0
 * @text 放大率
 * @desc 放大率
 * @default 100
 *
 * @param opacity
 * @type number
 * @min 0
 * @max 255
 * @text 不透明度
 * @desc 不透明度
 * @default 255
 *
 * @param type
 * @type select
 * @text 触发方式
 * @desc 触发方式
 * @option 单击(松手后执行)triggered
 * @value triggered
 * @option 按下(按下后执行)pressed
 * @value pressed
 * @default pressed
 *
 * @param commonevent
 * @type common_event
 * @text 按下后执行的公共事件
 * @desc 按下后执行的公共事件，写0时不触发公共事件
 * @default 0
 *
 * @param script
 * @type note
 * @text 按下后执行的脚本
 * @desc 按下后执行的脚本，不用空着就行
 * @default 
 *
 * @param textHide
 * @type boolean
 * @on 隐藏
 * @off 不隐藏
 * @text 显示文本时隐藏
 * @desc 显示文本时隐藏
 * @default false
 *
 * @param switch
 * @type switch
 * @text 显示按钮的开关
 * @desc 显示按钮的开关
 * @default 1
 *
 * @param switchScript
 * @type note
 * @text 更多显示条件
 * @desc 更多显示条件，不用空着就行
 * @default
 *
 * @param showOnScene_Title
 * @type boolean
 * @text 标题界面
 * @desc 是否在标题界面显示
 * @default true
 *
 * @param showOnScene_Map
 * @type boolean
 * @text 地图界面
 * @desc 是否在地图界面显示
 * @default true
 *
 * @param showOnScene_Menu
 * @type boolean
 * @text 菜单界面
 * @desc 是否在菜单界面显示
 * @default true
 *
 * @param showOnScene_Item
 * @type boolean
 * @text 物品栏
 * @desc 是否在物品栏显示
 * @default true
 *
 * @param showOnScene_Skill
 * @type boolean
 * @text 技能界面
 * @desc 是否在技能界面显示
 * @default true
 *
 * @param showOnScene_Equip
 * @type boolean
 * @text 装备界面
 * @desc 是否在装备界面显示
 * @default true
 *
 * @param showOnScene_Save
 * @type boolean
 * @text 存档界面
 * @desc 是否在存档界面显示
 * @default true
 *
 * @param showOnScene_Load
 * @type boolean
 * @text 加载界面
 * @desc 是否在加载界面显示
 * @default true
 *
 * @param showOnScene_GameEnd
 * @type boolean
 * @text 退出界面
 * @desc 是否在退出界面显示
 * @default true
 *
 * @param showOnScene_Shop
 * @type boolean
 * @text 商店界面
 * @desc 是否在商店界面显示
 * @default true
 *
 * @param showOnScene_Name
 * @type boolean
 * @text 写名字
 * @desc 是否在写名字界面显示
 * @default true
 *
 * @param showOnScene_Battle
 * @type boolean
 * @text 战斗界面
 * @desc 是否在战斗界面显示
 * @default true
 *
 * @param showOnScene_Gameover
 * @type boolean
 * @text 游戏结束界面
 * @desc 是否在游戏结束界面显示
 * @default true
 *
 * @param showOnScene_Options
 * @type boolean
 * @text 设置界面
 * @desc 是否在设置界面显示
 * @default true
 *
 * @param showOn
 * @type text
 * @text 其余显示设置
 * @desc 要在“Scene_Happy”场景显示，则写Scene_Happy，若有多个用|分割，例如：Scene_Happy|Scene_Sad。
 * @default
*/
//=============================================================================
//
//=============================================================================
var QJ = QJ || {};
QJ.B = QJ.B || {};
var Imported = Imported || {};
Imported.QJButton = true;
//=============================================================================
//
//=============================================================================
function NBDirButton() {
    this.initialize.apply(this, arguments);
}
function NBButton() {
    this.initialize.apply(this, arguments);
}
//=============================================================================
//
//=============================================================================
var NBRealZoom=1,NBButtonList=[];
setRealZoom=(newZoom,type)=>{//0全部 1除方向 2方向
    if (newZoom>=0) NBRealZoom=newZoom;
    if (type==2) {
        for (var i of NBButtonList) {
            if (i.DivX) {
                i.refreshPosition();
                break;
            }
        }
    } else {
        for (var i of NBButtonList) {
            if (type==1&&i.DivX) continue;
            i.refreshPosition();
        }
    }
    if (QJ.B.remember) $gameVariables._QJBRememberSize = NBRealZoom;
}
//=============================================================================
//
//=============================================================================
(() => {
//=============================================================================
//
//=============================================================================
QJ.B.lsBitmapRem = {};
QJ.B.loadDetailData = function(detail) {
    detail.scale = Number(detail.scale);
    detail.commonevent = Number(detail.commonevent);
    detail.opacity = Number(detail.opacity);
    detail.switch = Number(detail.switch);
    detail.pressChange = detail.pressChange?eval(detail.pressChange):true;
    return detail;
}
getName=(data,x)=>{return "./img/button/"+(x?data.name:data.namex)+".png";};
loadImage=function(data,x) {
    let img=new Image();
    img.src=getName(data,x);
    img.onload = ()=>{
　　　　if (x) {data.width = img.width;data.height = img.height;}
        else {data.widthx = img.width;data.heightx = img.height;}
　　}
    return img;
};
//=============================================================================
//
//=============================================================================
const pluginName = "QJ-Button";
const parameters = PluginManager.parameters(pluginName);
let specialMode=eval(parameters['specialMode'])||false;
const button=eval(parameters['button']) || [];
const dirButton=specialMode?JsonEx.parse(parameters['dirButton']):QJ.B.loadDetailData(JsonEx.parse(parameters['dirButton']));
const d=[];
let loadedD = false;
const showOnPC=eval(parameters['showOnPc']);
const NBShow=Utils.isMobileDevice() || showOnPC;
QJ.B.remember=eval(parameters['remember']);
const option=eval(parameters['option']);
const defaultSceneShow=eval(parameters['defaultSceneShow']);
let forBidTwo=eval(parameters['forBidTwo']);
let forBidDestination=eval(parameters['forBidDestination']);
let forBidButtonDes=eval(parameters['forBidButtonDes'])||true;
let forBidTwoWhenPress=eval(parameters['forBidTwoWhenPress'])||true;
if (specialMode) {
    (()=>{
        d.push(dirButton);
        for (var data of button) d.push(JsonEx.parse(data));
        for (var data of d) {
            data = QJ.B.loadDetailData(data);
            if (data.name) loadImage(data,true);
            if (data.namex) loadImage(data,false);
        }
    })();
}
let forBidButtonDesTemp = false;
const synPCAndAndroidScale=eval(parameters['synPCAndAndroidScale']);
const synPCAndAndroidXy=eval(parameters['synPCAndAndroidXy']);
let PCAndAndroidScale = 1;
NBRealZoom=parameters['mobile']/100;
//window.innerWidth<window.innerHeight?1:1;
//=============================================================================
//
//=============================================================================
let isMZ = Utils.RPGMAKER_NAME=='MZ';
//=============================================================================
//
//=============================================================================
QJ.B.setTwo = (bo) => forBidTwo = !bo;
QJ.B.setMove = (bo) => forBidDestination = !bo;
QJ.B.setButton = (id,scale,x,y,opacity) => {
    let data=null;
    for (let i of NBButtonList) {
        if (i.Data.id == id) {
            data=i;
            break;
        }
    }
    if (!data) {
        console.warn("未找到id为"+id+"的按钮。");
        return;
    }
    data.resetData(scale,x,y,opacity);
}
//=============================================================================
//
//=============================================================================
TouchInput._onCancel = function(x, y) {
    if (!forBidTwo) {
        if (isMZ) {
            if (forBidTwoWhenPress&&!forBidButtonDesTemp) {
                this._newState.cancelled = true;
            }
        } else {
            if (forBidTwoWhenPress&&!forBidButtonDesTemp) {
                this._events.cancelled = true;
            }
        }
    }
    this._x = x;
    this._y = y;
};
const B_Game_Variables_initialize = Game_Variables.prototype.initialize;
Game_Variables.prototype.initialize = function() {
    B_Game_Variables_initialize.call(this);
    this.initializeButton();
};
Game_Variables.prototype.initializeButton = function() {
    this._buttonData = {};
};
Game_Variables.prototype.button = function(id) {
    if (!this._buttonData) this.initializeButton();
    return this._buttonData[id]||{};
};
Game_Variables.prototype.setButton = function(id,data) {
    if (!this._buttonData) this.initializeButton();
    this._buttonData[id] = data;
};
const QJB_Game_Temp_setDestination = Game_Temp.prototype.setDestination
Game_Temp.prototype.setDestination = function(x, y) {
    if (forBidDestination||(forBidButtonDes&&forBidButtonDesTemp)) {
        return;
    }
    QJB_Game_Temp_setDestination.call(this,x,y);
};
const NB_Window_Options_addVolumeOptions = Window_Options.prototype.addVolumeOptions;
Window_Options.prototype.addVolumeOptions = function() {
    if (option) this.addCommand("按钮[退出后修改方向键]", 'NBButtonSize');
    NB_Window_Options_addVolumeOptions.call(this);
};
const NB_Window_Options_isVolumeSymbol = Window_Options.prototype.isVolumeSymbol;
Window_Options.prototype.isVolumeSymbol = function(symbol) {
    return NB_Window_Options_isVolumeSymbol.call(this,symbol)||symbol=="NBButtonSize";
};
const NB_Window_Options_cursorRight = Window_Options.prototype.cursorRight;
Window_Options.prototype.cursorRight = function(wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (symbol=="NBButtonSize") {
        var value = this.getConfigValue(symbol);
        value += 10;
        value = value.clamp(0, 200);
        this.changeValue(symbol, value);
    } else NB_Window_Options_cursorRight.call(this,wrap);
};
const NB_Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
Window_Options.prototype.cursorLeft = function(wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (symbol=="NBButtonSize") {
        var value = this.getConfigValue(symbol);
        value -= 10;
        value = value.clamp(0, 200);
        this.changeValue(symbol, value);
    } else NB_Window_Options_cursorLeft.call(this,wrap);
};
const NB_Window_Options_processOk = Window_Options.prototype.processOk;
Window_Options.prototype.processOk = function() {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (symbol=="NBButtonSize") {
        var value = this.getConfigValue(symbol);
        value += 1;
        value = value.clamp(0, 200);
        this.changeValue(symbol, value);
    } else NB_Window_Options_processOk.call(this);
};
const NB_Window_Options_changeValue = Window_Options.prototype.changeValue;
Window_Options.prototype.changeValue = function(symbol, value) {
    if (symbol=="NBButtonSize") {
        setRealZoom(value/100,1);
        this.refresh();
    } else NB_Window_Options_changeValue.call(this,symbol,value);
};
const NB_Window_Options_getConfigValue = Window_Options.prototype.getConfigValue;
Window_Options.prototype.getConfigValue = function(symbol) {
    if (symbol=="NBButtonSize") return Math.floor(NBRealZoom*100);
    else return NB_Window_Options_getConfigValue.call(this,symbol);
};
const NB_Scene_Options_popScene = Scene_Options.prototype.popScene;
Scene_Options.prototype.popScene = function() {
    setRealZoom(-1,0);
    NB_Scene_Options_popScene.call(this);
};
//=============================================================================
//
//=============================================================================
if (!isMZ) {
    const NB_Scene_Boot_loadSystemImages = Scene_Boot.loadSystemImages;
    Scene_Boot.loadSystemImages = function() {
        NB_Scene_Boot_loadSystemImages.call(this);
        if (!specialMode&&!loadedD) {
            loadedD = true;
            let detail;
            d.push(dirButton);
            for (let data of button) {
                d.push(QJ.B.loadDetailData(JsonEx.parse(data)));
            }
            for (let i of d) {
                if (i.namex&&typeof i.namex == 'string'&&i.namex.length>0) {
                    QJ.B.lsBitmapRem[i.namex] = ImageManager.loadButtonImage(i.namex);
                }
                if (i.name&&typeof i.name == 'string'&&i.name.length>0) {
                    QJ.B.lsBitmapRem[i.name] = ImageManager.loadButtonImage(i.name);
                }
            }
        }
    };
}
const NB_DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
    if (!NB_DataManager_isDatabaseLoaded.call(this,arguments)) return false;
    if (!specialMode) {
        for (let i in QJ.B.lsBitmapRem) {
            if (!QJ.B.lsBitmapRem[i].isReady()) return false;
        }
    }
    if (isMZ&&!loadedD) {
        loadedD = true;
        if (!specialMode) {
            let detail;
            d.push(dirButton);
            for (let data of button) {
                d.push(QJ.B.loadDetailData(JsonEx.parse(data)));
            }
            for (let i of d) {
                if (i.namex&&typeof i.namex == 'string'&&i.namex.length>0) {
                    QJ.B.lsBitmapRem[i.namex] = ImageManager.loadButtonImage(i.namex);
                }
                if (i.name&&typeof i.name == 'string'&&i.name.length>0) {
                    QJ.B.lsBitmapRem[i.name] = ImageManager.loadButtonImage(i.name);
                }
            }
        }
    }
    if (synPCAndAndroidScale&&!this.calculateSynPCAndAndroidQJ) {
        PCAndAndroidScale = Math.max(Graphics.width/window.innerWidth,Graphics.height/window.innerHeight);
        if (synPCAndAndroidScale) NBRealZoom /= PCAndAndroidScale;
        this.calculateSynPCAndAndroidQJ = true;
    }
    return true;
};
let hasShowOnOpen = true;
const NB_DataManager_setupNewGame = DataManager.setupNewGame;
DataManager.setupNewGame = function() {
    NB_DataManager_setupNewGame.call(this,arguments)
    if (hasShowOnOpen) {
        hasShowOnOpen = false;
        if (!NBShow) return;
        //document.getElementById(isMZ?"errorPrinter":"ErrorPrinter").style["pointer-events"]="none";
        for (let i=1;i<d.length;i++) {
            NBButtonList.push(new NBButton(d[i]));
        }
        document.documentElement.style["-webkit-user-select"]="none";
        NBButtonList.push(new NBDirButton(d[0]));
        //document.addEventListener("touchmove", function(evt) {evt.preventDefault();}, false);
    }
};
SceneManager.isGameActive = ()=>true;
//=============================================================================
//
//=============================================================================
ImageManager.loadButtonImage = function(filename, hue) {
    return this.loadBitmap('img/button/', filename, hue, true);
};
loadDiv=function(data,x) {
    let newDiv=document.createElement("div"),url,bitmap;
    if (!specialMode) {
        bitmap = QJ.B.lsBitmapRem[x?data.name:data.namex];
        url = bitmap.canvas.toDataURL('image/png');
        if (x) {
            data.width  = bitmap.baseTexture.width;
            data.height = bitmap.baseTexture.height;
        } else {
            data.widthx = bitmap.baseTexture.width;
            data.heightx = bitmap.baseTexture.height;
        }
    }
    newDiv.id = "NBButton"+data.id+(x?"":"o");
    newDiv.style.position = "fixed";
    var buttonw=Math.floor((x?data.width:data.widthx)*data.scale/100*NBRealZoom),buttonh;
    if (data.pressChange) {
        buttonh=Math.floor((x?data.height:(data.heightx/2))*data.scale/100*NBRealZoom);
    } else {
        buttonh=Math.floor((x?data.height:(data.heightx))*data.scale/100*NBRealZoom);
    }
    newDiv.style.width = buttonw+"px";
    newDiv.style.height = buttonh+"px";
    newDiv.style.top = dealTextContent(data.y,x,data,buttonw,buttonh,"y")+"px";
    newDiv.style.left = dealTextContent(data.x,x,data,buttonw,buttonh,"x")+"px";
    newDiv.style.opacity = data.opacity/255;
    newDiv.style.zIndex = "11";
    newDiv.style.userSelect="none";
    newDiv.style["-webkit-tap-highlight-color"]="rgba(0,0,0,0)";
    newDiv.style["background-image"] = 'url('+(specialMode?getName(data,x):url)+')';
    newDiv.style["background-repeat"] = "no-repeat";
    if (data.pressChange) {
        newDiv.style["background-size"]=buttonw+"px "+(x?buttonh:buttonh*2)+"px";
    } else {
        newDiv.style["background-size"]=buttonw+"px "+buttonh+"px";
    }
    newDiv.style["background-position"]="-0px -"+0+"px";
    document.body.appendChild(newDiv);
    return newDiv;
};
canJudge=()=>{return !SceneManager.isSceneChanging();};
dealTextContent=(content,x,data,w,h,sign)=>{
    content=String(content);
    content=content.replace(/bw/ig,w/PCAndAndroidScale);
    content=content.replace(/bh/ig,h/PCAndAndroidScale);
    content=content.replace(/sw/ig,Graphics.width);
    content=content.replace(/sh/ig,Graphics.height);
    if (synPCAndAndroidXy) {
        content=content.replace(/w/ig,Graphics.width);
        content=content.replace(/h/ig,Graphics.height);
        content=content.replace(/sx/ig,0);
        content=content.replace(/sy/ig,0);
        content=eval(content);
        content/=PCAndAndroidScale;
        if (sign=="x") {
            content+=(window.innerWidth-Graphics.width/PCAndAndroidScale)/2;
        } else if (sign=="y") {
            content+=(window.innerHeight-Graphics.height/PCAndAndroidScale)/2;
        }
        return content;
    } else {
        content=content.replace(/w/ig,window.innerWidth);
        content=content.replace(/h/ig,window.innerHeight);
        content=content.replace(/sx/ig,(window.innerWidth-Graphics.width)/2);
        content=content.replace(/sy/ig,(window.innerHeight-Graphics.height)/2);
        return eval(content);
    }
};
//=============================================================================
//
//=============================================================================
NBDirButton.prototype.initialize = function(data) {
    this.Data=data;   
    this.Data.textHide = this.Data.textHide?eval(this.Data.textHide):false;
    if (!!data.showOn) {
        let moreScene = (data.showOn.split("|"));
        for (let i of moreScene) this.Data["showOn"+i] = true;
    }
    this.Div=loadDiv(data,true);
    this.DivX=loadDiv(data,false);
    this.straightDegree = Number(data.straightDegree)*Math.PI/180;
    this.Press=false;
    this.PressAnim=false;
    this.show=null;
    this.refreshData();
    this.clearInput();
    var pointer=this;
    if(!Utils.isMobileDevice() && showOnPC){
        this.Div.addEventListener('mousedown', (e)=>{
            forBidButtonDesTemp = true;
            var xx=e.clientX,yy=e.clientY;
            var lx=xx-this.x-this.width/2,ly=yy-this.y-this.height/2,ld=(this.height+this.width)/4;
            if (lx*lx+ly*ly>ld*ld) return;
            if (canJudge()) {pointer.setInput(xx,yy);pointer.Press=true;};
            if (this.Data.type=="pressed") this.runData();
        }, false);
        this.DivX.addEventListener('mousedown', (e)=>{
            if (canJudge()) {pointer.setInput(e.clientX,e.clientY);pointer.Press=true;};
            if (this.Data.type=="pressed") this.runData();
        }, false);
        this.DivX.addEventListener('mousemove', (e)=>{
            forBidButtonDesTemp = true;
            if(pointer.Press && canJudge()) pointer.setInput(e.clientX,e.clientY);
        }, false);
        this.DivX.addEventListener('mouseup', ()=>{
            pointer.clearInput();pointer.Press=false;
            if (this.Data.type=="triggered") this.runData();
        }, false);
        this.DivX.addEventListener('mouseout', ()=>{
            pointer.clearInput();pointer.Press=false;
        }, false);
    }
    this.Div.addEventListener('touchstart', (e)=>{
        forBidButtonDesTemp = true;
        var xx=e.targetTouches[0].clientX,yy=e.targetTouches[0].clientY;
        var lx=xx-this.x-this.width/2,ly=yy-this.y-this.height/2,ld=(this.height+this.width)/4;
        if (lx*lx+ly*ly>ld*ld) return;
        if (canJudge()) {pointer.setInput(xx,yy);pointer.Press=true;};
        if (this.Data.type=="pressed") this.runData();
    }, false);
    this.Div.addEventListener('touchend', (e)=>{
        pointer.clearInput();
        pointer.Press=false;
        if (this.Data.type=="triggered") this.runData();
    }, false);
    this.Div.addEventListener('touchmove', (e)=>{
        forBidButtonDesTemp = true;
        if (pointer.Press && canJudge()) {
            pointer.setInput(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
        };
    }, false);
    this.DivX.addEventListener('touchstart', (e)=>{
        forBidButtonDesTemp = true;
        if (canJudge()) {
            pointer.setInput(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
            pointer.Press=true;
        };
        if (this.Data.type=="pressed") this.runData();
    }, false);
    this.DivX.addEventListener('touchmove', (e)=>{
        if (pointer.Press && canJudge()) {
            pointer.setInput(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
        };
    }, false);
    this.DivX.addEventListener('touchend', ()=>{
        pointer.clearInput();
        pointer.Press=false;
        if (this.Data.type=="triggered") this.runData();
    }, false);
};
NBDirButton.prototype.refreshData = function() {
    this.x = Number(this.Div.style.left.substr(0,this.Div.style.left.length-2));
    this.y = Number(this.Div.style.top.substr(0,this.Div.style.top.length-2));
    this.xx = Number(this.DivX.style.left.substr(0,this.DivX.style.left.length-2));
    this.yx = Number(this.DivX.style.top.substr(0,this.DivX.style.top.length-2));
    this.width = Number(this.Div.style.width.substr(0,this.Div.style.width.length-2));
    this.height = Number(this.Div.style.height.substr(0,this.Div.style.height.length-2));
    this.widthx = Number(this.DivX.style.width.substr(0,this.DivX.style.width.length-2));
    this.heightx = Number(this.DivX.style.width.substr(0,this.DivX.style.width.length-2));
    let remData = $gameVariables.button(this.Data.id)||{};
    remData["scale"] = this.Data.scale;
    remData["x"] = this.Data.x;
    remData["y"] = this.Data.y;
    remData["opacity"] = this.Data.opacity;
    $gameVariables.setButton(this.Data.id,remData);
};
NBDirButton.prototype.loadRemember = function() {
    let data = $gameVariables.button(this.Data.id)||{};
    if (!data||Object.keys(data).length==0) return;
    this.Data.x = data.x;
    this.Data.y = data.y;
    this.Data.opacity = data.opacity;
    this.Data.scale = data.scale;
    this.refreshPosition();
};
NBDirButton.prototype.runData = function() {
    if (this.Data.commonevent>0) $gameTemp.reserveCommonEvent(this.Data.commonevent);
    if (this.Data.script.length>0) eval(eval(this.Data.script));
};
NBDirButton.prototype.update = function() {
    if (this.Press!=this.PressAnim) this.updateShow();
    if (this.judge()!=this.show) {
        this.show=this.judge();
        if (this.show) {
            this.DivX.style.display="block";
            this.Div.style.display="block";
        } else {
            this.DivX.style.display="none";
            this.Div.style.display="none";
        }
        this.Press=false;
        this.updateShow();
    }
    //console.log(Input._currentState['up'],Input._currentState['down'],Input._currentState['left'],Input._currentState['right']);
};
NBDirButton.prototype.updateShow = function() {
    this.PressAnim=this.Press;
    if (this.Press&&this.Data.pressChange) this.DivX.style["background-position"]="-0px -"+this.DivX.style.height;
    else this.DivX.style["background-position"]="-0px -"+0+"px";
};
NBDirButton.prototype.judge = function() {
    let boo = true;
    if (this.Data.switchScript.length>0) {
        boo = boo&&(!!eval(eval(this.Data.switchScript)));
    }
    if (this.Data.switch>0) {
        boo = boo&&($gameSwitches.value(this.Data.switch));
    }
    if (this.Data.textHide) {
        let ts = $gameMessage.isBusy();
        if (ts) {
            this.textShowDelay = 10;
            boo = false;
        } else if (this.textShowDelay>0) {
            this.textShowDelay--;
            boo = false;
        } else boo = true;
    }
    if (SceneManager._scene) {
        if (this.Data["showOn"+SceneManager._scene.constructor.name.toString()]) {
            boo=boo&&!!eval(this.Data["showOn"+SceneManager._scene.constructor.name.toString()]);
        } else {
            boo=boo&&defaultSceneShow
        }
    } else {
        boo=boo&&defaultSceneShow
    }
    return boo;
};
QJ.B.calculateAngleByTwoPoint=function(x,y,ex,ey){
    let ro;
    if (ex>x&&ey<y)  ro=(-Math.atan((x-ex)/(y-ey)));
    if (ex>x&&ey>y)  ro=(Math.PI-Math.atan((x-ex)/(y-ey)));
    if (ex<x&&ey>y)  ro=(Math.PI-Math.atan((x-ex)/(y-ey)));
    if (ex<x&&ey<y)  ro=(2*Math.PI-Math.atan((x-ex)/(y-ey)));
    if (ex==x&&ey>y) ro=Math.PI;
    if (ex==x&&ey<y) ro=0;
    if (ex>x&&ey==y) ro=Math.PI/2;
    if (ex<x&&ey==y) ro=Math.PI*3/2;
    if (ex==x&&ey==y)ro=null;
    return ro;
};
NBDirButton.prototype.setInput = function(xx,yy) {
    this.xx=xx-this.widthx/2;
    this.yx=yy-this.heightx/2;
    this.DivX.style.left=this.xx+"px";
    this.DivX.style.top=this.yx+"px";
    this.touchx=xx-this.x-this.width/2;
    this.touchy=yy-this.y-this.height/2;
    let ro = QJ.B.calculateAngleByTwoPoint(0,0,this.touchx,this.touchy),de=this.straightDegree;
    if (ro<=de) {
        Input._currentState['down']=false;
        Input._currentState['left']=false;
        Input._currentState['right']=false;
        Input._currentState['up']=true;
    } else if (ro<=Math.PI/2-de) {
        Input._currentState['down']=false;
        Input._currentState['left']=false;
        Input._currentState['right']=true;
        Input._currentState['up']=true;
    } else if (ro<=Math.PI/2+de) {
        Input._currentState['down']=false;
        Input._currentState['left']=false;
        Input._currentState['right']=true;
        Input._currentState['up']=false;
    } else if (ro<=Math.PI-de) {
        Input._currentState['down']=true;
        Input._currentState['left']=false;
        Input._currentState['right']=true;
        Input._currentState['up']=false;
    } else if (ro<=Math.PI+de) {
        Input._currentState['down']=true;
        Input._currentState['left']=false;
        Input._currentState['right']=false;
        Input._currentState['up']=false;
    } else if (ro<=Math.PI*3/2-de) {
        Input._currentState['down']=true;
        Input._currentState['left']=true;
        Input._currentState['right']=false;
        Input._currentState['up']=false;
    } else if (ro<=Math.PI*3/2+de) {
        Input._currentState['down']=false;
        Input._currentState['left']=true;
        Input._currentState['right']=false;
        Input._currentState['up']=false;
    } else if (ro<=Math.PI*2-de) {
        Input._currentState['down']=false;
        Input._currentState['left']=true;
        Input._currentState['right']=false;
        Input._currentState['up']=true;
    } else {
        Input._currentState['down']=false;
        Input._currentState['left']=false;
        Input._currentState['right']=false;
        Input._currentState['up']=true;
    }
};
NBDirButton.prototype.clearInput = function() {
    this.touchx=0;
    this.touchy=0;
    Input._currentState['up']=false;
    Input._currentState['down']=false;
    Input._currentState['left']=false;
    Input._currentState['right']=false;
    this.DivX.style.left=(this.x+this.width/2-this.widthx/2)+"px";
    this.DivX.style.top=(this.y+this.height/2-this.heightx/2)+"px";
};
NBDirButton.prototype.refreshPosition = function() {
    if (true) {
        let x=true,data=this.Data,newDiv=this.Div;
        let buttonw=Math.floor((x?data.width:data.widthx)*data.scale/100*NBRealZoom),buttonh;
        if (data.pressChange) {
            buttonh=Math.floor((x?data.height:(data.heightx/2))*data.scale/100*NBRealZoom);
        } else {
            buttonh=Math.floor((x?data.height:(data.heightx))*data.scale/100*NBRealZoom);
        }
        newDiv.style.width = buttonw+"px";
        newDiv.style.height = buttonh+"px";
        newDiv.style.top = dealTextContent(data.y,x,data,buttonw,buttonh,"y")+"px";
        newDiv.style.left = dealTextContent(data.x,x,data,buttonw,buttonh,"x")+"px";
        if (data.pressChange) {
            newDiv.style["background-size"]=buttonw+"px "+(x?buttonh:buttonh*2)+"px";
        } else {
            newDiv.style["background-size"]=buttonw+"px "+buttonh+"px";
        }
        newDiv.style.opacity = this.Data.opacity/255;
    }
    if (true) {
        let x=false,data=this.Data,newDiv=this.DivX;//中间按钮
        let buttonw=Math.floor((x?data.width:data.widthx)*data.scale/100*NBRealZoom),buttonh;
        if (data.pressChange) {
            buttonh=Math.floor((x?data.height:(data.heightx/2))*data.scale/100*NBRealZoom);
        } else {
            buttonh=Math.floor((x?data.height:(data.heightx))*data.scale/100*NBRealZoom);
        }
        newDiv.style.width = buttonw+"px";
        newDiv.style.height = buttonh+"px";
        newDiv.style.top = Number(this.Div.style.top.substr(0,this.Div.style.top.length-2))+
            Number(this.Div.style.height.substr(0,this.Div.style.height.length-2))/2-buttonw/2+"px";
        newDiv.style.left = Number(this.Div.style.left.substr(0,this.Div.style.left.length-2))+
            Number(this.Div.style.width.substr(0,this.Div.style.width.length-2))/2-buttonh/2+"px";
        if (data.pressChange) {
            newDiv.style["background-size"]=buttonw+"px "+(x?buttonh:buttonh*2)+"px";
        } else {
            newDiv.style["background-size"]=buttonw+"px "+buttonh+"px";
        }
        newDiv.style.opacity = this.Data.opacity/255;
    }
    this.refreshData();
};
NBDirButton.prototype.resetData = function(scale,x,y,opacity) {
    this.Data.scale = scale;
    this.Data.x = x;
    this.Data.y = y;
    this.Data.opacity = opacity;
    this.refreshPosition();
}
//=============================================================================
//
//=============================================================================
NBButton.prototype.initialize = function(data) {
    this.delta=false;
    this.Data=data;
    this.Data.textHide = this.Data.textHide?eval(this.Data.textHide):false;
    let moreScene = (data.showOn.split("|"));
    for (let i of moreScene) this.Data["showOn"+i] = true;
    this.Div=loadDiv(data,false);
    this.Press=false;
    this.PressAnim=false;
    this.show=null;
    this.refreshData();
    this.clearInput();
    var pointer=this;
    if(!Utils.isMobileDevice() && showOnPC){
        this.Div.addEventListener('mousedown', (e)=>{
            forBidButtonDesTemp = true;
            if (this.Data.type=="pressed") this.runData();
            if (canJudge()) {
                pointer.setInput();
                pointer.Press=true;
            };
        }, false);
        this.Div.addEventListener('mouseup', ()=>{
            if (this.Data.type=="triggered") this.runData();
            pointer.clearInput();
            pointer.Press=false;
        }, false);
        this.Div.addEventListener('mouseleave', ()=>{
            if (this.Data.type=="triggered") this.runData();
            pointer.clearInput();
            pointer.Press=false;
        }, false);
    }
    this.Div.addEventListener('touchstart', (e)=>{
        forBidButtonDesTemp = true;
        if (this.Data.type=="pressed") this.runData();
        if (canJudge()) {
            pointer.setInput();
            pointer.Press=true;
        };
    }, false);
    this.Div.addEventListener('touchend', ()=>{
        if (this.Data.type=="triggered") this.runData();
        pointer.clearInput();
        pointer.Press=false;
    }, false);
};
NBButton.prototype.refreshData = function() {
    this.x = Number(this.Div.style.left.substr(0,this.Div.style.left.length-2));
    this.y = Number(this.Div.style.top.substr(0,this.Div.style.top.length-2));
    this.width = Number(this.Div.style.width.substr(0,this.Div.style.width.length-2));
    this.height = Number(this.Div.style.height.substr(0,this.Div.style.height.length-2));
    let remData = $gameVariables.button(this.Data.id)||{};
    remData["scale"] = this.Data.scale;
    remData["x"] = this.Data.x;
    remData["y"] = this.Data.y;
    remData["opacity"] = this.Data.opacity;
    $gameVariables.setButton(this.Data.id,remData);
};
NBButton.prototype.loadRemember = function() {
    let data = $gameVariables.button(this.Data.id);
    if (!data||Object.keys(data).length==0) return;
    this.Data.x = data.x;
    this.Data.y = data.y;
    this.Data.opacity = data.opacity;
    this.Data.scale = data.scale;
    this.refreshPosition();
};
NBButton.prototype.runData = function() {
    if (this.Data.commonevent>0) $gameTemp.reserveCommonEvent(this.Data.commonevent);
    if (this.Data.script.length>0) eval(eval(this.Data.script));
};
NBButton.prototype.update = function() {
    if (this.Press!=this.PressAnim) this.updateShow();
    if (this.judge()!=this.show) {
        this.show=this.judge();
        if (this.show) this.Div.style.display="block";
        else this.Div.style.display="none";
        this.Press=false;
        this.updateShow();
    }
};
NBButton.prototype.updateShow = function() {
    this.PressAnim=this.Press;
    if (this.Press&&this.Data.pressChange) this.Div.style["background-position"]="-0px -"+this.Div.style.height;
    else this.Div.style["background-position"]="-0px -"+0+"px";
};
NBButton.prototype.judge = function() {
    let boo = true;
    if (this.Data.switchScript.length>0) {
        boo = boo&&(!!eval(eval(this.Data.switchScript)));
    }
    if (this.Data.switch>0) {
        boo = boo&&($gameSwitches.value(this.Data.switch));
    }
    if (this.Data.textHide) {
        let ts = $gameMessage.isBusy();
        if (ts) {
            this.textShowDelay = 10;
            boo = false;
        } else if (this.textShowDelay>0) {
            this.textShowDelay--;
            boo = false;
        } else boo = true;
    }
    if (SceneManager._scene) {
        if (this.Data["showOn"+SceneManager._scene.constructor.name.toString()]) {
            boo=boo&&!!eval(this.Data["showOn"+SceneManager._scene.constructor.name.toString()]);
        } else {
            boo=boo&&defaultSceneShow
        }
    } else {
        boo=boo&&defaultSceneShow
    }
    return boo;
};
NBButton.prototype.setInput = function() {
    if (this.Data.button.length>0) {
        if (this.Data.button=='left+up') {
            Input._currentState['left']=true;
            Input._currentState['up']=true;
        } else if (this.Data.button=='left+down') {
            Input._currentState['left']=true;
            Input._currentState['down']=true;
        } else if (this.Data.button=='right+up') {
            Input._currentState['right']=true;
            Input._currentState['up']=true;
        } else if (this.Data.button=='right+down') {
            Input._currentState['right']=true;
            Input._currentState['down']=true;
        } else {
            Input._currentState[this.Data.button]=true;
        }
    }
};
NBButton.prototype.clearInput = function() {
    if (this.Data.button.length>0) {
        if (this.Data.button=='left+up') {
            Input._currentState['left']=false;
            Input._currentState['up']=false;
        } else if (this.Data.button=='left+down') {
            Input._currentState['left']=false;
            Input._currentState['down']=false;
        } else if (this.Data.button=='right+up') {
            Input._currentState['right']=false;
            Input._currentState['up']=false;
        } else if (this.Data.button=='right+down') {
            Input._currentState['right']=false;
            Input._currentState['down']=false;
        } else {
            Input._currentState[this.Data.button]=false;
        }
    }
};
NBButton.prototype.refreshPosition = function() {
    var x=false,data=this.Data,newDiv=this.Div;
    let buttonw=Math.floor((x?data.width:data.widthx)*data.scale/100*NBRealZoom),buttonh;
    if (data.pressChange) {
        buttonh=Math.floor((x?data.height:(data.heightx/2))*data.scale/100*NBRealZoom);
    } else {
        buttonh=Math.floor((x?data.height:(data.heightx))*data.scale/100*NBRealZoom);
    }
    newDiv.style.width = buttonw+"px";
    newDiv.style.height = buttonh+"px";
    newDiv.style.top = dealTextContent(data.y,x,data,buttonw,buttonh,"y")+"px";
    newDiv.style.left = dealTextContent(data.x,x,data,buttonw,buttonh,"x")+"px";
    if (data.pressChange) {
        newDiv.style["background-size"]=buttonw+"px "+(x?buttonh:buttonh*2)+"px";
    } else {
        newDiv.style["background-size"]=buttonw+"px "+buttonh+"px";
    }
    newDiv.style.opacity = this.Data.opacity/255;
    this.refreshData();
};
NBButton.prototype.resetData = function(scale,x,y,opacity) {
    this.Data.scale = scale;
    this.Data.x = x;
    this.Data.y = y;
    this.Data.opacity = opacity;
    this.refreshPosition();
}
//=============================================================================
//
//=============================================================================
const NB_Scene_Base_update = Scene_Base.prototype.update;
Scene_Base.prototype.update = function() {
    NB_Scene_Base_update.call(this);
    for (var data of NBButtonList) data.update();
    if (!TouchInput.isPressed()) forBidButtonDesTemp = false;
};
const NB_Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    NB_Scene_Map_update.call(this);
    if (QJ.B.remember) {
        QJ.B.remember = false;
        if ($gameVariables._QJBRememberSize) 
            setRealZoom($gameVariables._QJBRememberSize,0);
        for (let i of NBButtonList) {
            i.loadRemember();
        }
    }
};
//=============================================================================
//
//=============================================================================
})();
//=============================================================================
//
//=============================================================================
