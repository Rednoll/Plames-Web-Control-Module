export function restCreateServer(name, address, port, apiPort, secret) {

	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "POST",
		url: "/api/mc/rest/servers",
		data: JSON.stringify({ name: name, address: address, port: parseInt(port, 10), apiPort: parseInt(apiPort, 10), secret: secret })
	});
}

export function restSaveServer(name, serverId, address, port, apiPort, secret, onSuccess) {

	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "PUT",
		url: "/api/mc/rest/servers/"+serverId,
		data: JSON.stringify({ name: name, address: address, port: parseInt(port, 10), apiPort: parseInt(apiPort, 10), secret: secret }),
		success: onSuccess
	});
}

export function restDeleteServerById(id) {
	
	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "DELETE",
		url: "/api/mc/rest/servers/"+id
	})
}