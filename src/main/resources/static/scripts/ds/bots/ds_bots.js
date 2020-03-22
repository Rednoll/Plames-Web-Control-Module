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
	
	let rest = await import("/resources/scripts/ds/bots/bot_rest.js?1");

	var name = $("#modal-add-bot-name").val();
	var token = $("#modal-add-bot-token").val();
	
	rest.restCreateBot(name, token);
	
	window.location.href="/ds/bots#modal-background-add-bot-2";

	closeTimerId = setTimeout(function tick(currentTime) {
		
		if(currentTime == undefined) {
			
			currentTime = 9;
		}
		
		$("#modal-add-bot-2-close-text").html("Окно закроется через <span style='color: red;'>"+currentTime+"</span> сек");
		
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

async function openModalEditBot(id) {
	
	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "GET",
		url: "/api/ds/rest/bots/"+id,
		dataType: "json",
		
		success: function(data) {
		
			$("#modal-edit-bot-name").val(data.name);
			$("#modal-edit-bot-token").val(data.token);
			
			lastModalEditBotId = data.id;
		}
	});
	
	window.location.href = "/ds/bots#modal-background-edit-bot";
}

async function saveModalEditBot() {
	
	let rest = await import("/resources/scripts/ds/bots/bot_rest.js?1");
	
	let name = $("#modal-edit-bot-name").val();
	let id = lastModalEditBotId;
	let token = $("#modal-edit-bot-token").val();
	
	rest.restSaveBot(name, id, token, ()=> closeModal());
}

async function loadBotDescription(botId) {
	
	$.ajax({
	
		headers: { 

			'Content-Type': 'application/json;charset=UTF-8' 
		},
		type: "POST",
		url: "/web/controller/ajax/ds/bot/description",
		data: JSON.stringify({ bot: botId }),
		
		success: function(data) {
			
			$("#"+botId+"-description-text").html(data);
		}
	});
}

async function deleteBotById(id) {
	
	let rest = await import("/resources/scripts/ds/bots/bot_rest.js?1");
	
	rest.restDeleteBotById(id);
}

async function closeModal() {

	window.location.href = "/ds/bots";
	clearTimeout(closeTimerId);
}