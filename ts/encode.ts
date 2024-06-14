function getTextLength(text) {
	let all_count = 0;
	for (let char of [...text.split("")]) {
		const code_point_num = char.codePointAt(0);
		if (!code_point_num) continue;
		let now_count = 1;
		if (code_point_num >= 128) now_count += 1;
		if (code_point_num >= 2048) now_count += 1;
		if (code_point_num >= 65536) now_count += 1;
		all_count += now_count;
	}
	return all_count;
}
function fill_to_length(text, length, char = ";") {
	if (getTextLength(text) < length) return fill_to_length(`${char}${text}`, length, char);
	return text;
}

function data2sendText(...data) {
	const max_text_length = Math.max(...data.map((x) => getTextLength(x)));
	let send_text = `${String(max_text_length).length}${max_text_length}`;
	for (let text of data) {
		send_text += fill_to_length(text, max_text_length);
	}
	return send_text;
}

function data2sendText_inside(...data) {
	const fill_to_length2 = (text, length, isminus = false) => {
		if (getTextLength(text) < length) return fill_to_length2(`0${text}`, length, isminus);
		if (isminus) {
			let split_text = text.split("");
			split_text[0] = "-";
			return split_text.join("");
		}
		return text;
	};
	const max_text_length = Math.max(...data.map((x) => getTextLength(x)));
	let send_text = `${String(max_text_length).length}${max_text_length}`;
	for (let text of data) {
		send_text += fill_to_length2(text.replace("-", "0"), max_text_length, text[0] === "-");
	}
	return send_text;
}

/**
 *
 * @param {{x:number, y:number, w:number, h:number, is_show_button:boolean, is_show_image:boolean, is_show_text:boolean, text:string, image:string, button_hover_text:string }[]} ui_elements
 * @param {{x:string, y:string}} form_size
 * @returns
 */
const RP_screen_size = { x: 465, y: 262 };
export function encode(ui_elements, form_size) {
	//JSONUIの最大[465, 262]
	const offset_x_inc = (RP_screen_size.x - form_size.x) / 2;
	const offset_y_inc = (RP_screen_size.y - form_size.y) / 2;
	const output_obj: { text: string; image: string }[] = [];
	let count = 0;
	for (let ui_element of ui_elements) {
		count += 1;
		const { x, y, w, h, is_show_button, is_show_image, is_show_text, text, texture, button_hover_text } = ui_element;

		let data1 = "";
		if (is_show_text) data1 += "text";
		if (is_show_image) data1 += "image";
		if (is_show_button) data1 += "button";
		//ui_elementにis_show_closeを追加するか迷う
		if (ui_element.is_show_close === true) data1 += "close";

		let data2 = text;
		let data3 = button_hover_text;
		let data4_temp = [`${w}`, `${h}`, `${offset_x_inc + x - count}`, `${offset_y_inc + y - 1}`];
		let data4 = data2sendText_inside(...data4_temp);
		let send_text = data2sendText(data1, data2, data3, data4);
		output_obj.push({ text: send_text, image: texture });
	}
	return output_obj;
}
