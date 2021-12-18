/**
 * make-component
 *
 * A simple module that creates a reasonably constructed web component class.
 */
import { html, render } from "lit-html";

/**
 * Create a new web component
 *
 * While we suggest the Base class provided by this module, it can be any class that extends HTMLElement.
 *
 * @param tag_name - A properly formatted tag name for the web component such as "my-tag-name".
 * @param component_class - The class to use as the base for the web component.
 * @returns {HTMLElement} - The class provided by the `component_class` variable for easy exporting.
 */
export const makewc = (tag_name, component_class) => {
    customElements.define(tag_name, component_class);
    return component_class;
};

/**
 * A simple web components base class
 *
 * This class provides a few nice hooks for the process, but doesn't get to crazy. These hooks are 100% about providing
 * a few nice pre and post render check points. The hooks are all async functions. If you override them with functions
 * that do not return a promise or don't have the `async` keywords, the component will fail horribly.
 *
 * It should be noted that both `pre` and `init` are only run when the component is created and after it's first render.
 *
 * It should also be noted that subsequent renders are your responsibility.
 */
export class Base extends HTMLElement {
    constructor() {
        super();
        this.___CAN_RENDER___ = false;
    }
    connectedCallback() {
        this.pre()
            .then(() => {
                this.___CAN_RENDER___ = true;
                this.render();
                return Promise.resolve();
            })
            .then(() => this.init())
            .catch((e) => this.setupError(e));
    }

    /**
     * Defines the lit-html template to use for rendering the component.
     *
     * The template is expected to be a lit-html `html` tagged template string. The template is passed `this` so that
     * the implementor can be cool kids and dereference things out of the object like this:
     * ```
     * template({ some, stuff }) {
     *     return html`<p>We were talking about ${some} ${stuff}</p>`;
     * }
     * ```
     *
     * @param object component
     */
    template(component) {
        console.warn("There is not template defined.")
        return html``;
    }

    /**
     * A NO-OP function meant to be overridden.
     *
     * This runs once on connectedCallback. It is not intended to be re-run.
     * @returns {Promise<void>}
     */
    async pre() {
        // noop
    }

    /**
     * A NO-OP function meant to be overridden.
     *
     * This is run once after the first render.
     * @returns {Promise<void>}
     */
    async init() {
        // noop
    }

    /**
     * An error handling function that can be overriden.
     *
     * The default behavior is to log the error.
     * @param error
     */
    setupError(error) {
        console.error("Unhandled setup error", error);
    }

    /**
     * This function uses lit-html to render the provided template.
     *
     * Please note that this function does not call any of the hooks. Those only run once automatically on
     * connectedCallback.
     */
    render() {
        if (this.___CAN_RENDER___) render(this.template(this), this);
    }

    /**
     * A nice way to stop event bubbling
     *
     * @param {Event} evt a browser event that can bubble
     * @param {boolean} preventDefault a flag that if set to true will run `evt.preventDefault()`
     */
    popBubble(evt, preventDefault) {
        evt.stopPropagation();
        evt.stopImmediatePropagation();
        if (preventDefault) {
            evt.preventDefault()
        }
    }
}
