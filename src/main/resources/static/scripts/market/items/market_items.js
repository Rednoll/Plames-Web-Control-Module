let lastModalEditItemId = -1;
let staticPageSize = 12;

let lastContainer;

let itemStyler;

async function init() {
	
	$("#item-search-row").hide();
	
	$("header").load("/resources/style/header.html?1");
	
	itemStyler = await import("/resources/scripts/market/items/market_item_styler.js?1");
	
	let searchParams = new URLSearchParams(window.location.search);
		
	staticPageSize = parseInt(searchParams.has("pageSize") ? searchParams.get("pageSize") : 12);
	pageNumber = parseInt(searchParams.has("page") ? searchParams.get("page") : 0);
	
	goPage(pageNumber);
}

async function sendSearchRequest() {
	
	goPage(0, staticPageSize);
}

async function toggleItemRow(container) {
	
	settingsContainer = $(container).find(".item-settings-container").first();

	if($(container).prop("data-opened")) {
		
		$(container).prop("data-opened", false);
		
		$(settingsContainer).animate({"opacity": "0"}, 125, "linear", ()=> { 
		
			$(settingsContainer).css("display", "none");
			$(container).animate({"height": "32"}, 500, "swing")
		});
	}
	else {
	
		$(settingsContainer).find(".item-settings-description").html("Сбор данных");
		
		loadItemDescription($(container));
		
		$(container).animate({"height": "250"}, 500, "swing", ()=> $(settingsContainer).animate({"opacity": "1"}, 125, "linear"));
		$(container).prop("data-opened", true);
	
		$(settingsContainer).css("display", "inline-block");
	}
}

async function toggleSearch() {

	if($("#item-search-row").prop("data-opened")) {
		
		$("#item-search-row").animate({"opacity": 0}, 200, "swing").hide("normal").prop("data-opened", false);
		
		$("#item-search-name").val("");
		$("#item-search-id").val("");
		$("#item-search-tan").val("");
	}
	else {
		
		$("#item-search-row").show("normal").animate({'opacity': 1}, 200, 'swing').prop("data-opened", true);
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
	
	loadItemsList(pageNumber, staticPageSize);
	$("#scroll-page-field").val(pageNumber);
}

async function loadItemsList(pageNumber, pageSize) {

	let name = $("#item-search-name").val();
	let id = $("#item-search-id").val();
	let tan = $("#item-search-tan").val();
	
	let itemStyler = await import("/resources/scripts/market/items/market_item_styler.js");
	
	$.getJSON("../web/controller/ajax/market/item?page="+pageNumber+"&pageSize="+pageSize+"&name="+name+"&id="+id+"&tan="+tan, (data)=> {
		
		$(".scroll-unit").not("#item-prototype").remove();
		lastContainer = document.getElementById("item-search-row");
			
		for(var itemIndex in data) {
		
			let item = data[itemIndex];
		
			viewItem(item);
		}
	});
}

function viewItem(item) {
	
	$("#item-prototype").clone()
		.css("display", "flex")
		.attr("id", "item-init")
		.addClass("scroll-unit")
		.addClass("item-container")
	.hide().insertAfter(lastContainer);
	
	$("#item-init").attr("data-item-id", item.id);
	
	$("#item-init > .item-row-container").attr("id", item.id+"-row-container");
				
	$("#item-init > .item-row-container > .item-row-icon")
		.attr("src", "/resources/images/applications/"+item.target_application_name+"-logo.svg")
		.attr("onclick", "toggleItemRow($(this).closest('.item-container'));");
	
	let searchName = $("#item-search-name").val();
	$("#item-init > .item-row-container > .item-row-name").html(searchName.length > 0 ? searchHighlighting(item.name, searchName) : item.name);
	
	let searchId = $("#item-search-id").val();
	$("#item-init > .item-row-container > .item-row-id").html(searchId.length > 0 ? searchHighlighting(item.id, searchId) : item.id);
	
	let searchTan = $("#item-search-tan").val();
	$("#item-init > .item-row-container > .item-row-tan").html(searchTan.length > 0 ? searchHighlighting(item.target_application_name, searchTan) : item.target_application_name);
	
	$("#item-init > .item-row-container > .item-row-status").attr("id", "item-"+item.id+"-status-text");
	
	$("#item-init > .item-row-container > .item-row-sub-container > .item-status-toggle")
		.attr("checked", item.active)
		.attr("data-item-id", item.id)
		.attr("id", "item-"+item.id+"-status-toggle");
		
	$("#item-init > .item-row-container > .item-row-sub-container > .item-status-toggle-label").attr("for", "item-"+item.id+"-status-toggle");
	
	if(item.active) {
		
		itemStyler.setActiveStyle(item.id);
	}
	else {
		
		itemStyler.setInactiveStyle(item.id);
	}

	$("#item-init").show();
	lastContainer = document.getElementById("item-init");
	$("#item-init").attr("id", item.id+"-container");
}

async function createItem() {
	
	let rest = await import("/resources/scripts/market/items/item_rest.js?1");

	let priceCurrencies = getCurrencies($("#add-currency-list"));
	
	let price = {
		
		currencies: priceCurrencies
	}

	let data = {

		name: $("#modal-add-item-name").val(),
		target_application_name: $("#modal-add-item-tan").val(),
		price: price
	}
	
	rest.restCreateItem(JSON.stringify(data));
	
	closeModal();
}

async function openModalEditItem(id) {
	
	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "GET",
		url: "/api/market/rest/items/"+id,
		dataType: "json",
		
		success: function(data) {
		
			$("#modal-edit-item-name").val(data.name);
			$("#modal-edit-item-tan").val(data.target_application_name);
			$("#modal-edit-item-metadata").val(data.metadata);

			if("price" in data) {

				var currencies = data.price.currencies;

				let currenciesList = $("#edit-currencies-list");
			
				clearCurrencies(currenciesList);
				loadCurrencies(currenciesList, currencies);
			}
		}
	});
	
	lastModalEditItemId = id;
	
	window.location.href = "/market/items#modal-background-edit-item";
}

async function saveModalEditItem() {
	
	let rest = await import("/resources/scripts/market/items/item_rest.js?1");
	
	let name = $("#modal-edit-item-name").val();
	let id = lastModalEditItemId;
	let tan = $("#modal-edit-item-tan").val();
	
	let priceCurrencies = getCurrencies($("#edit-currencies-list"));
	
	let price = {
		
		currencies: priceCurrencies
	}
	
	let item = {
		
		name: name,
		target_application_name: tan,
		price: price
	}
	
	rest.restSaveItem(id, JSON.stringify(item), ()=> closeModal());
}

async function loadItemDescription(container) {
	
	$.ajax({

		type: "GET",
		url: "../web/controller/ajax/market/item/"+$(container).attr("data-item-id")+"/description",
		success: function(data) {
			
			$(container).find(".item-settings-container").find(".item-settings-description").html(data);
		}
	});
}

async function deleteItemById(id) {
	
	let rest = await import("/resources/scripts/market/items/item_rest.js?1");
	
	rest.restDeleteItemById(id);
}

async function closeModal() {

	window.location.href = "/market/items";
}