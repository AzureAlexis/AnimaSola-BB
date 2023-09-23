/*
	Contains data relating to bullets, managing them, and shot patterns
*/
//-----------------------------------------------------------------------------
// Az_Danmaku
//
// Controls the enemy's attacks in a bullet hell style

function Az_Danmaku(scene) {
	this.scene = scene;
	this.length = 0;
	this.state = null;
	
	// this.createPatterns(); // Located at the end of the doccument
	this.createSprites();
}

Az_Danmaku.prototype.createSprites = function() {
	this.bullets = [];
	this.player = new Az_PlayerBattle(Graphics.boxWidth/2, 300);
}

Az_Danmaku.prototype.update = function() {
	this.updateState()
	
	switch(this.state) {
		case "enemyaction" :
			if(this.length <= 0) {
				// this.startAction();
			} else {
				// this.updatePattern();
			}
			break
	}
}

Az_Danmaku.prototype.updateState = function() {
	this.state = BattleManager._phase;
	if(BattleManager._subject instanceof Game_Enemy) {
		this.state = "enemy" + this.state
	}
}

Az_Danmaku.prototype.startAction() = function() {
	this.currentSkill = BattleManager._currentSkill;
	this.setAction(this.currentSkill);
}

Az_Danmaku.prototype.addBullet = function(bullet) {
	this.bullets.push(bullet);
}

Az_Danmaku.prototype.aimPlayer = function(x, y) {
	let xsum = x - this._hitX;
	let ysum = y - this._hitY;
	return Math.atan2(ysum, xsum) * 180 / Math.PI - 180
}

Scene_Battle.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    this.startFadeIn(this.fadeSpeed(), false);
	this.danmaku = new Az_Danmaku(this);
    BattleManager.playBattleBgm();
    BattleManager.startBattle();
};

Scene_Battle.prototype.update = function() {
    var active = this.isActive();
    $gameTimer.update(active);
    $gameScreen.update();
    this.updateStatusWindow();
    this.updateWindowPositions();
	this.danmaku.update();
    if (active && !this.isBusy()) {
        this.updateBattleProcess();
    }
    Scene_Base.prototype.update.call(this);
};

//-----------------------------------------------------------------------------
// Az_Bullet
//
// The base class for bullets.
// Extended from Az_Sprite

function Az_Bullet() {
	this.initialize.apply(this, arguments);
}
(Az_Bullet.prototype = Object.create(Az_Sprite.prototype)).constructor = Az_Bullet;
Az_Bullet.prototype.constructor = Az_Bullet;

Az_Bullet.prototype.initialize = function(x, y, dir = 0, speed = 2, dirMod = 0, speedMod = 0, strength = 1) {
	Az_Sprite.prototype.initialize.call(this, x, y); 
	
	this.dir = dir;
	this.dirMod = dirMod;
	this.speed = speed;
	this.dirMod = dirMod;
	this.strength = strength;
	
	this.destroy = false;
	this.moves = [];
}

Az_Bullet.prototype.update = function() {
	Az_Sprite.prototype.update.call(this); 
	
	this.updatePos();
	this.updateCols();
	this.updateDestroy();
}

Az_Bullet.prototype.updatePos = function() {
	// Changes the bullet's movement info based on future move list
	if(this.moves.length > 0) {
		for(let i = 0; i < this.moves.length; i++) {
			if(moves[i].time == parent.length) {
				this.dir = moves[i].dir;
				this.dirMod = moves[i].dirMod;
				this.speed = moves[i].speed;
				this.dirMod = moves[i].dirMod;
			}
		}
	}
	
	this.x = this.x + Math.cos(toRad(this.dir)) * this.speed;
	this.y = this.y + Math.sin(toRad(this.dir)) * this.speed;
	this.dir = this.dir + this.dirMod;
	this.speed = this.speed + this.speedMod;
	
	// Marks to destroy if off screen
	if(((this.x < 0 - this.width/2 || this.x > Graphics.boxWidth + this.width/2 || this.y < 0 - this.height/2 || this.y > Graphics.boxHeight + this.height/2)) && this.eternal != true) {
		this.destroy = true;
	}
}

