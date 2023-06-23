// Creates the battle scene
Scene_Battle.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createDisplayObjects();
};
// Creates all objects in the battle scene
Scene_Battle.prototype.createDisplayObjects = function() {
	
    this.createSpriteset();
    this.createWindowLayer();
    this.createAllWindows();
    BattleManager.setLogWindow(this._logWindow);
    BattleManager.setStatusWindow(this._statusWindow);
    BattleManager.setSpriteset(this._spriteset);
    this._logWindow.setSpriteset(this._spriteset);
};
// Creates all windows in the battle scene
Scene_Battle.prototype.createAllWindows = function() {
    this.createLogWindow();
    this.createStatusWindow();
    this.createPartyCommandWindow();
    this.createActorCommandWindow();
    this.createHelpWindow();
    this.createSkillWindow();
    this.createItemWindow();
    this.createActorWindow();
    this.createEnemyWindow();
    this.createMessageWindow();
    this.createScrollTextWindow();
};
// Create skill window
Scene_Battle.prototype.createSkillWindow = function() {
    var wy = this._helpWindow.y + this._helpWindow.height;
    var wh = this._statusWindow.y - wy;
    this._skillWindow = new Window_BattleSkill(0, 0, Graphics.boxWidth - this._actorCommandWindow._width, wh);
    this._skillWindow.setHelpWindow(this._helpWindow);
    this._skillWindow.setHandler('ok',     this.onSkillOk.bind(this));
    this._skillWindow.setHandler('cancel', this.onSkillCancel.bind(this));
    this.addWindow(this._skillWindow);
};
// Runs every frame, updates the battle based on current state
BattleManager.update = function() {
    if (!this.isBusy() && !this.updateEvent()) {
        switch (this._phase) {
        case 'start':
            this.startInput();
            break;
        case 'turn':
			console.log($gameTroop);
            this.updateTurn();
            break;
        case 'action':
			console.log($gameTroop);
            this.updateAction();
            break;
        case 'turnEnd':
			console.log($gameTroop);
            this.updateTurnEnd();
            break;
        case 'battleEnd':
            this.updateBattleEnd();
            break;
        }
    }
};

// Runs every frame, updates window positions
Scene_Battle.prototype.updateWindowPositions = function() {
    var statusX = 0;
    if (BattleManager.isInputting()) {
        statusX = this._partyCommandWindow.width;
    } else {
        statusX = this._partyCommandWindow.width / 2;
    }
    if (this._statusWindow.x < statusX) {
        this._statusWindow.x += 16;
        if (this._statusWindow.x > statusX) {
            this._statusWindow.x = statusX;
        }
    }
    if (this._statusWindow.x > statusX) {
        this._statusWindow.x -= 16;
        if (this._statusWindow.x < statusX) {
            this._statusWindow.x = statusX;
        }
    }
	
	var maxWidth = 96;
    for (var i = 0; i < this._skillWindow._data.length; i++) {
        var choiceWidth = this._skillWindow.textWidthEx(this._skillWindow._data[i].name) + this._skillWindow.textPadding() * 8;
        if (maxWidth < choiceWidth) {
            maxWidth = choiceWidth;
        }
    }
	
	this._skillWindow.width = maxWidth;
	this._skillWindow.y = (this._actorCommandWindow.currentExt() - 1) * 40
	this._skillWindow.x = Graphics.boxWidth - this._actorCommandWindow._width - this._skillWindow.width;
	
	
};
/*
	Functions that are run at the start of battle, after initilized
	
	@param 	null
	@return null
*/
BattleManager.startBattle = function() {
    this._phase = 'start';
    $gameSystem.onBattleStart();
    $gameParty.onBattleStart();
    $gameTroop.onBattleStart();
};

Scene_Battle.prototype.changeInputWindow = function() {
    if (BattleManager.isInputting()) {
        if (BattleManager.actor()) {
            this.startActorCommandSelection();
        } else {
			this.selectNextCommand();
		}
    } else {
        this.endCommandSelection();
    }
};