# make-component

A super simple way to make web components.

## Getting Started

Right now the module is in pre-release. For right now you can just install from the git repository. Eventually, I'll add this to npm like the other cool kids do.

Oh, and I'll add tests at some point, but since this module is a single file with very little in the way of functionality it's not a super big priority for me.

For now, just install it via git repo.

```shell script
npm install --save blargism/make-component
```

## Usage

Using the module is pretty simple. To make a new component just do the following:

```javascript
import { makewc, Base } from "make-component";

export default makewc("fancy-component", class extends Base {
    get stuff() {
        return this._stuff;
    }

    set stuff(value) {
        this._stuff = value;
        this.render();
    }

    async pre() {
        this._stuff = "stuff";
    }
    
    template({ _stuff }) {
        return html`<p>We are doing some ${_stuff}.</p>`;
    }
    
    async init() {
        const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                this.stuff = "things";
                resolve();
            }, 3000);
        });
        
        await promsie;
    }
});
```

This utterly useless component will tell you we are doing stuff, then change its mind three seconds later and tell you we are doing things. A better use of `pre` and `init` is to have `pre` set initial values, and `init` load the actual values you want from a web service.

## API

The following get exported by this module, ES6 style.

### `makeit`

This function creates a new web component based on the tag name and provided HTMLElement class. It requires these two properties.

`tag_name` - The name of the tag in proper web component format (AKA tag-name).
`component_class` - A class extending HTMLElement, such as the `Base` class provided by this module.

### `Base`

A class extending HTMLElement that provides some basic initialization hooks.

#### Methods

These are methods intended to be implemented/overriden.

`pre` - An `async` method that is run right after the system calls `connectedCallback`. It takes no parameters. It is intended as a place to set initial values. Render gets called directly after this function's promise resolves.

`template` - A method that should return a `TemplateResult` from lit-html's `html` utility. `This` is passed to the method. It is called by the internal function `render`.

`init` - An `async` method called just after the first render. It takes no parameters. It is most often used to load data. Render gets called directly after this function's promise resolves.

## License

Copyright 2020 Joe Mills

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.