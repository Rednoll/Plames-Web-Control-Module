package com.inwaiders.plames.modules.webcontroller.web.security;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginPageController {

	@GetMapping("/login")
	public String mainPage(Model model) {
		
		return "login";
	}
}
