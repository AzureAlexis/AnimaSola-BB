/*	
	Controls custom window functions, by overwriting native JS functions and adding new ones
	Credit to Shiko for help with horizontol choice positioning
*/ 
/*----------------------------------------------------------------------
	Window_Base
	The base for all other windows
----------------------------------------------------------------------*/
Window_Base.prototype.drawGauge = function(x, y, width, rate, color1, color2, height = 16, backColor = this.gaugeBackColor()) {
    var fillW = Math.floor(width * rate);
    var gaugeY = y + this.lineHeight() - 8;
    this.contents.fillRect(x, gaugeY, width, height, backColor);
    this.contents.gradientFillRect(x, gaugeY, fillW, height, color1, color2);
};

Window_Base.prototype.drawActorHp = function(actor, x, y, width) {
    width = width || 186;
    var color1 = this.hpGaugeColor1();
    var color2 = color1;
    this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
};

Window_Base.prototype.drawActorMp = function(actor, x, y, width) {
    width = width || 186;
    var color1 = this.mpGaugeColor1();
    var color2 = this.mpGaugeColor2();
    this.drawGauge(x, y, width, actor.mpRate(), color1, color2);
};

Window_Base.prototype.drawActorTp = function(actor, x, y, width) {
    width = width || 96;
    var color1 = this.tpGaugeColor1();
    var color2 = this.tpGaugeColor2();
    this.drawGauge(x, y, width, actor.tpRate(), color1, color2, 6, "#00000000");
};

/*----------------------------------------------------------------------
	Game_Selectable
	Contains the text to be displayed in textboxes
----------------------------------------------------------------------*/

Window_Selectable.prototype.maxWinWidth = function() {
	var maxWidth = 96;
		for (var i = 0; i < this._data.length; i++) {
			var choiceWidth = this.textWidthEx(this._data[i].name) + this.textPadding() * 8;
			if (maxWidth < choiceWidth) {
				maxWidth = choiceWidth;
			}
		}
	this.width = maxWidth;
	this.refresh();
}
Window_Selectable.prototype.currentExt = function() {
    return this.currentData() ? this.currentData().ext : null;
};

/*----------------------------------------------------------------------
	Game_Message
	Contains the text to be displayed in textboxes
----------------------------------------------------------------------*/
Game_Message.prototype.allText = function() {
	let output = "";
	
	for(let i = 0; i < 3; i++) {
		if(i < this._texts.length) {
			output = output + this._texts[i];
		}
		output = output + "\n";
	}
	output = output + "\\c[8]Esper:";
	
    return output;
};
Game_Message.prototype.isChoice = function() {
    return this._choices.length > 0;
};

/*----------------------------------------------------------------------
	WindowMessage
	The main textbox of the game
----------------------------------------------------------------------*/
Window_Message.prototype.startInput = function() {
    if ($gameMessage.isChoice()) {
        this._choiceWindow.start();
        return true;
    } else if ($gameMessage.isNumberInput()) {
        this._numberWindow.start();
        return true;
    } else if ($gameMessage.isItemChoice()) {
        this._itemWindow.start();
        return true;
    } else if (this.canStart()) {
		$gameMessage.setChoiceBackground(2);
		$gameMessage.setChoicePositionType(0);
		$gameMessage.setChoices(["=>"], 0, 0);
		this._choiceWindow.start();
        return true;
    } else {
		return false;
	}
};

/*----------------------------------------------------------------------
	Window_ChoiceList
	The main input window of the game
----------------------------------------------------------------------*/
Window_ChoiceList.prototype.initialize = function(messageWindow) {
    this._messageWindow = messageWindow;
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.openness = 0;
    this.deactivate();
    this._background = 0;
	this.opacity = 0;
};
Window_ChoiceList.prototype.updatePlacement = function() { 
	var messageY = this._messageWindow.y;
	this.width = this.windowWidth();
	this.height = this.windowHeight();
	
	if ($gameMessage.choicePositionType() == 0) {
		this.x = 112;
		this.y = 408;
	} else {
		this.x = Graphics.boxWidth - this.width;
		if (messageY >= Graphics.boxHeight / 2) {
			this.y = messageY - this.height;
		} else {
			this.y = messageY + this._messageWindow.height;
		}
	}
}
Window_ChoiceList.prototype.drawItem = function(index) {
	if ($gameMessage.choicePositionType() == 0) {
		var rect = this.itemRectForText(index);
		var text = this.commandName(index);
		this.drawTextEx(text, rect.x, rect.y);
	} else {
		var rect = this.itemRectForText(index);
		this.drawTextEx(this.commandName(index), rect.x, rect.y);
	}
}
Window_ChoiceList.prototype.numVisibleRows = function() {
	if ($gameMessage.choicePositionType() == 0) {
		return 1;
	} else {
		var messageY = this._messageWindow.y;
		var messageHeight = this._messageWindow.height;
		var centerY = Graphics.boxHeight / 2;
		var choices = $gameMessage.choices();
		var numLines = choices.length;
		var maxLines = 8;
		if (messageY < centerY && messageY + messageHeight > centerY) {
			maxLines = 4;
		}
		if (numLines > maxLines) {
			numLines = maxLines;
		}
		return numLines;
	}
}
Window_ChoiceList.prototype.maxCols = function() {
	if ($gameMessage.choicePositionType() == 0) {
		return $gameMessage.choices().length;
	} else {
		return 1;
	}
}
Window_ChoiceList.prototype.windowWidth = function() {
	if ($gameMessage.choicePositionType() == 0) {
		var choices = $gameMessage.choices();
		var numLines = choices.length;
		var width = (this.maxChoiceWidth() + 10 * 2)*choices.length;
		return Math.min(width, Graphics.boxWidth*2);
	} else {
		var width = this.maxChoiceWidth() + 10 * 2;
		return Math.min(width, Graphics.boxWidth);
	}
}

