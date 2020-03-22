export function setActiveStyle(itemId) {

	$("#item-"+itemId+"-status-text").css("color", "#39E539");
	$("#item-"+itemId+"-status-text").text("Active");
}

export function setInactiveStyle(itemId) {
	
	$("#item-"+itemId+"-status-text").css("color", "#E53939");
	$("#item-"+itemId+"-status-text").text("Inactive");
}