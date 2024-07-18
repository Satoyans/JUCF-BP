import { Player } from "@minecraft/server";
import { customForm, resultType } from "./class";

export default <
	{
		[key: string]: {
			form: (player: Player) => customForm;
			response: (result: resultType, player: Player) => void;
		};
	}
>{
	scriptAPI_form: {
		form: (player) => new customForm({ x: 100, y: 100 }, "scriptAPI_form", true).addElement("button", 100, 100, 0, 0, "ボタン"),
		response: (result, player) => {
			if (result.selectedLabel === "ボタン") player.sendMessage("ボタンを押した！");
		},
	},
};
