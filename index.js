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
        console.warn("There is not template defined.");
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
        if (this.___CAN_RENDER___) {
            if (this.shadow) {
                render(this.template(this), this.shadow);
            } else {
                render(this.template(this), this);
            }
        }
    }

    /**
     * A nice way to stop event bubbling
     *
     * @param {Event} evt a browser event that can bubble
     * @param {boolean} [preventDefault] a flag that if set to true will run `evt.preventDefault()`
     */
    popBubble(evt, preventDefault) {
        evt.stopPropagation();
        evt.stopImmediatePropagation();
        if (preventDefault) {
            evt.preventDefault();
        }
    }
}

/**
 * FormBase provides a means to update an object with form controls
 *
 * There is a bit of magic here, but it's pretty simple so it's probably ok. This
 * magic revolves around a change handler that looks for the "name" property and
 * the "value" property. There is also a consideration for checkboxes. It should
 * support text inputs, textboxes, selects, checkboxes, and radio buttons. Beyond
 * that it may not work super well.
 *
 * The "data" property is expected to be an object and the properties are updated
 * on that object based on the "name" of the form control and either the "value" or
 * "checked" property depending on the control type.
 *
 * There is a 10ms debounce to prevent duplicate triggers of "handleChange".
 *
 * Properties interest:
 * @param {object} data The data object to be updated on form changes, the setter triggers a render.
 * @method handleChange(evt)
 */
export class FormBase extends Base {
    constructor() {
        super();
        this._data = {};
        let debounceTimeout;

        const handler = (evt) => {
            // ignore
            if (evt.target === this || !evt.target.name) {
                return;
            }

            if (evt.target.type === "checkbox") {
                this.data[evt.target.name] = evt.target.hasAttribute("checked");
            } else {
                this.data[evt.target.name] = evt.target.value;
            }

            debounceTimeout = setTimeout(() => {
                clearTimeout(debounceTimeout);
                this.handleChange(evt);
            }, 10);
        };

        this.addEventListener("change", handler);
        this.addEventListener("input", handler);
    }

    get data() {
        return this._data;
    }

    /**
     * Sets the data property.
     *
     * If the value is not an object, the set is silently ignored.
     */
    set data(value) {
        if (typeof value != "object") {
            return;
        }
        this._data = value;
        this.render();
    }

    /**
     * handleChange should be overwritten by the implementing class
     *
     * By default this method swallows the change event from the form control and
     * dispatches an event from this class context.
     * @param {Event} evt
     */
    handleChange(evt) {
        this.popBubble(evt);
        this.dispatchEvent(new Event("change"));
    }
}
