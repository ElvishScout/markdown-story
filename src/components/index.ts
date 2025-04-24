interface ComponentModule {
  default: typeof HTMLElement & {
    options?: ElementDefinitionOptions;
  };
}

export const defineComponents = async () => {
  return Promise.all(
    Object.entries({
      ...import.meta.glob(`./components/*.ts`),
      ...import.meta.glob(`./components/*/index.ts`),
    }).map(async ([path, module]) => {
      const tagName = /([^/]+)\/index\.ts$|([^/]+)\.ts$/.exec(path)?.[1] ?? "";
      if (tagName) {
        const Component = ((await module()) as ComponentModule).default;
        customElements.define(tagName, Component, Component.options);
      }
    })
  );
};
