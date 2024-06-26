import { Player, system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { customForm } from "./class";

system.afterEvents.scriptEventReceive.subscribe(async (ev) => {
	if (ev.id !== "cf:form") return;
	const sender = ev.sourceEntity;
	if (!sender) return;
	if (!(sender instanceof Player) || sender.typeId !== "minecraft:player") return; //tsの型判定用 || script用

	a(sender, 0);
});

async function a(sender: Player, num: number) {
	const custom_form = new customForm({ x: 300 + num * 7.5, y: 150 + num * 5 }, "カスタムなタイトル")
		.addElement("image", 200, 50, 50, 25, "textures/blocks/beacon", "ビーコンの画像")
		.addElement("text", 200, 50, 50, 25, "custom form class!", "ビーコン上のテキスト")
		.addElement(
			"custom",
			200,
			50,
			50,
			100,
			{
				buttonOption: {},
				hoverTextOption: { hover_text: "ホバーテキスト\n改行も可能！" },
				imageOption: { texture: "textures/blocks/iron_block" },
				textOption: { text: "次の画面" },
			},
			"次の画面"
		)
		.addElement("text", 50, 50, -75, 25, "外にも\n配置できる")
		.addElement("image", 50, 50, num * 10, 150, "textures/items/apple");

	const result = await custom_form.sendPlayer(sender);
	console.warn(`isCansel:${result.canceled}`);
	console.warn(result.selectedLabel);

	if (result.selectedLabel !== "次の画面") return;
	a(sender, num + 1);
}
