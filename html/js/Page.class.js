import Component from './Component.class.js';

class Page extends Component {
  constructor(properties, eventEmitter) {
    super(properties);
    this.parent = properties.parent || document.body;
    this.eventEmitter = eventEmitter;
    this.element = document.body;
    this.id = 'page';
  }

  _render() {
    // do nothing here, We want the page to be rendered when the document is ready
  }

  render() {
    console.log(this);
    this.parent.innerHTML = this.html || this.parent.innerHTML;

    Object.keys(this.properties).forEach(key => {
      if (typeof this.properties[key] === 'function') {
        this.eventEmitter.on(`${this.id}:${key}`, this.properties[key]);
        this.parent[key.toLowerCase()] = (e) => this.eventEmitter.emit(`${this.id}:${key}`, e);
      } else {
        this.parent[key.toLowerCase()] = JSON.stringify(this.properties[key]);
      }
    });
  }

  addComponent(componentProperties) {
    const component = new Component({ ...componentProperties, parent: this });
    this.components.push(component);
    return component;
  }
}

export default Page;