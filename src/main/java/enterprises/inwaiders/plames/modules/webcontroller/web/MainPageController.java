package enterprises.inwaiders.plames.modules.webcontroller.web;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import enterprises.inwaiders.plames.domain.messenger.impl.MessengerImpl;

@Controller
public class MainPageController {

	@GetMapping("/")
	public String mainPage(Model model) {
		
		List<MessengerImpl> messengers = MessengerImpl.getAll();
		
		model.addAttribute("messengers", messengers);
		
		return "index";
	}
}
