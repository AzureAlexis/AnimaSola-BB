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
    this.contents.gradientFillRect(x - fillW, gaugeY, x, height, color1, color2);
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
		$gameMessage.setChoicePositionType(2);
		$gameMessage.setChoices(["=>"], 0, 0);
		this._choiceWindow.start();
        return true;
    } else {
		return false;
	}
};
Window_Message.prototype.initialize = function() {
    var width = this.windowWidth();
    var height = this.windowHeight();
    var x = (Graphics.boxWidth - width) / 2;
    Window_Base.prototype.initialize.call(this, x, 0, width, height);
    this.openness = 0;
    this.initMembers();
    this.createSubWindows();
    this.updatePlacement();
	this.opacity = 100;
};
Window_Base.prototype.setBackgroundType = function(type) {
    this.opacity = 100;
};

/*----------------------------------------------------------------------
	Window_ChoiceList
	The main input window of the game
----------------------------------------------------------------------*/

Window_ChoiceList.prototype.updatePlacement = function() {
	var positionType = $gameMessage.choicePositionType();
	var messageY = this._messageWindow.y;
	this.width = this.windowWidth();
	this.height = this.windowHeight();
	if(positionType == 2) {
		this.x = 112;
		this.y = Graphics.boxHeight - this.windowHeight();
	} else {
		switch (positionType) {
		case 0:
			this.x = 0;
			break;
		case 1:
			this.x = (Graphics.boxWidth - this.width) / 2;
			break;
		case 2:
			this.x = Graphics.boxWidth - this.width;
			break;
		}
		this.y = Graphics.boxHeight - this.height
	}
};

Window_ChoiceList.prototype.windowWidth = function() {
	var positionType = $gameMessage.choicePositionType();
	if(positionType == 2) {
		var choices = $gameMessage.choices();
		var numLines = choices.length;
		var width = (this.maxChoiceWidth() + this.padding * 2)*choices.length;
		return Math.min(width, Graphics.boxWidth*2);
	} else {
		var width = this.maxChoiceWidth() + this.padding * 2;
		return Math.min(width, Graphics.boxWidth);
	}
}

Window_ChoiceList.prototype.numVisibleRows = function() {
	var positionType = $gameMessage.choicePositionType();
	if(positionType == 2) {
		return 1;
	} else {
		var choices = $gameMessage.choices();
		numCols = choices.length;
		switch (numCols) {
		case 1:
			return 1;
		case 2:
			return 2;
		case 3:
			return 3;
		case 4:
			return 4;
		case 5:
			return 5;
		case 6:
			return 6;
		}
	}
}
Window_ChoiceList.prototype.maxCols = function() {
	var positionType = $gameMessage.choicePositionType();
	if(positionType == 2) {
		var choices = $gameMessage.choices();
		numCols = choices.length;
		switch (numCols) {
		case 1:
			return 1;
		case 2:
			return 2;
		case 3:
			return 3;
		case 4:
			return 4;
		case 5:
			return 5;
		case 6:
			return 6;
		}
	} else {
		return 1;
	}
}

Window_ChoiceList.prototype.start = function() {
    this.updatePlacement();
    this.updateBackground();
    this.refresh();
    this.selectDefault();
    this.open();
    this.activate();
};
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

/*----------------------------------------------------------------------
	Window_BattleStatus
	Shows party status during battle
----------------------------------------------------------------------*/
Window_BattleStatus.prototype.drawGaugeArea = function(rect, actor) {
    if ($dataSystem.optDisplayTp) {
        this.drawGaugeAreaWithTp(rect, actor);
    } else {
        this.drawGaugeAreaWithoutTp(rect, actor);
    }
};

Window_BattleStatus.prototype.drawGaugeAreaWithTp = function(rect, actor) {
	this.drawActorMp(actor, this.width - actor.mmp * 3, this.height - 88, actor.mmp * 3);
    this.drawActorHp(actor, this.width - actor.mhp * 3, this.height - 100, actor.mhp * 3);
	this.drawActorTp(actor, this.width - actor.mmp * 3, this.height - 86, actor.mhp * 3);
	this.drawText(actor.hp, this.width - 80, this.height - 95, 72);
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

/*----------------------------------------------------------------------
	Window_BattleLog
	Shows actions during battle
----------------------------------------------------------------------*/
Window_BattleLog.prototype.maxWinWidth = function() {
	var maxWidth = 96;
		for (var i = 0; i < this._lines.length; i++) {
			var choiceWidth = this.textWidthEx(this._lines[i]) + this.textPadding() * 8;
			if (maxWidth < choiceWidth) {
				maxWidth = choiceWidth;
			}
		}
	this.width = maxWidth;
	this.refresh();
}