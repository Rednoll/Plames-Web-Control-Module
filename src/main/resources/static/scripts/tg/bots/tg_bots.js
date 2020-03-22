var closeTimerId = -1;

var lastModalEditBotId = -1;

async function toggleBotRow(botId) {

	container = document.getElementById(botId+"-container");

	settingsContainer = document.getElementById(botId+"-settings-container");

	if($(container).data("opened")) {
		
		$(container).data("opened", false);	
		
		$(settingsContainer).animate({"opacity": "0"}, 125, "linear", ()=> { 
		
			$(settingsContainer).css("display", "none");
			$(container).animate({"height": "32"}, 500, "swing")
		});
	}
	else {
	
		$("#"+botId+"-description-text").html("Сбор данных");
				
		loadBotDescription(botId);
		
		$(container).animate({"height": "175"}, 500, "swing", ()=> $(settingsContainer).animate({"opacity": "1"}, 125, "linear"));
		$(container).data("opened", true);
	
		$(settingsContainer).css("display", "inline-block");
	}
}

async function createBot(){
	
	let rest = await import("/resources/scripts/tg/bots/bot_rest.js?1");

	var name = $("#modal-add-bot-name").val();
	var token = $("#modal-add-bot-token").val();
	var webhookAddress = $("#modal-add-bot-waddress").val();
	var apiAddress = $("#modal-add-bot-aaddress").val();
	
	window.location.href="/tg/bots#modal-background-add-bot-2";
	
	rest.restCreateBot(name, token, webhookAddress, apiAddress, (botData)=> {
		
		$.ajax({
			
			type: "GET",
			url: "../web/controller/ajax/long_poll/tg/bot/"+botData.id+"/init",
			success: function initComplete() {
			
				window.location.href="/tg/bots#modal-background-add-bot-3";
	
				closeTimerId = setTimeout(function tick(currentTime) {
					
					if(currentTime == undefined) {
						
						currentTime = 9;
					}
					
					$("#modal-add-bot-3-close-text").html("Окно закроется через <span style='color: red;'>"+currentTime+"</span> сек");
					
					currentTime--;
					
					if(currentTime > 0) {
					
						setTimeout(tick, 1000, currentTime);			
					}
					else {

						closeModal();
						setTimeout(()=> location.reload(), 500);
					}
				
				}, 1000);
			}
		});
	});
}

async function openModalEditBot(id) {
	
	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "GET",
		url: "/api/tg/rest/bots/"+id,
		dataType: "json",
		
		success: function(data) {
		
			$("#modal-edit-bot-name").val(data.name);
			$("#modal-edit-bot-token").val(data.token);
			$("#modal-edit-bot-waddress").val(data.webhook_address);
			$("#modal-edit-bot-aaddress").val(data.api_address);
			
			lastModalEditBotId = data.id;
		}
	});
	
	window.location.href = "/tg/bots#modal-background-edit-bot";
}

async function saveModalEditBot() {
	
	let rest = await import("/resources/scripts/tg/bots/bot_rest.js?1");
	
	let name = $("#modal-edit-bot-name").val();
	let id = lastModalEditBotId;
	let token = $("#modal-edit-bot-token").val();
	let webhookAddress = $("#modal-edit-bot-waddress").val();
	let apiAddress = $("#modal-edit-bot-aaddress").val();
	
	rest.restSaveBot(name, id, token, webhookAddress, apiAddress, ()=> closeModal());
	
	$.ajax({

		type: "POST",
		url: "../web/controller/ajax/tg/bots/"+id+"/init"
	});
}

async function loadBotDescription(botId) {
	
	$.ajax({

		type: "GET",
		url: "../web/controller/ajax/tg/bots/"+botId+"/description",
		success: function(data) {
			
			$("#"+botId+"-description-text").html(data);
		}
	});
}

async function deleteBotById(id) {
	
	let rest = await import("/resources/scripts/tg/bots/bot_rest.js?1");
	
	rest.restDeleteBotById(id);
}

async function closeModal() {

	window.location.href = "/tg/bots";
	clearTimeout(closeTimerId);
}