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

        // Process inner text of an element, preserving certain HTML tags
        const processInnerText = (
            element: Element | ChildNode,
            trim = false,
        ): string => {
            if (element.nodeType === dom.window.Node.TEXT_NODE) {
                if (trim) {
                    return element.textContent?.trim() || "";
                }

                return element.textContent || "";
            } else if (element.nodeType === dom.window.Node.ELEMENT_NODE) {
                const el = element as HTMLElement;
                let textContent = "";
                Array.from(el.childNodes).forEach((child) => {
                    textContent += processInnerText(child, trim);
                });
                // Adjust for <a> and convert <strong> to <b> to align with EditorJS's formatting
                if (el.tagName === "A") {
                    return `<a href="${el.getAttribute(
                        "href",
                    )}">${textContent}</a>`;
                } else if (el.tagName === "STRONG") {
                    // Convert to <b> to align with EditorJS's default bold representation
                    return `<b>${textContent}</b>`;
                } else if (el.tagName === "MARK") {
                    return `<mark>${textContent}</mark>`;
                }
                return textContent;
            }
            return "";
        };

        const processElement = (element: HTMLElement) => {
            switch (element.tagName) {
                case "P":
                    let innerText = processInnerText(element);
                    blocks.push({
                        type: "paragraph",
                        data: {
                            text: innerText,
                        },
                    });
                    break;
                case "UL":
                case "OL":
                    const listItems = Array.from(element.children)
                        .filter(
                            (li) =>
                                li.tagName === "LI" && li.textContent?.trim(),
                        )
                        .map((li) => processInnerText(li, true));
                    if (listItems.length > 0) {
                        blocks.push({
                            type: "list",
                            data: {
                                style:
                                    element.tagName === "UL"
                                        ? "unordered"
                                        : "ordered",
                                items: listItems,
                            },
                        });
                    }
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
                            text: `<a href="${element.getAttribute("href")}">${
                                element.textContent
                            }</a>`,
                        },
                    });
                    break;
                /**
                 * handle div: just remove it and run the children
                 */
                case "DIV":
                    Array.from(element.children).forEach((child) => {
                        if (child.nodeType === dom.window.Node.ELEMENT_NODE) {
                            const el = child as HTMLElement;
                            processElement(el);
                        }
                    });
                    break;

                default:
                    break;
            }
        };

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
                processElement(element);
            }
        });

        return { blocks };
    }

    /**
     * compare editorJS stringified data.
     * just compares the blocks and data of the blocks. Returns true if they are the same.
     */
    public compareEditorJsData(data1: string, data2: string): boolean {
        const normalizedData1 = this.normalizeEditorJSData(JSON.parse(data1));
        const normalizedData2 = this.normalizeEditorJSData(JSON.parse(data2));

        return (
            JSON.stringify(normalizedData1) === JSON.stringify(normalizedData2)
        );
    }

    private normalizeEditorJSData(data: any): object {
        // Sort blocks to ensure order does not matter
        if (!data.blocks) {
            throw new Error("Invalid EditorJS data. Can't compare");
        }
        const sortedBlocks = data.blocks.map((block: any) => {
            const sortedData = Object.keys(block.data)
                .sort()
                .reduce((acc, key) => {
                    acc[key] = block.data[key];
                    return acc;
                }, {} as any);

            return {
                type: block.type,
                data: sortedData,
            };
        });

        // Sort the outer blocks array based on type and data for consistency
        sortedBlocks.sort((a: any, b: any) =>
            JSON.stringify(a).localeCompare(JSON.stringify(b)),
        );

        return {
            blocks: sortedBlocks,
        };
    }
}
const editorJsHelper = new EditorJSHelper();

export { editorJsHelper };
