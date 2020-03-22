async function init() {
	
	$("header").load("/resources/style/header.html?1");
	
	let botStyler = await import("/resources/scripts/tg/bots/tg_bot_styler.js");

	$(".bot-status-toggle").each(function(i, elem) {
		
		var botId = $(elem).data("bot-id");
		
		if($(elem).is(':checked')) {

			botStyler.setActiveStyle(botId);
		}
		else {
			
			botStyler.setInactiveStyle(botId);
		}
	});
}