async function ajaxMessengerActiveSave(el) {
	
	let messengerStyler = await import("/resources/scripts/messenger_panel_styler.js");
	
	var messengerType = $(el).data("messenger-type");
	
	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "POST",
		url: "web/controller/ajax/messenger/active",
		data: JSON.stringify({ messenger: messengerType, active: $(el).is(':checked') })
	});
	
	if($(el).is(':checked')) {
		
		messengerStyler.setOnlineStyle(messengerType);
	}
	else {
		
		messengerStyler.setOfflineStyle(messengerType);
	}
}