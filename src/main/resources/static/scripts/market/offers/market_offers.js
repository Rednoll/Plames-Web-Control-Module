var lastModalEditOfferId = -1;
let staticPageSize = 12;

let lastContainer;

let offerStyler;

async function init() {
	
	$("#offer-search-row").hide();
	
	$("header").load("/resources/style/header.html?1");
	
	offerStyler = await import("/resources/scripts/market/offers/market_offer_styler.js");
	
	$("#modal-edit-offer-discount")[0].currenciesList = $("#edit-currencies-list")[0];
	$("#modal-add-offer-discount")[0].currenciesList = $("#add-currencies-list")[0];
	
	$("#add-currencies-list").on("AutoModeChange", (event, autoMode)=> {
		
		if(autoMode) {
			
			viewStacksPrice($("#add-stacks-list"), $("#add-currencies-list"));
		}
	});
	
	$("#edit-currencies-list").on("AutoModeChange", (event, autoMode)=> {
		
		if(autoMode) {
			
			viewStacksPrice($("#edit-stacks-list"), $("#edit-currencies-list"));
		}
	});
	
	let searchParams = new URLSearchParams(window.location.search);
		
	staticPageSize = parseInt(searchParams.has("pageSize") ? searchParams.get("pageSize") : 12);
	pageNumber = parseInt(searchParams.has("page") ? searchParams.get("page") : 0);
	
	goPage(pageNumber);
}

async function sendSearchRequest() {
	
	goPage(0, staticPageSize);
}

async function toggleSearch() {

	if($("#offer-search-row").prop("data-opened")) {
		
		$("#offer-search-row").animate({"opacity": 0}, 200, "swing").hide("normal").prop("data-opened", false);
		
		$("#offer-search-name").val("");
		$("#offer-search-id").val("");
	}
	else {
		
		$("#offer-search-row").show("normal").animate({'opacity': 1}, 200, 'swing').prop("data-opened", true);
	}
}

async function nextPage() {
	
	var pageNumber = parseInt($("#scroll-page-field").val());

	goPage($(".scroll-unit").length < staticPageSize ? pageNumber : pageNumber+1);
}

async function preventPage() {
	
	var pageNumber = parseInt($("#scroll-page-field").val());

	goPage(pageNumber > 0 ? pageNumber-1 : 0);
}

async function goPage(pageNumber) {
	
	loadOffersList(pageNumber, staticPageSize);
	$("#scroll-page-field").val(pageNumber);
}

async function loadOffersList(pageNumber, pageSize) {

	let name = $("#offer-search-name").val();
	let id = $("#offer-search-id").val();
	
	$.getJSON("../web/controller/ajax/market/offer?page="+pageNumber+"&pageSize="+pageSize+"&name="+name+"&id="+id, (data)=> {
		
		$(".scroll-unit").not("#offer-prototype").remove();
		lastContainer = document.getElementById("offer-search-row");
			
		for(var offerIndex in data) {
		
			let offer = data[offerIndex];
		
			viewOffer(offer);
		}
	});
}

function viewOffer(offer) {
	
	$("#offer-prototype").clone()
		.css("display", "flex")
		.attr("id", "offer-init")
		.addClass("scroll-unit")
		.addClass("offer-container")
	.hide().insertAfter(lastContainer);
	
	$("#offer-init").attr("data-offer-id", offer.id);
	
	$("#offer-init > .offer-row-container").attr("id", offer.id+"-row-container");
	
	let searchName = $("#offer-search-name").val();
	$("#offer-init > .offer-row-container > .offer-row-name").html(searchName.length > 0 ? searchHighlighting(offer.name, searchName) : offer.name);
	
	let searchId = $("#offer-search-id").val();
	$("#offer-init > .offer-row-container > .offer-row-id").html(searchId.length > 0 ? searchHighlighting(offer.id, searchId) : offer.id);
	
	$("#offer-init > .offer-row-container > .offer-row-discount").text((offer.discount*100).toFixed(2)+"%");
	$("#offer-init > .offer-row-container > .offer-row-status").attr("id", "offer-"+offer.id+"-status-text");
	
	$("#offer-init > .offer-row-container > .offer-row-sub-container > .offer-status-toggle")
		.attr("checked", offer.active)
		.attr("data-offer-id", offer.id)
		.attr("id", "offer-"+offer.id+"-status-toggle");
		
	$("#offer-init > .offer-row-container > .offer-row-sub-container > .offer-status-toggle-label").attr("for", "offer-"+offer.id+"-status-toggle");
	
	if(offer.active) {
	
		offerStyler.setActiveStyle(offer.id);
	}
	else {
		
		offerStyler.setInactiveStyle(offer.id);
	}

	$("#offer-init").show();
	lastContainer = document.getElementById("offer-init");
	$("#offer-init").attr("id", offer.id+"-container");
}

