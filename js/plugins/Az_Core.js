/*
	General functions that I made that can be used in any Javascript based rpg game
	*says this while having published zero games :p*
	
	Needed for all my plugins
*/

var Az;

function Az_Sprite() {
	this.initialize.apply(this, arguments);
}

(Az_Sprite.prototype = Object.create(Sprite_Base.prototype)).constructor = Az_Sprite;
Az_Sprite.prototype.constructor = Az_Sprite;

Az_Sprite.prototype.initialize = function(x, y, addTo = 1) {
	Sprite_Base.prototype.initialize.call(this); 
	
	this.visible = false;
	
	// Data for positioning
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.x = x
	this.y = y;
	
	// Data for animations
	this.animated = false;
	this.animPos = 0;
	this.animRows = 0;
	this.animCols = 0;
	this.animFrame = 0;
	this.animSpeed = 0;
	this.animLength = 0;
	this.animX = 0; // Frame x
	this.animY = 0;
	this.animHeight = 0;
	this.animWidth = 0;
	
	if(addTo != -1) {
		SceneManager._scene.addChildAt(this, addTo);
	}
}

Az_Sprite.prototype.update = function() {
	Sprite_Base.prototype.update.call(this);
	
	if(ImageManager.isReady()) {
		this.visible = true;
		
		if(this.animated) {
			this.updateAnim();
		} else {
			this.updateStatic();
			
		}
	}
}

Az_Sprite.prototype.updateAnim = function() {
	this.animFrame++
	
	if(this.animFrame >= this.animSpeed) {
		this.animFrame = 0;
		this.animPos++
		
		if(this.animPos >= this.animLength) {
			this.animPos = 0;
		}
	}
	let cury = this.animPos % this.animCols * this.animWidth
	let curx = Math.floor(this.animPos / this.animCols) * this.animHeight
	this.setFrame(curx, cury, this.animWidth, this.animHeight);
		
	this.height = this.animHeight;
	this.width = this.animWidth;
}

Az_Sprite.prototype.updateStatic = function() {
	if(this._bitmap) {
		this.height = this._bitmap.height;
		this.width = this._bitmap.width;
	} else {
		this.height = Graphics.boxHeight;
		this.width = Graphics.boxWidth;
	}
}

Az_Sprite.prototype.makeAnimated = function(cols, rows, speed, startingpos = 0) {
	this.animated = true;
	this.animRows = rows;
	this.animCols = cols;
	this.animSpeed = speed;
	this.animLength = rows * cols;
	this.animHeight = 16;
	this.animWidth = 16;
	this.animPos = startingpos;
	let curx = this.animPos % this.animCols * this.animWidth
	let cury = Math.floor(this.animPos / this.animCols) * this.animHeight
	this.setFrame(curx, cury, this.animWidth, this.animHeight);
	this.visible = true;
}

Az_Sprite.prototype.destroy = function() {
	if(this.parent) {
		this.parent.removeChild(this);
	}
	this._bitmap = null;
}

const lineHeight = 36;

