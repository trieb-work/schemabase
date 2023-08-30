/* eslint-disable no-case-declarations */
import { OutputBlockData, OutputData } from "@editorjs/editorjs";
import edjsHTML from "editorjs-html";
import { JSDOM } from "jsdom";

class EditorJSHelper {
  /**
   * Takes the editorJS JSONString data and converts it to HTML
   * @param editorJs
   */
  public async editorJsToHTML(editorJs: OutputData) {
    const edjsParser = edjsHTML();
    const html = edjsParser.parse(editorJs);
    return html;
  }

  /**
   * Takes HTML and tries to convert it to editorJS blocks data.
   * Should work on the server side.
   * @param html
   */
  public async HTMLToEditorJS(
    html: string,
  ): Promise<{ blocks: OutputBlockData[] }> {
    const blocks: OutputBlockData[] = [];
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const body = document.body;

    Array.from(body.children).forEach((element) => {
      switch (element.tagName) {
        case "P":
          const innerHTML = element.innerHTML.replace(/<br>/g, "\n");
          blocks.push({
            type: "paragraph",
            data: {
              text: innerHTML,
            },
          });
          break;
        case "UL":
          const items = Array.from(element.children).map((li) =>
            li.innerHTML.replace(/<br>/g, "\n"),
          );
          blocks.push({
            type: "list",
            data: {
              style: "unordered",
              items,
            },
          });
          break;
        case "OL":
          const orderedItems = Array.from(element.children).map((li) =>
            li.innerHTML.replace(/<br>/g, "\n"),
          );
          blocks.push({
            type: "list",
            data: {
              style: "ordered",
              items: orderedItems,
            },
          });
          break;
        case "H1":
        case "H2":
        case "H3":
        case "H4":
        case "H5":
        case "H6":
          blocks.push({
            type: "header",
            data: {
              text: element.innerHTML.replace(/<br>/g, "\n"),
              level: parseInt(element.tagName.substring(1)),
            },
          });
          break;
        case "A":
          blocks.push({
            type: "paragraph",
            data: {
              text: `<a href="${(element as any).href}">${
                (element as any).textContent
              }</a>`,
            },
          });
          break;
        default:
          // handle other tags or ignore
          break;
      }
    });

    return { blocks };
  }
}
const editorJsHelper = new EditorJSHelper();

export { editorJsHelper };
