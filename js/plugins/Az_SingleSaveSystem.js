/*----------------------------------------------------------------------
	Window_SavePrompt
	Asks the player what to do during save screen
----------------------------------------------------------------------*/
function Window_SavePrompt() {
	this.initialize.apply(this, arguments);
}

(Window_SavePrompt.prototype = Object.create(Window_HorzCommand.prototype)).constructor = Window_SavePrompt;
Window_SavePrompt.prototype.constructor = Window_SavePrompt;

Window_SavePrompt.prototype.initialize = function(x, y) {
	Window_HorzCommand.prototype.initialize.call(this, x, y);
	this._saved = true;
	this.width = Graphics.boxWidth/2;
}
Window_SavePrompt.prototype.makeCommandList = function() {
	this.addCommand("Save", 'ok', this._saved);
	this.addCommand("To Title", 'toTitle');
	this.addCommand("Done", 'cancel');
};

Window_SavePrompt.prototype.maxCols = function() {
    return 3;
};

/*----------------------------------------------------------------------
	Window_SavePreview
	Shows the player a preview of their save file, usually on
	save/load scenes
----------------------------------------------------------------------*/
function Window_SavePreview() {
	this.initialize.apply(this, arguments);
}

(Window_SavePreview.prototype = Object.create(Window_Base.prototype)).constructor = Window_SavePreview;
Window_SavePreview.prototype.constructor = Window_SavePreview;

Window_SavePreview.prototype.initialize = function(x, y) {
	Window_Base.prototype.initialize.call(this, x, y, Graphics.boxWidth/2,  lineHeight * 5.5);
	this._height = lineHeight * 5.5;
	this._width = Graphics.boxWidth/2;
	this._openness = 0;
	
	if(DataManager.isAnySavefileExists()) {
		// Store save data in a variable
		let info = JSON.parse(StorageManager.load(1))
		
		// Assign needed infomation to variables. Mapname set to ??? if it begains with ?
		let name = "'" + info.actors._data["@a"][1]._name + "'";
		let playtime = DataManager.loadGlobalInfo()[1].playtime;
		let lv = "LV " + info.actors._data["@a"][1]._level;
		let diff = diffReturn(info.variables._data["@a"][3]) + " (" + modeReturn(info.variables._data["@a"][4]) + ")";
		let mapName = $dataMapInfos[info.map._mapId].name;
		if(mapName.substring(0, 1) == "?") {
			mapName = "???"
		}
		
		this.drawText(name, 0, 0, this.width, "left");  
		this.drawText(lv, -18, 0, this.width, "center");  
		this.drawText(playtime, -36, 0, this.width, "right");
		this.drawText(diff, 0, lineHeight * 1, this.width, "left")
		this.drawText(mapName, 0, lineHeight * 2.5, this.width, "left");
		
	} else {
		// Displays "---EMPTY--" if a save doesn't exist
		this.drawText("---EMPTY---", -18, lineHeight * 1.5, this.width, "center");
	}
}

/*----------------------------------------------------------------------
	Scene_File
	Base for both save and load menus. The entire thing is recreated due
	to having only 1 save slot
----------------------------------------------------------------------*/

// Creates the scene with only the save preview window
Scene_File.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this._savePreview = new Window_SavePreview(Graphics.boxWidth/4, Graphics.boxHeight/4);
	this.addWindow(this._savePreview);
};

// Opens the save preview upon starting the scene
Scene_File.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
	this._savePreview.open();
};

// Always returns the selected save file as 1, since there's only ever one file
Scene_File.prototype.savefileId = function() {
    return 1;
};

/*----------------------------------------------------------------------
	Scene_Save
	Based off Scene_Save, mostly adds the save prompt and it's functions
----------------------------------------------------------------------*/

// Adds the save prompt to the scene
Scene_Save.prototype.create = function() {
	Scene_File.prototype.create.call(this);
	
	this._savePrompt = new Window_SavePrompt(this._savePreview.x, this._savePreview.y + this._savePreview.height, 80, this._savePreview.width)
	
	this._savePrompt.setHandler('ok', this.onSavefileOk.bind(this));
	this._savePrompt.setHandler('toTitle', this.toTitle.bind(this));
    this._savePrompt.setHandler('cancel', this.popScene.bind(this));
	
	this.addWindow(this._savePrompt);
}

// Returns to title. Needed to make the "To title" button word
Scene_Save.prototype.toTitle = function() {
	this.fadeOutAll();
	SceneManager.goto(Scene_Title);
}

// Starts the scene with the save prmopt added
Scene_Save.prototype.start = function() {
	Scene_File.prototype.start.call(this);
	
	this._savePrompt.refresh();
	this._savePrompt.activate();
}

// Restarts the scene upon selecting save
Scene_Save.prototype.onSaveSuccess = function() {
    SoundManager.playSave();
	StorageManager.cleanBackup(this.savefileId());
	this._savePreview.close();
    this._savePreview = new Window_SavePreview(Graphics.boxWidth/4, Graphics.boxHeight/4);
	this.addWindow(this._savePreview);
	this._savePreview.open();
	this._savePrompt._saved = false;
	this._savePrompt.refresh();
	this._savePrompt.select(2);
	this._savePrompt.activate();
};

/*----------------------------------------------------------------------
	Scene_Title
	Title screen file
----------------------------------------------------------------------*/
Scene_Title.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_TitleCommand();
    this._commandWindow.setHandler('newGame',  this.commandNewGame.bind(this));
    this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
    this._commandWindow.setHandler('options',  this.commandOptions.bind(this));
	
	this._savePreview = new Window_SavePreview(this._commandWindow.x + this._commandWindow.width, this._commandWindow.y);
	this.addWindow(this._commandWindow);
	this.addWindow(this._savePreview);
};

Scene_Title.prototype.update = function() {
    if (!this.isBusy()) {
        this._commandWindow.open();
		if(this._commandWindow._openness >= 255) {
			if(this._commandWindow._index == 0 && !this._savePreview.isOpening()) {
				this._savePreview.open();
			} else if(this._commandWindow._index != 0 && !this._savePreview.isClosing()) {
				this._savePreview.close();
			}
		}
    }
	Scene_Base.prototype.update.call(this);
};

Scene_Title.prototype.commandContinue = function() {
    DataManager.loadGame(1)
    SoundManager.playLoad();
    this.fadeOutAll();
    if ($gameSystem.versionId() !== $dataSystem.versionId) {
        $gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
        $gamePlayer.requestMapReload();
    }
    SceneManager.goto(Scene_Map);
};



