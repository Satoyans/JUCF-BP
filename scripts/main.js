import { system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import FORM_DATA from "./form_data";
import { encode } from "./encode";

system.afterEvents.scriptEventReceive.subscribe((ev) => {
	if (ev.id !== "cf:form") return;
	const sender = ev.sourceEntity;
	if (!sender) return;
	if (sender.typeId !== "minecraft:player") return;
	const form = new ActionFormData().title(ev.message !== "" ? ev.message : "§c§u§s§t§o§m§f§o§r§m");
	const ui_elements = FORM_DATA[0];
	const form_size = FORM_DATA[1];
	for (let data of encode(ui_elements, form_size)) {
		const { text, image } = data;
		form.button(text, image);
	}

	form.show(sender).then((response) => {
		sender.runCommand(`tell @s res:${response.selection}`);
	});
});
