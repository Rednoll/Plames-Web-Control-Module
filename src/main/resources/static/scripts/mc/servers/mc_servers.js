var closeTimerId = -1;

var lastModalEditServerId = -1;

async function toggleServerRow(serverId) {

	container = document.getElementById(serverId+"-container");

	settingsContainer = document.getElementById(serverId+"-settings-container");

	if($(container).data("opened")) {
		
		$(container).data("opened", false);	
		
		$(settingsContainer).animate({"opacity": "0"}, 125, "linear", ()=> { 
		
			$(settingsContainer).css("display", "none");
			$(container).animate({"height": "32"}, 500, "swing")
		});
	}
	else {
	
		$("#"+serverId+"-description-text").html("Сбор данных");
				
		loadServerDescription(serverId);
		
		$(container).animate({"height": "275"}, 500, "swing", ()=> $(settingsContainer).animate({"opacity": "1"}, 125, "linear"));
		$(container).data("opened", true);
	
		$(settingsContainer).css("display", "inline-block");
	}
}

async function createServer(){
	
	let rest = await import("/resources/scripts/mc/servers/server_rest.js?1");

	var name = $("#modal-add-server-name").val();
	var address = $("#modal-add-server-address").val();
	var port = $("#modal-add-server-port").val();
	var apiPort = $("#modal-add-server-api-port").val();
	var secret = $("#modal-add-server-secret").val();
	
	rest.restCreateServer(name, address, port, apiPort, secret);
	
	window.location.href="/mc/servers#modal-background-add-server-2";

	closeTimerId = setTimeout(function tick(currentTime) {
		
		if(currentTime == undefined) {
			
			currentTime = 9;
		}
		
		$("#modal-add-server-2-close-text").html("Окно закроется через <span style='color: red;'>"+currentTime+"</span> сек");
		
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

async function openModalEditServer(id) {
	
	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "GET",
		url: "/api/mc/rest/servers/"+id,
		dataType: "json",
		
		success: function(data) {
		
			$("#modal-edit-server-name").val(data.name);
			$("#modal-edit-server-address").val(data.address);
			$("#modal-edit-server-port").val(data.port);
			$("#modal-edit-server-api-port").val(data.apiPort);
			$("#modal-edit-server-secret").val(data.secret);
		
			lastModalEditServerId = data.id;
		}
	});
	
	window.location.href = "/mc/servers#modal-background-edit-server";
}

async function saveModalEditServer() {
	
	let rest = await import("/resources/scripts/mc/servers/server_rest.js?1");
	
	let name = $("#modal-edit-server-name").val();
	let id = lastModalEditServerId;
	let address = $("#modal-edit-server-address").val();
	let port = $("#modal-edit-server-port").val();
	let apiPort = $("#modal-edit-server-api-port").val();
	let secret = $("#modal-edit-server-secret").val();
	
	rest.restSaveServer(name, id, address, port, apiPort, secret, ()=> closeModal());
}

async function loadServerDescription(serverId) {
	
	$.ajax({
	
		headers: { 

			'Content-Type': 'application/json;charset=UTF-8' 
		},
		type: "POST",
		url: "/web/controller/ajax/mc/server/description",
		data: JSON.stringify({ server: serverId }),
		
		success: function(data) {
			
			$("#"+serverId+"-description-text").html(data);
		}
	});
}

async function deleteServerById(id) {
	
	let rest = await import("/resources/scripts/mc/servers/server_rest.js?1");
	
	rest.restDeleteServerById(id);
}

async function closeModal() {

	window.location.href = "/mc/servers";
	clearTimeout(closeTimerId);
}