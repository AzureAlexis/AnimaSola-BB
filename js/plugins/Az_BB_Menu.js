/*
	Not much right now, but will eventually contain menu code
*/

/*
	Creating the scene and all associated windows
*/

Scene_Menu.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
	this.createNameWindow();
    this.createCommandWindow();
    this.createCategoryWindow();
	this.createItemWindow();
	this.createActorWindow();
	this.createSkillWindow();
	this.createStatusWindow();
};

Scene_Menu.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
};

// GeneraL command for moving between windows
Scene_Menu.prototype.backTo = function(window1, window2, toClose = true) {
	if(toClose) {
		window1.close() // Closes window if 3rd param is true. Default is true
	}
	window1.deactivate()
	
	window2.refresh();
	window2.activate();
	window2.show();
	window2.open();
	
	if(window2 instanceof Window_MenuCommand) {
		this._nameWindow.activate(); // Activate the name window if going to main command
	}
};

/*
	CategoryWindow: Shows list of item categories
	After: CommandWindow
	Before: ItemWindow
*/
Scene_Menu.prototype.createCategoryWindow = function() {
    this._categoryWindow = new Window_ItemCategory();
    // this._categoryWindow.y = Graphics.boxHeight - this._nameWindow.height * 2;
	this._categoryWindow.height = 200;
    this._categoryWindow.setHandler('ok',     this.onCategoryOk.bind(this));
    this._categoryWindow.setHandler('cancel', this.backTo.bind(this, this._categoryWindow, this._commandWindow));
	this._categoryWindow.refresh();
	this._categoryWindow.hide();
	this._categoryWindow.deactivate();
	this._categoryWindow.close();
    this.addWindow(this._categoryWindow);
};

Scene_Menu.prototype.onCategoryOk = function() {
	this._itemWindow.setCategory(this._categoryWindow._list[this._categoryWindow.index()].name.toLowerCase());
	this._itemWindow.show()
	this._itemWindow.open()
	this._itemWindow.activate();
	this._itemWindow.setCategory(this._categoryWindow._list[this._categoryWindow.index()].name.toLowerCase());
	this._itemWindow.select(0);
};

Window_ItemCategory.prototype.maxCols = function() {
    return 1;
};
Window_ItemCategory.prototype.numVisableRows = function() {
    return 4;
};
Window_ItemCategory.prototype.windowWidth = function() {
    return 240;
};

