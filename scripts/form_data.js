// const x = 465;
// const x = 465;
// const y = 262;
const x = 100 + 14;
const y = 150 + 29;
const offset_x = -7;
const offset_y = -22;
export default [
	[
		{
			//背景
			is_show_text: false,
			is_show_image: true,
			is_show_button: false,
			w: x - 8,
			h: y - 8,
			x: offset_x + 4,
			y: offset_y + 4,
			text: "",
			texture: "textures/ui/translucent_black",
		},
		{
			//枠
			is_show_text: false,
			is_show_image: true,
			is_show_button: false,
			w: x,
			h: y,
			x: offset_x,
			y: offset_y,
			text: "",
			texture: "textures/ui/dialog_background_hollow_3",
		},
		{
			//X
			is_show_text: false,
			is_show_image: false,
			is_show_button: false,
			is_show_close: true,
			w: x,
			h: y,
			x: offset_x,
			y: offset_y,
			text: "",
			texture: "",
		},
		{
			//Title
			is_show_text: true,
			is_show_image: false,
			is_show_button: false,
			w: x,
			h: 30,
			x: offset_x,
			y: offset_y,
			text: `§0${x - 14}x${y - 29}(${x}x${y})`,
			texture: "",
		},
		{
			//要素
			is_show_text: true,
			is_show_image: true,
			is_show_button: false,
			w: 100,
			h: 100,
			x: 0,
			y: 0,
			text: "§0要素\n100x100",
			texture: "textures/blocks/diamond_block",
		},
		{
			//要素
			is_show_text: true,
			is_show_image: true,
			is_show_button: false,
			w: 100,
			h: 100,
			x: 300,
			y: 0,
			text: "§0要素\n100x100",
			texture: "textures/blocks/diamond_block",
		},
		{
			//要素
			is_show_text: true,
			is_show_image: true,
			is_show_button: false,
			w: 100,
			h: 100,
			x: 100,
			y: 80,
			text: "§0要素\n100x100",
			texture: "textures/blocks/diamond_block",
		},
	],
	{ x, y },
];
