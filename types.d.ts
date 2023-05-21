import {TemplateInstance} from "lit-html";

export declare const makewc: (tag_name: string, component_class: HTMLElement) => HTMLElement;

export declare class Base extends HTMLElement {
    shadow: ShadowRoot;
    template(component: Base): TemplateInstance;
    pre(): Promise<void>;
    init(): Promise<void>;
    setupError(): void;
    render(): void;
    popBubble(evt: Event, preventDefault: boolean): void;
}

export declare class FormBase extends Base {
    get data(): any;
    set data(value: any);
    handleChange(evt): void;
}