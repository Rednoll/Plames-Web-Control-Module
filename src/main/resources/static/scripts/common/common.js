async function commonInit() {
	
	if($(".currencies-list").length > 0) {
		
		$.getJSON("../api/wallet/rest/currencies", (currencies)=> {
			
			$.each($(".currencies-list"), (index, element)=> {
			
				$(element).load("../resources/style/price_currencies_editor.html?1", ()=> {

					let currencyHeader = $(element).find(".currencies-list-header").first();
					let nameInput = $(currencyHeader).find(".currency-name-input");

					for(var curI in currencies) {
						
						var currency = currencies[curI];
						
						$(nameInput).append("<option value='"+currency.name+"' text='"+currency.name+"' data-currency-id="+currency.id+" data-currency-tag='"+currency.tag+"'>"+currency.name+"</option>");
					}
					
					if($(element).attr("data-custom-auto") == "true") {
						
						$(element).prop("data-custom-auto", false);
						toggleAutoMode($(element));
					}
					
					$(currencyHeader).find(".currency-name-input :first").prop("selected", true);
				});
			});
		});
	}
	
	if($(".stacks-list").length > 0) {
		
		$.getJSON("../web/controller/ajax/market/item/aliases", (pairs)=> {
					
			for(var pairIndex in pairs){
						
				var pair = pairs[pairIndex];
					
				$("#items-names-datalist").append("<option value='["+pair.tan+"] "+pair.alias+"' text='["+pair.tan+"] "+pair.alias+"' data-item-id="+pair.id+">["+pair.tan+"] "+pair.alias+"</option>");
			}
		});
				
		$.each($(".stacks-list"), (index, element)=> {

			$(element).load("../resources/style/item_stacks_editor.html?1", ()=> {
					
				let stackHeader = $(".stacks-list").find(".stacks-list-header");
				
				let stackInput = $(stackHeader).find(".stack-name-input");
				
				$(stackInput).on('input', function(){
				
					$(stackInput).removeClass("custom-text-field-incorrect");
				});	
			});
		});
	}
	
	if($(".suffix").length > 0) {
		
		$.each($(".suffix"), (index, element)=> {
				
			$(element).css("display", "none");
				
			$(element).parent().find("input").on("input", (event)=> {
			
				let suffix = $(event.target).parent().find(".suffix");
				
				var width = getTextWidth($(event.target).val(), $(event.target).css("font"));
	
				$(suffix).css("display", width == 0 ? "none" : "inline-block")
				
				width = width - 2;
	
				$(suffix).css("left", width + 'px');
			});
			
			$(element).click((event)=> {
				
				$(event.target).parent().find("input").focus();
			});
		});
	}
	
	if($(".discount-parameter-field").length > 0) {
		
		$.each($(".discount-parameter-field"), (index, element)=> {

			$(element).on("input", (event)=> { 
		
				var percent = parseFloat($(event.target).val());
				var discountShare = percent/100;
			
				var currenciesList = $($(element)[0].currenciesList);
			
				$(currenciesList)[0].discount = discountShare;
		
				showAllDiscount($(currenciesList));
			});
		});
	}
}

function getTextWidth(text, font) {
	
	var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
	
	var context = canvas.getContext("2d");
		context.font = font;
		
	var metrics = context.measureText(text);
	
	return metrics.width;
}

function searchHighlighting(data, searchPattern) {
	
	data = String(data);
	searchPattern = String(searchPattern);
	
	let finalData = "";
	let cleanFinalDataLenght = 0;
	
	let loweredDataParts = data.toLowerCase().split(searchPattern.toLowerCase());
	
	for(var i in loweredDataParts) {
		
		finalData += data.substring(cleanFinalDataLenght, cleanFinalDataLenght+loweredDataParts[i].length);
		cleanFinalDataLenght += data.substring(cleanFinalDataLenght, cleanFinalDataLenght+loweredDataParts[i].length).length;
		
		if(i < loweredDataParts.length) {
		
			finalData += "<span style='background: #fff44f;'>"+data.substring(cleanFinalDataLenght, cleanFinalDataLenght+searchPattern.toLowerCase().length)+"</span>";
			cleanFinalDataLenght += data.substring(cleanFinalDataLenght, cleanFinalDataLenght+searchPattern.toLowerCase().length).length;
		}
	}
	
	return finalData;
}