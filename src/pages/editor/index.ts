import "./style.css";

import FcEditor from "@/src/components/components/fc-editor";

export const createEditor = (root: HTMLElement) => {
  document.title = "Source Editor";

  const heading = document.createElement("h1");
  heading.classList.add("editor-heading");
  heading.innerText = "Source Editor";
  root.append(heading);

  const tools = document.createElement("div");
  tools.classList.add("editor-tools");
  root.append(tools);

  const label = document.createElement("label");
  tools.append(label);

  const span = document.createElement("span");
  span.innerText = "Tab size:";
  label.append(span);

  const select = document.createElement("select");
  select.classList.add("editor-tabsize");
  label.append(select);

  for (let i = 1; i <= 8; i++) {
    const option = document.createElement("option");
    option.innerText = option.value = `${i}`;
    select.append(option);
  }

  const button = document.createElement("button");
  button.classList.add("preview-button");
  button.type = "button";
  button.innerText = "Preview";
  tools.append(button);

  const editor = document.createElement("textarea", { is: "fc-editor" }) as FcEditor;
  editor.ariaLabel = "editor";
  root.append(editor);

  select.oninput = () => {
    editor.tabSize = parseInt(select.value);
  };
  select.value = "2";
  editor.tabSize = 2;

  button.onclick = () => {
    sessionStorage.setItem("content", editor.value);
    window.open("?mode=viewer", "_blank");
  };

  const content = sessionStorage.getItem("content");
  if (content !== null) {
    editor.value = content;
  }
};
