import "./style.css";

import { createPreview } from "./pages/preview";
import { createEditor } from "./pages/editor";
import { decodeAndDecompress } from "./utils/codec";

import icon from "./assets/icon.png";

const createApp = async (root: HTMLElement) => {
  const link = document.querySelector("link[rel=icon]") as HTMLLinkElement | null;
  if (link) {
    link.href = icon;
  }

  const { searchParams } = new URL(location.href);

  const mode = searchParams.get("mode");
  const content = searchParams.get("content");

  if (content !== null) {
    const decodedContent = await decodeAndDecompress(content);
    sessionStorage.setItem("content", decodedContent);
  }

  if (mode === "preview") {
    root.classList.add("preview");
    createPreview(root);
  } else {
    root.classList.add("editor");
    createEditor(root);
  }
};

createApp(document.querySelector("#root")!);
