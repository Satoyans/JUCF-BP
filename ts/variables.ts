import { Player } from "@minecraft/server";

export default (form_name: string, variable: { [key: string]: string }, message: string, args: { player?: Player }) => {
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

	const player = args.player ?? ({} as Player);

	const variables: { [form_name: string]: { [key: string]: string | number | boolean } } = {
		default: {
			form_name: form_name,
			player_name: player.nameTag,
			player_location_x: player.location.x,
			player_location_y: player.location.y,
			player_location_z: player.location.z,

			...variable,
			...parse_arg,
		},
	};

	if (variables[form_name] === undefined) return variables.default;
	return variables[form_name];
};
