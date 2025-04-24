export * from "./base";

import { StoryBase, parseStoryContent } from "./base";

export class Story extends StoryBase {
  constructor(content: string) {
    super(parseStoryContent(content));
  }
}