Az_Bullet.prototype.updateCols = function() {
	if(this.parent._hitbox) {
		hitbox = player._hitbox;
		if(hitbox.inv <= 0) {
			
			// Creates the "hitbox" for the bullet based on width/height of bullet
			xl = this.width/2
			yl = this.height/2
			
			// Checks if coliding with player hitbox
			if(this.x + xl > hitbox.x && this.x - xl < hitbox.x && this.y + yl > hitbox.y && this.y - yl < hitbox.y) {
				this.parent.target.gainHp(-this.strength);
				if (value > 0) {
					target.parent.onDamage(this.strength);
				}
				hitbox.makeinv();
				this.destroy = true;
			}
		}
	}
}

Az_Bullet.prototype.updateDestroy = function() {
	if(this.destroy) {
		this._bitmap = null;
		this.parent.removeChild(this);
		this.parent.bullets.splice(this.parent.bullets.indexOf(this), 1)
	}
}

//-----------------------------------------------------------------------------
// Az_BulletNormal
//
// Class for normal bullets
// Extended from Az_Bullet

function Az_BulletNormal() {
	this.initialize.apply(this, arguments);
}
(Az_BulletNormal.prototype = Object.create(Az_Bullet.prototype)).constructor = Az_BulletNormal;
Az_BulletNormal.prototype.constructor = Az_BulletNormal;

Az_Bullet.prototype.initialize = function(x, y, dir = 0, speed = 2, dirMod = 0, speedMod = 0, strength = 1) {
	Az_Bullet.prototype.initialize.call(this, x, y, dir, speed, dirMod, speedMod, strength); 
	
	// Changes from base: Adds the standard bullet bitmap
	this._bitmap = ImageManager.loadBitmap("img//bullets//", "normal", 0, true);
}

//-----------------------------------------------------------------------------
// Az_PlayerBattle
//
// The class for the player's sprite during battle.
// Extended from Az_Sprite

function Az_PlayerBattle() {
	this.initialize.apply(this, arguments);
}
(Az_PlayerBattle.prototype = Object.create(Az_Sprite.prototype)).constructor = Az_PlayerBattle;
Az_PlayerBattle.prototype.constructor = Az_PlayerBattle;

Az_PlayerBattle.prototype.initialize = function(x, y) {
	Az_Sprite.prototype.initialize.call(this, x, y); 
	
	this.inv = 0;
	this._bitmap = ImageManager.loadBitmap("img//characters//", "esperBattle", 0, false);
	this.setFrame(48, 0, 48, 48);
}

Az_PlayerBattle.prototype.update = function() {
	Az_Sprite.prototype.update.call(this); 
	this.updatePos();
	this.updateInv();
	
	if(ImageManager.isReady()) {
		this.visible = true;
		this.height = 48;
		this.width = 48;
	}
}

Az_PlayerBattle.prototype.updatePos = function() {
	if(BattleManager._phase == "action" && BattleManager._subject instanceof Game_Enemy) {
		let xf = 48;
		let yf = 0;
		
		if(Input.isPressed("up")) {
			if(Input.isPressed("shift")) {
				this.y = this.y - 2;
			} else {
				this.y = this.y - 5;
			}
		}
		if(Input.isPressed("down")) {
			if(Input.isPressed("shift")) {
				this.y = this.y + 2;
			} else {
				this.y = this.y + 5;
			}
		}
		if(Input.isPressed("left")) {
			xf = xf - 48;
			if(Input.isPressed("shift")) {
				this.x = this.x - 2;
			} else {
				this.x = this.x - 5;
			}
		}
		if(Input.isPressed("right")) { 
			xf = xf + 48;
			if(Input.isPressed("shift")) {
				this.x = this.x + 2;
			} else {
				this.x = this.x + 5;
			}
		}
		
		if(Input.isPressed("shift")) {
			yf = 48;
		}
		
		this.setFrame(xf, yf, 48, 48);
	}
}

Az_PlayerBattle.prototype.updateInv = function() {
	if(this.inv > 0) {
		this.inv--;
	}
}

Az_PlayerBattle.prototype.makeInv = function() {
	this.inv = 30;
}

Scene_Battle.prototype.updateHp = function() {
	for(let i = 1; i < $gameActors.length; i++) {
		let actor = $gameActors._data[i];
		if(actor.mhp != actor.mat * 5) {
			console.log("updating");
			let dif = (actor.mat * 5) - actor.mhp;
			actor.addParam(0, dif);
		}
	}
};




