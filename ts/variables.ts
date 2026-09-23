import { Player } from "@minecraft/server";

export default (form_name: string, variable: { [key: string]: string }, args: string, context: { player: Player }) => {
	//コマンドの引数をJSONにパース
	let parse_arg: { [key: string]: string } = {};
	if (args !== "") {
		try {
			const parsed_args = JSON.parse(args);
			for (let parsed_key of Object.keys(parsed_args)) {
				parse_arg[parsed_key] = String(parsed_args[parsed_key]);
			}
		} catch (e) {
			console.warn("エラー：引数のパースに失敗");
			console.warn(e);
		}
	}

	//デフォルトの変数を定義
	const default_variable: { [key: string]: string | number | boolean } = {
		form_name: form_name,
		player_nametag: context.player.nameTag,
		player_location_x: context.player.location.x,
		player_location_y: context.player.location.y,
		player_location_z: context.player.location.z,
	};

	return {
		...variable,
		...default_variable,
		...parse_arg,
	};
};
