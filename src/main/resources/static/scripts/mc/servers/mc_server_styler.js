export function setActiveStyle(serverid) {

	$("#server-"+serverid+"-status-text").css("color", "#39E539");
	$("#server-"+serverid+"-status-text").text("Active");
}

export function setInactiveStyle(serverid) {
	
	$("#server-"+serverid+"-status-text").css("color", "#E53939");
	$("#server-"+serverid+"-status-text").text("Inactive");
}