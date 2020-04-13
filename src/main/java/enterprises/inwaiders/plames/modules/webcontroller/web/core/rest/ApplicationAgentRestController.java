package enterprises.inwaiders.plames.modules.webcontroller.web.core.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import enterprises.inwaiders.plames.api.application.ApplicationAgent;
import enterprises.inwaiders.plames.api.application.ApplicationAgentRegistry;

@RestController
@RequestMapping("/api/core/rest")
public class ApplicationAgentRestController {

	@Autowired
	private ObjectMapper mapper;
	
	@GetMapping(value = "/application_agents/{sign}")
	public ResponseEntity<ObjectNode> get(@PathVariable String sign) {
		
		ApplicationAgent agent = ApplicationAgentRegistry.getBySign(sign);
		
		if(agent == null) {
			
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		
		ObjectNode jsonAgent = mapper.createObjectNode();
			jsonAgent.put("tag", agent.getTag());
			jsonAgent.put("display_name", agent.getDisplayName());
		
		return new ResponseEntity<ObjectNode>(jsonAgent, HttpStatus.OK);
	}
}