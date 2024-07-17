import { Player } from "@minecraft/server";

export default (form_name: string, variable: { [key: string]: string }, message: string, args: { player: Player }) => {
	//コマンドの引数をJSONにパース
	let parse_arg: { [key: string]: string } = {};
	if (message !== "") {
		try {
			const parsed_message = JSON.parse(message);
			for (let parsed_key of Object.keys(parsed_message)) {
				parse_arg[parsed_key] = String(parsed_message[parsed_key]);
			}
		} catch (e) {
			console.warn("エラー：メッセージのパースに失敗");
			console.warn(e);
		}
	}

	//デフォルトの変数を定義
	const default_variable: { [key: string]: string | number | boolean } = {
		form_name: form_name,
		player_nametag: args.player.nameTag,
		player_location_x: args.player.location.x,
		player_location_y: args.player.location.y,
		player_location_z: args.player.location.z,
	};

	//フォームごとの変数を定義
	const variables: { default: { [key: string]: string | number | boolean }; custom: { [form_name: string]: { [key: string]: string | number | boolean } } } = {
		default: {
			...variable,
			...default_variable,
			...parse_arg,
		},
		custom: {
			custom_form: { ...default_variable },
		},
	};

	//フォーム名にあった変数があるならそれを返し、なければデフォルトの変数を返す
	return variables.custom[form_name] ?? variables.default;
};
