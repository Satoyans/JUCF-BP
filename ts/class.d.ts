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

declare class customFormClass {
  addElement(type: "custom", properties: customFormType.all): customFormClass;
  addElement(type: "button", properties: customFormType.addButton): customFormClass;
  addElement(type: "text", properties: customFormType.addText): customFormClass;
  addElement(type: "image", properties: customFormType.addImage): customFormClass;
  addElement(type: "hover_text", properties: customFormType.addHoverText): customFormClass;
  addElement(type: "close_button", properties: customFormType.addCloseButton): customFormClass;
}
