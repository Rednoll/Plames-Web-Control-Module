export function setActiveStyle(moduleId) {

	$("#module-"+moduleId+"-status-text").css("color", "#39E539");
	$("#module-"+moduleId+"-status-text").text("Active");
}

export function setAwaitingOnStyle(moduleId) {

	$("#module-"+moduleId+"-status-text").css("color", "#F9AA3B");
	$("#module-"+moduleId+"-status-text").text("Awaiting On");
}

export function setAwaitingOffStyle(moduleId) {

	$("#module-"+moduleId+"-status-text").css("color", "#F9AA3B");
	$("#module-"+moduleId+"-status-text").text("Awaiting Off");
}

export function setInactiveStyle(moduleId) {
	
	$("#module-"+moduleId+"-status-text").css("color", "#E53939");
	$("#module-"+moduleId+"-status-text").text("Inactive");
}