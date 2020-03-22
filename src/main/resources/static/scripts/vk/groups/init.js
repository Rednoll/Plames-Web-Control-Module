async function init() {
	
	$("header").load("/resources/style/header.html?1");
	
	let groupStyler = await import("/resources/scripts/vk/groups/vk_group_styler.js");
	
	$(".group-status-toggle").each(function(i, elem) {
		
		var groupId = $(elem).data("group-id");
		
		if($(elem).is(':checked')) {

			groupStyler.setActiveStyle(groupId);
		}
		else {
			
			groupStyler.setInactiveStyle(groupId);
		}
	});
}