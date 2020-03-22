async function ajaxGroupActiveSave(el) {
	
	let messengerStyler = await import("/resources/scripts/vk/groups/vk_group_styler.js");
	
	var groupId = $(el).data("group-id");

	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "POST",
		url: "/web/controller/ajax/vk/group/active",
		data: JSON.stringify({ group: groupId, active: $(el).is(':checked') })
	});
	
	if($(el).is(':checked')) {
		
		messengerStyler.setActiveStyle(groupId);
	}
	else {
		
		messengerStyler.setInactiveStyle(groupId);
	}
}