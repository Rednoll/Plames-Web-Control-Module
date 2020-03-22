export function restCreateOffer(offerData) {
	
	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "POST",
		url: "/api/market/rest/offers",
		data: offerData
	})
}

export function restSaveOffer(offerId, offerData, onSuccess) {

	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "PUT",
		url: "/api/market/rest/offers/"+offerId,
		data: offerData,
		success: onSuccess
	});
}

export function restDeleteOfferById(id) {
	
	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "DELETE",
		url: "/api/market/rest/offers/"+id
	})
}