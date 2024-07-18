import { Player } from "@minecraft/server";
import { ActionFormData, FormCancelationReason } from "@minecraft/server-ui";

export namespace customFormType {
	interface basePropertiesType {
		w: number;
		h: number;
		x: number;
		y: number;
		label?: string;
	}
	export namespace elementPropertiesOption {
		export interface buttonOption {
			// is_show_button?: boolean;
		}
		export interface closeButtonOption {
			// is_show_close?: boolean;
		}
		export interface textOption {
			text: string;
			// is_show_text?: boolean;
		}
		export interface imageOption {
			texture: string;
			// is_show_image?: boolean;
		}
		export interface hoverTextOption {
			hover_text: string;
			// is_show_hover?: boolean; //実際は使っていない、falseならhover_textを""にするだけ
		}
		export interface customOption {
			buttonOption?: buttonOption;
			closeButtonOption?: closeButtonOption;
			textOption?: textOption;
			imageOption?: imageOption;
			hoverTextOption?: hoverTextOption;
		}
	}
	export namespace elementPropertiesTypes {
		export interface addButton extends basePropertiesType, elementPropertiesOption.buttonOption {}
		export interface addCloseButton extends basePropertiesType, elementPropertiesOption.closeButtonOption {}
		export interface addText extends basePropertiesType, elementPropertiesOption.textOption {}
		export interface addImage extends basePropertiesType, elementPropertiesOption.imageOption {}
		export interface addHoverText extends basePropertiesType, elementPropertiesOption.hoverTextOption {}
		export interface all
			extends basePropertiesType,
				elementPropertiesOption.buttonOption,
				elementPropertiesOption.closeButtonOption,
				elementPropertiesOption.hoverTextOption,
				elementPropertiesOption.imageOption,
				elementPropertiesOption.textOption {
			is_show_button: boolean;
			is_show_close: boolean;
			is_show_text: boolean;
			is_show_image: boolean;
		}
	}
}

export namespace formElementsVariableTypes {
	interface basePropertiesType {
		w: string; //変数使えるように
		h: string; //変数使えるように
		x: string; //変数使えるように
		y: string; //変数使えるように
		label?: string;
	}
	export namespace elementPropertiesOption {
		export interface buttonOption {}
		export interface closeButtonOption {}
		export interface textOption {
			text: string;
		}
		export interface imageOption {
			texture: string;
		}
		export interface hoverTextOption {
			hover_text: string;
		}
		export interface customOption {
			buttonOption?: buttonOption;
			closeButtonOption?: closeButtonOption;
			textOption?: textOption;
			imageOption?: imageOption;
			hoverTextOption?: hoverTextOption;
		}
	}
	export namespace elementPropertiesTypes {
		export interface addButton extends basePropertiesType, elementPropertiesOption.buttonOption {}
		export interface addCloseButton extends basePropertiesType, elementPropertiesOption.closeButtonOption {}
		export interface addText extends basePropertiesType, elementPropertiesOption.textOption {}
		export interface addImage extends basePropertiesType, elementPropertiesOption.imageOption {}
		export interface addHoverText extends basePropertiesType, elementPropertiesOption.hoverTextOption {}
		export interface all
			extends basePropertiesType,
				elementPropertiesOption.buttonOption,
				elementPropertiesOption.closeButtonOption,
				elementPropertiesOption.hoverTextOption,
				elementPropertiesOption.imageOption,
				elementPropertiesOption.textOption {
			is_show_button: string; //変数
			is_show_close: string; //変数
			is_show_text: string; //変数
			is_show_image: string; //変数
		}
	}
}

export class customForm {
	private elements: customFormType.elementPropertiesTypes.all[] = [];
	private labels: (string | undefined)[];
	private x: number;
	private y: number;
	private title: string;
	private is_show_form_frame: boolean;

	constructor(size: { x: number; y: number }, title: string, is_show_form_frame: boolean) {
		this.x = size.x;
		this.y = size.y;
		this.title = title;
		this.elements = [];
		this.labels = [];
		this.is_show_form_frame = is_show_form_frame;
	}

