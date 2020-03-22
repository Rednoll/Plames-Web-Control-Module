export function setActiveStyle(groupId) {

	$("#group-"+groupId+"-status-text").css("color", "#39E539");
	$("#group-"+groupId+"-status-text").text("Active");
}

export function setInactiveStyle(groupId) {
	
	$("#group-"+groupId+"-status-text").css("color", "#E53939");
	$("#group-"+groupId+"-status-text").text("Inactive");
}