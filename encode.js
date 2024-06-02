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

function fill_to_length_back(text, length, char = ";") {
	if (getTextLength(text) < length) return fill_to_length_back(`${text}${char}`, length, char);
	return text;
}

function data2sendText1(...data) {
	const max_text_length = Math.max(...data.map((x) => getTextLength(x)));
	let send_text = `${String(max_text_length).length}${max_text_length}`;
	for (let text of data) {
		send_text += fill_to_length(text, max_text_length);
	}
	return send_text;
}
function data2sendText2(...data) {
	const max_text_length = Math.max(...data.map((x) => getTextLength(x)));
	let send_text = `${String(max_text_length).length}${max_text_length}`;
	for (let text of data) {
		send_text += fill_to_length_back(text, max_text_length);
	}
	return send_text;
}

//const convert_datas = [
//	["30", "30", "0", "0", "tl", "文字1"],
//	["30", "30", "30", "20", "tl", "文字2"],
//	["30", "30", "60", "40", "tl", "文字3"],
//	["30", "30", "90", "60", "tl", "文字4"],
//	["30", "30", "120", "80", "tl", "文字5"],
//	["30", "30", "150", "100", "tl", "文字6"],
//	["30", "30", "180", "120", "tl", "文字7"],
//	["30", "30", "210", "140", "tl", "文字8"],
//	["30", "30", "240", "160", "tl", "文字9"],
//	["30", "30", "0", "-30", "tr", "文字a"],
//];

const convert_datas = [
	["30", "30", "0", "0", "文字1"],
	["30", "30", "30", "20", "文字2"],
	["30", "30", "60", "40", "文字3"],
	["30", "30", "90", "60", "文字4"],
	["30", "30", "120", "80", "文字5"],
	//["30", "30", "150", "100", "文字6"],
	//["30", "30", "180", "120", "文字7"],
	//["30", "30", "210", "140", "文字8"],
	//["30", "30", "240", "160", "文字9"],
	//["30", "30", "270", "180", "文字10"],
];

console.log("/title @s title " + data2sendText2(...convert_datas.map((x) => data2sendText1(...x))) + "update");
