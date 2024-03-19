function Danmaku() {
    this.scene = SceneManager._scene;    // The current scene, usually battle
    this.player = new PlayerSprite();   // The player's hitbox that dodges attacks
    this.bullets = [];                  // A list of all bullets on screen
    this.bulletQueue = [];
    this.pattern = null;                  // The total length of the current attack, in frames
    this.activeTime = null;           // Which frame the current attack is currently in
}

Danmaku.prototype.update = function() {
    if(!this.isActive()) {
        return;                         
    }
	if(!this.pattern) {
        this.setPattern();              // If no pattern is set, choose one
    }
    if(this.patternTime >= this.pattern.length) {
        this.endPattern();              // If current attack length is greater than time, end it
        return;
    }
    
    this.activeTime++;
    this.bulletQueue = this.pattern.getBulletsAt(this.activeTime); // Get any bullets that should be fired at the current frame
    
    if(this.bulletQueue != []) {
        this.fire(this.bulletQueue);
    }
};

Danmaku.prototype.isActive = function() {
    if(this.scene instanceof Scene_Battle) {
        if(BattleManager._phase == "turn") {
            if(BattleManager._subject instanceof Game_Enemy) {
                return true;
            }
        }
    }
    return false;
};

Danmaku.prototype.setPattern = function() {
    let skill = BattleManager._action._item._itemid;
    
    this.pattern = PatternManager(skill);
    this.patternTime = 0;
    this.patternLength = this.pattern.patternLength;
};

Danmaku.prototype.endPattern = function() {
    this.pattern = null;
    this.bullets = [];
    BattleManager._phase = "turnend";
};

Danmaku.prototype.fire = function() {
    for(let i = 0; i < this.bulletQueue.length; i++) {
        let data = this.bulletQueue[i];
        let bullet = new Az_Bullet(data);
        this.bullets.push(bullet);
    }
  
  this.bulletQueue = null;
};

// Bullets

Az_Bullet = function() {
    this.initialize.apply(this, arguments);
};

Az_Bullet.prototype = Object.create(Az_Sprite);
Az_Bullet.prototype.constructor = Az_Bullet;

Az_Bullet.prototype.initialize = function (data) {
    Object.assign(this, data);
    Az_Sprite.prototype.initialize.call(this.x, this.y);
};

// PatternManager

function Az_PatternManager() {
    this.patterns = [];
    this.addInitialPatterns();
};

Az_PatternManager.prototype.addInitialPatterns = function() {
    this.patterns[0] = {
        power: 2,
        length: 300,
        bullets: [
            {
            name: spread,
            frames: [30, 90, 150, 210],
            num: 12,
            dir: 0
            },{
            name: spread,
            frames: [60, 120, 180, 240],
            num: 12,
            dir: 15
            }
        ]
    };
    
    this.patterns[1] = {
        power: 3,
        length: 360,
        bullets: [
            {
                name: shooter,
                frames: [30],
                speed: 5,
                acc: 0,
                dir: 0,
                curve: 3,
                bullets: [
                    name: spread,
                    frames: [60, 120, 180, 240],
                    num: 12,
                    dir: 0
                ]
            },{
            name: spread,
            frames: [60, 120, 180, 240],
            num: 12,
            angle: 15
            }
        ]
    };
};

PatternManager = new Az_PatternManager();