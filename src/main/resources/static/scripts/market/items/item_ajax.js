async function ajaxItemActiveSave(el) {
	
	let itemStyler = await import("/resources/scripts/market/items/market_item_styler.js");
	
	var itemId = $(el).data("item-id");

	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "POST",
		url: "../web/controller/ajax/market/item/"+itemId+"/active",
		data: JSON.stringify({ active: $(el).is(':checked') })
	});
	
	if($(el).is(':checked')) {
		
		itemStyler.setActiveStyle(itemId);
	}
	else {
		
		itemStyler.setInactiveStyle(itemId);
	}
}