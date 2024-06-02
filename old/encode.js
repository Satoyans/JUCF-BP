//テストコード
//使ってない
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
function encode(texts) {
	const data2sendText_inside = (...data) => {
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
	};
	const output_obj = [];
	let count = 0;
	for (let ui_element of this.ui_elements) {
		count += 1;
		const { id, x, y, w, h, is_show_button, is_show_image, is_show_text, text, image } = ui_element;
		let data1 = "";
		if (is_show_text) data1 += "text";
		if (is_show_image) data1 += "image";
		if (is_show_button) data1 += "button";
		let data2 = text;
		let data3_temp = [`${w}`, `${h}`, `${x - count}`, `${y - 1}`];
		let data3 = data2sendText_inside(...data3_temp);
		let send_text = data2sendText(data1, data2, data3);
		output_obj.push({ text: send_text, image });
	}
	return output_obj;
}

function data2sendText(...data) {
	const max_text_length = Math.max(...data.map((x) => getTextLength(x)));
	let send_text = `${String(max_text_length).length}${max_text_length}`;
	for (let text of data) {
		send_text += fill_to_length(text, max_text_length);
	}
	return send_text;
}

const convert_datas = [
	["30", "30", "0", "0", "文字1"],
	["30", "30", "30", "20", "文字2"],
	["30", "30", "60", "40", "文字3"],
	["30", "30", "90", "60", "文字4"],
	["30", "30", "120", "80", "文字5"],
	["30", "30", "150", "100", "文字6"],
	["30", "30", "180", "120", "文字7"],
	["30", "30", "210", "140", "文字8"],
	["30", "30", "240", "160", "文字9"],
	["30", "30", "270", "180", "文字10"],
];

console.log(convert_datas.map((x) => data2sendText(...x)));
