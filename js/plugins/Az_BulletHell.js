{ // Danmaku class

{ // Initilization
var danmaku;

function Danmaku() {
	danmaku = this;
    this.scene = SceneManager._scene;    // The current scene, usually battle
	this.player;
    this.bullets = [];                  // A list of all bullets on screen
    this.bulletQueue = [];
    this.pattern = null;                  // The total length of the current attack, in frames
    this.activeTime = null;           // Which frame the current attack is currently in
	this.hearts = [];
	this.createdHearts = false;
	this.playerInv = 0;
	
	this.createHearts()
}

Danmaku.prototype.createHearts = function() {
	let player = $gameActors._data[1]
	let mhp = player.mhp;
	let hp = player.hp;
	
	for(let i = 0; i < mhp; i += 2) {
		this.hearts.push(new Az_Heart(ImageManager.loadBitmap("img/system/hearts/", "fullHeart")));
	}
}

}

{ // Update
Danmaku.prototype.update = function() {
	this.updateBullets();
    this.updatePlayer();
	this.updateHearts();
};

Danmaku.prototype.updateBullets = function() {
	if(!this.isActive()) {
        return;                         
    }
	if(!this.pattern) {
        this.setPattern(BattleManager._action._item._itemId - 300); // If no pattern is set, choose one
		return;
    }
    if(this.activeTime >= this.pattern.length) {
        this.endPattern();              // If current attack length is greater than time, end it
        return;
    }
	
	this.activeTime++;
    this.addToQueue(this.getBulletsAt(this.pattern, this.activeTime)); // Get any bullets that should be fired at the current frame
    
    if(this.bulletQueue.length > 0) {
        this.fire(this.bulletQueue);
		this.bulletQueue = [];
    }
	/*
	for(let i = 0; i < this.bullets.length; i++) {
		this.bullets[i].update();
	}
	*/
}

Danmaku.prototype.updatePlayer = function() {
	this.playerInv--;
	if(this.isActive()) {
		$gameActors._data[1].gainSilentTp(0.1);
	}
}

Danmaku.prototype.updateHearts = function() {
	this.updateHeartPositions();
	this.updateHeartBitmaps();
}

Danmaku.prototype.updateHeartPositions = function() {
	let originX = Graphics.boxWidth - 254;
	let originY = 20;
	
	for(let i = 0; i < this.hearts.length; i++) {
		this.hearts[i].x = originX + (i % 6) * 39;
		this.hearts[i].y = originY + Math.trunc(i / 6) * 39;
	}
}

Danmaku.prototype.updateHeartBitmaps = function() {
	let player = $gameActors._data[1]
	let mhp = player.mhp;
	let hp = player.hp;
	let index = 0;
	
	let full = ImageManager.loadBitmap("img/system/hearts/", "fullHeart");
	let half0 = ImageManager.loadBitmap("img/system/hearts/", "halfHeart0");
	let half1 = ImageManager.loadBitmap("img/system/hearts/", "halfHeart1");
	let empty0 = ImageManager.loadBitmap("img/system/hearts/", "emptyHeart0");
	let empty1 = ImageManager.loadBitmap("img/system/hearts/", "emptyHeart1");
	
	for(index = 0; index < hp - 1; index += 2) { // fill all full hearts
		this.hearts[index / 2].bitmap = full;
	}
	if(hp % 2 == 1) { // fill a full half heart if needed
		if(mhp == hp) {
			this.hearts[index / 2].bitmap = half0; 
		} else {
			this.hearts[index / 2].bitmap = half1;
		}
		index += 2;
	}
	
	for(index = index; index < mhp - 1; index += 2) { // fill all empty hearts
		this.hearts[index / 2].bitmap = empty1;
	}
	if(mhp % 2 == 1 && hp != mhp) {
		this.hearts[index / 2].bitmap = empty0;
	}
	
	if(true) {
		this.createdHearts = false;
		for(let i = 0; i < this.hearts.length; i++) {
			SceneManager._scene.addChild(this.hearts[i]);
		}
	}
}

}

// Checks if danmaku should be firing
Danmaku.prototype.isActive = function() {
    if(BattleManager._phase == 'danmaku') {
		return true;
	}
    return false;
};

// Assigns a pattern based on current skill id
Danmaku.prototype.setPattern = function(skill) {
    this.pattern = PatternManager.getPattern(skill);
    this.activeTime = 0;
};

Danmaku.prototype.getBulletsAt = function(pattern, pos) {
	let returnBullets = []; // List of bullets to return
	for(let i = 0; i < pattern.shots.length; i++) {
		let shot = pattern.shots[i];
		
		if(shot.frames.includes(pos) || (pos - shot.frames[0]) % shot.repeat == 0)  {
			if(pattern.x && pattern.y) {
				returnBullets = returnBullets.concat(this.parseShot(shot, pattern.x, pattern.y)); // Convert the shot into a list of bullets, then add them
			} else {
				returnBullets = returnBullets.concat(this.parseShot(shot, this.enemyX, this.enemyY - 24))
			}
		}
		
	}
	return returnBullets;
}

Danmaku.prototype.parseShot = function(shot, x, y) {
	let bullet
	let bullets = []; // List of bullets to return
	switch (shot.name) {
		case "spread":
			for(let i = 0; i < shot.num; i++) {
				bullet = new Az_Bullet(shot);
				bullet._angle = (360 / shot.num * i) + shot._angle
				bullet.x = x;
				bullet.y = y;
				bullets.push(bullet);
			}
			break;
			
		case "shooter":
			bullet = new Az_Shooter(shot);
			bullet.x = x;
			bullet.y = y;
			bullets.push(bullet);
			break;
			
		case "spray":
			bullet = new Az_GravBullet(shot);
			bullet._angle = Math.random() * 360;
			bullet._originalAngle = bullet._angle;
			bullet.x = x;
			bullet.y = y;
			bullets.push(bullet);
			break;
			
		case "moveToPlayer":
			this.moveEnemyToPlayer(shot.x, shot.y, shot.length);
			break;
	}
	return bullets;	
}

Danmaku.prototype.moveEnemyToPlayer = function(maxX, maxY, length) {
	let disX = 0;
	let disY = 0;
	
	if(this.player.x > this.enemyX) {
		disX = Math.min(maxX, this.player.x - this.enemyX);
	} else {
		disX = Math.min(-maxX, this.enemyX - this.player.x);
	}
	
	if(this.player.y > this.enemyY) {
		disY = Math.min(maxY, this.player.y- this.enemyY);
	} else {
		disY = Math.min(-maxY, this.enemyY - this.player.y);
	}
	console.log(this.enemyX + disX)
	this.enemy.startMove(disX, disY, length);
}

Danmaku.prototype.addToQueue = function(bullets) {
	this.bulletQueue = this.bulletQueue.concat(bullets);
}

// Ends the enemy's turn
Danmaku.prototype.endPattern = function() {
    this.pattern = null;
    this.bullets = [];
	this.activeTime = null;
    BattleManager.endAction();
};

Danmaku.prototype.fire = function() {
    for(let i = 0; i < this.bulletQueue.length; i++) {
        this.bullets.push(this.bulletQueue[i]);
    }
  
  this.bulletQueue = [];
};

Danmaku.prototype.movePlayer = function() {
	let left = Input.isPressed("left");
	let right = Input.isPressed("right");
	let up = Input.isPressed("up");
	let down = Input.isPressed("down");
	let shift = Input.isPressed("shift");
	
	let x = 0;
	let y = 0;
	
	if (left) 
		x -= 6;
	if (right)
		x += 6;
	if (up)
		y -= 6;
	if (down)
		y += 6;
	
	if (shift) {
		x /= 2;
		y /= 2;
	}
	
	this.player.x += x;
	this.player.y += y;
}

Danmaku.prototype.playerHit = function() {
	if (this.playerInv <= 0) {
		let player = $gameActors._data[1];
		player._hp--;
		this.playerInv = 60;
	}
}

Sprite_Actor.prototype.getMovement = function() {
	let left = Input.isPressed("left");
	let right = Input.isPressed("right");
	let shift = Input.isPressed("shift");
	
	if (!(BattleManager._phase == "danmaku")) {
		return "wait";
	} else if (left && !right && shift) {
		return "moveLeftFocus";
	} else if (!left && right && shift) {
		return "moveRightFocus";
	} else if (left && !right) {
		return "moveLeft";
	} else if (right && !left) {
		return "moveRight";
	} else if (shift) {
		return "moveFocus";
	} else {
		return "move"
	}
}

}

