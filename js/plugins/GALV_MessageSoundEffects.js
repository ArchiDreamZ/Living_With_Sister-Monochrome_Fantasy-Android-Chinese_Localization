//-----------------------------------------------------------------------------
//  Galv's Message Sound Effects
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  GALV_MessageSoundEffects.js
//-----------------------------------------------------------------------------
//  2016-10-31 - Version 1.4 - Made aliasing globally obtainable, set ability
//                             to change the pan of sound effects.
//  2015-11-12 - Version 1.3 - Added delay time to sound effect
//  2015-11-12 - Version 1.2 - Fixed some code that didnt break anything
//  2015-11-11 - Version 1.1 - added Galv plugin command efficiency code
//  2015-11-04 - Version 1.0 - release
//-----------------------------------------------------------------------------
// Terms can be found at:
// galvs-scripts.com
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_MessageSE = true;

var Galv = Galv || {};          // Galv's main object
Galv.pCmd = Galv.pCmd || {};    // Plugin Command manager
Galv.MSE = Galv.MSE || {};      // Galv's stuff

//-----------------------------------------------------------------------------
/*:
 * @plugindesc Play sound effects when during Show Text event commands.
 * 
 * @author Galv - galvs-scripts.com
 *
 * @param Delay Time
 * @desc PEriod of time (frames) after each SE that the next SE cannot play for
 * @default 10
 *
 * @param Default Talk SE
 * @desc Sound effect played during each character in a Show Text
 * message. FileName,volume,pitch,pan(optional).
 * @default Cursor1,80,150
 *
 * @param Default Confirm SE
 * @desc Sound effect played When player confirms message to
 * continue. FileName,volume,pitch,pan(optional).
 * @default Cursor2,80,150
 *
 * @param -----------
 * @desc Doesn't do anything
 *
 * @default
 *
 * @param Quick SE 1
 * @desc To use in the quick talk plugin command as 1.
 *
 * @default
 *
 * @param Quick SE 2
 * @desc To use in the quick talk plugin command as 2.
 *
 * @default
 *
 * @param Quick SE 3
 * @desc To use in the quick talk plugin command as 3.
 *
 * @default
 *
 * @param Quick SE 4
 * @desc To use in the quick talk plugin command as 4.
 *
 * @default
 *
 * @help
 * Galv's Message Sound Effects
 * -----------------------------------------------------------------------------
 * Set the default sound effects in the plugin settings for characters showing
 * and for confirming the Show Text message. The parameters are:
 *
 * SoundName,volume,pitch,pan(optional)
 *
 * Separated by commas. For example, the below will play the Cursor1 SE at 80
 * volume and 150 pitch:
 * Cursor1,80,150
 *
 * While this plugin allows you to do more or less, RPG Maker MV usually 
 * restricts users to certain amounts:
 * Volume: 0 - 100
 * Pitch: 50 - 150
 *
 * -----------------------------------------------------------------------------
 *   PLUGIN COMMANDS
 * -----------------------------------------------------------------------------
 *   MSGSE TALK CLEAR                 // Removes talk SE
 *   MSGSE TALK DEFAULT               // Returns talk SE to default
 *   MSGSE TALK SoundName vol pit pan // Sets talk SE to a specific sound
 *   MSGSE TALK x                     // Change talk SE to a quick talk. x = 1-4
 *
 *   MSGSE CONFIRM CLEAR                 // Removes the confirm SE
 *   MSGSE CONFIRM DEFAULT               // Returns confirm SE to default
 *   MSGSE CONFIRM SoundName vol pit pan // Sets confirm SE to a specific sound
 *   MSGSE CONFIRM x                     // Change confirm SE to a quick SE 1-4
 * -----------------------------------------------------------------------------
 * Note: pan settings can be left out to return to 0 (default).
 * Once a plugin is called, the SE's will stay changed until changed again.
 */



