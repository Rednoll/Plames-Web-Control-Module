async function toggleModuleRow(moduleId) {

	container = document.getElementById(moduleId+"-container");

	dataContainer = document.getElementById(moduleId+"-data-container");

	if($(container).data("opened")) {
		
		$(container).data("opened", false);	
		
		$(dataContainer).animate({"opacity": "0"}, 125, "linear", ()=> { 
		
			$(dataContainer).css("display", "none");
			$(container).animate({"height": "32"}, 500, "swing")
		});
	}
	else {
	
		$(container).animate({"height": "250"}, 500, "swing", ()=> $(dataContainer).animate({"opacity": "1"}, 125, "linear"));
		$(container).data("opened", true);
	
		$(dataContainer).css("display", "inline-block");
	}
}