/*----------------------------------------------------------------------
	Window_BattleStatus
	Shows status of characters during battle
----------------------------------------------------------------------*/
Window_BattleStatus.prototype.initialize = function() {
    var width = this.windowWidth();
    var height = this.windowHeight();
    var x = Graphics.boxWidth - width;
    var y = Graphics.boxHeight - height;
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
    this.openness = 0;
};

/*----------------------------------------------------------------------
	Window_ActorCommand
	The main way to choose moves in battle
----------------------------------------------------------------------*/
Window_ActorCommand.prototype.initialize = function() {
	var x = 0;
    var y = 0;
    Window_Command.prototype.initialize.call(this, x, y);
    this.openness = 0;
	// this.opacity = 0;
    this.deactivate();
    this._actor = null;
	
};
Window_ActorCommand.prototype.makeCommandList = function() {
    if (this._actor) {
        this.addSkillCommands();
        this.addItemCommand();
    }
	
};

/*----------------------------------------------------------------------
	Window_Help
	Displays information about selection in battle
----------------------------------------------------------------------*/
Window_Help.prototype.initialize = function(numLines) {
    var width = Graphics.boxWidth;
    var height = this.fittingHeight(numLines || 2);
    Window_Base.prototype.initialize.call(this, 0, 0, 0, 0);
    this._text = '';
	this.opacity = 0;
};

/*----------------------------------------------------------------------
	Window_SkillList
	The main way to choose skills in battle
----------------------------------------------------------------------*/
Window_SkillList.prototype.textWidthEx = function(text) {
    return this.drawTextEx(text, 0, this.contents.height);
};
Window_SkillList.prototype.drawItem = function(index) {
    var skill = this._data[index];
    if (skill) {
        var costWidth = this.costWidth();
        var rect = this.itemRect(index);
        rect.width -= this.textPadding();
        this.changePaintOpacity(this.isEnabled(skill));
        this.drawText(skill.name, rect.x + this.textPadding(), rect.y,);
        this.changePaintOpacity(1);
    }
};

/*----------------------------------------------------------------------
	Window_BattleEnemy
	Lists the enemies in battle 
----------------------------------------------------------------------*/
Window_BattleEnemy.prototype.maxWinWidth = function() {
	var maxWidth = 96;
	for (var i = 0; i < this._enemies.length; i++) {
		var choiceWidth = this.textWidthEx(this._enemies[i].name()) + this.textPadding() * 8;
		if (maxWidth < choiceWidth) {
			maxWidth = choiceWidth;
		}
	}
	this.width = maxWidth;
	this.refresh();
}
Window_BattleEnemy.prototype.maxCols = function() {
	return 1;
}

Window_BattleStatus.prototype.drawGaugeArea = function(rect, actor) {
    if ($dataSystem.optDisplayTp) {
        this.drawGaugeAreaWithTp(rect, actor);
    } else {
        this.drawGaugeAreaWithoutTp(rect, actor);
    }
};

Scene_Battle.prototype.createDisplayObjects = function() {
    this.createSpriteset();
    this.createWindowLayer();
    this.createAllWindows();
    BattleManager.setLogWindow(this._logWindow);
	BattleManager.setStatusWindow(this._statusWindow);
    BattleManager.setSpriteset(this._spriteset);
    this._logWindow.setSpriteset(this._spriteset);
};

Scene_Battle.prototype.startPartyCommandSelection = function() {
    this.refreshStatus();
    this._statusWindow.deselect();
    this._actorCommandWindow.close();
    this._partyCommandWindow.setup();
};

Scene_Battle.prototype.updateStatusWindow = function() {
    if ($gameMessage.isBusy()) {
        this._statusWindow.close();
        this._partyCommandWindow.close();
        this._actorCommandWindow.close();
    } else if (this.isActive() && !this._messageWindow.isClosing()) {
        this._statusWindow.open();
    }
};

Window_BattleStatus.prototype.drawGaugeAreaWithTp = function(rect, actor) {
	this.drawActorMp(actor, this.width - actor.mmp * 3, this.height - 88, actor.mmp * 3);
    this.drawActorHp(actor, this.width - actor.mhp * 3, this.height - 100, actor.mhp * 3);
	this.drawActorTp(actor, this.width - actor.mhp * 3, this.height - 86, actor.mhp * 3);
};

Window_BattleStatus.prototype.drawBasicArea = function(rect, actor) {
};

Window_BattleStatus.prototype.initialize = function() {
    var width = Graphics.boxWidth;
    var height = this.windowHeight();
    var x = Graphics.boxWidth - width;
    var y = Graphics.boxHeight - height;
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
    this.openness = 0;
	this.opacity = 0;
};