export function restCreateBot(name, token) {

	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "POST",
		url: "/api/ds/rest/bots",
		data: JSON.stringify({ name: name, token: token })
	});
}

export function restSaveBot(name, botId, token, onSuccess) {

	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "PUT",
		url: "/api/ds/rest/bots/"+botId,
		data: JSON.stringify({ name: name, token: token }),
		success: onSuccess
	});
}

export function restDeleteBotById(id) {
	
	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "DELETE",
		url: "/api/ds/rest/bots/"+id
	})
}