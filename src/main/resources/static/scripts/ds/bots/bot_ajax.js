async function ajaxBotActiveSave(el) {
	
	let botStyler = await import("/resources/scripts/ds/bots/ds_bot_styler.js");
	
	var botId = $(el).data("bot-id");

	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "POST",
		url: "/web/controller/ajax/ds/bot/active",
		data: JSON.stringify({ bot: botId, active: $(el).is(':checked') })
	});
	
	if($(el).is(':checked')) {
		
		botStyler.setActiveStyle(botId);
	}
	else {
		
		botStyler.setInactiveStyle(botId);
	}
}