	addElement(
		type: "custom",
		sizeW: number,
		sizeH: number,
		offsetX: number,
		offsetY: number,
		customOption: customFormType.elementPropertiesOption.customOption,
		selectedLabel?: string
	): customForm;
	addElement(type: "text", sizeW: number, sizeH: number, offsetX: number, offsetY: number, text: string, selectedLabel?: string): customForm;
	addElement(type: "hover_text", sizeW: number, sizeH: number, offsetX: number, offsetY: number, hover_text: string, selectedLabel?: string): customForm;
	addElement(type: "image", sizeW: number, sizeH: number, offsetX: number, offsetY: number, texture: string, selectedLabel?: string): customForm;
	addElement(type: "button", sizeW: number, sizeH: number, offsetX: number, offsetY: number, selectedLabel?: string): customForm;
	addElement(type: "close_button", sizeW: number, sizeH: number, offsetX: number, offsetY: number, selectedLabel?: string): customForm;
	addElement(
		type: "button" | "close_button" | "text" | "hover_text" | "image" | "custom",
		sizeW: number,
		sizeH: number,
		offsetX: number,
		offsetY: number,
		...args: (string | customFormType.elementPropertiesOption.customOption | undefined)[]
	): customForm {
		let label: string | undefined = undefined;
		const properties: customFormType.elementPropertiesTypes.all = {
			x: offsetX,
			y: offsetY,
			w: sizeW,
			h: sizeH,
			hover_text: "",
			text: "",
			texture: "",
			is_show_button: false,
			is_show_close: false,
			is_show_image: false,
			is_show_text: false,
		};
		switch (type) {
			case "button":
				properties.is_show_button = true;
				label = args[0] as string | undefined;
				break;
			case "close_button":
				properties.is_show_close = true;
				label = args[0] as string | undefined;
				break;
			case "hover_text":
				properties.hover_text = args[0] as string;
				label = args[1] as string | undefined;
				break;
			case "text":
				properties.text = args[0] as string;
				properties.is_show_text = true;
				label = args[1] as string | undefined;
				break;
			case "image":
				properties.texture = args[0] as string;
				properties.is_show_image = true;
				label = args[1] as string | undefined;
				break;
			case "custom":
				const custom_option = args[0] as customFormType.elementPropertiesOption.customOption;
				properties.is_show_button = custom_option.buttonOption !== undefined;
				properties.is_show_close = custom_option.closeButtonOption !== undefined;
				properties.is_show_image = custom_option.imageOption !== undefined;
				properties.is_show_text = custom_option.textOption !== undefined;
				properties.text = custom_option.textOption?.text ?? "";
				properties.texture = custom_option.imageOption?.texture ?? "";
				properties.hover_text = custom_option.hoverTextOption?.hover_text ?? "";
				label = args[1] as string | undefined;
				break;
		}
		this.elements.push(properties);
		this.labels.push(label);
		return this;
	}

	private getFormData() {
		return { elements: this.elements, labels: this.labels, x: this.x, y: this.y, title: this.title };
	}

	private encode(elements: customFormType.elementPropertiesTypes.all[], labels: (string | undefined)[], x: number, y: number, title: string) {
		return new customFormEncoder(elements, labels, { x, y }, title, this.is_show_form_frame);
	}

	private createActionForm(form_data: { text: string; texture: string }[]) {
		const form = new ActionFormData().title("§c§u§s§t§o§m§f§o§r§m");
		for (let data of form_data) {
			const { text, texture } = data;
			form.button(text, texture);
		}
		return form;
	}

	sendPlayer(player: Player) {
		const { elements, labels, x, y, title } = this.getFormData();
		const encoder = this.encode(elements, labels, x, y, title);
		const form = this.createActionForm(encoder.result);

		return new Promise(async (resolve: (arg: resultType) => void, reject: (e: Error) => void) => {
			try {
				const result = await form.show(player);
				return resolve({
					cancelationReason: result.cancelationReason,
					selection: result.selection,
					selectedLabel: result.selection ? encoder.labels[result.selection] : undefined,
					canceled: result.canceled,
				});
			} catch (e) {
				return reject(new Error(String(e)));
			}
		});
	}
}
export type resultType = {
	cancelationReason: FormCancelationReason | undefined;
	selection: number | undefined;
	selectedLabel: string | undefined;
	canceled: boolean;
};

class customFormEncoder {
	private RP_screen_size = { x: 465, y: 262 };
	private aux_x = 14;
	private aux_y = 29;
	private aux_offset_x = -7;
	private aux_offset_y = -22;
	result: { text: string; texture: string }[];
	labels: (string | undefined)[];

