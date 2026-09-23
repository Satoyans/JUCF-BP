import {
	CommandPermissionLevel,
	CustomCommandOrigin,
	CustomCommandParamType,
	CustomCommandResult,
	CustomCommandStatus,
	Player,
	StartupEvent,
	system,
	world,
} from "@minecraft/server";
import { CustomForm, MessageBox, ObservableString } from "@minecraft/server-ui";
import { customForm, customFormType, formElementsVariableTypes, resultType } from "./class";
import variables from "./variables";
import { variableReplacer } from "./variableReplacer";

// スラッシュコマンドの登録 (startup イベント)
system.beforeEvents.startup.subscribe((init: StartupEvent) => {
	// /jucf:list - フォーム管理GUIを開く
	init.customCommandRegistry.registerCommand(
		{
			name: "jucf:list",
			description: "JUCFのフォーム一覧・管理画面を開きます。",
			permissionLevel: CommandPermissionLevel.Any,
		},
		(origin: CustomCommandOrigin): CustomCommandResult => {
			const sender = origin.sourceEntity;
			if (!(sender instanceof Player)) {
				return {
					status: CustomCommandStatus.Failure,
					message: "このコマンドはプレイヤーのみ実行できます。",
				};
			}
			system.run(() => {
				openGui(sender);
			});
			return {
				status: CustomCommandStatus.Success,
			};
		}
	);

	// /jucf:open <form_name> [message] - フォームを開く
	init.customCommandRegistry.registerCommand(
		{
			name: "jucf:open",
			description: "指定したJUCFフォームを開きます。",
			permissionLevel: CommandPermissionLevel.Any,
			mandatoryParameters: [
				{
					name: "form_name",
					type: CustomCommandParamType.String,
				},
			],
			optionalParameters: [
				{
					name: "message",
					type: CustomCommandParamType.String,
				},
			],
		},
		(origin: CustomCommandOrigin, args: any[]): CustomCommandResult => {
			const sender = origin.sourceEntity;
			if (!(sender instanceof Player)) {
				return {
					status: CustomCommandStatus.Failure,
					message: "このコマンドはプレイヤーのみ実行できます。",
				};
			}
			const formName = args[0] as string;
			const message = (args[1] as string | undefined) ?? "";
			system.run(() => {
				openForm(sender, formName, message);
			});
			return {
				status: CustomCommandStatus.Success,
			};
		}
	);

	// /jucf:import - タグからフォームをインポート
	init.customCommandRegistry.registerCommand(
		{
			name: "jucf:import",
			description: "プレイヤーのタグからJUCFフォーム定義をインポートします。",
			permissionLevel: CommandPermissionLevel.Any,
		},
		(origin: CustomCommandOrigin): CustomCommandResult => {
			const sender = origin.sourceEntity;
			if (!(sender instanceof Player)) {
				return {
					status: CustomCommandStatus.Failure,
					message: "このコマンドはプレイヤーのみ実行できます。",
				};
			}
			system.run(() => {
				importFromTags(sender);
			});
			return {
				status: CustomCommandStatus.Success,
			};
		}
	);
});

/**
 * プレイヤーのタグからフォーム定義を取得して保存します。
 */
export function importFromTags(executor: Player) {
	let importCount = 0;
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

				// 既に同じ名前のフォームが無いかチェック
				if (world.getDynamicPropertyIds().includes(`jucf:${form_name}`)) {
					throw new Error(`エラー：フォーム"${form_name}"は既に存在します。`);
				}

				const form_size = parse.form_size;
				if (form_size === undefined) throw new Error('エラー："form_size"を取得できませんでした。');
				if (form_size["x"] === undefined) throw new Error('エラー："form_size.x"を取得できませんでした。');
				if (typeof form_size["x"] !== "string") throw new Error('エラー："form_size.x"の型がstringではありません。');
				if (form_size["y"] === undefined) throw new Error('エラー："form_size.y"を取得できませんでした。');
				if (typeof form_size["y"] !== "string") throw new Error('エラー："form_size.y"の型がstringではありません。');

				const is_show_form_frame = parse.is_show_form_frame;
				if (is_show_form_frame === undefined) throw new Error('エラー："is_show_form_frame"を取得できませんでした。');
				if (typeof is_show_form_frame !== "string") throw new Error('エラー："is_show_form_frame"の型がstringではありません。');

				const form_variables = parse.variables;
				if (form_variables === undefined) throw new Error('エラー："variables"を取得できませんでした。');
				if (typeof form_variables !== "object") throw new Error('エラー："variables"の型がobjectではありません。');

				const elements = parse.elements;
				if (elements === undefined) throw new Error('エラー："elements"を取得できませんでした。');
				if (!Array.isArray(elements)) throw new Error('エラー："elements"の型がarrayではありません。');
				for (let element of elements) {
					if (
						element.x === undefined ||
						element.y === undefined ||
						element.w === undefined ||
						element.h === undefined ||
						element.text === undefined ||
						element.texture === undefined ||
						element.command === undefined ||
						element.hover_text === undefined ||
						element.aux === undefined ||
						element.is_show_text === undefined ||
						element.is_show_image === undefined ||
						element.is_show_button === undefined ||
						element.is_show_close === undefined ||
						element.is_show_item === undefined
					) {
						throw new Error('エラー："element"のキーが不足しています。' + JSON.stringify(element));
					}
					// labelの対策
					if (element.label === undefined && Object.keys(element).length !== 14) throw new Error('エラー："element"のキーの数が異常です。');
					if (element.label !== undefined && Object.keys(element).length !== 15) throw new Error('エラー："element"のキーの数が異常です。');
				}

				world.setDynamicProperty(`jucf:${form_name}`, tag);
				executor.sendMessage(`フォーム名"${form_name}"を追加しました。`);
				importCount++;
			} catch (e: any) {
				console.warn("タグを変換中にエラーが発生しました。");
				console.warn(tag);
				console.warn(e);
				executor.sendMessage(e?.message ?? String(e));
			}
		}
	}
	if (importCount === 0) {
		executor.sendMessage("インポート対象のタグを持つプレイヤーは見つかりませんでした。");
	}
}

