function CommandLine() {
	this.initialize.apply(this, arguments);
}
CommandLine.prototype = Object.create(Window_ChoiceList.prototype)
CommandLine.prototype.constructor = CommandLine;
CommandLine.prototype.initialize = function(x, y, width, height) {
	Window_ChoiceList.prototype.initialize.call(this, x, y, width, height);
}
CommandLine.prototype.update = function() {
	Window_ChoiceList.prototype.update.call(this);
}