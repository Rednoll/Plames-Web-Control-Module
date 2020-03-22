async function ajaxCurrencyActiveSave(el) {
	
	let currencyStyler = await import("/resources/scripts/wallet/currencies/wallet_currency_styler.js");
	
	var currencyId = $(el).data("currency-id");

	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "POST",
		url: "../web/controller/ajax/wallet/currency/"+currencyId+"/active",
		data: JSON.stringify({ active: $(el).is(':checked') })
	});
	
	if($(el).is(':checked')) {
		
		currencyStyler.setActiveStyle(currencyId);
	}
	else {
		
		currencyStyler.setInactiveStyle(currencyId);
	}
}