Scene_Battle.prototype.getPattern = function(patNo, x, y, dir = 0, speed = 1, curve = 0) {
	let output = [];
	console.log(patNo);
	switch(patNo) {
	case "8x8" :
		for(let j = 0; j < 8; j++) {
			output.push(new Bullet(x, y, j * 45 + dir, speed, curve));
		}
		break;
	case "semicircle" :
		for(let j = 0; j < 11; j++) {
			output.push(new Bullet(x, y, j * 18 + dir, speed, curve));
		}
		break;
	case "playerWave" :
		for(let j = -1; j <= 1; j++) {
			output.push(new Bullet(x, y, j * dir + this.aimPlayer(x, y), speed, curve));
		}
		break;
	case "playerCross" :
		output.push(new Bullet(x, y, dir + this.aimPlayer(x, y), speed, curve));
		output.push(new Bullet(x, y, -dir + this.aimPlayer(x, y), speed, curve));
		break;
	case "singleBurst" :
		output.push(new Bullet(x, y, dir, speed, curve, "burst"));
		break;
	case "bounceSemicircle" :
		for(let j = 1; j < 10; j++) {
			output.push(new Bullet(x, y, j * 18 + dir, speed, curve, "bounce"));
		}
		break;
	case "seekingWave" :
		for(let j = -1; j <= 1; j++) {
			output.push(new Bullet(x, y, j * dir + this.aimPlayer(x, y), speed, curve, "seeking"));
		}
		break;
	case "randomBurst" :
		output.push(new Bullet(Math.floor(Math.random() * 868), 0, 90, speed, curve, "burst"));
		break;
	case "randomBounce" :
		output.push(new Bullet(x, Math.floor(Math.random() * 480), dir, speed, curve, "bounce"));
		break;
	}
	return output;
}

Scene_Battle.prototype.addPattern = function(patNo, x, y, dir = 0, speed = 1, curve = 0) {
	pattern = this.getPattern(patNo, x, y, dir, speed, curve);
	
	for(let i = 0; i < pattern.length; i++) {
		
		this.addBullet(pattern[i]);
	}
}

Scene_Battle.prototype.updateShot = function() {
	if(this._length > 0) {
		let curPat;
		let shot = skillData[this._shot];
		let curFrame = shot[0] - this._length;
		for(let i = 2; i < shot.length; i++) {
			curPat = shot[i];
			for(let j = curPat[0]; j < curPat[0] + (curPat[1] * curPat[2]); j = j + curPat[1]) {
				
				if(j == curFrame) {
					
					this.addPattern(curPat[3], curPat[4], curPat[5], curPat[6], curPat[7], curPat[8], curPat[9]);
					break;
				}
			}
		}
		this._length--;
	}
}

