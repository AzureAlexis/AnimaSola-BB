/*	
	Controls custom window functions, by overwriting native JS functions and adding new ones
	Credit to Shiko for help with horizontol choice positioning
*/ 

// Game_Message
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

// Message
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

// ChoiceList
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


// BattleStatus
Window_BattleStatus.prototype.initialize = function() {
    var width = this.windowWidth();
    var height = this.windowHeight();
    var x = Graphics.boxWidth - width;
    var y = Graphics.boxHeight - height;
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
    this.openness = 0;
};

// ActorCommand
Window_ActorCommand.prototype.initialize = function() {
	var x = Graphics.boxWidth - this.windowWidth();
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

Window_Help.prototype.initialize = function(numLines) {
    var width = Graphics.boxWidth;
    var height = this.fittingHeight(numLines || 2);
    Window_Base.prototype.initialize.call(this, 0, 0, 0, 0);
    this._text = '';
	this.opacity = 0;
};

Window_SkillList.prototype.textWidthEx = function(text) {
    return this.drawTextEx(text, 0, this.contents.height);
};

Window_SkillList.prototype.drawItem = function(index) {
    var skill = this._data[index];
    if (skill) {
        var costWidth = this.costWidth();
        var rect = this.itemRect(index);
		console.log(rect);
        rect.width -= this.textPadding();
        this.changePaintOpacity(this.isEnabled(skill));
        this.drawText(skill.name, rect.x + this.textPadding(), rect.y,);
        this.changePaintOpacity(1);
    }
};