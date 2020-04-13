package enterprises.inwaiders.plames.modules.webcontroller.web.core.modules;

import java.util.Set;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import enterprises.inwaiders.plames.api.module.Module;
import enterprises.inwaiders.plames.api.module.ModuleRegistry;

@Controller
public class ModulesPageController {

	@GetMapping("/modules")
	public String modulesPage(Model model) {
		
		Set<Module> modules = ModuleRegistry.getModules();

		model.addAttribute("modules", modules);
		
		return "modules";
	}
}
