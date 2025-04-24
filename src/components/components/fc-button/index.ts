import "./style.css";

export default class extends HTMLElement {
  constructor() {
    super();

    const childAttrs = ["name", "type", "value"];

    this.classList.add("fc-button");
    const type = this.getAttribute("type");
    if (type !== null) {
      this.classList.add(`fc-button-${type}`);
    }

    const button = document.createElement("button");
    for (const name of childAttrs) {
      const value = this.getAttribute(name);
      if (value !== null) {
        button.setAttribute(name, value);
        this.removeAttribute(name);
      }
    }
    while (this.firstChild) {
      button.append(this.removeChild(this.firstChild));
    }
    this.append(button);
  }
}
