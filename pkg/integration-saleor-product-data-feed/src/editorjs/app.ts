/* eslint-disable */

import { OutputData } from "@editorjs/editorjs";

type parser = {
  parse(OutputData: OutputData): Array<string>;
  parseStrict(OutputData: OutputData): Array<string> | Error;
  parseBlock(block: block): string;
  validate(OutputData: OutputData): Array<string>;
};

const parser = (plugins = {}): parser => {
  const parsers = Object.assign({}, transforms, plugins);

  return {
    parse: ({ blocks }) => {
      return blocks.map((block) => {
        return parsers[block.type]
          ? parsers[block.type](block)
          : ParseFunctionError(block.type);
      });
    },

    parseBlock: (block) => {
      return parsers[block.type]
        ? parsers[block.type](block)
        : ParseFunctionError(block.type);
    },

    parseStrict: ({ blocks }) => {
      const parserFreeBlocks = parser(parsers).validate({ blocks });

      if (parserFreeBlocks.length) {
        throw new Error(
          `Parser Functions missing for blocks: ${parserFreeBlocks.toString()}`,
        );
      }

      const parsed = [];

      for (let i = 0; i < blocks.length; i++) {
        if (!parsers[blocks[i].type]) throw ParseFunctionError(blocks[i].type);

        parsed.push(parsers[blocks[i].type](blocks[i]));
      }

      return parsed;
    },

    validate: ({ blocks }) => {
      const types = blocks
        .map((item: block) => item.type)
        .filter(
          (item: string, index: number, blocksArr: Array<string>) =>
            blocksArr.indexOf(item) === index,
        );

      const parser_keys = Object.keys(parsers);

      return types.filter((type) => !parser_keys.includes(type));
    },
  };
};

export default parser;

export function ParseFunctionError(type: string) {
  return new Error(`\x1b[31m The Parser function of type "${type}" is not defined. \n
  Define your custom parser functions as: \x1b[34mhttps://github.com/pavittarx/editorjs-html#extend-for-custom-blocks \x1b[0m`);
}

export type transforms = {
  [key: string]: any;
  delimiter(): string;
  header(block: block): string;
  paragraph(block: block): string;
  list(block: block): string;
  image(block: block): string;
  quote(block: block): string;
  code(block: block): string;
  embed(block: block): string;
};

type ListItem = {
  content: string;
  items: Array<ListItem>;
};

export type block = {
  type: string;
  data: {
    text?: string;
    level?: number;
    caption?: string;
    url?: string;
    file?: {
      url?: string;
    };
    stretched?: boolean;
    withBackground?: boolean;
    withBorder?: boolean;
    items?: Array<string> | Array<ListItem>;
    style?: string;
    code?: string;
    service?: "vimeo" | "youtube";
    source?: string;
    embed?: string;
    width?: number;
    height?: number;
  };
};

const transforms: transforms = {
  delimiter: () => {
    return `<br/>`;
  },

  header: ({ data }) => {
    return `<h${data.level}>${data.text}</h${data.level}>`;
  },

  paragraph: ({ data }) => {
    return `<p>${data.text}</p>`;
  },

  list: ({ data }) => {
    const listStyle = data.style === "unordered" ? "ul" : "ol";

    const recursor = (items: any, listStyle: string) => {
      const list = items.map((item: any) => {
        if (!item.content && !item.items) return `<li>${item}</li>`;

        let list = "";
        if (item.items) list = recursor(item.items, listStyle);
        if (item.content) return `<li> ${item.content} </li>` + list;

        return list;
      });

      return `<${listStyle}>${list.join("")}</${listStyle}>`;
    };

    return recursor(data.items, listStyle);
  },

  image: ({ data }) => {
    const caption = data.caption ? data.caption : "Image";
    return `<img src="${
      data.file && data.file.url ? data.file.url : data.url
    }" alt="${caption}" />`;
  },

  quote: ({ data }) => {
    return `<blockquote>${data.text}</blockquote> - ${data.caption}`;
  },

  code: ({ data }) => {
    return `<pre><code>${data.code}</code></pre>`;
  },

  embed: ({ data }) => {
    switch (data.service) {
      case "vimeo":
        return `<iframe src="${data.embed}" height="${data.height}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
      case "youtube":
        return `<iframe width="${data.width}" height="${data.height}" src="${data.embed}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      default:
        throw new Error(
          "Only Youtube and Vime Embeds are supported right now.",
        );
    }
  },
};