(function() {
	
// GALV'S PLUGIN MANAGEMENT. INCLUDED IN ALL GALV PLUGINS THAT HAVE PLUGIN COMMAND CALLS, BUT ONLY RUN ONCE.
if (!Galv.aliased) {
	Galv.MSE.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		if (Galv.pCmd[command]) {
			Galv.pCmd[command](args);
			return;
		};
		Galv.MSE.Game_Interpreter_pluginCommand.call(this, command, args);
	};
	Galv.aliased = true; // Don't keep aliasing for other Galv scripts.
};

// Direct to Plugin Object
Galv.pCmd.MSGSE = function(arguments) {
	Galv.MSE.plugin(arguments);
};
// END GALV'S PLUGIN MANAGEMENT



Galv.MSE.plugin = function(arr) {
	if (arr[0] !== "TALK" && arr[0] !== "CONFIRM") return;
	// Get Sound
	switch (arr[1]) {
		case "CLEAR":
			sound = Galv.MSE.makeSound(["",0,100]);
			break;
		case "DEFAULT":
			sound = "default";
			break;
		case "1": case "2": case "3": case "4":
			// Quick SE
			sound = Galv.MSE.quickSE[Number(arr[1])];
			break;
		default:
			obj = {
				name: arr[1],
				pan: Number(arr[4]) || 0,
				pitch: Number(arr[3]),
				volume: Number(arr[2])
			};
			sound = obj;
			break;
	};
	// Set sound
	if (arr[0] === "TALK") {
		if (sound === "default") {
			$gameMessage.msgSe = Galv.MSE.defaultSe;
		} else {
			$gameMessage.msgSe = sound;
		};
	} else if (arr[0] === "CONFIRM") {
		if (sound === "default") {
			$gameMessage.msgConfirmSe = Galv.MSE.defaultConfirmSe;
		} else {
			$gameMessage.msgConfirmSe = sound;
		};
	};
};
	
	
Galv.MSE.makeSound = function(txt) {
	if (Array.isArray(txt)) {
		var arr = txt;
	} else {
		var arr = txt.split(",");
	};
	var obj = {
		name: arr[0],
		pan: Number(arr[3]) || 0,
		pitch: Number(arr[2]),
		volume: Number(arr[1])
	};
	return obj;
};


Galv.MSE.delay = Number(PluginManager.parameters('GALV_MessageSoundEffects')["Delay Time"]);
Galv.MSE.defaultSe = Galv.MSE.makeSound(PluginManager.parameters('GALV_MessageSoundEffects')["Default Talk SE"]);
Galv.MSE.defaultConfirmSe = Galv.MSE.makeSound(PluginManager.parameters('GALV_MessageSoundEffects')["Default Confirm SE"]);

Galv.MSE.quickSE = [];
for (var i = 1; i < 5; i++) {
	var name = "Quick SE " + i
	Galv.MSE.quickSE[i] = Galv.MSE.makeSound(PluginManager.parameters('GALV_MessageSoundEffects')[name]);
};

Galv.MSE.Game_Message_initialize = Game_Message.prototype.initialize;
Game_Message.prototype.initialize = function() {
	this.msgSe = Galv.MSE.defaultSe;
	this.msgConfirmSe = Galv.MSE.defaultConfirmSe;
    Galv.MSE.Game_Message_initialize.call(this);
};

Galv.MSE.Window_Message_startMessage = Window_Message.prototype.startMessage;
Window_Message.prototype.startMessage = function() {
	this.delayTime = Galv.MSE.delay;
	Galv.MSE.Window_Message_startMessage.call(this);
};


Galv.MSE.Window_Message_updateMessage = Window_Message.prototype.updateMessage;
Window_Message.prototype.updateMessage = function() {
	this.delayTime += 1;
	return Galv.MSE.Window_Message_updateMessage.call(this);
};

Galv.MSE.Window_Message_processNormalCharacter = Window_Base.prototype.processNormalCharacter;
Window_Message.prototype.processNormalCharacter = function(textState) {
	if (!this._showFast) {
		if (this.delayTime >= Galv.MSE.delay) {
			AudioManager.playSe($gameMessage.msgSe);
			this.delayTime = 0;
		};
	};
    Galv.MSE.Window_Message_processNormalCharacter.call(this, textState);
};

Galv.MSE.Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
Window_Message.prototype.terminateMessage = function() {
	AudioManager.playSe($gameMessage.msgConfirmSe);
	this.delayTime = Galv.MSE.delay;
    Galv.MSE.Window_Message_terminateMessage.call(this);
};
})();