async function toggleOfferRow(container) {

	dataContainer = $(container).find(".offer-data-container");

	if($(container).prop("data-opened")) {

		$(container).prop("data-opened", false);

		$(dataContainer).animate({"opacity": "0"}, 125, "linear", ()=> {

			$(dataContainer).css("display", "none");
			$(container).animate({"height": "32"}, 500, "swing")
		});
	}
	else {

		$(dataContainer).find(".item-settings-description").html("Сбор данных");
		
		loadOfferDescription($(container));

		$(container).animate({"height": "250"}, 500, "swing", ()=> $(dataContainer).animate({"opacity": "1"}, 125, "linear"));
		$(container).prop("data-opened", true);

		$(dataContainer).css("display", "inline-block");
	}
}

async function loadOfferDescription(container) {
	
	$.ajax({

		type: "GET",
		url: "../web/controller/ajax/market/offer/"+$(container).attr("data-offer-id")+"/description",
		success: function(data) {
			
			$(container).find(".offer-data-container").find(".offer-data-description").html(data);
		}
	});
}

async function cancelCreateOffer() {

	clearModalCreateOffer();
}

async function createOffer() {

	let itemStacks = getStacks($("#add-stacks-list"));
	
	let priceCurrencies = getCurrencies($("#add-currencies-list"));
		
	let price = {
		
		currencies: priceCurrencies
	}

	let discount = parseFloat($("#modal-add-offer-discount").val() == "" ? 0 : $("#modal-add-offer-discount").val());

	discount = discount / 100;

	let data = {

		name: $("#modal-add-offer-name").val(),
		item_stacks: itemStacks,
		discount: discount
	}
	
	if(!isAuto($("#add-currencies-list"))) {
	
		Object.defineProperty(data, "custom_price", { value: price, enumerable: true, configurable: true, writable: true });
	}
	
	let rest = await import("/resources/scripts/market/offers/offer_rest.js?1");

	rest.restCreateOffer(JSON.stringify(data));

	clearModalCreateOffer();
}

async function openModalEditOffer(id) {
	
	lastModalEditOfferId = id;
	
	window.location.href = "/market/offers#modal-background-edit-offer";
	
	let discount;
	
	$.ajax({
		
		headers: {

			'Content-Type': 'application/json' 
		},
		type: "GET",
		url: "/api/market/rest/offers/"+id,
		dataType: "json",
		async: false,
		
		success: function(data) {
		
			$("#modal-edit-offer-name").val(data.name);

			let stacks = data.item_stacks;

			loadStacks($("#edit-stacks-list"), stacks);

			if("custom_price" in data) {

				var currencies = data.custom_price.currencies;

				let currenciesList = $("#edit-currencies-list");
			
				clearCurrencies(currenciesList);
				loadCurrencies(currenciesList, currencies);
			}
			else {
				
				setAuto($("#edit-currencies-list"), true);
				viewStacksPrice($("#edit-stacks-list"), $("#edit-currencies-list"));
			}

			if("discount" in data) {
				
				discount = data.discount;
				
				if(discount > 0) {
				
					$("#modal-edit-offer-discount").val(discount*100);
				}
			}
		}
	});
	
	setTimeout(()=> {
		
		var event = document.createEvent("Event");
		event.initEvent("input", true, true);
		$("#modal-edit-offer-discount")[0].dispatchEvent(event);
		
		$("#edit-currencies-list")[0].discount = discount;
		showAllDiscount($("#edit-currencies-list"));
		
	}, 500);
}

async function saveModalEditOffer() {
	
	let rest = await import("/resources/scripts/market/offers/offer_rest.js?1");
	
	let name = $("#modal-edit-offer-name").val();
	let id = lastModalEditOfferId;

	let priceCurrencies = getCurrencies($("#edit-currencies-list"));
	
	let price = {
		
		currencies: priceCurrencies
	}
	
	let itemStacks = getStacks($("#edit-stacks-list"));
	
	let discount = parseFloat($("#modal-edit-offer-discount").val() == "" ? 0 : $("#modal-edit-offer-discount").val());

	discount = discount / 100;
	
	let offer = {
		
		name: name,
		item_stacks: itemStacks,
		discount: discount
	}
	
	if(!isAuto($("#edit-currencies-list"))) {
	
		Object.defineProperty(offer, "custom_price", { value: price, enumerable: true, configurable: true, writable: true });
	}
	else {
		
		Object.defineProperty(offer, "custom_price", { value: null, enumerable: true, configurable: true, writable: true });
	}
	
	rest.restSaveOffer(id, JSON.stringify(offer), ()=> closeModal());
}

async function clearModalCreateOffer() {

	$(".item-stack").not(document.getElementById("item-stack-prototype")).remove();

	$("#create-item-stack-name").val("");
	$("#create-item-stack-amount").val("");
	
	clearCurrencies($("#add-currencies-list"));

	$("#modal-edit-offer-discount").val("");
}

async function deleteOfferById(id) {

	let rest = await import("/resources/scripts/market/offers/offer_rest.js?1");

	rest.restDeleteOfferById(id);
}

async function closeModal() {

	window.location.href = "/market/offers";
}