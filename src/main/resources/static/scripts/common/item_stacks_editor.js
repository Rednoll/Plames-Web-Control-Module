function addStackFFD(stacksList) {

	if(!validateCreateStackName(stacksList)) return;

	let stacksListHeader = $(stacksList).find(".stacks-list-header");
	
	let nameInput = $(stacksListHeader).find(".stack-name-input");
	let amountInput = $(stacksListHeader).find(".stack-amount-input");
	
	var selectedItemOption = $("#items-names-datalist option[value='"+$(nameInput).val()+"']");
	var selectedItemId = parseInt(selectedItemOption.attr("data-item-id"));
	
	addStack(stacksList, selectedItemId, $(nameInput).val(), $(amountInput).val());
	
	$(nameInput).val("");
	$(amountInput).val("");
}

function loadStacks(stacksList, stacks) {
	
	for(var stackIndex in stacks) {

		var stack = stacks[stackIndex];

		addStack(stacksList, stack.item.id, "["+stack.item.target_application_name+"] "+stack.item.name, stack.quantity);
	}
}

function addStack(stacksList, id, name, amount) {

	let stacksListContainer = $(stacksList).find(".stacks-list-container");

	$(".item-stack-prototype").first().clone()
		.css("display", "flex")
		.css("opacity", "0")
		.attr("id", "item-stack-init")
		.addClass("item-stack")
		.removeClass("item-stack-prototype")
	.hide().appendTo(stacksListContainer);

	$("#item-stack-init > .stack-name").val(name);
	$("#item-stack-init > .stack-amount").val(amount);

	$("#item-stack-init").attr("data-item-id", id);
	$("#item-stack-init").attr("data-item-amount", amount);

	$("#item-stack-init").show("fast").animate({"opacity": "1"}, 100, "swing");

	$("#item-stack-init").removeAttr("id");
	
	let currenciesList = $(stacksList).parent().find(".currencies-list").first();
	
	if(isAuto($(currenciesList))) {
		
		viewStacksPrice(stacksList, currenciesList);
	}
}

function validateCreateStackName(stacksList) {

	let stacksListHeader = $(stacksList).find(".stacks-list-header");
	
	let nameInput = $(stacksListHeader).find(".stack-name-input");

	var selectedItemOption = $("#items-names-datalist option[value='"+$(nameInput).val()+"']");
	var selectedItemId = parseInt(selectedItemOption.attr("data-item-id"));

	if(selectedItemId) {

		$(nameInput).removeClass("custom-text-field-incorrect");

		return true;
	}
	else {

		$(nameInput).addClass("custom-text-field-incorrect");

		return false;
	}
}

function viewStacksPrice(stacksList, currenciesList) {
	
	$.each($(currenciesList).find(".currencies-list-container").first().find(".currency"), (index, value) => {
		
		setCurrencyAmount(currenciesList, $(value).attr("data-currency-tag"), 0);
	});
	
	$.each($(stacksList).find(".stacks-list-container").find(".item-stack"), (index, value)=> {
		
		$.ajax({
		
			headers: { 

				'Content-Type': 'application/json' 
			},
			type: "GET",
			url: "/api/market/rest/items/"+$(value).attr("data-item-id"),
			dataType: "json",
			async: false,
			success: function(jsonData) {
			
				if("price" in jsonData) {
				
					var currencies = jsonData.price.currencies;
					
					for(var currencyTag in currencies) {
						
						var currencyModal = getCurrencyByTag(currenciesList, currencyTag);
					
						if(currencyModal.length) {
							
							setCurrencyAmount(currenciesList, currencyTag, parseFloat($(currencyModal).attr("data-clean-amount"))+parseFloat(currencies[currencyTag]*$(value).attr("data-item-amount")));			
						}
						else {
							
							$.ajax({
		
								headers: { 

									'Content-Type': 'application/json' 
								},
								type: "GET",
								url: "/api/wallet/rest/currencies/"+currencyTag,
								dataType: "json",
								async: false,
								success: function(currencyJsonData) {
	
									addCurrency(currenciesList, currencyJsonData.id, currencyJsonData.name, currencies[currencyJsonData.tag]*$(value).attr("data-item-amount"), currencyJsonData.tag);
								}
							});
						}
					}
				}
			}
		});
	});
	
	$.each((currenciesList).find(".currencies-list-container").first().find(".currency"), (index, value) => {
		
		if($(value).attr("data-clean-amount") == "0") {
			
			removeCurrency(value);
		}
	});
	
	showAllDiscount($(currenciesList));
}

function getStacks(stacksList) {
	
	let itemStacks = new Array();
	
	$.each($(stacksList).find(".stacks-list-container").find(".item-stack"), (index, value)=> {

		let itemStack = {
				
			item_id: parseInt($(value).attr("data-item-id")),
			quantity: parseInt($(value).attr("data-item-amount"))
		}
		
		itemStacks[index] = itemStack;
	});
	
	return itemStacks;
}

function removeStack(stack) {
	
	let stacksList = $(stack).parent().parent();
	
	$(stack).hide('fast').remove();
	
	viewStacksPrice(stacksList, $(stacksList).parent().find(".currencies-list").first());
}