export function restSaveItem(itemId, itemData, onSuccess) {

	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "PUT",
		url: "/api/market/rest/items/"+itemId,
		data: itemData,
		success: onSuccess
	});
}

export function restCreateItem(itemData) {
	
	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "POST",
		url: "/api/market/rest/items",
		data: itemData
	})
}

export function restDeleteItemById(id) {
	
	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "DELETE",
		url: "/api/market/rest/items/"+id
	})
}