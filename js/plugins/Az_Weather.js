// Weather

Az_WeatherController = function() {}
var Az_WeatherSprites = [];

Az_TimeController = function() {}
var Az_TimeSprites = [];

Az_WeatherController.update = function() {
	let info = $dataMap.meta;
	let scene = SceneManager._scene
	let mode = scene.az_weathermode
		
	if(info) {		
		if(info.wind) {
			if(mode != "wind") {
				Az_WeatherController.createSprites("wind");
			}
			Az_WeatherController.updateSprites("wind");
			
		} else {
			if(mode != "none") {
				Az_WeatherController.clearWeather();
			}
		
		}
	} 
}

Az_WeatherController.clearWeather = function() {
	let scene = SceneManager._scene
	let mode = scene.az_weathermode
	
	for(let i = 0; i < Az_WeatherSprites.length; i++) {
		Az_WeatherSprites[i].destroy();
	}
	Az_WeatherSprites = [];
	mode = "none";
}

Az_WeatherController.createSprites = function(type) {
	let scene = SceneManager._scene
	let mode = scene.az_weathermode
	scene.az_weathermode = type;
	
	for(let i = 0; i < 15; i++) {
		let x = Math.floor(Math.random() * Graphics.boxWidth);
		let y = Math.floor(Math.random() * Graphics.boxHeight);
		
		Az_WeatherSprites[i] = new Az_Sprite(x, y);
		Az_WeatherSprites[i]._bitmap = ImageManager.loadBitmap("img//effects//", type, 0, false);
		Az_WeatherSprites[i].makeAnimated(1, 4, 20, Math.floor(Math.random() * 4));
	}
}
Az_WeatherController.updateSprites = function(type) {
	for(let i = 0; i < Az_WeatherSprites.length; i++) {
		switch(type) {
		case "wind" :
			Az_WeatherSprites[i].x += 1.5
			Az_WeatherSprites[i].y += 0.5
			break;
		}
		
		if(Az_WeatherSprites[i].x > Graphics.boxWidth) {
			let newpos = Math.floor(Math.random() * (Graphics.boxHeight));
			Az_WeatherSprites[i].x = 0;
			Az_WeatherSprites[i].y = newpos;
			
		} else if (Az_WeatherSprites[i].y > Graphics.boxHeight) {
			let newpos = Math.floor(Math.random() * (Graphics.boxWidth));
				Az_WeatherSprites[i].x = newpos;
				Az_WeatherSprites[i].y = 0
			
		} else if (Az_WeatherSprites[i].x < 0) {
			let newpos = Math.floor(Math.random() * (Graphics.boxHeight));
				Az_WeatherSprites[i].x = Graphics.boxWidth;
				Az_WeatherSprites[i].y = newpos;
				
		} else if (Az_WeatherSprites[i].y < 0) {
			let newpos = Math.floor(Math.random() * (Graphics.boxWidth ));
			Az_WeatherSprites[i].x = newpos;
			Az_WeatherSprites[i].y = Graphics.boxHeight

		}
	}
}

Az_WeatherController.scrollSprites = function(x, y) {
	for(let i = 0; i < Az_WeatherSprites.length; i++) {
		Az_WeatherSprites[i].x += 48 * x;
		Az_WeatherSprites[i].y += 48 * y;
	}
}

Scene_Map.prototype.update = function() {
    this.updateDestination();
    this.updateMainMultiply();
    if (this.isSceneChangeOk()) {
        this.updateScene();
    } else if (SceneManager.isNextScene(Scene_Battle)) {
        this.updateEncounterEffect();
    }
    this.updateWaitCount();
    Scene_Base.prototype.update.call(this);
	Az_TimeController.update()
	Az_WeatherController.update()
};

Game_Map.prototype.scrollDown = function(distance) {
    if (this.isLoopVertical()) {
        this._displayY += distance;
        this._displayY %= $dataMap.height;
        if (this._parallaxLoopY) {
            this._parallaxY += distance;
        }
    } else if (this.height() >= this.screenTileY()) {
        var lastY = this._displayY;
        this._displayY = Math.min(this._displayY + distance,
            this.height() - this.screenTileY());
        this._parallaxY += this._displayY - lastY;
		
		if(lastY != this._displayY) {
			Az_WeatherController.scrollSprites(0, -distance)
		}
    }
};