	constructor(elements: customFormType.elementPropertiesTypes.all[], labels: (string | undefined)[], size: { x: number; y: number }, title: string, is_show_form_frame: boolean) {
		const { x, y } = size;
		const form_frame_elements: customFormType.elementPropertiesTypes.all[] = [
			{
				//背景
				is_show_text: false,
				is_show_image: true,
				is_show_button: false,
				is_show_close: false,
				hover_text: "",
				w: x + this.aux_x - 8,
				h: y + this.aux_y - 8,
				x: this.aux_offset_x + 4,
				y: this.aux_offset_y + 4,
				text: "",
				texture: "textures/ui/translucent_black",
			},
			{
				//枠
				is_show_text: false,
				is_show_image: true,
				is_show_button: false,
				is_show_close: false,
				hover_text: "",
				w: x + this.aux_x,
				h: y + this.aux_y,
				x: this.aux_offset_x,
				y: this.aux_offset_y,
				text: "",
				texture: "textures/ui/dialog_background_hollow_3",
			},
			{
				//X
				is_show_text: false,
				is_show_image: false,
				is_show_button: false,
				is_show_close: true,
				hover_text: "",
				w: x + this.aux_x,
				h: y + this.aux_y,
				x: this.aux_offset_x,
				y: this.aux_offset_y,
				text: "",
				texture: "",
			},
			{
				//Title
				is_show_text: true,
				is_show_image: false,
				is_show_button: false,
				is_show_close: false,
				hover_text: "",
				w: x + this.aux_x,
				h: 30,
				x: this.aux_offset_x,
				y: this.aux_offset_y,
				text: `§0${title}`,
				texture: "",
			},
		];
		const form_frame_labels: (string | undefined)[] = ["backgroundImage", "frameImage", "closeButton", "titleText"];
		const target_form_elements = is_show_form_frame ? form_frame_elements.concat(...elements) : elements;
		this.result = this.encode(target_form_elements, size);
		this.labels = form_frame_labels.concat(labels);
	}

	private getTextLength(text: string) {
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
	private fill_to_length(text: string, length: number, char = ";") {
		if (length === this.getTextLength(text)) return text;
		//charが1文字以外になることを考慮してない
		return `${[...Array(length - this.getTextLength(text)).fill(char)].join("")}${text}`;
	}

	private data2sendText(...data: string[]) {
		const max_text_length = Math.max(...data.map((x) => this.getTextLength(x)));
		let send_text = `${String(max_text_length).length}${max_text_length}`;
		for (let text of data) {
			send_text += this.fill_to_length(text, max_text_length);
		}
		return send_text;
	}

	private fill_to_length_inside(text: string, length: number, isminus = false) {
		if (this.getTextLength(text) < length) return this.fill_to_length_inside(`0${text}`, length, isminus);
		if (isminus) {
			let split_text = text.split("");
			split_text[0] = "-";
			return split_text.join("");
		}
		return text;
	}

	private data2sendText_inside(...data: string[]) {
		const max_text_length = Math.max(...data.map((x) => this.getTextLength(x)));
		let send_text = `${String(max_text_length).length}${max_text_length}`;
		for (let text of data) {
			send_text += this.fill_to_length_inside(text.replace("-", "0"), max_text_length, text[0] === "-");
		}
		return send_text;
	}

	private encode(ui_elements: customFormType.elementPropertiesTypes.all[], form_size: { x: number; y: number }) {
		const offset_x_inc = (this.RP_screen_size.x - form_size.x) / 2 - 7;
		const offset_y_inc = (this.RP_screen_size.y - form_size.y) / 2 - 15;
		const output_obj: { text: string; texture: string }[] = [];
		let count = 0;
		for (let ui_element of ui_elements) {
			count += 1;
			const { x, y, w, h, is_show_button, is_show_image, is_show_text, text, texture, hover_text } = ui_element;

			let data1 = "";
			if (is_show_text) data1 += "text";
			if (is_show_image) data1 += "image";
			if (is_show_button) data1 += "button";
			//ui_elementにis_show_closeを追加するか迷う
			if (ui_element.is_show_close === true) data1 += "close";

			let data2 = `§z${text}`; //先頭が数字の場合消えるから対策として§z入れる
			let data3 = hover_text;
			let data4_temp = [`${w}`, `${h}`, `${offset_x_inc + x - count}`, `${offset_y_inc + y - 1}`];
			let data4 = this.data2sendText_inside(...data4_temp);
			let send_text = this.data2sendText(data1, data2, data3, data4);
			output_obj.push({ text: send_text, texture });
		}
		return output_obj;
	}
}
