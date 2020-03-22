async function init() {
	
	$("header").load("/resources/style/header.html?1");
	
	let messengerStyler = await import("/resources/scripts/messenger_panel_styler.js");
	
	$(".messenger-toggle").each(function(i, elem) {
		
		var messengerType = $(elem).data("messenger-type");
		
		if($(elem).is(':checked')) {

			messengerStyler.setOnlineStyle(messengerType);
		}
		else {
			
			messengerStyler.setOfflineStyle(messengerType);
		}
	});
	
	loadStatistics();
}

async function loadStatistics() {
	
	let ajax = await import("/resources/scripts/messenger_ajax.js");
		
	$(".messenger-panel").each(function(i, elem) {
		
		var messengerType = $(elem).data("messenger-type");

		$.ajax({
		
			headers: { 

				'Content-Type': 'application/json;charset=UTF-8' 
			},
			type: "POST",
			url: "web/controller/ajax/messenger/description",
			data: JSON.stringify({ messenger: messengerType }),
			
			success: function(data) {
				
				$("#"+messengerType+"-description-text").html(data);
			}
		});
	});
}

async function openSettingsPage(icon) {
	
	var messengerType = $(icon).data("messenger-type");
	
	if(messengerType == "vk") {
		
		document.location.href = "/vk/groups";
	}
	
	if(messengerType == "mc") {
		
		document.location.href = "/mc/servers";
	}
	
	if(messengerType == "ds") {
		
		document.location.href = "/ds/bots";
	}
	
	if(messengerType == "tg") {
		
		document.location.href = "/tg/bots";
	}
}