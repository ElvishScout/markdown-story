import "./style.css";

const insertContent = (text: string, content: string) => {
  const dom = new DOMParser().parseFromString(text, "text/html");
  const template = dom.querySelector("#content") as HTMLTemplateElement;
  template.content.querySelector("pre")!.textContent = content;

  let source = dom.documentElement.outerHTML;
  const { doctype } = dom;
  if (doctype) {
    const { name, publicId, systemId } = doctype;
    const doctypeStr =
      "<!DOCTYPE" +
      (name ? ` ${name}` : "") +
      (publicId ? ` PUBLIC "${publicId}"` : "") +
      (systemId ? ` "${systemId}"` : "") +
      ">";
    source = doctypeStr + source;
  }

  return source;
};

export const createPreview = async (root: HTMLElement) => {
  const content = sessionStorage.getItem("content");
  if (content === null) {
    location.href = "?mode=editor";
    return;
  }

  const template = await (await fetch("/template.html")).text();
  const srcdoc = insertContent(template, content);
  const blob = new Blob([srcdoc], { type: "text/html" });
  const dataUrl = URL.createObjectURL(blob);

  const tools = document.createElement("div");
  tools.classList.add("preview-tools");
  root.append(tools);

  const anchor = document.createElement("a");
  anchor.innerText = "Download Standalone HTML";
  anchor.download = "download.html";
  anchor.href = dataUrl;
  tools.append(anchor);

  const frame = document.createElement("iframe");
  frame.classList.add("preview-frame");
  frame.title = "preview";
  frame.src = dataUrl;
  root.append(frame);
};
