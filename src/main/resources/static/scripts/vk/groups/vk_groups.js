var lastModalGroupId = -1;
var closeTimerId = -1;

var lastModalEditGroupId = -1;

async function toggleGroupRow(groupId) {

	container = document.getElementById(groupId+"-container");

	settingsContainer = document.getElementById(groupId+"-settings-container");

	if($(container).data("opened")) {
		
		$(container).data("opened", false);	
		
		$(settingsContainer).animate({"opacity": "0"}, 125, "linear", ()=> { 
		
			$(settingsContainer).css("display", "none");
			$(container).animate({"height": "32"}, 500, "swing")
		});
	}
	else {
	
		$("#"+groupId+"-description-text").html("Сбор данных");
				
		loadGroupDescription(groupId);
		
		$(container).animate({"height": "250"}, 500, "swing", ()=> $(settingsContainer).animate({"opacity": "1"}, 125, "linear"));
		$(container).data("opened", true);
	
		$(settingsContainer).css("display", "inline-block");
	}
}

async function createGroup(){
	
	let rest = await import("/resources/scripts/vk/groups/group_rest.js?1");
	let ajax = await import("/resources/scripts/vk/groups/group_ajax.js?1");

	var name = $("#modal-add-group-name").val();
	var groupId = $("#modal-add-group-groupId").val();
	var secret = $("#modal-add-group-secret").val();
	var testKey = $("#modal-add-group-test").val();
	var token = $("#modal-add-group-token").val();
	
	lastModalGroupVkId = parseInt(groupId, 10);
	
	rest.restCreateGroup(name, groupId, secret, testKey, token, (data)=> { lastModalGroupId = data.id });
	
	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "POST",
		url: "/web/controller/ajax/long_poll/vk/group/verification",
		data: JSON.stringify({ groupId: parseInt(groupId, 10) }),
		timeout: 1800000
		
	}).done(function() {
		
		window.location.href="/vk/groups#modal-background-add-group-3";
	
		closeTimerId = setTimeout(function tick(currentTime) {
			
			if(currentTime == undefined) {
				
				currentTime = 9;
			}
			
			$("#modal-add-group-3-close-text").html("Окно закроется через <span style='color: red;'>"+currentTime+"</span> сек");
			
			currentTime--;
			
			if(currentTime > 0) {
			
				setTimeout(tick, 1000, currentTime);			
			}
			else {

				closeModal();
				setTimeout(()=> location.reload(), 500);
			}
		
		}, 1000);
	});
}

async function openModalEditGroup(id) {
	
	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "GET",
		url: "/api/vk/rest/groups/"+id,
		dataType: "json",
		
		success: function(data) {
		
			$("#modal-edit-group-name").val(data.name);
			$("#modal-edit-group-secret").val(data.secret);
			$("#modal-edit-group-test").val(data.testKey);
			$("#modal-edit-group-token").val(data.token);
		
			lastModalEditGroupId = data.id;
		}
	});
	
	window.location.href = "/vk/groups#modal-background-edit-group";
}

async function saveModalEditGroup() {
	
	let rest = await import("/resources/scripts/vk/groups/group_rest.js?1");
	
	let name = $("#modal-edit-group-name").val();
	let groupId = lastModalEditGroupId;
	let secret = $("#modal-edit-group-secret").val();
	let test = $("#modal-edit-group-test").val();
	let token = $("#modal-edit-group-token").val();
	
	rest.restSaveGroup(name, groupId, secret, test, token, ()=> closeModal());
}

async function loadGroupDescription(groupId) {
	
	$.ajax({
	
		headers: { 

			'Content-Type': 'application/json;charset=UTF-8' 
		},
		type: "POST",
		url: "/web/controller/ajax/vk/group/description",
		data: JSON.stringify({ group: groupId }),
		
		success: function(data) {
			
			$("#"+groupId+"-description-text").html(data);
		}
	});
}

async function deleteModalGroup() {
	
	deleteGroupById(lastModalGroupId);
}

async function deleteGroupById(id) {
	
	let rest = await import("/resources/scripts/vk/groups/group_rest.js?1");
	
	rest.restDeleteGroupById(id);
}

async function closeModal() {

	window.location.href = "/vk/groups";
	clearTimeout(closeTimerId);
}