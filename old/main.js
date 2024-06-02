import { system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import FORM_DATA from "./form_data";

system.afterEvents.scriptEventReceive.subscribe((ev) => {
	if (ev.id !== "cf:form") return;
	const sender = ev.sourceEntity;
	if (!sender) return;
	if (sender.typeId !== "minecraft:player") return;
	const form = new ActionFormData().title(ev.message !== "" ? ev.message : "タイトル?§c§u§s§t§o§m§f§o§r§m");
	for (let data of FORM_DATA) {
		const { text, image } = data;
		form.button(text, image);
	}

	form.show(sender).then((response) => {
		sender.runCommand(`tell @s res:${response.selection}`);
	});
});
