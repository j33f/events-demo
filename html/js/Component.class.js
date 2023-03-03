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

  _renderProperties() {
    let properties = [];

    Object.keys(this.properties).forEach(key => {
      if (typeof this.properties[key] === 'function') {
        this.eventEmitter.on(`${this.id}:${key}`, this.properties[key]);
        const funcName = 'f' + self.crypto.randomUUID().replaceAll('-', '_');
        const script = document.createElement('script');
        script.innerHTML = `function ${funcName}(e){globalThis.eventEmitter.emit('${this.id}:${key}', e);}`;
        document.body.appendChild(script);
        properties.push(`${key.toLowerCase()}="${funcName}()"`);
      } else {
        properties.push(`${key.toLowerCase()}="${JSON.stringify(this.properties[key])}" `);
      }
    });

    return properties.join(' ');
  }

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

  addComponent(componentProperties) {
    const component = new Component({ ...componentProperties, parent: this });
    this.components.push(component);
    return component;
  }
}

export default Component;