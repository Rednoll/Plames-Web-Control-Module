async function init() {
	
	$("header").load("/resources/style/header.html?1");
	
	let currencyStyler = await import("/resources/scripts/wallet/currencies/wallet_currency_styler.js");

	$(".currency-status-toggle").each(function(i, elem) {
		
		var currencyId = $(elem).data("currency-id");
		
		if($(elem).is(':checked')) {

			currencyStyler.setActiveStyle(currencyId);
		}
		else {
			
			currencyStyler.setInactiveStyle(currencyId);
		}
	});

	$("#modal-add-currency-type").change(function() {
		
		selectedType = $("#modal-add-currency-type option:selected").text();
		
		if(selectedType == "microtransaction") {
			
			$(".modal-currency-table-row-multiplier").css("display", "flex");
		}
		else {
			
			$(".modal-currency-table-row-multiplier").css("display", "none");
		}
	});
	
	$("#add-currency-icon-uploader").on("change", ()=> {
		
		files = $("#add-currency-icon-uploader").prop("files");
		
		if(FileReader && files && files.length) {
			
			var fr = new FileReader();
		
			fr.onload = function () {
				document.getElementById("modal-add-currency-icon").src = fr.result;
			}
			
			fr.readAsDataURL(files[0]);
		}
	});
	
	$("#edit-currency-icon-uploader").on("change", ()=> {
		
		files = $("#edit-currency-icon-uploader").prop("files");
		
		if(FileReader && files && files.length) {
			
			var fr = new FileReader();
		
			fr.onload = function () {
				document.getElementById("modal-edit-currency-icon").src = fr.result;
			}
			
			fr.readAsDataURL(files[0]);
		}
	});
	
	$("#edit-currency-form").submit(function(event) {
	
		setTimeout(()=> document.location.href="../wallet/currencies#", 250);
	});
	
	$("#add-currency-form").submit(function(event) {
	
		setTimeout(()=> document.location.href="../wallet/currencies#", 250);
	});
}