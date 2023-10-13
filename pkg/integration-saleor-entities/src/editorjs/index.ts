/* eslint-disable no-case-declarations */
import type { OutputBlockData, OutputData } from "@editorjs/editorjs";
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

        Array.from(body.childNodes).forEach((node) => {
            if (
                node.nodeType === dom.window.Node.TEXT_NODE &&
                node.textContent?.trim()
            ) {
                // Handle regular text
                blocks.push({
                    type: "paragraph",
                    data: {
                        text: node.textContent.trim(),
                    },
                });
            } else if (node.nodeType === dom.window.Node.ELEMENT_NODE) {
                const element = node as HTMLElement;
                switch (element.tagName) {
                    case "P":
                        let innerText = "";
                        Array.from(element.childNodes).forEach((child) => {
                            if (
                                child.nodeType === dom.window.Node.TEXT_NODE &&
                                child.textContent
                            ) {
                                innerText += child.textContent;
                            } else if (
                                child.nodeType === dom.window.Node.ELEMENT_NODE
                            ) {
                                const el = child as HTMLElement;
                                switch (el.tagName) {
                                    case "A":
                                        innerText += `<a href="${el.getAttribute(
                                            "href",
                                        )}">${el.textContent}</a>`;
                                        break;
                                    case "STRONG":
                                        innerText += `<strong>${el.textContent}</strong>`;
                                        break;
                                    default:
                                        innerText += el.outerHTML;
                                }
                            }
                        });
                        blocks.push({
                            type: "paragraph",
                            data: {
                                text: innerText.replace(/<br>/g, "\n"),
                            },
                        });
                        break;
                    case "UL":
                    case "OL":
                        const items = Array.from(element.children).map((li) =>
                            li.innerHTML.replace(/<br>/g, "\n"),
                        );
                        blocks.push({
                            type: "list",
                            data: {
                                style:
                                    element.tagName === "UL"
                                        ? "unordered"
                                        : "ordered",
                                items,
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
                                text: `<a href="${element.getAttribute(
                                    "href",
                                )}">${element.textContent}</a>`,
                            },
                        });
                        break;
                    default:
                        // handle other tags or ignore
                        break;
                }
            }
        });

        return { blocks };
    }
}
const editorJsHelper = new EditorJSHelper();

export { editorJsHelper };
