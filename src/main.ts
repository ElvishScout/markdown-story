import "./style.css";

import { defineComponents } from "./components";
import { createViewer } from "./pages/viewer";
import { decodeAndDecompress } from "./utils/codec";

import icon from "./assets/icon.png";
import { createEditor } from "./pages/editor";

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

  if (mode === "viewer") {
    root.classList.add("viewer");
    createViewer(root);
  } else {
    root.classList.add("editor");
    createEditor(root);
  }
};

defineComponents();
createApp(document.querySelector("#root")!);