var skillData = [
	["Not a skill"],
	[360, 2,
		[30, 60, 4, "semicircle", 434, 100, 0, 3, 0],
		[60, 60, 3, "semicircle", 434, 100, 9, 3, 0]
	],[360, 2,
		[30, 5, 10, "playerWave", 434, 100, 2, 9, 0],
		[150, 5, 10, "playerWave", 434, 100, 2, 9, 0],
		[270, 5, 10, "playerWave", 434, 100, 2, 9, 0]
	],[900, 2,
		[0, 150, 5, "semicircle", 434, 100, 0, 1, 0],
		[50, 150, 5, "semicircle", 434, 100, 10, 1, 0],
		[75, 150, 5, "semicircle", 434, 100, 0, 1, 0],
		[125, 150, 5, "semicircle", 434, 100, -10, 1, 0]
	],[480, 2,
		[20, 40, 4, "singleBurst", 434, 100, 65, 3, 0],
		[40, 40, 4, "singleBurst", 434, 100, 115, 3, 0]
	],[420, 2,
		[30, 60, 3, "bounceSemicircle", 434, 100, 0, 4, 0]
	],[420, 2,
		[30, 10, 20, "seekingWave", 434, 100, 45, 4, 0]
	],[600, 2,
		[15, 90, 5, "8x8", 434, 100, 0, 4, 0.5],
		[30, 90, 5, "8x8", 434, 100, 0, 4, 0.5],
		[15, 90, 5, "8x8", 434, 100, 22, 4, 0.5],
		[30, 90, 5, "8x8", 434, 100, 22, 4, 0.5],
		[45, 90, 5, "8x8", 434, 100, 0, 4, -0.5],
		[60, 90, 5, "8x8", 434, 100, 0, 4, -0.5],
		[45, 90, 5, "8x8", 434, 100, 22, 4, -0.5],
		[60, 90, 5, "8x8", 434, 100, 22, 4, -0.5],
		[75, 90, 3, "singleBurst", 434, 100, 30, 4, 0],
		[80, 90, 3, "singleBurst", 434, 100, 70, 4, 0],
		[85, 90, 3, "singleBurst", 434, 100, 110, 4, 0],
		[90, 90, 3, "singleBurst", 434, 100, 150, 4, 0],
		
	],[660, 2,
		[90, 90, 20, "playerWave", 434, 100, 22.5, 2, 0],
		[30, 60, 40, "randomBurst", 434, 100, 165, 4, 0],
		[60, 60, 40, "randomBurst", 434, 100, 135, 4, 0]
	],[660, 2,
		[6, 12, 60, "randomBounce", 6, 0, 0, 5, 0],
		[12, 12, 60, "randomBounce", 862, 0, 180, 5, 0],
		[300, 12, 5, "semicircle", 434, 100, 0, 5, 0],
	],[660, 2,
		[15, 5, 100, "playerWave", 434, 100, 15, 5, 0],
		[15, 15, 33, "playerCross", 434, 100, 25, 5, 0],
		[20, 15, 33, "playerCross", 434, 100, 35, 5, 0],
		[25, 15, 33, "playerCross", 434, 100, 45, 5, 0],
		[60, 30, 5, "seekingWave", 434, 100, 0, 3, 0],
	],[1500, 2,
		[15, 5, 15, "8x8", 434, 100, 0, 8, 1.2],
		[15, 5, 15, "8x8", 434, 100, 22, 8, 1.2],
		[90, 5, 15, "8x8", 434, 100, 22, 8, -1.2],
		[90, 5, 15, "8x8", 434, 100, 0, 8, -1.2],
		[165, 5, 15, "8x8", 434, 100, 0, 8, 1.2],
		[165, 5, 15, "8x8", 434, 100, 22, 8, 1.2],
		[230, 10, 4, "semicircle", 434, 100, 0, 1.5, 0],
		[230, 10, 4, "semicircle", 434, 100, 9, 1.5, 0],
		[235, 10, 4, "semicircle", 434, 100, 4.5, 1.5, 0],
		[235, 10, 4, "semicircle", 434, 100, 13.5, 1.5, 0],
		[250, 20, 3, "singleBurst", 434, 100, 90, 4, 0.5],
		[260, 20, 3, "singleBurst", 434, 100, 90, 4, -0.5],
		[315, 80, 8, "8x8", 434, 100, 0, 8, 0.5],
		[330, 80, 8, "8x8", 434, 100, 0, 8, 0.5],
		[315, 80, 8, "8x8", 434, 100, 22, 8, 0.5],
		[330, 80, 8, "8x8", 434, 100, 22, 8, 0.5],
		[345, 80, 8, "8x8", 434, 100, 0, 6, -0.5],
		[360, 80, 8, "8x8", 434, 100, 0, 6, -0.5],
		[345, 80, 8, "8x8", 434, 100, 22, 6, -0.5],
		[360, 80, 8, "8x8", 434, 100, 22, 6, -0.5],
		[600, 10, 200, "8x8", 434, 100, 0, 10, 1],
		[800, 10, 200, "8x8", 434, 100, 0, 12, -2],
		[1000, 10, 100, "8x8", 434, 100, 0, 14, 3],
		[1000, 20, 10, "8x8", 434, 100, 22, 2, 0.5],
		[1000, 20, 10, "8x8", 434, 100, 22, 2, 0.5],
		[1000, 20, 10, "8x8", 434, 100, 22, 2, -0.5],
		[1000, 20, 10, "8x8", 434, 100, 22, 2, -0.5],
		[1000, 20, 10, "8x8", 434, 100, 22, 2, 0],
		[1000, 20, 10, "8x8", 434, 100, 22, 2, 0]
	]
];

function toRad(x) {
	return x * (Math.PI/180);
}