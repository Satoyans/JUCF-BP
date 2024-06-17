export namespace customFormType {
	export type code = string;
	export type json = string;
	export interface basePropertiesType {
		w: number;
		h: number;
		x: number;
		y: number;
	}
	export namespace elementPropertiesTypes {
		export interface addButton extends basePropertiesType {}
		export interface addCloseButton extends basePropertiesType {}
		export interface addText extends basePropertiesType {
			text: string;
		}
		export interface addImage extends basePropertiesType {
			texture: string;
		}
		export interface addHoverText extends basePropertiesType {
			hover_text: string;
		}
		export interface all extends basePropertiesType {
			is_show_text: boolean;
			is_show_image: boolean;
			is_show_button: boolean;
			is_show_close: boolean;
			hover_text: string;
			text: string;
			texture: string;
		}
		export interface addElement extends all {}
	}
}

class customFormClass {
	/*
    作成方法
    1.scriptAPI上でコードを書く
    2.エディター?で作成したJSONを使う

    1の場合
    コードをJSONに変換 → JSONをFormに変換

    2の場合
    JSONをFormに変換

    */
	elements: customFormType.elementPropertiesTypes.all[] = [];
	x: number;
	y: number;
	title: string;
	constructor(size: { x: number; y: number }, title: string) {
		this.x = size.x;
		this.y = size.x;
		this.title = title;
	}

	private fillProperties(
		properties:
			| customFormType.elementPropertiesTypes.addButton
			| customFormType.elementPropertiesTypes.addCloseButton
			| customFormType.elementPropertiesTypes.addHoverText
			| customFormType.elementPropertiesTypes.addImage
			| customFormType.elementPropertiesTypes.addText
	): customFormType.elementPropertiesTypes.all {
		const p = properties as any;
		return {
			w: properties.w,
			h: properties.h,
			x: properties.x,
			y: properties.y,
			is_show_text: p.is_show_text ?? false,
			is_show_image: p.is_show_image ?? false,
			is_show_button: p.is_show_button ?? false,
			is_show_close: p.is_show_close ?? false,
			hover_text: p.hover_text ?? "",
			text: p.text ?? "",
			texture: p.texture ?? "",
		};
	}

	addButton(properties: customFormType.elementPropertiesTypes.addButton) {
		const p = this.fillProperties(properties);
		p.is_show_button = true;
		this.elements.push(p);
	}
	addCloseButton(properties: customFormType.elementPropertiesTypes.addCloseButton) {
		const p = this.fillProperties(properties);
		p.is_show_close = true;
		this.elements.push(p);
	}
	addText(properties: customFormType.elementPropertiesTypes.addText) {
		const p = this.fillProperties(properties);
		p.is_show_text = true;
		this.elements.push(p);
	}
	addImage(properties: customFormType.elementPropertiesTypes.addImage) {
		const p = this.fillProperties(properties);
		p.is_show_image = true;
		this.elements.push(p);
	}
	addHoverText(properties: customFormType.elementPropertiesTypes.addHoverText) {
		this.elements.push(this.fillProperties(properties));
	}
	addElement(properties: customFormType.elementPropertiesTypes.addElement) {
		this.elements.push(properties);
	}
	getFormData() {
		return { elements: this.elements, x: this.x, y: this.y, title: this.title };
	}
}

const custom_form = new customFormClass({ x: 200, y: 200 }, "たいとるのもじれつ！2");
custom_form.addElement({
	h: 50,
	w: 50,
	x: 0,
	y: 0,
	hover_text: "ﾉｼ",
	text: "要素\n50x50",
	texture: "textures/blocks/diamond_block",
	is_show_button: false,
	is_show_close: false,
	is_show_image: true,
	is_show_text: true,
});
custom_form.addElement({
	h: 100,
	w: 100,
	x: 50,
	y: 50,
	hover_text: "ホバーテキスト",
	text: "§0ボタン\n100x100",
	texture: "textures/blocks/diamond_block",
	is_show_button: true,
	is_show_close: false,
	is_show_image: true,
	is_show_text: true,
});
custom_form.addElement({
	h: 50,
	w: 50,
	x: 150,
	y: 150,
	hover_text: "",
	text: "§0要素\n50x50",
	texture: "textures/blocks/diamond_block",
	is_show_button: false,
	is_show_close: false,
	is_show_image: true,
	is_show_text: true,
});
export const FORM_DATA = custom_form.getFormData();