{ // Bullet class - Bullets fired during danmaku


// Bullets

function Az_Bullet() {
    this.initialize.apply(this, arguments);
}

Az_Bullet.prototype = Object.create(Sprite_Base.prototype);
Az_Bullet.prototype.constructor = Az_Bullet;

Az_Bullet.prototype.initialize = function (data) {
	Sprite_Base.prototype.initialize.call(this);
	
	this.setDefaultValues();
	Object.assign(this, data);
	this.rotation = (this._angle + 90) * Math.PI / 180;
	SceneManager._scene.addChild(this);
};

Az_Bullet.prototype.setDefaultValues = function() {
	this.x = Graphics.boxWidth/2;
	this.y = Graphics.boxHeight/2;
	this._width = 16;
	this._height = 16;
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this._visible = false;
	this._destroy = false;
	this.bitmap = ImageManager.loadBitmap("img/bullets/", "arrowBullet");
}

Az_Bullet.prototype.update = function() {
	Sprite_Base.prototype.update.call(this);
	this.updateDestroy()
	this.updateRotation();
	this.updatePosition();
	this.updateCollsion();
	if(ImageManager.isReady()) {
		this.visible = true;
	}
}

Az_Bullet.prototype.updateRotation = function() {
	if(!this._velY || !this._velX) {
		this._velX = Math.cos(this._angle * Math.PI / 180);
		this._velY = Math.sin(this._angle * Math.PI / 180);
		
	}
	
	this.rotation = Math.atan2(this._velY, this._velX)
}

Az_Bullet.prototype.updatePosition = function() {
	this.x += this._velX * this._speed / 5;
	this.y += this._velY * this._speed / 5;
	
	if(this.x < 0 || this.x > Graphics.boxWidth || this.y < 0 || this.y > Graphics.boxHeight) {
		this._destroy = true;
	}
}


Az_Bullet.prototype.updateCollsion = function() {
	if(!this._destroy) {
		let playerX = danmaku.player.x;
		let playerY = danmaku.player.y;
		
		if(this.x - 6 < playerX && this.x + 6 > playerX && this.y - 6 < playerY - 20 && this.y + 6 > playerY - 20) {
			danmaku.playerHit();
			this._destroy = true;
		}
	}
}

Az_Bullet.prototype.updateDestroy = function() {
	if(!danmaku.isActive()) {
		this._destroy = true;
	}
	if (this.parent != null && this._destroy) {	
		this.parent.removeChild(this);
	}
}

}