Game_Map.prototype.scrollLeft = function(distance) {
    if (this.isLoopHorizontal()) {
        this._displayX += $dataMap.width - distance;
        this._displayX %= $dataMap.width;
        if (this._parallaxLoopX) {
            this._parallaxX -= distance;
        }
    } else if (this.width() >= this.screenTileX()) {
        var lastX = this._displayX;
        this._displayX = Math.max(this._displayX - distance, 0);
        this._parallaxX += this._displayX - lastX;
		
		if(lastX != this._displayX) {
			Az_WeatherController.scrollSprites(distance, 0);
		}
    }
};

Game_Map.prototype.scrollRight = function(distance) {
    if (this.isLoopHorizontal()) {
        this._displayX += distance;
        this._displayX %= $dataMap.width;
        if (this._parallaxLoopX) {
            this._parallaxX += distance;
        }
    } else if (this.width() >= this.screenTileX()) {
        var lastX = this._displayX;
        this._displayX = Math.min(this._displayX + distance,
            this.width() - this.screenTileX());
        this._parallaxX += this._displayX - lastX;
		if(lastX != this._displayX) {
			Az_WeatherController.scrollSprites(-distance, 0);
		}
    }
};

Game_Map.prototype.scrollUp = function(distance) {
    if (this.isLoopVertical()) {
        this._displayY += $dataMap.height - distance;
        this._displayY %= $dataMap.height;
        if (this._parallaxLoopY) {
            this._parallaxY -= distance;
        }
    } else if (this.height() >= this.screenTileY()) {
        var lastY = this._displayY;
        this._displayY = Math.max(this._displayY - distance, 0);
        this._parallaxY += this._displayY - lastY;
		
		if(lastY != this._displayY) {
			Az_WeatherController.scrollSprites(0, distance)
		}
    }
};

// Time

Az_TimeController.update = function() {
	let scene = SceneManager._scene;
	
	if($gameSwitches.value(2)) {
		if(!(scene.children[scene.children.length - 4] instanceof Az_Sprite)) {
			Az_TimeSprites[0] = (new Az_Sprite(Graphics.boxWidth - 250, 0, scene.children.length - 2))
			Az_TimeSprites[0].anchor.x = 0;
			Az_TimeSprites[0].anchor.y = 0;
			Az_TimeSprites[0]._bitmap = ImageManager.loadBitmap("img/system/", "clock", 0, true);
			
			Az_TimeSprites[1] = (new Window_Base(Graphics.boxWidth - 274, 0, 250, 250));
			Az_TimeSprites[1].opacity = 0;
			Az_TimeSprites[1].open();
			
			Az_TimeSprites[2] = new Az_Sprite(Graphics.boxWidth - 195, -24, scene.children.length - 2);
			Az_TimeSprites[2].anchor.x = 0;
			Az_TimeSprites[2].anchor.y = 0;
			Az_TimeSprites[2]._bitmap = ImageManager.loadBitmap("img/system/", "timeLabel", 0, true);
			
			scene.addWindow(Az_TimeSprites[1]);
		}
		
		Az_TimeSprites[1].contents.clear();
		
		if(!$gameMap._interpreter.isRunning() || $gameSwitches.value(3)) {
			$gameVariables.setValue(6, $gameVariables.value(6) + 1)
			
			if($gameVariables.value(6) >= 360) {
				$gameVariables.setValue(6, 0)
				$gameVariables.setValue(7, $gameVariables.value(7) + 1)
				
				
				if($gameVariables.value(7) >= 60) {
					$gameVariables.setValue(7, 0)
					$gameVariables.setValue(8, $gameVariables.value(8) + 1)
					
					if($gameVariables.value(8) >= 12) {
						$gameVariables.setValue(8, 0)
					}
				}
			}
			Az_TimeSprites[1].drawTextEx($gameVariables.value(8) + ":" + $gameVariables.value(7), 24, 0, 250, "left");
		} else {
			Az_TimeSprites[1].drawTextEx("\\c[17]" + $gameVariables.value(8) + ":" + $gameVariables.value(7), 24, 0, 250, "left");
		}
		
		
		
		
		Az_TimeSprites[2].x = Graphics.boxWidth - 195 + $gameVariables.value(6)/360*195;
		Az_TimeSprites[2].y = $gameVariables.value(6)/360*195 - 24;
	}
	
	
}