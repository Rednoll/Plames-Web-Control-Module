export function setActiveStyle(paygateId) {

	$("#paygate-"+paygateId+"-status-text").css("color", "#39E539");
	$("#paygate-"+paygateId+"-status-text").text("Active");
}

export function setInactiveStyle(paygateId) {
	
	$("#paygate-"+paygateId+"-status-text").css("color", "#E53939");
	$("#paygate-"+paygateId+"-status-text").text("Inactive");
}