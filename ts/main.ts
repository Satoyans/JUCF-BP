import { Player, ScriptEventCommandMessageAfterEvent, system, world } from "@minecraft/server";
import { customForm, customFormType, formElementsVariableTypes, resultType } from "./class";
import variables from "./variables";
import forms from "./forms";
import { variableReplacer } from "./variableReplacer";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";

system.afterEvents.scriptEventReceive.subscribe(async (ev) => {
	if (ev.id !== "cf:tag") return;
	const sender = ev.sourceEntity;
	if (!sender) return;
	if (!(sender instanceof Player) || sender.typeId !== "minecraft:player") return; //tsの型判定用 || script用

	for (let player of world.getAllPlayers()) {
		const tags = player.getTags().filter((t) => t.match(/^{.+}$/));
		for (let tag of tags) {
			try {
				player.removeTag(tag);
				const parse = JSON.parse(tag);
				const form_name = parse.form_name;
				if (form_name === undefined) throw new Error('エラー："form_name"を取得できませんでした。');
				if (typeof form_name !== "string") throw new Error('エラー："form_name"の型がstringではありません。');
				if (form_name === "") throw new Error('エラー："form_name"は空に出来ません。');
				//既に同じ名前のフォームが無いかチェック
				if (world.getDynamicPropertyIds().includes(`cf:${form_name}`)) throw new Error(`エラー：フォーム"${form_name}"は既に存在します。`);

				const form_size = parse.form_size;
				if (form_size === undefined) throw new Error('エラー："form_size"を取得できませんでした。');
				if (form_size["x"] === undefined) throw new Error('エラー："form_size.x"を取得できませんでした。');
				if (typeof form_size["x"] !== "string") throw new Error('エラー："form_size.x"の型がstringではありません。');
				if (form_size["y"] === undefined) throw new Error('エラー："form_size.y"を取得できませんでした。');
				if (typeof form_size["y"] !== "string") throw new Error('エラー："form_size.y"の型がstringではありません。');

				const is_show_form_frame = parse.is_show_form_frame;
				if (is_show_form_frame === undefined) throw new Error('エラー："is_show_form_frame"を取得できませんでした。');
				if (typeof is_show_form_frame !== "string") throw new Error('エラー："is_show_form_frame"の型がstringではありません。');

				const variables = parse.variables;
				if (variables === undefined) throw new Error('エラー："variables"を取得できませんでした。');
				if (typeof variables !== "object") throw new Error('エラー："variables"の型がobjectではありません。');

				const elements = parse.elements;
				if (elements === undefined) throw new Error('エラー："elements"を取得できませんでした。');
				if (!Array.isArray(elements)) throw new Error('エラー："variables"の型がarrayではありません。');
				for (let element of elements) {
					if (
						element.x === undefined ||
						element.y === undefined ||
						element.w === undefined ||
						element.h === undefined ||
						element.text === undefined ||
						element.texture === undefined ||
						element.hover_text === undefined ||
						element.aux === undefined ||
						element.is_show_text === undefined ||
						element.is_show_image === undefined ||
						element.is_show_button === undefined ||
						element.is_show_close === undefined ||
						element.is_show_item === undefined
					)
						throw new Error('エラー："element"のキーが不足しています。');
					//labelの対策
					if (element.label === undefined && Object.keys(element).length !== 11) throw new Error('エラー："element"のキーの数が異常です。');
					if (element.label !== undefined && Object.keys(element).length !== 12) throw new Error('エラー："element"のキーの数が異常です。');
				}

				world.setDynamicProperty(`cf:${form_name}`, tag);
				player.sendMessage(`フォーム名"${form_name}"を追加しました。`);
			} catch (e) {
				if (!e.message) {
					console.warn("タグを変換中にエラーが発生しました。");
					console.warn("以下のエラー文をコピーしてお知らせください。");
					console.warn(tag);
					console.warn(e);
					player.sendMessage(e);
				} else {
					console.warn(e);
					player.sendMessage(e);
				}
			}
		}
	}
});

