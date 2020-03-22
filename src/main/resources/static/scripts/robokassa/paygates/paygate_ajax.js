async function ajaxPaygateActiveSave(el) {
	
	let paygateStyler = await import("/resources/scripts/robokassa/paygates/robokassa_paygate_styler.js");
	
	var paygateId = $(el).data("paygate-id");

	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "POST",
		url: "../web/controller/ajax/robokassa/paygate/"+paygateId+"/active",
		data: JSON.stringify({ active: $(el).is(':checked') })
	});
	
	if($(el).is(':checked')) {
		
		paygateStyler.setActiveStyle(paygateId);
	}
	else {
		
		paygateStyler.setInactiveStyle(paygateId);
	}
}