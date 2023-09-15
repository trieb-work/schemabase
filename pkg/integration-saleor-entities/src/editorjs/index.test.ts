/* eslint-disable max-len */
// test the editorjshelper library. Test both ways - html to editorJS and back
// Path: pkg/integration-saleor-entities/src/editorjs/index.test.ts
import { editorJsHelper } from "./index";
import { describe, it, expect } from "@jest/globals";

describe("editorJsHelper", () => {
    /**
     * The HTML we are using for testing
     */
    const html = `<h2>Editor.js</h2>
    <p>Hey. Meet the new Editor. On this page you can see it in action — try to edit this text.</p>
    <h3>Key features</h3>
    <ul>
    <li>It is a block-styled editor</li>
    <li>It returns clean data output in JSON</li>
    <li>Designed to be extendable and pluggable with a simple API</li>
    </ul>
    <h3>What does it mean «block-styled editor»</h3>
    <p>Workspace in classic editors is made of a single contenteditable element, used to create different HTML markups. Editor.js <mark class="cdx-marker">workspace consists of separate Blocks: paragraphs, headings, images, lists, quotes, etc</mark>. Each of them is an independent contenteditable element (or more complex structure) provided by Plugin and united by Editor's Core.</p>
    <p>There are dozens of <a href="">ready-to-use Blocks</a> and the <a href="https://editorjs.io/creating-a-block-tool">simple API</a> for creation any Block you need. For example, you can implement Blocks for Tweets, Instagram posts, surveys and polls, CTA-buttons and even games.</p>`;

    /**
     * The editorJS json we are using for testing
     */
    const editorJs = {
        blocks: [
            {
                type: "header",
                data: {
                    text: "Editor.js",
                    level: 2,
                },
            },
            {
                type: "paragraph",
                data: {
                    text: "Hey. Meet the new Editor. On this page you can see it in action — try to edit this text.",
                },
            },
            {
                type: "header",
                data: {
                    text: "Key features",
                    level: 3,
                },
            },
            {
                type: "list",
                data: {
                    style: "unordered",
                    items: [
                        "It is a block-styled editor",
                        "It returns clean data output in JSON",
                        "Designed to be extendable and pluggable with a simple API",
                    ],
                },
            },
            {
                type: "header",
                data: {
                    text: "What does it mean «block-styled editor»",
                    level: 3,
                },
            },
            {
                type: "paragraph",
                data: {
                    text: 'Workspace in classic editors is made of a single contenteditable element, used to create different HTML markups. Editor.js <mark class="cdx-marker">workspace consists of separate Blocks: paragraphs, headings, images, lists, quotes, etc</mark>. Each of them is an independent contenteditable element (or more complex structure) provided by Plugin and united by Editor\'s Core.',
                },
            },
            {
                type: "paragraph",
                data: {
                    text: 'There are dozens of <a href="">ready-to-use Blocks</a> and the <a href="https://editorjs.io/creating-a-block-tool">simple API</a> for creation any Block you need. For example, you can implement Blocks for Tweets, Instagram posts, surveys and polls, CTA-buttons and even games.',
                },
            },
        ],
    };

    it("should convert HTML to editorJS", async () => {
        const parsedEditorJs = await editorJsHelper.HTMLToEditorJS(html);
        expect(parsedEditorJs).toEqual(editorJs);
    });

    it("should convert HTML to editorJS. It should work also when HTML is just a regular text", async () => {
        const text =
            'Universal ground rod clamp. Fits ¼" - 1¼" ground rods. <br>To use with ½" or smaller rods, simply reverse the face plate.';
        const parsedEditorJs = await editorJsHelper.HTMLToEditorJS(text);
        const expectedEditorJs = {
            blocks: [
                {
                    type: "paragraph",
                    data: {
                        text: 'Universal ground rod clamp. Fits ¼" - 1¼" ground rods.',
                    },
                },
                {
                    type: "paragraph",
                    data: {
                        text: 'To use with ½" or smaller rods, simply reverse the face plate.',
                    },
                },
            ],
        };
        expect(parsedEditorJs).toEqual(expectedEditorJs);
    });
});