/**
 * JUCFフォームを表示します。
 */
export function openForm(sender: Player, formName: string, message: string = ""): Promise<resultType | undefined> {
	return new Promise<resultType | undefined>((resolve) => {
		system.run(async () => {
			const form_data = world.getDynamicProperty(`jucf:${formName}`) as string | undefined;
			if (form_data === undefined) {
				sender.sendMessage(`エラー：フォーム"${formName}"は見つかりませんでした。`);
				return resolve(undefined);
			}

			try {
				// 全体パース=>変数取得=>要素文字化=>要素置き換え=>要素パース
				const parsed_form_data = JSON.parse(form_data);
				const variables_value = parsed_form_data["variables"];
				const variable = variables(formName, variables_value, message, { player: sender });

				const elements: formElementsVariableTypes.elementPropertiesTypes.all[] = JSON.parse(
					variableReplacer(JSON.stringify(parsed_form_data["elements"]), variable)
				);
				const converted_elements: customFormType.elementPropertiesTypes.all[] = elements.map((element) => {
					const converted_form_data: customFormType.elementPropertiesTypes.all = {
						h: Number.isNaN(Number(element.h)) ? 0 : Number(element.h),
						w: Number.isNaN(Number(element.w)) ? 0 : Number(element.w),
						x: Number.isNaN(Number(element.x)) ? 0 : Number(element.x),
						y: Number.isNaN(Number(element.y)) ? 0 : Number(element.y),
						text: String(element.text).replace(/\\n/g, "\n"),
						texture: String(element.texture).replace(/\\n/g, "\n"),
						command: String(element.command).replace(/\\n/g, "\n"),
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

				const custom_form = new customForm({ ...converted_form_size }, formName, is_show_form_frame);
				converted_elements.forEach((element) => {
					const options: customFormType.elementPropertiesOption.customOption = {};
					if (element.is_show_button) options.buttonOption = { command: element.command };
					if (element.is_show_close) options.closeButtonOption = {};
					if (element.is_show_image) options.imageOption = { texture: element.texture };
					if (element.is_show_text) options.textOption = { text: element.text };
					if (element.is_show_item) options.itemRendererOption = { aux: element.aux };
					if (element.hover_text !== "") options.hoverTextOption = { hover_text: element.hover_text };
					custom_form.addElement("custom", element.w, element.h, element.x, element.y, options, element.label);
				});

				const form_result = await custom_form.sendPlayer(sender);
				if (!form_result.canceled) {
					// コマンド実行
					const selectionIndex = form_result.selection ?? -1;
					if (selectionIndex >= 0 && selectionIndex < converted_elements.length) {
						const command = converted_elements[selectionIndex].command;
						if (command) sender.runCommand(command);
					}
				}
				resolve(form_result);
			} catch (e: any) {
				console.warn(e);
				sender.sendMessage(`エラー：フォーム表示中に問題が発生しました: ${e?.message ?? e}`);
				resolve(undefined);
			}
		});
	});
}

/**
 * DDUI を使用したフォーム一覧・管理GUIを表示します。
 */
export function openGui(sender: Player) {
	const form_keys = world
		.getDynamicPropertyIds()
		.filter((v) => v.startsWith("jucf:"))
		.map((v) => v.replace("jucf:", ""));

	const form = new CustomForm(sender, "JUCF フォーム一覧");

	if (form_keys.length === 0) {
		form.label("登録されているフォームはありません。");
	} else {
		form.label("管理するフォームを選択してください：");
		for (const key of form_keys) {
			form.button(key, () => {
				form.close();
				system.run(() => {
					openFormDetail(sender, key);
				});
			});
		}
	}

	form.spacer();
	form.divider();
	form.button("タグからインポート", () => {
		importFromTags(sender);
		form.close();
		system.run(() => {
			openGui(sender);
		});
	});
	form.closeButton();
	form.show().catch((e) => console.error(e));
}

/**
 * DDUI を使用したフォーム詳細操作画面を表示します。
 */
function openFormDetail(sender: Player, selected_key: string) {
	const detailForm = new CustomForm(sender, `JUCF: ${selected_key}`);
	detailForm.label(`フォーム名: jucf:${selected_key}`);
	detailForm.spacer();

	// 1. 表示
	detailForm.button("表示", () => {
		detailForm.close();
		system.run(() => {
			openForm(sender, selected_key, "");
			sender.sendMessage(`"jucf:${selected_key}"を表示しました。`);
		});
	});

	// 2. 改名
	detailForm.button("改名", () => {
		detailForm.close();
		system.run(() => {
			openRenameForm(sender, selected_key);
		});
	});

	// 3. コピー
	detailForm.button("コピー", () => {
		const selected_form_data = world.getDynamicProperty(`jucf:${selected_key}`) as string | undefined;
		if (selected_form_data === undefined) {
			sender.sendMessage(`エラー：フォーム"jucf:${selected_key}"が見つかりませんでした。`);
			return;
		}
		const copyName = `${selected_key}-copy`;
		const renamed_form_data = JSON.stringify({ ...JSON.parse(selected_form_data), form_name: copyName });
		world.setDynamicProperty(`jucf:${copyName}`, renamed_form_data);
		sender.sendMessage(`"jucf:${copyName}"を作成しました。`);
		detailForm.close();
		system.run(() => {
			openGui(sender);
		});
	});

	// 4. 削除 (MessageBox による確認)
	detailForm.button("削除", () => {
		detailForm.close();
		system.run(() => {
			const confirmBox = new MessageBox(sender, "フォーム削除の確認")
				.body(`本当にフォーム "jucf:${selected_key}" を削除しますか？\nこの操作は取り消せません。`)
				.button1("削除")
				.button2("キャンセル");

			confirmBox
				.show()
				.then((res) => {
					if (res.selection === 1) {
						world.setDynamicProperty(`jucf:${selected_key}`);
						sender.sendMessage(`"jucf:${selected_key}"を削除しました。`);
						system.run(() => {
							openGui(sender);
						});
					} else {
						system.run(() => {
							openFormDetail(sender, selected_key);
						});
					}
				})
				.catch((e) => console.error(e));
		});
	});

	// 5. コンテンツログに出力
	detailForm.button("コンテンツログに出力", () => {
		const selected_form_data = world.getDynamicProperty(`jucf:${selected_key}`) as string | undefined;
		if (selected_form_data === undefined) {
			sender.sendMessage(`エラー：フォーム"jucf:${selected_key}"が見つかりませんでした。`);
			return;
		}
		console.warn(JSON.stringify(selected_form_data));
		sender.sendMessage(`コンテンツログに出力しました。`);
	});

	detailForm.spacer();
	detailForm.divider();
	detailForm.button("一覧に戻る", () => {
		detailForm.close();
		system.run(() => {
			openGui(sender);
		});
	});
	detailForm.closeButton();
	detailForm.show().catch((e) => console.error(e));
}

/**
 * DDUI (CustomForm / ObservableString) を使用した改名画面を表示します。
 */
function openRenameForm(sender: Player, selected_key: string) {
	const nameObservable = new ObservableString(selected_key, { clientWritable: true });
	const renameForm = new CustomForm(sender, `改名: ${selected_key}`);
	renameForm.label("新しいフォーム名を入力してください。");
	renameForm.textField("フォーム名", nameObservable, { description: "新しいフォーム名" });

	renameForm.button("改名を適用", () => {
		const newName = nameObservable.getData().trim();
		if (!newName) {
			sender.sendMessage("エラー：フォーム名を空にすることはできません。");
			return;
		}
		if (newName === selected_key) {
			renameForm.close();
			system.run(() => {
				openFormDetail(sender, selected_key);
			});
			return;
		}
		const form_keys = world
			.getDynamicPropertyIds()
			.filter((v) => v.startsWith("jucf:"))
			.map((v) => v.replace("jucf:", ""));

		if (form_keys.includes(newName)) {
			sender.sendMessage("エラー：そのフォーム名は既に存在します。");
			return;
		}

		const selected_form_data = world.getDynamicProperty(`jucf:${selected_key}`) as string | undefined;
		if (selected_form_data === undefined) {
			sender.sendMessage(`エラー：フォーム"jucf:${selected_key}"が見つかりませんでした。`);
			return;
		}

		const renamed_form_data = JSON.stringify({ ...JSON.parse(selected_form_data), form_name: newName });
		world.setDynamicProperty(`jucf:${selected_key}`);
		world.setDynamicProperty(`jucf:${newName}`, renamed_form_data);
		sender.sendMessage(`"jucf:${selected_key}"から"jucf:${newName}"に改名しました。`);
		renameForm.close();
		system.run(() => {
			openFormDetail(sender, newName);
		});
	});

	renameForm.button("キャンセル", () => {
		renameForm.close();
		system.run(() => {
			openFormDetail(sender, selected_key);
		});
	});
	renameForm.closeButton();
	renameForm.show().catch((e) => console.error(e));
}
