BattleManager.setChainWindow = function(chainWindow) {
    this._chainWindow = chainWindow;
	this._chainWindow.hide();
	this._chainQueue = null;
};

BattleManager.update = function() {
    if (!this.isBusy() && !this.updateEvent()) {
        switch (this._phase) {
        case 'start':
			if(this._chainQueue == null) {
				this.startInput();
			} else {
				this.startChain();
			}
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
    } else if(this._actionBattlers[this._actorIndex] instanceof Game_Actor) {
		this.chainController();
	}
};

BattleManager.chainController = function() {
	if(this._chainQueue == null && this._currentSkill > 20) {
		if(Input.isTriggered("up")) {
			this._chainQueue = $dataSkills[$dataSkills[this._currentSkill].meta.chain.split(", ")[0]];
		} else if(Input.isTriggered("left")) {
			this._chainQueue = $dataSkills[$dataSkills[this._currentSkill].meta.chain.split(", ")[1]];
		} else if(Input.isTriggered("right")) {
			this._chainQueue = $dataSkills[$dataSkills[this._currentSkill].meta.chain.split(", ")[2]];
		} else if(Input.isTriggered("down")) {
			this._chainQueue = $dataSkills[$dataSkills[this._currentSkill].meta.chain.split(", ")[3]];
		}
		if(this._chainQueue != null) {
			let temp = [];
			temp[0] = this._chainQueue.name;
			this._chainWindow.clear();
			this._chainWindow._lines = temp;
			this._chainWindow.refresh();
		}
	}
}

BattleManager.startChain = function() {
	var skill = this._chainQueue;
	var subject = this._actionBattlers[this._actorIndex];
	var action = new Game_Action(subject);
	
	action.setSkill(skill.id);
	action.setTarget(subject._lastTargetIndex);
	subject._actions[0] = action;
	
	this.actor().setLastBattleSkill(skill);
	this._chainQueue = null;
	this.startTurn();
}

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
}

Scene_Battle.prototype.createChainWindow = function() {
    this._chainWindow = new Window_BattleLog();
    this.addWindow(this._chainWindow);
	this._chainWindow.x = 0
	this._chainWindow.y = this._actorCommandWindow.height;
	this._chainWindow.width = this._actorCommandWindow.width;
	this._chainWindow.height =  824 - this._actorCommandWindow.height;
	
	BattleManager.setChainWindow(this._chainWindow);
};

BattleManager.endAction = function() {
    this._chainWindow.clear();
	this._chainWindow.close();
	this._chainWindow.hide();
    this._phase = 'turnEnd';
};

BattleManager.setupChain = function() {
	if(this._currentSkill > 20) {
		
		this._chainQueue = null;
		
		let chainIds = $dataSkills[this._currentSkill].meta.chain.split(", ")
		let chains = []
		
		for(let i = 0; i < chainIds.length; i++) {
			if($dataSkills[chainIds[i]].name != "") {
				this._chainWindow._lines.push($dataSkills[chainIds[i]].name);
			} else {
				this._chainWindow._lines.push("\\c[7]--EMPTY--");
			}
		}
		
		this._chainWindow.refresh();
		this._chainWindow.maxWinWidth();
		this._chainWindow.show();
	}
}