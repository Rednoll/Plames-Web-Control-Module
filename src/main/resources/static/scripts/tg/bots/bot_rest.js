export function restCreateBot(name, token, webhookAddress, apiAddress, onSuccess) {

	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "POST",
		url: "/api/tg/rest/bots",
		data: JSON.stringify({ name: name, token: token, webhook_address: webhookAddress, api_address: apiAddress }),
		dataType: "JSON",
		success: onSuccess
	});
}

export function restSaveBot(name, botId, token, webhookAddress, apiAddress, onSuccess) {

	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "PUT",
		url: "/api/tg/rest/bots/"+botId,
		data: JSON.stringify({ name: name, token: token, webhook_address: webhookAddress, api_address: apiAddress }),
		success: onSuccess
	});
}

export function restDeleteBotById(id) {
	
	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "DELETE",
		url: "/api/tg/rest/bots/"+id
	})
}