/*
	CommandWindow: Top layer of the menu
*/
Scene_Menu.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_MenuCommand(this._nameWindow.width, Graphics.boxHeight - this._nameWindow.height);
    this._commandWindow.setHandler('item',      this.commandItem.bind(this));
    this._commandWindow.setHandler('skill',     this.onPersonalOk.bind(this));
    this._commandWindow.setHandler('status',    this.onPersonalOk.bind(this));
    this._commandWindow.setHandler('save',      this.commandSave.bind(this));
    this._commandWindow.setHandler('cancel',    this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Menu.prototype.commandItem = function() {
	this._categoryWindow.x = this._commandWindow.x + this._commandWindow.index() * 36;
	this._categoryWindow.y = Graphics.boxHeight - this._categoryWindow.height - this._commandWindow.height;
	this._nameWindow.deactivate();
	this._categoryWindow.refresh();
	this._categoryWindow.show();
    this._categoryWindow.activate();
	this._categoryWindow.open();
};

Window_MenuCommand.prototype.numVisibleRows = function() {
    return 1;
};

Window_MenuCommand.prototype.maxCols = function() {
    return 4;
};

Window_MenuCommand.prototype.makeCommandList = function() {
    if (this.needsCommand('item')) {
        this.addCommand(TextManager.item, 'item');
    }
    if (this.needsCommand('skill')) {
        this.addCommand(TextManager.skill, 'skill');
    }
    if (this.needsCommand('status')) {
        this.addCommand(TextManager.status, 'status');
    }
	if (this.needsCommand('save')) {
        this.addCommand(TextManager.save, 'save');
    }
};

Window_MenuCommand.prototype.windowWidth = function() {
    return Graphics.boxWidth - 130;
};

/*
	NameWindow: Displays character name
*/
function Window_Name() {
	this.initialize.apply(this, arguments);
}

(Window_Name.prototype = Object.create(Window_Command.prototype)).constructor = Window_Name;
Window_Name.prototype.constructor = Window_Name;

Window_Name.prototype.initialize = function(x, y) {
	Window_Command.prototype.initialize.call(this, x, y, 130, this.fittingHeight(4)); 
}

Window_Name.prototype.makeCommandList = function() {
	for(let i = 1; i < $gameActors._data.length; i++) {
		this.addCommand($gameActors._data[i]._name + ":", '', false);
	}
};

Window_Name.prototype.numVisibleRows = function() {
    return 1;
};

Scene_Menu.prototype.createNameWindow = function() {
    this._nameWindow = new Window_Name(0, Graphics.boxHeight - lineHeight * 2);
	this.addWindow(this._nameWindow);
};
Scene_Menu.prototype.createActorWindow = function() {
    this._actorWindow = new Window_Name(this._itemWindow.x + this._itemWindow.width, this._itemWindow.y);
	this._actorWindow.refresh();
	this._actorWindow.hide();
	this._actorWindow.deactivate();
	this.addWindow(this._actorWindow);
};
Window_Name.prototype.windowWidth = function() {
    return 135;
};

// Item window
Scene_Menu.prototype.createItemWindow = function() {
    this._itemWindow = new Window_ItemList(this._nameWindow.width + this._categoryWindow.width, Graphics.boxHeight - this._nameWindow.height - Graphics.boxHeight/2, Graphics.boxWidth/2, Graphics.boxHeight/2);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.backTo.bind(this, this._itemWindow, this._categoryWindow));
    this.addWindow(this._itemWindow);
	this._itemWindow.hide();
	this._itemWindow.deactivate();
	this._itemWindow.close();
    this.addWindow(this._itemWindow);
};

Scene_Menu.prototype.onItemOk = function() {
    $gameParty.setLastItem(this._itemWindow.item());
    this.determineItem();
};
Scene_Menu.prototype.onSkillOk = function() {
    $gameParty.setLastItem(this._skillWindow.item());
    this.determineItem();
};
Window_ItemList.prototype.numberWidth = function() {
    return 24;
};

Scene_Menu.prototype.determineItem = function() {
    var action = new Game_Action($gameParty.menuActor());
    var item = this._itemWindow.item()
    action.setItemObject(item);
    if (action.isForFriend()) {
        this.backTo(this._itemWindow, this._actorWindow, false);
    } else {
        this.useItem();
        this.activateItemWindow();
    }
};

Window_Name.prototype.selectForItem = function(item) {
    var actor = $gameParty.menuActor();
    var action = new Game_Action(actor);
    action.setItemObject(item);
    this.setCursorFixed(false);
    this.setCursorAll(false);
    if (action.isForUser()) {
        if (DataManager.isSkill(item)) {
            this.setCursorFixed(true);
            this.select(actor.index());
        } else {
            this.selectLast();
        }
    } else if (action.isForAll()) {
        this.setCursorAll(true);
        this.select(0);
    } else {
        this.selectLast();
    }
};

//Skill window
Scene_Menu.prototype.createSkillWindow = function() {
    this._skillWindow = new Window_SkillList(this._nameWindow.width, Graphics.boxHeight - this._nameWindow.height - Graphics.boxHeight/2, Graphics.boxWidth/2, Graphics.boxHeight/2);
    this._skillWindow.setHandler('ok',     this.onSkillOk.bind(this));
    this._skillWindow.setHandler('cancel', this.backTo.bind(this, this._skillWindow, this._commandWindow));
	this._skillWindow.setStypeId(2);
	this._skillWindow.hide();
	this._skillWindow.close();
	this._skillWindow.select(0);
    this.addWindow(this._skillWindow);
};

Scene_Menu.prototype.onPersonalOk = function() {
    switch (this._commandWindow.currentSymbol()) {
    case 'skill':
		this._skillWindow.setActor($gameActors._data[this._nameWindow.index() + 1]);
        this.backTo(this._commandWindow, this._skillWindow, false);
        break;
	case 'status':
		this._statusWindow.setActor($gameActors._data[this._nameWindow.index() + 1]);
        this.backTo(this._commandWindow, this._statusWindow, false);
        break;
    }
}

