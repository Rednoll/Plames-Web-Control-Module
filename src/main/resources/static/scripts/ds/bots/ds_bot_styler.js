export function setActiveStyle(botId) {

	$("#bot-"+botId+"-status-text").css("color", "#39E539");
	$("#bot-"+botId+"-status-text").text("Active");
}

export function setInactiveStyle(botId) {
	
	$("#bot-"+botId+"-status-text").css("color", "#E53939");
	$("#bot-"+botId+"-status-text").text("Inactive");
}