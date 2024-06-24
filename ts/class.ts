export namespace customFormType {
  export type code = string;
  export type json = string;

  interface addBase {
    x: number;
    y: number;
    w: number;
    h: number;
    is_show_text?: boolean;
    is_show_image?: boolean;
    is_show_button?: boolean;
    is_show_close?: boolean;
    hover_text?: string;
    text?: string;
    texture?: string;
  }
  export interface addButton extends addBase {}
  export interface addCloseButton extends addBase {}
  export interface addText extends addBase {
    text: string;
  }
  export interface addImage extends addBase {
    texture: string;
  }
  export interface addHoverText extends addBase {
    hover_text: string;
  }
  export interface all extends addBase {
    is_show_text: boolean;
    is_show_image: boolean;
    is_show_button: boolean;
    is_show_close: boolean;
    hover_text: string;
    text: string;
    texture: string;
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
  elements: customFormType.all[] = [];
  x: number;
  y: number;
  title: string;
  constructor(size: { x: number; y: number }, title: string) {
    this.x = size.x;
    this.y = size.y;
    this.title = title;
  }

  private fillProperties(
    properties:
      | customFormType.addButton
      | customFormType.addCloseButton
      | customFormType.addHoverText
      | customFormType.addImage
      | customFormType.addText
  ): customFormType.all {
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

  addElement(
    type: "button" | "text" | "image" | "hover_text" | "close_button" | "custom",
    properties:
      | customFormType.addButton
      | customFormType.addText
      | customFormType.addImage
      | customFormType.addHoverText
      | customFormType.addCloseButton
      | customFormType.all
  ) {
    this.elements.push(this.fillProperties(properties));
    return this;
  }
  getFormData() {
    return { elements: this.elements, x: this.x, y: this.y, title: this.title };
  }
}
const custom_form = new customFormClass({ x: 200, y: 200 }, "たいとるのもじれつ！2");
custom_form
  .addElement("custom", {
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
  })
  .addElement("custom", {
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
  })
  .addElement("custom", {
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
  })
  .addElement("close_button", {}); //だめそう
export const FORM_DATA = custom_form.getFormData();
