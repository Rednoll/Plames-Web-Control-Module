var closeTimerId = -1;

async function toggleCurrencyRow(currencyId) {

	container = document.getElementById(currencyId+"-container");

	settingsContainer = document.getElementById(currencyId+"-settings-container");

	if($(container).data("opened")) {
		
		$(container).data("opened", false);	
		
		$(settingsContainer).animate({"opacity": "0"}, 125, "linear", ()=> { 
		
			$(settingsContainer).css("display", "none");
			$(container).animate({"height": "32"}, 500, "swing")
		});
	}
	else {
	
		$("#"+currencyId+"-description-text").html("Сбор данных");
				
		loadCurrecnyDescription(currencyId);
		
		$(container).animate({"height": "175"}, 500, "swing", ()=> $(settingsContainer).animate({"opacity": "1"}, 125, "linear"));
		$(container).data("opened", true);
	
		$(settingsContainer).css("display", "inline-block");
	}
}

async function openModalEditCurrency(currencyId) {
	
	$("#modal-edit-currency-id").val(currencyId);
	$("#modal-edit-currency-icon").attr("src", "/data/modules/wallet/currencies/"+currencyId+"/icon.svg");
	
	$.get("/data/modules/wallet/currencies/"+currencyId+"/icon.svg")
		.done(()=> $("#modal-edit-currency-icon").attr("src", "/data/modules/wallet/currencies/"+currencyId+"/icon.svg"))
		.fail(()=> $("#modal-edit-currency-icon").attr("src", "/resources/images/wallet/currencies/upload-image-icon.svg"));
	
	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "GET",
		url: "/api/wallet/rest/currencies/"+currencyId,
		dataType: "json",
		
		success: function(data) {
		
			$("#modal-edit-currency-name").val(data.name);
			$("#modal-edit-currency-tag").val(data.tag);
			$("#modal-edit-currency-code").val(data.code);
			$("#modal-edit-currency-flevel").val(data.fragmentation_level);
			
			if(data.type == "microtransaction") {
				
				$("#modal-edit-currency-multiplier").val(data.multiplier);
				$(".modal-currency-table-row-multiplier").css("display", "flex");
			}
			else {
				
				$(".modal-currency-table-row-multiplier").css("display", "none");
			}
		}
	});
	
	window.location.href = "#modal-background-edit-currency";
}

async function loadCurrecnyDescription(currencyId) {
	
	$.ajax({

		type: "GET",
		url: "../web/controller/ajax/long_poll/wallet/currency/"+currencyId+"/description",
		success: function(data) {
			
			$("#"+currencyId+"-description-text").html(data);
		}
	});
}

async function deleteCurrencyById(id) {
	
	let rest = await import("/resources/scripts/wallet/currencies/currency_rest.js?1");
	
	rest.restDeleteCurrencyById(id);
}

async function closeModal() {

	window.location.href = "/wallet/currencies";
	clearTimeout(closeTimerId);
}