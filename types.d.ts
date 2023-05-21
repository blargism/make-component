import {TemplateInstance} from "lit-html";

declare const makewc: (tag_name: string, component_class: HTMLElement) => HTMLElement;

declare class Base extends HTMLElement {
    template(component: Base): TemplateInstance;
    pre(): Promise<void>;
    init(): Promise<void>;
    setupError(): void;
    render(): void;
    popBubble(evt: Event, preventDefault: boolean): void;
}

declare class FormBase extends Base {
    get data(): any;
    set data(value: any);
    handleChange(evt): void;
}