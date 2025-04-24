import "./style.css";

export default class extends HTMLElement {
  constructor() {
    super();
    
    const childAttrs = ["name", "type", "value", "checked", "required", "readonly", "aria-label"];

    this.classList.add("fc-input");
    const type = this.getAttribute("type");
    if (type !== null) {
      this.classList.add(`fc-input-${type}`);
    }

    const input = document.createElement("input");
    for (const name of childAttrs) {
      const value = this.getAttribute(name);
      if (value !== null) {
        input.setAttribute(name, value);
        this.removeAttribute(name);
      }
    }
    this.append(input);

    if (input.type === "text") {
      const div = document.createElement("div");
      input.addEventListener("input", () => {
        div.innerText = input.value;
      });
      div.innerText = input.value;
      this.append(div);
    } else if (input.type === "checkbox") {
      const div = document.createElement("div");
      this.append(div);
    }
  }
}
