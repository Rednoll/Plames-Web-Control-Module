async function ajaxOfferActiveSave(el) {
	
	let offerStyler = await import("/resources/scripts/market/offers/market_offer_styler.js");
	
	var offerId = $(el).data("offer-id");

	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "POST",
		url: "../web/controller/ajax/market/offer/"+offerId+"/active",
		data: JSON.stringify({ active: $(el).is(':checked') })
	});
	
	if($(el).is(':checked')) {
		
		offerStyler.setActiveStyle(offerId);
	}
	else {
		
		offerStyler.setInactiveStyle(offerId);
	}
}