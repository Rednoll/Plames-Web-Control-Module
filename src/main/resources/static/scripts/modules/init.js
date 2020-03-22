async function init() {
	
	$("header").load("/resources/style/header.html?1");
	
	let moduleStyler = await import("/resources/scripts/modules/module_styler.js");
	
	$(".module-container").each(function(i, elem) {
		
		var moduleId = $(elem).data("module-id");
		var moduleStatus = $(elem).data("module-status");
		
		if(moduleStatus == "ACTIVE") {
			
			moduleStyler.setActiveStyle(moduleId);
		}
		
		if(moduleStatus == "AWAITING_ON"){
			
			moduleStyler.setAwaitingOnStyle(moduleId);
		}
		
		if(moduleStatus == "INACTIVE") {
			
			moduleStyler.setInactiveStyle(moduleId);
		}
		
		if(moduleStatus == "AWAITING_OFF"){
			
			moduleStyler.setAwaitingOffStyle(moduleId);
		}
	});
}