{ // Shooter class - Bullets that fire more bullets
function Az_Shooter() {
    this.initialize.apply(this, arguments);
}

Az_Shooter.prototype = Object.create(Az_Bullet.prototype);
Az_Shooter.prototype.constructor = Az_Shooter;

Az_Shooter.prototype.initialize = function (data) {
	Az_Bullet.prototype.initialize.call(this, data);
};

Az_Shooter.prototype.update = function() {
	Az_Bullet.prototype.update.call(this);
	danmaku.addToQueue(danmaku.getBulletsAt(this, danmaku.activeTime));
}

}

{ // GravBullet class - Bullets that obey gravity
function Az_GravBullet() {
    this.initialize.apply(this, arguments);
	
}

Az_GravBullet.prototype = Object.create(Az_Bullet.prototype);
Az_GravBullet.prototype.constructor = Az_GravBullet;

Az_GravBullet.prototype.initialize = function (data) {
	Az_Bullet.prototype.initialize.call(this, data);
	
	this._alive = 0;
};

Az_GravBullet.prototype.update = function() {
	Az_Bullet.prototype.update.call(this);
	this._alive++
	this.updateGravity()
}

Az_GravBullet.prototype.updateGravity = function() {
	this._velY += 0.0002 * this._alive;
}

}

{ // Az_Heart - Heart sprite displayed during battle
function Az_Heart() {
    this.initialize.apply(this, arguments);

}

Az_Heart.prototype = Object.create(Sprite.prototype);
Az_Heart.prototype.constructor = Az_Heart;

Az_Heart.prototype.initialize = function () {
	Sprite.prototype.initialize.call(this);
	this.x = Graphics.boxWidth/2;
	this.y = Graphics.boxHeight/2;
	this._width = 52;
	this._height = 52;
	this.anchor.x = 0;
	this.anchor.y = 0;
	this.visible = false;
};

Az_Heart.prototype.update = function() {
	Sprite.prototype.update.call(this);
	
	if(ImageManager.isReady()) {
		this.visible = true;
	}
}

}

