import { Player, system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
// import FORM_DATA from "./form_data";
import { FORM_DATA, customFormType } from "./class";
import { encode } from "./encode";

const aux_x = 14;
const aux_y = 29;
const aux_offset_x = -7;
const aux_offset_y = -22;

function createElements(form_data) {
	const { x, y, title, elements } = form_data;
	const form_flame_elements = [
		{
			//背景
			is_show_text: false,
			is_show_image: true,
			is_show_button: false,
			hover_text: "",
			w: x + aux_x - 8,
			h: y + aux_y - 8,
			x: aux_offset_x + 4,
			y: aux_offset_y + 4,
			text: "",
			texture: "textures/ui/translucent_black",
		},
		{
			//枠
			is_show_text: false,
			is_show_image: true,
			is_show_button: false,
			hover_text: "",
			w: x + aux_x,
			h: y + aux_y,
			x: aux_offset_x,
			y: aux_offset_y,
			text: "",
			texture: "textures/ui/dialog_background_hollow_3",
		},
		{
			//X
			is_show_text: false,
			is_show_image: false,
			is_show_button: false,
			is_show_close: true,
			hover_text: "",
			w: x + aux_x,
			h: y + aux_y,
			x: aux_offset_x,
			y: aux_offset_y,
			text: "",
			texture: "",
		},
		{
			//Title
			is_show_text: true,
			is_show_image: false,
			is_show_button: false,
			is_show_close: false,
			hover_text: "",
			w: x + aux_x,
			h: 30,
			x: aux_offset_x,
			y: aux_offset_y,
			text: `§0${title}`,
			texture: "",
		},
	] as customFormType.elementPropertiesTypes.all[];
	return encode(form_flame_elements.concat(...elements), { x, y });
}

//動的インポートができないからモジュール評価のタイミングで計算しちゃう
const FORM_ELEMENTS_DATA = createElements(FORM_DATA);

system.afterEvents.scriptEventReceive.subscribe(async (ev) => {
	if (ev.id !== "cf:form") return;
	const sender = ev.sourceEntity;
	if (!sender) return;
	if (!(sender instanceof Player) || sender.typeId !== "minecraft:player") return; //tsの型判定用 || script用

	const raw_title_string = ev.message !== "" ? ev.message : "§c§u§s§t§o§m§f§o§r§m";
	const form = new ActionFormData().title(raw_title_string);

	for (let data of FORM_ELEMENTS_DATA) {
		const { text, texture } = data;
		form.button(text, texture);
	}

	form.show(sender).then((response) => {
		sender.runCommand(`tell @s res:${response.selection}`);
	});
});
