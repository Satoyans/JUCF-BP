export const variableReplacer = (original_text: string, variables: { [key: string]: string | number | boolean }) => {
	let count = 0;
	//%で分割
	const split_texts = original_text.split("%");
	const variable_texts: string[] = [];

	let add_variable_text = "";
	//変数の部分を切り抜く
	for (let split_text of split_texts) {
		count += 1;
		add_variable_text = `${add_variable_text}${split_text}`;

		//最後が\(="~~~\%~~~~")は変数として扱わない
		if (split_text.endsWith("\\")) {
			count -= 1;
		}
		//"~~~~%xxx\%xxx%~~~~"の場合"%xxx\%xxx"を変数として扱う
		if (count === 2) {
			variable_texts.push(add_variable_text);
			add_variable_text = "";
			count = 0;
		}
	}

	let target_text = String(original_text);
	for (let variable_text of variable_texts) {
		if (variables[variable_text] === undefined) continue;
		target_text = target_text.replace(`%${variable_text}%`, String(variables[variable_text]));
	}
	return target_text.replace(/\\%/g, "%");
};
