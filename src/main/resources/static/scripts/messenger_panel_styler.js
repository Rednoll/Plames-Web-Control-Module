export function setOnlineStyle(messengerType) {

	$("#"+messengerType+"-status-text").css("color", "#39E539");
	$("#"+messengerType+"-status-text").text("Online");
	
	$("#"+messengerType+"-panel > .messenger-pane-top-container").css("filter", "grayscale(0%)").css("webkitFilter", "grayscale(0%)");
	$("#"+messengerType+"-panel > .messenger-description-text").css("filter", "grayscale(100%)").css("webkitFilter", "grayscale(0%)");
}

export function setOfflineStyle(messengerType) {
	
	$("#"+messengerType+"-status-text").css("color", "#E53939");
	$("#"+messengerType+"-status-text").text("Offline");

	$("#"+messengerType+"-panel > .messenger-pane-top-container").css("filter", "grayscale(100%)").css("webkitFilter", "grayscale(100%)");
	$("#"+messengerType+"-panel > .messenger-description-text").css("filter", "grayscale(100%)").css("webkitFilter", "grayscale(100%)");
}