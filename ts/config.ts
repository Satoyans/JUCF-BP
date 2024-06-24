//現状使っていない
//後で考える
import { Player } from "@minecraft/server";

export default (player: Player) => {
	return {
		player_name: player.nameTag,
		player_coordinate_x: player.location.x,
		player_coordinate_y: player.location.y,
		player_coordinate_z: player.location.z,
	};
};