// Status Window
Scene_Menu.prototype.createStatusWindow = function() {
    this._statusWindow = new Window_Status(this._nameWindow.width, Graphics.boxHeight - this._nameWindow.height - Graphics.boxHeight/1.5);
    this._statusWindow.setHandler('cancel', this.backTo.bind(this, this._statusWindow, this._commandWindow));
	this._statusWindow.hide();
	this._statusWindow.close();
    this.addWindow(this._statusWindow);
};

Window_Status.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        var lineHeight = this.lineHeight();
        this.drawBlock1(lineHeight * 0);
        this.drawHorzLine(lineHeight * 1);
        //this.drawBlock2(lineHeight * 2);
        //this.drawHorzLine(lineHeight * 6);
        this.drawBlock3(lineHeight * 2);
        this.drawHorzLine(lineHeight * 13);
        this.drawBlock4(lineHeight * 14);
    }
};

Window_Status.prototype.drawBlock3 = function(y) {
    this.drawParameters(0, y);
    this.drawEquipments(220, y);
};

Window_Status.prototype.initialize = function(x = 0, y = 0) {
    var width = Graphics.boxWidth/1.5;
    var height = Graphics.boxHeight/1.5;
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._actor = null;
    this.refresh();
    this.activate();
};

Window_Status.prototype.drawParameters = function(x, y) {
    var lineHeight = this.lineHeight();
    for (var i = 0; i < 6; i++) {
        var paramId = i + 2;
        var y2 = y + lineHeight * i;
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.param(paramId), x, y2, 160);
        this.resetTextColor();
		if($dataWeapons[this._actor._equips[0]._itemId].meta.lethal && i == 0) {
			this.drawText("Lethal", x + 140, y2, 80, 'right');
		} else {
			this.drawText(this._actor.param(paramId), x + 160, y2, 60, 'right');
		}
    }
};


Window_ItemList.prototype.includes = function(item) {
    switch (this._category) {
    case 'item':
        return DataManager.isItem(item) && item.itypeId === 1;
    case 'weapon':
        return DataManager.isWeapon(item);
    case 'armor':
        return DataManager.isArmor(item);
    case 'keyItem':
        return DataManager.isItem(item) && item.itypeId === 2;
    default:
        return false;
    }
};

//-----------------------------------------------------------------------------
// Scene_Journal
//
// The scene class of the journal screen (Bonds, events). Acti

function Scene_Journal() {
    this.initialize.apply(this, arguments);
}

Scene_Journal.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Journal.prototype.constructor = Scene_Journal;

Scene_Journal.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

// Creating the scene
Scene_Journal.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createCategoryWindow();
	this.createBondWindow();
	this.createInfoWindow();
};

Scene_Journal.prototype.createCategoryWindow = function() {
	this._categoryWindow = new Window_JournalCat(0, 0);
	this._categoryWindow.setHandler("cancel", this.popScene.bind(this));
	this.addWindow(this._categoryWindow);
};

Scene_Journal.prototype.createBondWindow = function() {
	this._bondWindow = new Window_Bonds(0, this._categoryWindow.height);
	this.addWindow(this._bondWindow);
};

Scene_Journal.prototype.createInfoWindow = function() {
	this._infoWindow = new Window_Base(216, 72);
	this._infoWindow.height = Graphics.boxHeight - 72
	this._infoWindow.width = Graphics.boxWidth - 216
	this.addWindow(this._infoWindow);
};

// Start scene
Scene_Journal.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._categoryWindow.open();
};

// Update scene
Scene_Journal.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
	this.updateInfoWindow();
};

Scene_Journal.prototype.updateInfoWindow = function() {
	let info = this.makeRepList()[this._bondWindow._index];
	this._infoWindow.createContents();
	
	this._infoWindow.drawText('"' + info.name + '"', 0, 0, Graphics.boxWidth, "left");
	this._infoWindow.drawText(info.rank, 134, 0, Graphics.boxWidth, "left");
	
	if(info.rep < 550) {
		this._infoWindow.contents.fillRect(316, 4, 300, 24, "#404040");
		this._infoWindow.contents.fillRect(316, 4, (info.repReq - info.rep + info.repToNext) * 3, 24, "#808080");
		this._infoWindow.contents.fillRect(316, 4, info.repToNext * 3, 24, "#00FF00");
	} else {
		this._infoWindow.contents.fillRect(316, 4, 300, 24, "#AAAAFF");
	}
};

