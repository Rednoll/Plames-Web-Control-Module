export function setActiveStyle(currencyId) {

	$("#currency-"+currencyId+"-status-text").css("color", "#39E539");
	$("#currency-"+currencyId+"-status-text").text("Active");
}

export function setInactiveStyle(currencyId) {
	
	$("#currency-"+currencyId+"-status-text").css("color", "#E53939");
	$("#currency-"+currencyId+"-status-text").text("Inactive");
}