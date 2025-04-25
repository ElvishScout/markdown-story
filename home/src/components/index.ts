type ComponentModule = {
  default: typeof HTMLElement & {
    options?: ElementDefinitionOptions;
  };
};

export const defineComponents = () => {
  Object.entries({
    ...import.meta.glob(`./components/*.ts`, { eager: true }),
    ...import.meta.glob(`./components/*/index.ts`, { eager: true }),
  }).forEach(([path, module]) => {
    const tagName = /([^/]+)\/index\.ts$|([^/]+)\.ts$/.exec(path)?.[1] ?? "";
    if (tagName) {
      const Component = (module as ComponentModule).default;
      customElements.define(tagName, Component, Component.options);
    }
  });
};
