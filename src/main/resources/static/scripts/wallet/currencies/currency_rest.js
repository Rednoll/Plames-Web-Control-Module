export function restDeleteCurrencyById(id) {
	
	$.ajax({
		
		headers: { 

			'Content-Type': 'application/json' 
		},
		type: "DELETE",
		url: "/api/wallet/rest/currencies/"+id
	})
}