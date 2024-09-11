{ // Pattern manager
	
function Az_PatternManager() {
    this.patterns = [];
    this.addInitialPatterns();
};

Az_PatternManager.prototype.getPattern = function(id) {
	return this.patterns[id];
}

Az_PatternManager.prototype.addInitialPatterns = function() {
    this.patterns[1] = { // Unfocused Shot
        length: 300,
        shots: [
            {
            name: "spread",
            num: 12,
            frames: [30],
			repeat: 60,
			_speed: 8,
            _angle: 0,
			_bitmap: ImageManager.loadBitmap("img/bullets/", "arrowBullet")
            },{
            name: "spread",
            frames: [60],
			repeat: 60,
            num: 12,
			_speed: 8,
            _angle: 15,
			_bitmap: ImageManager.loadBitmap("img/bullets/", "arrowBullet")
            }
        ]
    };
    
    this.patterns[2] = { // Evil Sealing Circle
        length: 360,
        shots: [
            {
                name: "shooter",
				length: 360,
                frames: [1],
                speed: 8,
                acc: 0,
                angle: 15,
                curve: 3,
				sprite: ImageManager.loadBitmap("img/bullets/", "arrowBullet"),
                shots: [{
					name: "spread",
					frames: [20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340],
					speed: 15,
					num: 12,
					angle: 15,
					sprite: ImageManager.loadBitmap("img/bullets/", "bullet")
				},{
					name: "spread",
					frames: [10, 30, 50, 70, 90, 110, 130, 150, 170, 190, 210, 230, 250, 270, 290, 310, 330],
					speed: 15,
					num: 12,
					angle: 0,
					sprite: ImageManager.loadBitmap("img/bullets/", "bullet")
				}]
            },{
                name: "shooter",
				length: 360,
                frames: [1],
                speed: 8,
                acc: 0,
                angle: 165,
                curve: 3,
				sprite: ImageManager.loadBitmap("img/bullets/", "arrowBullet"),
                shots: [{
					name: "spread",
					frames: [20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340],
					speed: 15,
					num: 12,
					angle: 15,
					sprite: ImageManager.loadBitmap("img/bullets/", "bullet")
				},{
					name: "spread",
					frames: [10, 30, 50, 70, 90, 110, 130, 150, 170, 190, 210, 230, 250, 270, 290, 310, 330],
					speed: 15,
					num: 12,
					angle: 0,
					sprite: ImageManager.loadBitmap("img/bullets/", "bullet")
				}]
            }
        ]
    };
	
	this.patterns[12] = { // Glitter Spray 1
        length: 480,
        shots: [
            {
                name: "spray",
				length: 480,
                frames: [30],
				repeat: 2,
                _speed: 8,
                _angle: 0,
                curve: 3,
				sprite: ImageManager.loadBitmap("img/bullets/", "arrowBullet")
            },{
                name: "moveToPlayer",
				length: 30,
				x: 50,
				y: 0,
                frames: [60],
				repeat: 120
            }
        ]
    }
	
	this.patterns[13] = { // Glitter Spray 2
        length: 480,
        shots: [
            {
                name: "spread",
				length: 480,
                frames: [60],
				repeat: 60,
				num: 24,
                _speed: 8,
                _angle: 0,
                curve: 3,
				sprite: ImageManager.loadBitmap("img/bullets/", "bullet")
            },{
                name: "moveToPlayer",
				length: 30,
				x: 200,
				y: 0,
                frames: [90],
				repeat: 120
            }
        ]
    }

};

var PatternManager = new Az_PatternManager();

}
