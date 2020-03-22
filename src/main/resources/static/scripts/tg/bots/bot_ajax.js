async function ajaxBotActiveSave(el) {
	
	let botStyler = await import("/resources/scripts/tg/bots/tg_bot_styler.js");
	
	var botId = $(el).data("bot-id");

	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "POST",
		url: "../web/controller/ajax/tg/bots/"+botId+"/active",
		data: JSON.stringify({ active: $(el).is(':checked') })
	});
	
	if($(el).is(':checked')) {
		
		botStyler.setActiveStyle(botId);
	}
	else {
		
		botStyler.setInactiveStyle(botId);
	}
}