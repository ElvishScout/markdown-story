import "./style.css";

import { defineComponents } from "./components";
import { createViewer } from "./pages/viewer";
import { decode } from "./utils/b64u";

import icon from "./assets/icon.png";
import { createEditor } from "./pages/editor";

defineComponents();

const link = document.querySelector("link[rel=icon]") as HTMLLinkElement | null;
if (link) {
  link.href = icon;
}

const root = document.querySelector("#root") as HTMLDivElement;

const { searchParams } = new URL(location.href);

const container = document.createElement("div");
container.classList.add("container");
root.append(container);

const mode = searchParams.get("mode");
const content = searchParams.get("content");

if (content !== null) {
  sessionStorage.setItem("content", decode(content));
}

if (mode === "viewer") {
  container.classList.add("viewer");
  createViewer(container);
} else {
  container.classList.add("editor");
  createEditor(container);
}
