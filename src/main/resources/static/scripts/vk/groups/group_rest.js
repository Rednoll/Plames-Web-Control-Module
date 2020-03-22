export function restCreateGroup(name, groupId, secret, testKey, token, onSuccess) {

	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "POST",
		url: "/api/vk/rest/groups",
		data: JSON.stringify({ name: name, groupId: groupId, secret: secret, testKey: testKey, token: token }),
		dataType: "json",
		success: onSuccess
	});
}

export function restSaveGroup(name, groupId, secret, testKey, token, onSuccess) {

	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "PUT",
		url: "/api/vk/rest/groups/"+groupId,
		data: JSON.stringify({ name: name, secret: secret, testKey: testKey, token: token }),
		success: onSuccess
	});
}

export function restDeleteGroupById(id) {
	
	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "DELETE",
		url: "/api/vk/rest/groups/"+id
	})
}