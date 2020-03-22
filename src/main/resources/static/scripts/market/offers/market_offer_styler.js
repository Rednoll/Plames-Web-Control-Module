export function setActiveStyle(offerId) {

	$("#offer-"+offerId+"-status-text").css("color", "#39E539");
	$("#offer-"+offerId+"-status-text").text("Active");
}

export function setInactiveStyle(offerId) {
	
	$("#offer-"+offerId+"-status-text").css("color", "#E53939");
	$("#offer-"+offerId+"-status-text").text("Inactive");
}