system.afterEvents.scriptEventReceive.subscribe(async (ev) => {
	if (!ev.id.startsWith("cfs:")) return;
	const sender = ev.sourceEntity;
	if (!sender) return;
	if (!(sender instanceof Player) || sender.typeId !== "minecraft:player") return; //tsの型判定用 || script用
	const result = await send({ sender, id: ev.id, message: ev.message });
});

function send({ sender, id, message }: { sender: Player; id: string; message: string }): Promise<resultType> {
	return new Promise<resultType>((resolve) => {
		system.run(async () => {
			if (forms[id.replace("cfs:", "")]) {
				//forms.tsに追加されている場合
				const { form, response } = forms[id.replace("cfs:", "")];
				const result = await form(sender).sendPlayer(sender);
				//登録されている関数を実行する
				response(result, sender);
				return result;
			} else {
				//されていない場合
				const form_name = id.replace("cfs:", "");
				const form_data = world.getDynamicProperty(`cf:${form_name}`) as string | undefined;
				if (form_data === undefined) return sender.sendMessage(`エラー：フォーム"${form_name}"は見つかりませんでした。`);
				//全体パース=>変数取得=>要素文字化=>要素置き換え=>要素パース
				const parsed_form_data = JSON.parse(form_data);
				const variables_value = parsed_form_data["variables"];
				const variable = variables(form_name, variables_value, message, { player: sender });

				const elements: formElementsVariableTypes.elementPropertiesTypes.all[] = JSON.parse(variableReplacer(JSON.stringify(parsed_form_data["elements"]), variable));
				const converted_elements: customFormType.elementPropertiesTypes.all[] = elements.map((element) => {
					const converted_form_data: customFormType.elementPropertiesTypes.all = {
						h: Number.isNaN(Number(element.h)) ? 0 : Number(element.h),
						w: Number.isNaN(Number(element.w)) ? 0 : Number(element.w),
						x: Number.isNaN(Number(element.x)) ? 0 : Number(element.x),
						y: Number.isNaN(Number(element.y)) ? 0 : Number(element.y),
						text: String(element.text).replace(/\\n/g, "\n"),
						texture: String(element.texture).replace(/\\n/g, "\n"),
						hover_text: String(element.hover_text).replace(/\\n/g, "\n"),
						aux: Number.isNaN(Number(element.aux)) ? 0 : Number(element.aux),
						is_show_button: Boolean(element.is_show_button === "true"),
						is_show_close: Boolean(element.is_show_close === "true"),
						is_show_text: Boolean(element.is_show_text === "true"),
						is_show_image: Boolean(element.is_show_image === "true"),
						is_show_item: Boolean(element.is_show_item === "true"),
						label: element.label,
					};
					return converted_form_data;
				});
				const form_size: { x: string; y: string } = parsed_form_data["form_size"];
				const converted_form_size = {
					x: Number.isNaN(Number(form_size.x)) ? 0 : Number(form_size.x),
					y: Number.isNaN(Number(form_size.y)) ? 0 : Number(form_size.y),
				};

				const is_show_form_frame = parsed_form_data["is_show_form_frame"] === "true";

				const custom_form = new customForm({ ...converted_form_size }, form_name, is_show_form_frame);
				converted_elements.map((element) => {
					const options: customFormType.elementPropertiesOption.customOption = {};
					if (element.is_show_button) options.buttonOption = {};
					if (element.is_show_close) options.closeButtonOption = {};
					if (element.is_show_image) options.imageOption = { texture: element.texture };
					if (element.is_show_text) options.textOption = { text: element.text };
					if (element.is_show_item) options.itemRendererOption = { aux: element.aux };
					if (element.hover_text !== "") options.hoverTextOption = { hover_text: element.hover_text };
					custom_form.addElement("custom", element.w, element.h, element.x, element.y, options, element.label);
				});
				resolve(custom_form.sendPlayer(sender));
			}
		});
	});
}