{ // Scene_Battle edits (to add Danmaku class)

Scene_Battle.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
	this.danmaku = new Danmaku();
    this.createDisplayObjects();
};

Scene_Battle.prototype.update = function() {
    var active = this.isActive();
    $gameTimer.update(active);
    $gameScreen.update();
    this.updateStatusWindow();
    this.updateWindowPositions();
    if (active && !this.isBusy()) {
        this.updateBattleProcess();
    }
	if (this.danmaku) {
		this.danmaku.update();
	}
    Scene_Base.prototype.update.call(this);
};

Spriteset_Battle.prototype.createActors = function() {
    this._actorSprites = [];
    for (var i = 0; i < $gameParty.maxBattleMembers(); i++) {
        this._actorSprites[i] = new Sprite_Actor();
        this._battleField.addChild(this._actorSprites[i]);
    }
	SceneManager._scene.danmaku.player = this._actorSprites[0];
};

}

{ // Battle Manager edits (to transition to Danmaku)

BattleManager.startAction = function() {
    var subject = this._subject;
    var action = subject.currentAction();
    var targets = action.makeTargets();
    this._action = action;
    this._targets = targets;
    this.refreshStatus();
	this._logWindow.startAction(subject, action, targets);
    
	if (subject instanceof Game_Actor) {
		this._phase = 'action';
		subject.useItem(action.item());
		this._action.applyGlobal();
	} else if (subject instanceof Game_Enemy) {
		this._phase = 'danmaku';
	} else {
		throw new Error('The subject is not an actor or enemy');
		this.endAction();
	}
};

}

