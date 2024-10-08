/*
	Contains code relating to combat in this game
	I probably could've done this in a better way, but I'm insane
*/

var animFrame = 0;

/*----------------------------------------------------------------------
	Initilization functions	
	These relate to creating the battle scene, and all involved objects
----------------------------------------------------------------------*/
// Adds the chain window to BattleManager

// Creates the battle scene. Called whenever a battle starts

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
// Creat chain window


/*----------------------------------------------------------------------
	Update functions	
	These update the current battle phase
----------------------------------------------------------------------*/

// Runs every frame, updates window positions
Scene_Battle.prototype.updateWindowPositions = function() {};

/*
BattleManager.update = function() {
	console.log(!this.isBusy() && !this.updateEvent());
    if (!this.isBusy() && !this.updateEvent()) {
        switch (this._phase) {
        case 'start':
            this.startInput();
            break;
        case 'turn':
            this.updateTurn();
            break;
        case 'action':
            this.updateAction();
            break;
        case 'turnEnd':
            this.updateTurnEnd();
            break;
        case 'battleEnd':
            this.updateBattleEnd();
            break;
        }
    }
};
*/

BattleManager.updateEvent = function() {
    switch (this._phase) {
        case 'start':
			return this.updateEventMain();
        case 'turn':
        case 'turnEnd':
            if (this.isActionForced()) {
                this.processForcedAction();
			}
            return true;
    }
    return this.checkAbort();
};

BattleManager.updateEventMain = function() {
    $gameTroop.updateInterpreter();
    $gameParty.requestMotionRefresh();
    if ($gameTroop.isEventRunning() || this.checkBattleEnd()) {
        return true;
    }
    $gameTroop.setupBattleEvent();
    if ($gameTroop.isEventRunning() || SceneManager.isSceneChanging()) {
        return true;
    }
    return false;
};

/*----------------------------------------------------------------------
	Start phase
	These run at the beginning of battle, after initilization is complete
----------------------------------------------------------------------*/
BattleManager.startBattle = function() {
    $gameSystem.onBattleStart();
    $gameParty.onBattleStart();
    $gameTroop.onBattleStart();
	$gameTroop.increaseTurn();
	BattleManager.makeActionOrders();
	this._phase = 'start';
};

/*----------------------------------------------------------------------
	Input phase
	These run when the player is selecting a move
----------------------------------------------------------------------*/

BattleManager.startInput = function() {
    this._phase = 'input';
    $gameParty.makeActions();
    $gameTroop.makeActions();
    this.clearActor();
    if (this._surprise || !$gameParty.canInput()) {
        this.startTurn();
    }
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
Scene_Battle.prototype.commandSkill = function() {
    this._skillWindow.setActor(BattleManager.actor());
    this._skillWindow.setStypeId(this._actorCommandWindow.currentExt());
	this._skillWindow.refresh();
	
	this._skillWindow.maxWinWidth();
	this._skillWindow.y = (this._actorCommandWindow.index()) * 36
	this._skillWindow.x = this._actorCommandWindow._width
    this._skillWindow.show();
    this._skillWindow.activate();
};
// Opens window to target enemy for attack
Scene_Battle.prototype.selectEnemySelection = function() {
    this._enemyWindow.refresh();
	this._enemyWindow.maxWinWidth();
	this._enemyWindow.y = this._skillWindow.y + (this._skillWindow.index()) * 36
	this._enemyWindow.x = this._actorCommandWindow._width + this._skillWindow.width
    this._enemyWindow.show();
    this._enemyWindow.select(0);
    this._enemyWindow.activate();
};
Scene_Battle.prototype.onSelectAction = function() {
    var action = BattleManager.inputtingAction();
    if (!action.needsSelection()) {
		this._skillWindow.hide();
		this._itemWindow.hide();
        this.selectNextCommand();
    } else if (action.isForOpponent()) {
        this.selectEnemySelection();
    } else {
        this.selectActorSelection();
    }
};
Scene_Battle.prototype.startActorCommandSelection = function() {
    this._partyCommandWindow.close();
    this._actorCommandWindow.setup(BattleManager.actor());
};
BattleManager.clearActor = function() {
	this._actorIndex++;
	if(this._actorIndex >= this._actionBattlers.length) {
		this.changeActor(0, '');
		$gameTroop.increaseTurn();
	}
};

BattleManager.selectNextCommand = function() {
	this.startTurn();
}

BattleManager.getNextSubject = function() {
    for (;;) {
        var battler = this._actionBattlers[this._actorIndex];
        if (!battler) {
            return null;
        }
        if (battler.isBattleMember() && battler.isAlive()) {
            return battler;
        }
    }
};


Game_Action.prototype.setSkill = function(skillId) {
    this._item.setObject($dataSkills[skillId]);
	if(skillId > 300) {
		this._length = PatternManager.getPattern(skillId - 300).length;
	} else {
		this._length = 0;
	}
};
Scene_Battle.prototype.onSkillOk = function() {
    var skill = this._skillWindow.item();
    var action = BattleManager.inputtingAction();
    action.setSkill(skill.id);
	BattleManager.setCurrentSkill(skill.id);
    BattleManager.actor().setLastBattleSkill(skill);
    this.onSelectAction();
};
BattleManager.setCurrentSkill = function(input) {
	this._currentSkill = input;
}
/*----------------------------------------------------------------------
	Turn phase
	Runs after the input phase, where the inputted action is executed
----------------------------------------------------------------------*/
BattleManager.startTurn = function() {
    this._phase = 'turn';
    $gameParty.requestMotionRefresh();
    this._logWindow.startTurn();
};

BattleManager.updateTurn = function() {
    $gameParty.requestMotionRefresh();
		console.log("got here");
    if (!this._subject) {
        this._subject = this.getNextSubject();
    }
    if (this._subject) {
        this.processTurn();
    } else {
        this.endTurn();
    }
};

BattleManager.endTurn = function() {
    this._phase = 'turnEnd';
    this._preemptive = false;
    this._surprise = false;
	this._logWindow.close();
	
    this.allBattleMembers().forEach(function(battler) {
        battler.onTurnEnd();
        this.refreshStatus();
        this._logWindow.displayAutoAffectedStatus(battler);
        this._logWindow.displayRegeneration(battler);
    }, this);
    if (this.isForcedTurn()) {
        this._turnForced = false;
    }
};
BattleManager.endAction = function() {
    this._logWindow.endAction(this._subject);
    this._phase = 'turnEnd';
};
BattleManager.updateAction = function() {
    var target = this._targets.shift();
	var scene = SceneManager._scene
    if (target) {
        this.invokeAction(this._subject, target);
    } else if(scene._length <= 0) {
        this.endAction();
    }
};
/*----------------------------------------------------------------------
	EndTurn phase
	Runs after the inputted action is executed
----------------------------------------------------------------------*/

BattleManager.updateTurnEnd = function() {
	this._logWindow.clear();
    this._phase = "start";
};

Scene_Battle.prototype.createActorCommandWindow = function() {
    this._actorCommandWindow = new Window_ActorCommand();
    this._actorCommandWindow.setHandler('attack', this.commandAttack.bind(this));
    this._actorCommandWindow.setHandler('skill',  this.commandSkill.bind(this));
    this._actorCommandWindow.setHandler('guard',  this.commandGuard.bind(this));
    this._actorCommandWindow.setHandler('item',   this.commandItem.bind(this));
    this.addWindow(this._actorCommandWindow);
};