// Creates a list of bonds if player has a non-zero amount of rep with them
Scene_Journal.prototype.makeRepList = function() {
	let bondNames = ["Esper", "Luna", "Jake", "Arlet", "Alan", "Sophia"]
	let ranks = ["None", "Neutral", "Familiar", "Friendly", "Acquaintance", "Friend", "Friend", "Good Friend", "Close Friend", "True Friend", "Soulbound"]
	let output = [];
	
	for(let i = 0; i < bondNames.length; i++) {
		let myRep = $gameVariables.value(i + 21)
		
		if(myRep != 0) {
			let myRank = 0;
			let reqRep = 0;
			let repInRank = 0;
			for(let j = 0; j < ranks.length; j++) {
				reqRep = reqRep + (j + 1) * 10
				if(myRep >= reqRep) {
					myRank++;
				} else {
					repInRank = myRep - reqRep + (j + 1) * 10;
					break;
				}
			}
			output.push({name: bondNames[i], rep: myRep, repToNext: repInRank, repReq: reqRep, rank: ranks[myRank]});
		}
	}
	
	return output;
};

// Adds check for journal to Scene_Map
Scene_Map.prototype.updateScene = function() {
    this.checkGameover();
    if (!SceneManager.isSceneChanging()) {
        this.updateTransferPlayer();
    }
    if (!SceneManager.isSceneChanging()) {
        this.updateEncounter();
    }
    if (!SceneManager.isSceneChanging()) {
        this.updateCallMenu();
    }
    if (!SceneManager.isSceneChanging()) {
        this.updateCallDebug();
    }
	if (!SceneManager.isSceneChanging() && !$gameMap.isEventRunning() && Input.isTriggered("tab")) {
        this.callJournal();
    }
};

Scene_Map.prototype.callJournal = function() {
    SoundManager.playOk();
    SceneManager.push(Scene_Journal);
    Window_MenuCommand.initCommandPosition();
    $gameTemp.clearDestination();
    this._mapNameWindow.hide();
    this._waitCount = 2;
};

//-----------------------------------------------------------------------------
// Window_JournalCat
//
// The window class of jornal catagories

function Window_JournalCat() {
    this.initialize.apply(this, arguments);
}

Window_JournalCat.prototype = Object.create(Window_HorzCommand.prototype);
Window_JournalCat.prototype.constructor = Window_JournalCat;

Window_JournalCat.prototype.initialize = function(x, y) {
    Window_HorzCommand.prototype.initialize.call(this, x, y);
};

Window_JournalCat.prototype.makeCommandList = function() {
    this.addCommand("My Bonds", "bonds", true);
	this.addCommand("Schedule", "schedule", true);
};

Window_JournalCat.prototype.maxCols = function() {
    return 2;
};

Window_JournalCat.prototype.windowWidth = function() {
    return Graphics.boxWidth/2;
};

//-----------------------------------------------------------------------------
// Window_Bonds
//
// The window class of the list of your bonds

function Window_Bonds() {
    this.initialize.apply(this, arguments);
}

Window_Bonds.prototype = Object.create(Window_Command.prototype);
Window_Bonds.prototype.constructor = Window_Bonds;

Window_Bonds.prototype.initialize = function(x, y) {
    Window_HorzCommand.prototype.initialize.call(this, x, y);
};

Window_Bonds.prototype.makeCommandList = function() {
	let scene = SceneManager._scene;
	let bonds = scene.makeRepList();
	
	for(let i = 0; i < bonds.length; i++) {
		this.addCommand(bonds[i].name, bonds[i].name, true);
	}
};

Window_Bonds.prototype.windowHeight = function() {
	return Graphics.boxHeight - 72;
};

Window_Bonds.prototype.windowWidth = function() {
    return Graphics.boxWidth/4;
};