{ // Sprite_Actor edits (adjusting movement)

Sprite_Actor.MOTIONS = {
    wait:     		{ index: 0,  loop: true },
    move:     		{ index: 1,  loop: true },
    moveLeft:    	{ index: 2,  loop: false },
    moveRight:    	{ index: 3,  loop: false },
    moveFocus:   	{ index: 4,  loop: true },
    moveLeftFocus:  { index: 5,  loop: false },
    moveRightFocus:	{ index: 6,  loop: false },
};

Sprite_Actor.prototype.updatePosition = function() {
	if (BattleManager._phase == "danmaku") {
		let up = Input.isPressed("up");
		let down = Input.isPressed("down");
		let left = Input.isPressed("left");
		let right = Input.isPressed("right");
		let shift = Input.isPressed("shift");
		let speed;
		
		if (shift) {
			speed = 2;
		} else {
			speed = 5;
		}
		
		if (left && !right) {
			this.x -= speed;
		}
		if (!left && right) {
			this.x += speed;
		}
		if (up && !down) {
			this.y -= speed;
		}
		if (!up && down) {
			this.y += speed;
		}
			
	} else {
		this.x = this._homeX;
		this.y = this._homeY;	
	}
};

Sprite_Actor.prototype.updateMotion = function() {
    this.setupMotion();
    this.setupWeaponAnimation();
	this.refreshMotion();
	this._actor.clearMotion();
    this.updateMotionCount();
};

Sprite_Actor.prototype.refreshMotion = function() {
    var actor = this._actor;
    if (actor) {
        this.startMotion(this.getMovement());
    }
};

Game_Actor.prototype.isSpriteVisible = function() {
    return true;
};

Sprite_Actor.prototype.setActorHome = function(index) {
    this.setHome(Graphics.boxWidth / 2, Graphics.boxHeight * 3 / 4);
};

Sprite_Actor.prototype.setBattler = function(battler) {
    Sprite_Battler.prototype.setBattler.call(this, battler);
    var changed = (battler !== this._actor);
    if (changed) {
        this._actor = battler;
        if (battler) {
            this.setActorHome(battler.index());
        }
        this.startEntryMotion();
        this._stateSprite.setup(battler);
		
		if(battler._battlerName == "esperBattle") {
			danmaku.player = this;
		}
    }
};

{// Sprite_Enemy edits (Adding animation)
Sprite_Enemy.prototype.initMembers = function() {
    Sprite_Battler.prototype.initMembers.call(this);
    this._enemy = null;
    this._appeared = false;
    this._battlerName = '';
    this._battlerHue = 0;
    this._effectType = null;
    this._effectDuration = 0;
    this._shake = 0;
    this.createStateIconSprite();
    this._motion = null;
    this._motionCount = 0;
    this._pattern = 0;
    this.createMainSprite();
};

Sprite_Enemy.prototype.createMainSprite = function() {
    this._mainSprite = new Sprite_Base();
    this._mainSprite.anchor.x = 0.5;
    this._mainSprite.anchor.y = 1;
    this.addChild(this._mainSprite);
    this._effectTarget = this._mainSprite;
};

Sprite_Enemy.prototype.update = function() {
    Sprite_Battler.prototype.update.call(this);
    if (this._enemy) {
        this.updateEffect();
        this.updateStateSprite();
		this.updateDanmaku();
		this.updateMotion();
    }
};

Sprite_Enemy.prototype.updateDanmaku = function() {
	danmaku.enemy = this;
	danmaku.enemyX = this.x;
	danmaku.enemyY = this.y;
}

Sprite_Enemy.prototype.updateBitmap = function() {
    Sprite_Battler.prototype.updateBitmap.call(this);
    var name = this._enemy.battlerName();
    if (this._battlerName !== name) {
        this._battlerName = name;
        this._mainSprite.bitmap = ImageManager.loadSvActor(name);
    }
};

Sprite_Enemy.prototype.updateStateSprite = function() {
    this._stateIconSprite.y = -Math.round((this._mainSprite.bitmap.height + 40) * 0.9);
    if (this._stateIconSprite.y < 20 - this.y) {
        this._stateIconSprite.y = 20 - this.y;
    }
};

Sprite_Enemy.prototype.updateFrame = function() {
    Sprite_Battler.prototype.updateFrame.call(this);
    var bitmap = this._mainSprite.bitmap;
    if (bitmap) {
        var motionIndex = this._motion ? this._motion.index : 0;
        var pattern = this._pattern < 3 ? this._pattern : 1;
        var cw = bitmap.width / 9;
        var ch = bitmap.height / 6;
        var cx = Math.floor(motionIndex / 6) * 3 + pattern;
        var cy = motionIndex % 6;
        this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);
    }
};

Sprite_Enemy.prototype.refreshMotion = function() {
    let enemy = this._enemy;
    if (enemy) {
        this.startMotion(this.getMovement());
    }
};

Sprite_Enemy.MOTIONS = {
    wait:     		{ index: 0,  loop: true },
    moveLeft:    	{ index: 2,  loop: true },
    moveRight:    	{ index: 1,  loop: true },
};

Sprite_Enemy.prototype.getMovement = function() {
	
	if (this._targetOffsetX > this._offsetX) {
		return "moveRight"
	} else if (this._targetOffsetX < this._offsetX) {
		return "moveLeft"
	} else {
		return "wait"
	}
}

Sprite_Enemy.prototype.updateMotion = function() {
    this.setupMotion();
	this.refreshMotion();
	this._enemy.clearMotion();
    this.updateMotionCount();
};

Sprite_Enemy.prototype.setupMotion = function() {
    if (this._enemy.isMotionRequested()) {
        this.startMotion(this.getMovement());
        this._enemy.clearMotion();
    }
};

Sprite_Enemy.prototype.startMotion = function(motionType) {
    var newMotion = Sprite_Enemy.MOTIONS[motionType];
    if (this._motion !== newMotion) {
        this._motion = newMotion;
        this._motionCount = 0;
        this._pattern = 0;
    }
};

Sprite_Enemy.prototype.updateMotionCount = function() {
    if (this._motion && ++this._motionCount >= this.motionSpeed()) {
        if (this._motion.loop) {
            this._pattern = (this._pattern + 1) % 4;
        } else if (this._pattern < 2) {
            this._pattern++;
        } else {
            this.refreshMotion();
        }
        this._motionCount = 0;
    }
};

Sprite_Enemy.prototype.motionSpeed = function() {
    return 12;
};

}

}