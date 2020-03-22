function addCurrencyFFD(currenciesList) {

	let currencyHeader = $(currenciesList).find(".currencies-list-header").first();

	if($(currencyHeader).find(".currency-name-input option[data-custom-hidden!=true]").length <= 0) return;
	
	let name = $(currencyHeader).find(".currency-name-input").val();
	let id = $(currencyHeader).find(".currency-name-input option[value='"+name+"']").attr("data-currency-id");
	let amount = $(currencyHeader).find(".currency-amount-input").val();
	let tag = $(currencyHeader).find(".currency-name-input option[value='"+name+"']").attr("data-currency-tag");
	
	if(isAuto(currenciesList)) {
		
		toggleAutoMode(currenciesList);
	}
	
	addCurrency(currenciesList, id, name, amount, tag);
	
	$(currencyHeader).find(".currency-amount-input").val("");
}

function loadCurrencies(currenciesList, currencies) {
	
	for(var currencyTag in currencies) {

		$.getJSON("../api/wallet/rest/currencies/"+currencyTag, (currencyJsonData)=> {
		
			addCurrency(currenciesList, currencyJsonData.id, currencyJsonData.name, currencies[currencyJsonData.tag], currencyJsonData.tag);
		});
	}
}

function addCurrency(currenciesList, id, name, amount, tag) {
	
	let currencyContainer = $(currenciesList).find(".currencies-list-container").first();
	let currencyHeader = $(currenciesList).find(".currencies-list-header").first();
	
	$(currencyHeader).find(".currency-name-input option[value="+name+"]").attr("data-custom-hidden", true).hide();
	
	if($(currencyHeader).find(".currency-name-input option[data-custom-hidden!=true]").length > 0) {

		let toSelect = $(currencyHeader).find(".currency-name-input option[data-custom-hidden!=true]").first();

		toSelect.prop("selected", true);
	}
	else {

		$(currencyHeader).find(".currency-name-input").prop("disabled", true);
	}
	
	$(currencyContainer).find(".currency-prototype").first().clone()
		.css("display", "flex")
		.css("opacity", "0")
		.attr("id", "currency-init")
		.removeClass("currency-prototype")
		.addClass("currency")
	.hide().appendTo(currencyContainer);

	if($(currenciesList).prop("data-custom-auto")) {
		
		$("#currency-init > .currency-amount").addClass("auto-text-field");
	}

	$("#currency-init").attr("data-currency-id", id);
	$("#currency-init").attr("data-currency-tag", tag);
	$("#currency-init").attr("data-currency-name", name);
	$("#currency-init").attr("data-clean-amount", amount);
	
	$("#currency-init > .currency-name").val(name);
	$("#currency-init > .currency-amount").text(amount+" "+tag);
	$("#currency-init > .currency-icon-first").attr("src", "/data/modules/wallet/currencies/"+id+"/icon.svg");
	
	if(isAuto($(currenciesList))) {
		
		$("#currency-init > .currency-icon-second").css("filter", "grayscale(100%) brightness(200%)");
	}
	
	showDiscount($("#currency-init"), $(currenciesList)[0].discount);
	
	$("#currency-init").show("fast").animate({"opacity": "1"}, 100, "swing");

	$("#currency-init").removeAttr("id");
}

function toggleAutoMode(currenciesList) {
	
	let currencyContainer = $(currenciesList).find(".currencies-list-container").first();
	let currencyHeader = $(currenciesList).find(".currencies-list-header").first();
	
	if($(currenciesList).prop("data-custom-auto")) {
		
		$(currencyContainer).find(".currency").find(".currency-amount").removeClass("auto-text-field");
		$(currencyHeader).find(".currency-icon-mode").attr("src", "../resources/images/common/custom-icon.svg");
		$(currencyContainer).find(".currency").find(".currency-icon-second").css("filter", "grayscale(0%) brightness(100%)");
		$(currenciesList).prop("data-custom-auto", false);
	}
	else {
		
		$(currencyContainer).find(".currency").find(".currency-amount").addClass("auto-text-field");
		$(currencyHeader).find(".currency-icon-mode").attr("src", "../resources/images/common/auto-icon.svg");
		$(currencyContainer).find(".currency").find(".currency-icon-second").css("filter", "grayscale(100%) brightness(200%)");
		$(currenciesList).prop("data-custom-auto", true);
	}
	
	$(currenciesList).trigger("AutoModeChange", [$(currenciesList).prop("data-custom-auto")]);
}

function setAuto(currenciesList, autoMode) {
	
	if(isAuto(currenciesList) != autoMode) {
		
		toggleAutoMode(currenciesList);
	}
}

function isAuto(currenciesList) {
	
	return $(currenciesList).prop("data-custom-auto");
}

function getCurrencies(currenciesList) {

	let currencyContainer = $(currenciesList).find(".currencies-list-container").first();

	let currencies = {}

	$.each($(currencyContainer).find(".currency"), (index, currency)=> {
		
		let tag = $(currency).attr("data-currency-tag");
		let amount = parseFloat($(currency).attr("data-clean-amount"));
		
		Object.defineProperty(currencies, tag, { value: amount, enumerable: true, configurable: true, writable: true });
	});

	return currencies;
}

function getCurrencyByTag(currenciesList, tag) {
	
	return $(currenciesList).find(".currencies-list-container").first().find(".currency[data-currency-tag='"+tag+"']");
}

function setCurrencyAmount(currenciesList, tag, amount) {
	
	var currency = getCurrencyByTag(currenciesList, tag)
	
	currency.find(".currency-amount").html(amount+" "+tag);
	currency.attr("data-clean-amount", amount);
	showDiscount(currency, $(currency)[0].discount);
}

function showAllDiscount(currenciesList) {
	
	var discount = $(currenciesList)[0].discount;

	$.each($(currenciesList).find(".currencies-list-container").first().find(".currency"), (index, value) => {
		
		showDiscount($(value), discount);
	});
}

function showDiscount(currency, discount) {
	
	var cleanAmount = parseFloat($(currency).attr("data-clean-amount"));
	var discountAmount = (cleanAmount * discount).toFixed(2);
	var finalAmount = (cleanAmount - discountAmount).toFixed(2);
	
	if(discountAmount > 0) {
		
		$(currency).find(".currency-amount").html(finalAmount+" <span style='color: #E12327;'>(-"+discountAmount+")</span> "+$(currency).attr("data-currency-tag"));
	}
	else {
		
		$(currency).find(".currency-amount").html(cleanAmount+" "+$(currency).attr("data-currency-tag"));
	}
}

function clearCurrencies(currenciesList) {
	
	$.each($(currenciesList).find(".currencies-list-container").first().find(".currency"), (index, value) => {
		
		removeCurrency(value);
	});
	
	if($(currenciesList).attr("data-custom-auto-default") != isAuto(currenciesList)) {
	
		toggleAutoMode(currenciesList);
	}
}

function removeCurrency(currency) {
	
	let currenciesList = $(currency).parent().parent();
	
	if(!isAuto(currenciesList)) {
		
		$(currenciesList).find(".currencies-list-header").first().find(".currency-name-input option[value='"+$(currency).attr('data-currency-name')+"']").show().attr("data-custom-hidden", false);
		$(currenciesList).find(".currencies-list-header").first().find(".currency-name-input").attr("disabled", false);
		$(currency).hide("fast").remove();
	}
}