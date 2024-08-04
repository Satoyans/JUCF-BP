import { Player } from "@minecraft/server";
import { customForm, resultType } from "./class";

type formsType = {
	[key: string]: {
		form: (player: Player) => customForm;
		response: (result: resultType, player: Player) => void;
	};
};

//フォームを作成して返す関数と、フォームのレスポンスを受け取って処理する関数を書く
let id = 1;
export default <formsType>{
	example_form: {
		form: (player) => new customForm({ x: 100, y: 100 }, "example_form", true).addElement("button", 100, 100, 0, 0, "ボタン"),
		response: (result, player) => {
			if (result.selectedLabel === "ボタン") player.sendMessage("ボタンを押した！");
		},
	},
	アイテムレンダラーフォーム: {
		form: (player) => {
			return new customForm({ x: 100, y: 100 }, "アイテムレンダラーフォーム", true)
				.addElement("text", 100, 20, 0, 0, "テキスト！", "")
				.addElement("custom", 100, 100, 0, 0, { itemRendererOption: { aux: 65536 * 326 + 32768 }, hoverTextOption: { hover_text: "水:500円" } }, "")
				.addElement("custom", 20, 20, 100, 40, { itemRendererOption: { aux: 65536 * (id + 1) + 32768 }, textOption: { text: "+1" }, buttonOption: {} }, "+")
				.addElement("custom", 20, 20, -20, 40, { itemRendererOption: { aux: 65536 * (id - 1) + 32768 }, textOption: { text: "-1" }, buttonOption: {} }, "-");
		},
		response: (result, player) => {
			if (result.canceled) return;
			if (result.selectedLabel === "+") id += 1;
			if (result.selectedLabel === "-") id -= 1;
			player.runCommand("/scriptevent cfs:アイテムレンダラーフォーム");
		},
	},
};
