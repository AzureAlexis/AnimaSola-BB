/*	
	Controls custom window functions, by overwriting native JS functions and adding new ones
	Credit to Shiko for help with horizontol choice positioning
*/ 

// Overwrites default window behavior
(function() {
	Window_ChoiceList.prototype.updatePlacement = function() { 
		var messageY = this._messageWindow.y;
		this.width = this.windowWidth();
		this.height = this.windowHeight();
		
		if ($gameMessage.choicePositionType() == 1) {
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
		if ($gameMessage.choicePositionType() == 1) {
			var rect = this.itemRectForText(index);
			var text = this.commandName(index);
			this.drawTextEx(text, rect.x, rect.y);
		} else {
			var rect = this.itemRectForText(index);
			this.drawTextEx(this.commandName(index), rect.x, rect.y);
		}
	}

	Window_ChoiceList.prototype.numVisibleRows = function() {
		if ($gameMessage.choicePositionType() == 1) {
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
		if ($gameMessage.choicePositionType() == 1) {
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

	Window_ChoiceList.prototype.windowWidth = function() {
		if ($gameMessage.choicePositionType() == 1) {
			var choices = $gameMessage.choices();
			var numLines = choices.length;
			var width = (this.maxChoiceWidth() + 10 * 2)*choices.length;
			return Math.min(width, Graphics.boxWidth*2);
		} else {
			var width = this.maxChoiceWidth() + 10 * 2;
			return Math.min(width, Graphics.boxWidth);
		}
	}

	Window_ChoiceList.prototype.maxChoiceWidth = function() {
		var maxWidth = 60;
		var choices = $gameMessage.choices();
		for (var i = 0; i < choices.length; i++) {
			var choiceWidth = this.textWidthEx(choices[i]) + 10 * 2;
			if (maxWidth < choiceWidth) {
				maxWidth = choiceWidth;
			}
		}
		return maxWidth;
	};
}