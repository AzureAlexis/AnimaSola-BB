/*----------------------------------------------------------------------
	Window_TitleCommand
	Asks the player what to do during save screen
----------------------------------------------------------------------*/
Window_TitleCommand.prototype.makeCommandList = function() {
	this.addCommand("Continue", 'continue', this.isContinueEnabled());
    this.addCommand("    New Cycle",   'newGame');
	this.addCommand("        Extra Cycle",   'newGame');
    this.addCommand("            Options",   'options');
};

Window_TitleCommand.prototype.updatePlacement = function() {
	this.opacity = 0;
    this.x = 0 + 48;
    this.y = (Graphics.boxHeight - this.height) / 2;
};

Window_TitleCommand.prototype.windowWidth = function() {
    return 360;
};