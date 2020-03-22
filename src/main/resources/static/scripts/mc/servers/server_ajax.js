async function ajaxServerActiveSave(el) {
	
	let serverStyler = await import("/resources/scripts/mc/servers/mc_server_styler.js");
	
	var serverId = $(el).data("server-id");

	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "POST",
		url: "/web/controller/ajax/mc/server/active",
		data: JSON.stringify({ server: serverId, active: $(el).is(':checked') })
	});
	
	if($(el).is(':checked')) {
		
		serverStyler.setActiveStyle(serverId);
	}
	else {
		
		serverStyler.setInactiveStyle(serverId);
	}
}