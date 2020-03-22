let lastModalEditPaygateId = -1;
let staticPageSize = 12;

let lastContainer;

let paygateStyler;

async function init() {
	
	$("#paygate-search-row").hide();
	
	$("header").load("/resources/style/header.html?1");
	
	paygateStyler = await import("/resources/scripts/robokassa/paygates/robokassa_paygate_styler.js?1");
	
	let searchParams = new URLSearchParams(window.location.search);
		
	staticPageSize = parseInt(searchParams.has("pageSize") ? searchParams.get("pageSize") : 12);
	pageNumber = parseInt(searchParams.has("page") ? searchParams.get("page") : 0);
	
	goPage(pageNumber);
}

async function sendSearchRequest() {
	
	goPage(0, staticPageSize);
}

async function togglePaygateRow(container) {
	
	settingsContainer = $(container).find(".paygate-settings-container").first();

	if($(container).prop("data-opened")) {
		
		$(container).prop("data-opened", false);
		
		$(settingsContainer).animate({"opacity": "0"}, 125, "linear", ()=> { 
		
			$(settingsContainer).css("display", "none");
			$(container).animate({"height": "32"}, 500, "swing")
		});
	}
	else {
	
		$(settingsContainer).find(".paygate-settings-description").html("Сбор данных");
		
		loadPaygateDescription($(container));
		
		$(container).animate({"height": "250"}, 500, "swing", ()=> $(settingsContainer).animate({"opacity": "1"}, 125, "linear"));
		$(container).prop("data-opened", true);
	
		$(settingsContainer).css("display", "inline-block");
	}
}

