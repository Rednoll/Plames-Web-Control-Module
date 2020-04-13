package enterprises.inwaiders.plames.modules.webcontroller.web.messenger.common.ajax;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;

import enterprises.inwaiders.plames.api.messenger.Messenger;
import enterprises.inwaiders.plames.api.messenger.profile.UserProfile;
import enterprises.inwaiders.plames.domain.messenger.impl.MessengerImpl;

@RestController
@RequestMapping("web/controller/ajax/messenger")
public class MessengerWebAjax {

	@PostMapping("/active")
	public ResponseEntity activeToggle(@RequestBody JsonNode json) {
		
		//TODO: { "messenger": "vk", "active": true } ...
		
		if(!json.has("messenger") || !json.get("messenger").isTextual()) return new ResponseEntity(HttpStatus.BAD_REQUEST);
		if(!json.has("active") || !json.get("active").isBoolean()) return new ResponseEntity(HttpStatus.BAD_REQUEST);
	
		String messengerType = json.get("messenger").asText();
		boolean active = json.get("active").asBoolean();
	
		Messenger<UserProfile> messenger = MessengerImpl.getByType(messengerType);
	
		if(messenger != null) {
			
			messenger.setActive(active);
			messenger.save();
		
			return new ResponseEntity(HttpStatus.OK);
		}
		
		return new ResponseEntity(HttpStatus.NOT_FOUND);
	}
	
	@PostMapping(value = "/description", consumes = "application/json;charset=UTF-8", produces = "text/plain;charset=UTF-8") //Not GET cause JQuery Ajax put body into URL if use a GET type of request
	public ResponseEntity<String> description(@RequestBody JsonNode json) {

		if(!json.has("messenger") || !json.get("messenger").isTextual()) return new ResponseEntity(HttpStatus.BAD_REQUEST);
		
		String messengerType = json.get("messenger").asText();
		
		Messenger messenger = MessengerImpl.getByType(messengerType);
	
		String description = messenger.getWebDescription();
	
		return new ResponseEntity<String>(description, HttpStatus.OK);
	}
}
