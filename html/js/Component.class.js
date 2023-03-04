const selfClosingTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

class Component {
  id = self.crypto.randomUUID();
  type = 'div';
  html = '';
  parent = document.body;
  element;
  eventListeners = [];
  eventEmitter;
  components = [];
  properties = {};

  constructor({ id, type, html, parent, ...properties }) {
    this.id = id || this.id;
    this.type = type || this.type;
    this.html = html;
    this.parent = parent || this.parent;
    this.properties = properties || this.properties;
    this.eventEmitter = this.parent.eventEmitter;

    this._render();
  }

  /**
   * Render the properties of the component
   * @private
   * @returns string
   */
  _renderProperties() {
    let properties = [];

    Object.keys(this.properties).forEach(key => {
      if (typeof this.properties[key] === 'function') {
        // If the property is a function, it is certainly an event listener
        // As we want to transmit the event to all other components, we need to wrap the function

        // first, we add the a listener to the global event emitter so that the given (original) function can be called
        this.eventEmitter.on(`${this.id}:${key}`, this.properties[key]);
        // the we generate a unique function name
        const funcName = 'f' + self.crypto.randomUUID().replaceAll('-', '_');
        // then we create a script element and add the function to it
        const script = document.createElement('script');
        // the function will call the global event emitter with the event and the id of the component
        script.innerHTML = `function ${funcName}(e){globalThis.eventEmitter.emit('${this.id}:${key}', e);}`;
        // finally, we add the script to the document
        document.body.appendChild(script);
        // and add the function name to the properties
        properties.push(`${key.toLowerCase()}="${funcName}()"`);

        /**
         * Let's say we have a component with an onClick property which is a function Fn()
         * We want to call the function Fn() when the component is clicked and allow other components to listen to the event
         * Let's say that the random function name is f_1234567890abcdef
         * We will create a script element with the following content:
         * <script>
         *  function f_1234567890abcdef(e) {
         *   globalThis.eventEmitter.emit('component-id:onClick', e);
         * }
         * </script>
         * Then we will add the following attribute to the component:
         * onclick="f_1234567890abcdef()"
         * When the component is clicked, the function f_1234567890abcdef will be called
         * The function will call the global event emitter with the event and the id of the component
         * The global event emitter will then call the function Fn() of the component
         * The function Fn() will be called with the event as parameter
         * The function Fn() can then do whatever it wants with the event
         * Every other component can listen to the event by calling the following:
         * globalThis.eventEmitter.on('component-id:onClick', AnotherFn);
         */

      } else {
        properties.push(`${key.toLowerCase()}="${JSON.stringify(this.properties[key])}" `);
      }
    });

    return properties.join(' ');
  }

  /**
   * Render the component into its parent
   * @private
   */
  _render() {
    console.log(this);
    let html = `<${this.type} id="${this.id}"${this._renderProperties()}`;
    if (!selfClosingTags.includes(this.type)) {
      html += `></${this.type}>`;
    } else {
      html += ` />`;
    }
    this.parent.element.insertAdjacentHTML('beforeend', html);
    this.element = document.getElementById(this.id);
    this.element.innerHTML = this.html;
  }

  /**
   * Add a child component to the current component
   * @param {*} componentProperties
   * @returns Component
   * @public
   */
  addComponent(componentProperties) {
    const component = new Component({ ...componentProperties, parent: this });
    this.components.push(component);
    return component;
  }
}

export default Component;