/*
	Not much right now, but will eventually contain menu code
*/

// Triggers menu upon pressing confirm key while targeting nothing
Scene_Map.prototype.updateScene = function() {
    this.checkGameover();
    if (!SceneManager.isSceneChanging()) {
        this.updateTransferPlayer();
    }
    if (!SceneManager.isSceneChanging()) {
        this.updateEncounter();
    }
    if (!SceneManager.isSceneChanging()) {
        this.updateCallMenu();
    }
    if (!SceneManager.isSceneChanging()) {
        this.updateCallDebug();
    }
	if(!((SceneManager.isSceneChanging()) || ($gameMap.isEventRunning())) && Input.isTriggered('ok')) {
		mapText(0, 0);
	}
};