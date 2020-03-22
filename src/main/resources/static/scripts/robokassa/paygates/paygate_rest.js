export function restSavePaygate(paygateId, paygateData, onSuccess) {

	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "PUT",
		url: "/api/robokassa/rest/paygates/"+paygateId,
		data: paygateData,
		success: onSuccess
	});
}

export function restCreatePaygate(paygateData) {
	
	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "POST",
		url: "/api/robokassa/rest/paygates",
		data: paygateData
	})
}

export function restDeletePaygateById(id) {
	
	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "DELETE",
		url: "/api/robokassa/rest/paygates/"+id
	})
}