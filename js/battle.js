/*
	Contains code relating to combat in this game
	I probably could've done this in a better way, but I'm insane
*/

/*----------------------------------------------------------------------
	Initilization functions	
	These relate to creating the battle scene, and all involved objects
----------------------------------------------------------------------*/
BattleManager.setChainWindow = function(chainWindow) {
    this._chainWindow = chainWindow;
	this._chainQueue = null;
};
// Creates the battle scene. Called whenever a battle starts
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
	this.createChainWindow();
	BattleManager.setChainWindow(this._chainWindow);
	
	this._chainWindow.x = 0
	this._chainWindow.y = this._actorCommandWindow.height;
	this._chainWindow.width = this._actorCommandWindow.width;
	this._chainWindow.height =  824 - this._actorCommandWindow.height;
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
Scene_Battle.prototype.createChainWindow = function() {
    this._chainWindow = new Window_BattleLog();
    this.addWindow(this._chainWindow);
};

/*----------------------------------------------------------------------
	Update functions	
	These relate to creating the battle scene, and all involved objects
----------------------------------------------------------------------*/
// Runs every frame, updates the battle based on current state
BattleManager.update = function() {
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
    } else {
		this.chainController();
	}
};
// Runs every frame, updates window positions
Scene_Battle.prototype.updateWindowPositions = function() {
};

/*----------------------------------------------------------------------
	Start phase
	These run at the beginning of battle, after initilization is complete
----------------------------------------------------------------------*/
BattleManager.startBattle = function() {
    $gameSystem.onBattleStart();
    $gameParty.onBattleStart();
    $gameTroop.onBattleStart();
	BattleManager.makeActionOrders();
	this._phase = 'start';
};
BattleManager.makeActionOrders = function() {
    var battlers = [];
    if (!this._surprise) {
        battlers = battlers.concat($gameParty.members());
    }
    if (!this._preemptive) {
        battlers = battlers.concat($gameTroop.members());
    }
    battlers.forEach(function(battler) {
        battler.makeSpeed();
    });
    battlers.sort(function(a, b) {
        return b.speed() - a.speed();
    });
    this._actionBattlers = battlers;
};

/*----------------------------------------------------------------------
	Input phase
	These run when the player is selecting a move
----------------------------------------------------------------------*/
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
BattleManager.startTurn = function() {
    this._phase = 'turn';
    $gameTroop.increaseTurn(); 
    $gameParty.requestMotionRefresh();
    this._logWindow.startTurn();
};
BattleManager.clearActor = function() {
	if(this._actorIndex >= this._actionBattlers.length) {
		this.changeActor(0, '');
	}
};
BattleManager.selectNextCommand = function() {
	if(this._actorIndex >= 0) {
		this.startTurn();
	}
    
}
BattleManager.updateTurn = function() {
    $gameParty.requestMotionRefresh();
	console.log("update");
	this._subject = this._actionBattlers[this._actorIndex]
	this.setupChain();
    this.processTurn();
    this.endTurn();
};
BattleManager.endAction = function() {
    this._logWindow.endAction(this._subject);
    this._phase = 'input';
};
BattleManager.startInput = function() {
	this._logWindow.clear();
	this._chainWindow.clear();
    this._phase = 'input';
    $gameParty.makeActions();
    $gameTroop.makeActions();
	this.changeActor(this._actorIndex + 1, 'waiting');
	this.clearActor();
    if (this._surprise || !$gameParty.canInput()) {
        this.startTurn();
    }
};
BattleManager.endTurn = function() {
    this._phase = 'turnEnd';
    this._preemptive = false;
    this._surprise = false;
	
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
BattleManager.setupChain = function() {
	this._chainQueue = null;
	let chains = ["hello", "world", "this", "works"]
	this._chainWindow._lines = chains;
	this._chainWindow.refresh();
}
BattleManager.chainController = function() {
	if(this._chainQueue == null) {
		if(Input.isTriggered("up")) {
			this._chainQueue = "up";
		} else if(Input.isTriggered("left")) {
			this._chainQueue = "left";
		} else if(Input.isTriggered("right")) {
			this._chainQueue = "right";
		} else if(Input.isTriggered("down")) {
			this._chainQueue = "down";
		}
		if(this._chainQueue != null) {
			let temp = [];
			temp[0] = this._chainQueue;
			this._chainWindow.clear();
			this._chainWindow._lines = temp;
			this._chainWindow.refresh();
		}
	}
}