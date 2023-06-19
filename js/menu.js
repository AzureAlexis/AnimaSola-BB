/*
	This file (menu.js) contains all the functions relating to the pause menu, including;
	-Creating and drawing the menu
	-Controller for cursor and menu animations
	-Lists containing current player items
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