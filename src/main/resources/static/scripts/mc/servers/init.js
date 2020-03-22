async function init() {
	
	$("header").load("/resources/style/header.html?1");
	
	let serverStyler = await import("/resources/scripts/mc/servers/mc_server_styler.js");

	$(".server-status-toggle").each(function(i, elem) {
		
		var serverId = $(elem).data("server-id");
		
		if($(elem).is(':checked')) {

			serverStyler.setActiveStyle(serverId);
		}
		else {
			
			serverStyler.setInactiveStyle(serverId);
		}
	});
	
	$(".server-row-available").each(function(i, elem) {
		
		var serverId = $(elem).data("server-id");
	
		if(!$(elem).data("loaded")){

			$(elem).animate({"opacity": "0.15"}, 750, "swing", function anim() {

				if($(elem).css("opacity") == 0.15) {
					
					$(elem).animate({"opacity": "1"}, 750, "swing", anim);
				}
				else if(!$(elem).data("loaded")){
					
					$(elem).animate({"opacity": "0.15"}, 750, "swing", anim);
				}
			});
		}
		
		$.ajax({
		
			type: "GET",
			url: "/web/controller/ajax/long_poll/mc/server/available/"+serverId,
			
			success: function(data) {
				
				if(data) {
					
					$("#server-"+serverId+"-available-text").text("Online");
					$("#server-"+serverId+"-available-text").css("color", "#39E539");
					$("#server-"+serverId+"-available-text").data("loaded", true);
					$("#server-"+serverId+"-available-text").finish().css("opacity", "1");
				}
				else {
					
					$("#server-"+serverId+"-available-text").text("Offline");
					$("#server-"+serverId+"-available-text").css("color", "#E53939");
					$("#server-"+serverId+"-available-text").data("loaded", true);
					$("#server-"+serverId+"-available-text").finish().css("opacity", "1");
				}
			}
		});
	});
}