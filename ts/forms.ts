import { Player } from "@minecraft/server";
import { customForm, resultType } from "./class";

type formsType = {
	[key: string]: {
		form: (player: Player) => customForm;
		response: (result: resultType, player: Player) => void;
	};
};

//フォームを作成して返す関数と、フォームのレスポンスを受け取って処理する関数を書く
export default <formsType>{
	example_form: {
		form: (player) => new customForm({ x: 100, y: 100 }, "example_form", true).addElement("button", 100, 100, 0, 0, "ボタン"),
		response: (result, player) => {
			if (result.selectedLabel === "ボタン") player.sendMessage("ボタンを押した！");
		},
	},
};