system.afterEvents.scriptEventReceive.subscribe(async (ev) => {
	if (ev.id !== "cf:list") return;
	const sender = ev.sourceEntity;
	if (!sender) return;
	if (!(sender instanceof Player) || sender.typeId !== "minecraft:player") return; //tsの型判定用 || script用

	gui(sender);
});

function gui(sender: Player) {
	const form = new ActionFormData().title("custom form list");
	const form_keys = world
		.getDynamicPropertyIds()
		.filter((v) => v.startsWith("cf:"))
		.map((v) => v.replace("cf:", ""));
	form_keys.map((v) => form.button(v));
	system.run(async () => {
		const res = await form.show(sender);
		if (res.canceled) return;
		if (res.selection === undefined) return;
		const selected_key = form_keys[res.selection];

		const res2 = await new ActionFormData()
			.title("custom form list")
			.body(`cf:${selected_key}`)
			.button("改名")
			.button("コピー")
			.button("削除")
			.button("表示")
			.button("コンテンツログに出力")
			.show(sender);
		if (res2.canceled) return;
		if (res2.selection === undefined) return;
		if (res2.selection === 0) {
			//改名
			const rename = async (sender: Player) => {
				const res3 = await new ModalFormData().title("custom form list").textField("変更後のフォーム名", "", selected_key).show(sender);
				if (res3.canceled) return;
				if (res3.formValues === undefined) return;
				if (typeof res3.formValues[0] !== "string") return;
				if (res3.formValues[0] === "") return sender.sendMessage(`フォーム名を空にすることはできません。`);
				if (form_keys.includes(res3.formValues[0])) {
					sender.sendMessage(`そのフォーム名は既に存在します。`);
					rename(sender);
					return;
				}
				const selected_form_data = world.getDynamicProperty(`cf:${selected_key}`) as string | undefined;
				if (selected_form_data === undefined) return sender.sendMessage(`フォーム"cf:${selected_key}"が見つかりませんでした。`);
				const renamed_form_data = JSON.stringify({ ...JSON.parse(selected_form_data), form_name: res3.formValues[0] });
				world.setDynamicProperty(`cf:${selected_key}`);
				world.setDynamicProperty(`cf:${res3.formValues[0]}`, renamed_form_data);
				sender.sendMessage(`"cf:${selected_key}"から"cf:${res3.formValues[0]}"に改名しました。`);
			};
			rename(sender);
		}
		if (res2.selection === 1) {
			//コピー
			const selected_form_data = world.getDynamicProperty(`cf:${selected_key}`) as string | undefined;
			if (selected_form_data === undefined) return sender.sendMessage(`フォーム"cf:${selected_key}"が見つかりませんでした。`);
			const renamed_form_data = JSON.stringify({ ...JSON.parse(selected_form_data), form_name: `cf:${selected_key}-copy` });
			world.setDynamicProperty(`cf:${selected_key}-copy`, renamed_form_data);
			sender.sendMessage(`"cf:${selected_key}-copy"を作成しました。`);
		}
		if (res2.selection === 2) {
			//削除
			const selected_form_data = world.getDynamicProperty(`cf:${selected_key}`) as string | undefined;
			if (selected_form_data === undefined) return sender.sendMessage(`フォーム"cf:${selected_key}"が見つかりませんでした。`);
			world.setDynamicProperty(`cf:${selected_key}`);
			sender.sendMessage(`"cf:${selected_key}"を削除しました。`);
		}
		if (res2.selection === 3) {
			//表示
			send({ sender, id: `cfs:${selected_key}`, message: "" }).catch((r) => console.warn(r));
			sender.sendMessage(`"cf:${selected_key}"を表示しました。`);
		}
		if (res2.selection === 4) {
			//コンテンツログに出力
			const selected_form_data = world.getDynamicProperty(`cf:${selected_key}`) as string | undefined;
			if (selected_form_data === undefined) return sender.sendMessage(`フォーム"cf:${selected_key}"が見つかりませんでした。`);
			console.warn(JSON.stringify(selected_form_data));
			sender.sendMessage(`コンテンツログに出力しました。`);
		}
	});
}
