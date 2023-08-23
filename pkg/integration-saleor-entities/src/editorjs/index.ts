import EditorJS, { OutputData } from "@editorjs/editorjs";
import edjsHTML from "editorjs-html";

export class EditorJSHelper {
  private readonly editorJS: EditorJS;

  constructor() {
    this.editorJS = new EditorJS({
      holder: "editorjs",
      readOnly: true,
      tools: {},
    });
  }

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
   * Takes HTML and tries to convert it to editorJS blocks data
   * @param html
   */
  public async HTMLToEditorJS(html: string) {
    const data = await this.editorJS.blocks.renderFromHTML(html);
    return data;
  }
}
