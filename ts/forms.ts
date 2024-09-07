import { Player, system, world } from "@minecraft/server";
import { customForm, resultType } from "./class";
import { typeIdToID } from "./typeIds.js";
import { FormCancelationReason, uiManager } from "@minecraft/server-ui";

type formsType =
	| {
			//v1.0.0
			[key: string]: {
				form: (player: Player) => customForm;
				response: (result: resultType, player: Player) => void;
			};
	  }
	| {
			//v1.1.0 メッセージを使用可能にした
			[key: string]: {
				form: (player: Player, message: string) => customForm;
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
	アイテムレンダラーフォーム: {
		form: (player, message) => {
			//メッセージからぺージを取得
			let page = 0;
			console.warn(message);
			try {
				const parsed = JSON.parse(message);
				const parsed_page = parsed["page"];
				if (parsed_page !== undefined && !Number.isNaN(Number(parsed_page))) page = Number(parsed_page);
			} catch (e) {}

			//左右のボタン作成
			const form = new customForm({ x: 320, y: 160 }, "アイテムレンダラーフォーム", true)
				.addElement("custom", 30, 30, 320, 65, { imageOption: { texture: "textures/ui/arrow_right" }, buttonOption: {} }, `+,${page + 1}`)
				.addElement("custom", 30, 30, -30, 65, { imageOption: { texture: "textures/ui/arrow_left" }, buttonOption: {} }, `-,${page - 1}`);

			//for文で回す
			const IDTotypeId = new Map<number, string>(Array.from(typeIdToID.keys()).map((v) => [typeIdToID.get(v)!, v]));
			for (let n in Array(10).fill(null)) {
				let n_num = Number(n);
				for (let m in Array(20).fill(null)) {
					let m_num = Number(m);
					let id = page * 20 * 10 + n_num * 20 + m_num;
					//アイテム
					form.addElement("custom", 16, 16, 16 * m_num, 16 * n_num, {
						itemRendererOption: { aux: id * 65536 },
						hoverTextOption: { hover_text: `aux:${id * 65536}\nid:${id}\nname:${IDTotypeId.get(id)}` },
					});
				}
			}

			//下にぺージのテキスト追加
			form.addElement("text", 320, 20, 0, 160, `page:${page}(${page * 20 * 10} ~ ${(page + 1) * 20 * 10 - 1})`);
			return form;
		},
		response: (result, player) => {
			if (result.canceled) return;
			if (!result.selectedLabel) return;
			player.runCommand(`/scriptevent cfs:アイテムレンダラーフォーム {"page":${result.selectedLabel.slice(2)}}`);
		},
	},
	//@minecraft/server-ui@1.3.0-betaのUiManagerが必要
	//更新フォーム: {
	//	form: (player: Player, message: string) => {
	//		let count = Number(message);
	//		if (Number.isNaN(count)) count = 0;
	//		const form = new customForm({ x: 200, y: 150 }, "チャット", true);
	//		form.addElement("text", 10, 10, 0, 10, `${new Date().toDateString()}`);
	//		form.addElement("text", 10, 10, 0, 20, `count:${count + 1}`);
	//
	//		const player_name = player.name;
	//		chat_form_set.add(player_name);
	//		system.runTimeout(() => {
	//			if (!chat_form_set.has(player_name)) return;
	//			chat_form_delete_flag_set.add(player_name);
	//			uiManager.closeAllForms(player);
	//			const send_players = world.getPlayers({ name: player_name });
	//			if (send_players.length === 0) return;
	//			const send_player = send_players[0];
	//			send_player.runCommand(`scriptevent cfs:更新フォーム ${count + 1}`);
	//		}, 20);
	//
	//		return form;
	//	},
	//	response: (result, player) => {
	//		if (!chat_form_delete_flag_set.has(player.name)) chat_form_set.delete(player.name);
	//		chat_form_delete_flag_set.delete(player.name);
	//	},
	//},
};
const chat_form_set = new Set<string>();
const chat_form_delete_flag_set = new Set<string>();
