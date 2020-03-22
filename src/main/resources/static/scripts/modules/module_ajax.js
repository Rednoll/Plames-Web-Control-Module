async function ajaxModuleActiveSave(el) {
	
	let moduleStyler = await import("/resources/scripts/modules/module_styler.js");
	
	var moduleId = $(el).data("module-id");

	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "POST",
		url: "web/controller/ajax/module/active",
		data: JSON.stringify({ module: moduleId, active: $(el).is(':checked') })
	});
	
	if($(el).is(':checked')) {
		
		moduleStyler.setAwaitingOnStyle(moduleId);
	}
	else {
		
		moduleStyler.setAwaitingOffStyle(moduleId);
	}
}