async function toggleSearch() {

	if($("#paygate-search-row").prop("data-opened")) {
		
		$("#paygate-search-row").animate({"opacity": 0}, 200, "swing").hide("normal").prop("data-opened", false);
		
		$("#paygate-search-name").val("");
		$("#paygate-search-merchant-login").val("");
		$("#paygate-search-test").val("");
		$("#paygate-search-id").val("");
	}
	else {
		
		$("#paygate-search-row").show("normal").animate({'opacity': 1}, 200, 'swing').prop("data-opened", true);
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
	
	loadPaygatesList(pageNumber, staticPageSize);
	$("#scroll-page-field").val(pageNumber);
}

async function loadPaygatesList(pageNumber, pageSize) {

	let name = $("#paygate-search-name").val();
	let merchantLogin = $("#paygate-search-merchant-login").val();
	let test = $("#paygate-search-test").val();
	let id = $("#paygate-search-id").val();
	
	let paygateStyler = await import("/resources/scripts/robokassa/paygates/robokassa_paygate_styler.js");
	
	$.getJSON("../web/controller/ajax/robokassa/paygate?page="+pageNumber+"&pageSize="+pageSize+"&id="+id+"&name="+name+"&merchant_login="+merchantLogin+"&test_mode="+test, (data)=> {
		
		$(".scroll-unit").not("#paygate-prototype").remove();
		lastContainer = document.getElementById("paygate-search-row");
			
		for(var paygateIndex in data) {
		
			let paygate = data[paygateIndex];
		
			viewPaygate(paygate);
		}
	});
}

function viewPaygate(paygate) {
	
	$("#paygate-prototype").clone()
		.css("display", "flex")
		.attr("id", "paygate-init")
		.addClass("scroll-unit")
		.addClass("paygate-container")
	.hide().insertAfter(lastContainer);
	
	$("#paygate-init").attr("data-paygate-id", paygate.id);
	
	$("#paygate-init > .paygate-row-container").attr("id", paygate.id+"-row-container");
	
	$("#paygate-init > .paygate-row-container > .paygate-row-icon").attr("onclick", "togglePaygateRow($(this).closest('.paygate-container'));");
	
	let searchName = $("#paygate-search-name").val();
	$("#paygate-init > .paygate-row-container > .paygate-row-name").html(searchName.length > 0 ? searchHighlighting(paygate.name, searchName) : paygate.name);
	
	let searchId = $("#paygate-search-id").val();
	$("#paygate-init > .paygate-row-container > .paygate-row-id").html(searchId.length > 0 ? searchHighlighting(paygate.id, searchId) : paygate.id);

	let searchMerchantLogin = $("#paygate-search-merchant-login").val();
	$("#paygate-init > .paygate-row-container > .paygate-row-merchant-login").html(searchMerchantLogin.length > 0 ? searchHighlighting(paygate.merchant_login, searchMerchantLogin) : paygate.merchant_login);
	
	let searchTest = $("#paygate-search-test").val();
	$("#paygate-init > .paygate-row-container > .paygate-row-test").html(searchTest.length > 0 ? searchHighlighting(paygate.test_mode, searchTest) : paygate.test_mode);
	
	$("#paygate-init > .paygate-row-container > .paygate-row-status").attr("id", "paygate-"+paygate.id+"-status-text");
	
	$("#paygate-init > .paygate-row-container > .paygate-row-sub-container > .paygate-status-toggle")
		.attr("checked", paygate.active)
		.attr("data-paygate-id", paygate.id)
		.attr("id", "paygate-"+paygate.id+"-status-toggle");
		
	$("#paygate-init > .paygate-row-container > .paygate-row-sub-container > .paygate-status-toggle-label").attr("for", "paygate-"+paygate.id+"-status-toggle");
	
	if(paygate.active) {
		
		paygateStyler.setActiveStyle(paygate.id);
	}
	else {
		
		paygateStyler.setInactiveStyle(paygate.id);
	}

	$("#paygate-init").show();
	lastContainer = document.getElementById("paygate-init");
	$("#paygate-init").attr("id", paygate.id+"-container");
}

async function createPaygate() {
	
	let rest = await import("/resources/scripts/robokassa/paygates/paygate_rest.js?1");

	let data = {

		name: $("#modal-add-paygate-name").val(),
		merchant_login: $("#modal-add-paygate-merchant-login").val(),
		test_mode: $("#modal-add-paygate-test")[0].checked,
		pass1: $("#modal-add-paygate-pass1").val(),
		pass2: $("#modal-add-paygate-pass2").val()	
	}
	
	rest.restCreatePaygate(JSON.stringify(data));
	
	closeModal();
}

async function openModalEditPaygate(id) {
	
	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "GET",
		url: "/api/robokassa/rest/paygates/"+id,
		dataType: "json",
		
		success: function(data) {
		
			$("#modal-edit-paygate-name").val(data.name);
			$("#modal-edit-paygate-test")[0].checked = data.test_mode;
			$("#modal-edit-paygate-pass1").val(data.pass1);
			$("#modal-edit-paygate-pass2").val(data.pass2);	
		}
	});
	
	lastModalEditPaygateId = id;
	
	window.location.href = "/robokassa/paygates#modal-background-edit-paygate";
}

async function saveModalEditPaygate() {
	
	let rest = await import("/resources/scripts/robokassa/paygates/paygate_rest.js?1");
	
	let name = $("#modal-edit-paygate-name").val();
	let id = lastModalEditPaygateId;
	let test = $("#modal-edit-paygate-test")[0].checked;
	let pass1 = $("#modal-edit-paygate-pass1").val();
	let pass2 = $("#modal-edit-paygate-pass2").val();
	
	let paygate = {
		
		name: name,
		test_mode: test,
		pass1: pass1,
		pass2: pass2
	}
	
	rest.restSavePaygate(id, JSON.stringify(paygate), ()=> closeModal());
}

async function loadPaygateDescription(container) {
	
	$.ajax({

		type: "GET",
		url: "../web/controller/ajax/robokassa/paygate/"+$(container).attr("data-paygate-id")+"/description",
		success: function(data) {
			
			$(container).find(".paygate-settings-container").find(".paygate-settings-description").html(data);
		}
	});
}

async function deletePaygateById(id) {
	
	let rest = await import("/resources/scripts/robokassa/paygates/paygate_rest.js?1");
	
	rest.restDeletePaygateById(id);
}

async function closeModal() {

	window.location.href = "/robokassa/paygates";
}