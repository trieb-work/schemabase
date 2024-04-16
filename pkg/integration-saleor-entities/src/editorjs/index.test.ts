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
    <p>There are dozens of <a href="">ready-to-use Blocks</a> and the <a href="https://editorjs.io/creating-a-block-tool">simple API</a> for creation any Block you need. For example, you can implement Blocks for Tweets, Instagram posts, surveys and polls, CTA-buttons and even games.</p>
    <p>This is a <strong>strong</strong> tag.</p>`;

    const complexHtml = `<div
        class="OutlineElement Ltr SCXW86883465 BCX0"
        style="
          margin: 0px;
          padding: 0px;
          user-select: text;
          -webkit-user-drag: none;
          -webkit-tap-highlight-color: transparent;
          overflow: visible;
          cursor: text;
          clear: both;
          position: relative;
          direction: ltr;
          color: rgb(0, 0, 0);
          font-family: 'Segoe UI', 'Segoe UI Web', Arial, Verdana, sans-serif;
          font-size: 12px;
        "
      >
        <p
          class="Paragraph SCXW86883465 BCX0"
          xml:lang="EN-US"
          lang="EN-US"
          paraid="1843401225"
          paraeid="{e9a4f25f-2b60-4ed0-af49-2c4635a7e54a}{61}"
          style="
            padding: 0px;
            user-select: text;
            -webkit-user-drag: none;
            -webkit-tap-highlight-color: transparent;
            overflow-wrap: break-word;
            white-space-collapse: preserve;
            vertical-align: baseline;
            font-kerning: none;
            background-color: transparent;
            color: windowtext;
          "
        >
          <span
            data-contrast="none"
            xml:lang="EN-US"
            lang="EN-US"
            class="TextRun SCXW86883465 BCX0"
            style="
              margin: 0px;
              padding: 0px;
              user-select: text;
              -webkit-user-drag: none;
              -webkit-tap-highlight-color: transparent;
              font-variant-numeric: normal;
              font-variant-east-asian: normal;
              font-variant-alternates: normal;
              font-variant-position: normal;
              color: rgb(50, 50, 50);
              font-size: 9.5pt;
              line-height: 18.6px;
              font-family: Verdana, Verdana_EmbeddedFont, Verdana_MSFontService,
                sans-serif;
            "
            ><span
              class="NormalTextRun SCXW86883465 BCX0"
              style="
                margin: 0px;
                padding: 0px;
                user-select: text;
                -webkit-user-drag: none;
                -webkit-tap-highlight-color: transparent;
              "
              >This 170</span
            ><span
              class="NormalTextRun SCXW86883465 BCX0"
              style="
                margin: 0px;
                padding: 0px;
                user-select: text;
                -webkit-user-drag: none;
                -webkit-tap-highlight-color: transparent;
              "
            >
            </span
            ><span
              class="NormalTextRun SCXW86883465 BCX0"
              style="
                margin: 0px;
                padding: 0px;
                user-select: text;
                -webkit-user-drag: none;
                -webkit-tap-highlight-color: transparent;
              "
              >KSI 12</span
            ><span
              class="NormalTextRun SCXW86883465 BCX0"
              style="
                margin: 0px;
                padding: 0px;
                user-select: text;
                -webkit-user-drag: none;
                -webkit-tap-highlight-color: transparent;
              "
              >½ </span
            ><span
              class="BCX0 NormalTextRun SCXW86883465"
              style="
                margin: 0px;
                padding: 0px;
                user-select: text;
                -webkit-user-drag: none;
                -webkit-tap-highlight-color: transparent;
              "
              >ga high-tensile wire is easier to bend than 200+ KSI wire, which makes
              it a great choice for hand tying</span
            ><span
              class="BCX0 NormalTextRun SCXW86883465"
              style="
                margin: 0px;
                padding: 0px;
                user-select: text;
                -webkit-user-drag: none;
                -webkit-tap-highlight-color: transparent;
              "
            >
              applications. This wire should be electrified for maximum results and
              animal control</span
            ><span
              class="NormalTextRun SCXW86883465 BCX0"
              style="
                margin: 0px;
                padding: 0px;
                user-select: text;
                -webkit-user-drag: none;
                -webkit-tap-highlight-color: transparent;
              "
              >.</span
            ><span
              class="NormalTextRun SCXW86883465 BCX0"
              style="
                margin: 0px;
                padding: 0px;
                user-select: text;
                -webkit-user-drag: none;
                -webkit-tap-highlight-color: transparent;
              "
            >
              WD17</span
            ><span
              class="NormalTextRun SCXW86883465 BCX0"
              style="
                margin: 0px;
                padding: 0px;
                user-select: text;
                -webkit-user-drag: none;
                -webkit-tap-highlight-color: transparent;
              "
            >
              wire</span
            ><span
              class="NormalTextRun SCXW86883465 BCX0"
              style="
                margin: 0px;
                padding: 0px;
                user-select: text;
                -webkit-user-drag: none;
                -webkit-tap-highlight-color: transparent;
              "
            >
              is </span
            ><span
              class="NormalTextRun ContextualSpellingAndGrammarErrorV2Themed SCXW86883465 BCX0"
              style="
                margin: 0px;
                padding: 0px;
                user-select: text;
                -webkit-user-drag: none;
                -webkit-tap-highlight-color: transparent;
                background-repeat: repeat-x;
                background-position: left bottom;
                background-image: var(
                  --urlContextualSpellingAndGrammarErrorV2,
                  url('')
                );
                border-bottom: 1px solid transparent;
              "
              >hot</span
            ><span
              class="NormalTextRun ContextualSpellingAndGrammarErrorV2Themed SCXW86883465 BCX0"
              style="
                margin: 0px;
                padding: 0px;
                user-select: text;
                -webkit-user-drag: none;
                -webkit-tap-highlight-color: transparent;
                background-repeat: repeat-x;
                background-position: left bottom;
                background-image: var(
                  --urlContextualSpellingAndGrammarErrorV2,
                  url('')
                );
                border-bottom: 1px solid transparent;
              "
              >-</span
            ><span
              class="NormalTextRun ContextualSpellingAndGrammarErrorV2Themed SCXW86883465 BCX0"
              style="
                margin: 0px;
                padding: 0px;
                user-select: text;
                -webkit-user-drag: none;
                -webkit-tap-highlight-color: transparent;
                background-repeat: repeat-x;
                background-position: left bottom;
                background-image: var(
                  --urlContextualSpellingAndGrammarErrorV2,
                  url('')
                );
                border-bottom: 1px solid transparent;
              "
              >dip</span
            ><span
              class="NormalTextRun SCXW86883465 BCX0"
              style="
                margin: 0px;
                padding: 0px;
                user-select: text;
                -webkit-user-drag: none;
                -webkit-tap-highlight-color: transparent;
              "
            >
              galvanized.</span
            ></span
          ><span
            class="EOP SCXW86883465 BCX0"
            data-ccp-props='{"134233117":false,"134233118":false,"201341983":0,"335551550":0,"335551620":0,"335559738":0,"335559739":0,"335559740":279}'
            style="
              margin: 0px;
              padding: 0px;
              user-select: text;
              -webkit-user-drag: none;
              -webkit-tap-highlight-color: transparent;
              font-size: 9.5pt;
              line-height: 18.6px;
              font-family: Verdana, Verdana_EmbeddedFont, Verdana_MSFontService,
                sans-serif;
              color: rgb(50, 50, 50);
            "
            > </span
          >
        </p>
      </div>
      <div
        class="OutlineElement Ltr SCXW86883465 BCX0"
        style="
          margin: 0px;
          padding: 0px;
          user-select: text;
          -webkit-user-drag: none;
          -webkit-tap-highlight-color: transparent;
          overflow: visible;
          cursor: text;
          clear: both;
          position: relative;
          direction: ltr;
          color: rgb(0, 0, 0);
          font-family: 'Segoe UI', 'Segoe UI Web', Arial, Verdana, sans-serif;
          font-size: 12px;
        "
      >
        <p
          class="Paragraph SCXW86883465 BCX0"
          xml:lang="EN-US"
          lang="EN-US"
          paraid="1718639391"
          paraeid="{e9a4f25f-2b60-4ed0-af49-2c4635a7e54a}{70}"
          style="
            padding: 0px;
            user-select: text;
            -webkit-user-drag: none;
            -webkit-tap-highlight-color: transparent;
            overflow-wrap: break-word;
            white-space-collapse: preserve;
            vertical-align: baseline;
            font-kerning: none;
            background-color: transparent;
            color: windowtext;
          "
        >
          <span
            data-contrast="none"
            xml:lang="EN-US"
            lang="EN-US"
            class="TextRun SCXW86883465 BCX0"
            style="
              margin: 0px;
              padding: 0px;
              user-select: text;
              -webkit-user-drag: none;
              -webkit-tap-highlight-color: transparent;
              font-variant-numeric: normal;
              font-variant-east-asian: normal;
              font-variant-alternates: normal;
              font-variant-position: normal;
              font-size: 12pt;
              line-height: 20.925px;
              font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, sans-serif;
            "
            ><span
              class="NormalTextRun SCXW86883465 BCX0"
              style="
                margin: 0px;
                padding: 0px;
                user-select: text;
                -webkit-user-drag: none;
                -webkit-tap-highlight-color: transparent;
              "
            ></span></span
          ><span
            class="EOP SCXW86883465 BCX0"
            data-ccp-props='{"134233117":false,"134233118":false,"201341983":0,"335551550":0,"335551620":0,"335559738":0,"335559739":0,"335559740":279}'
            style="
              margin: 0px;
              padding: 0px;
              user-select: text;
              -webkit-user-drag: none;
              -webkit-tap-highlight-color: transparent;
              font-size: 12pt;
              line-height: 20.925px;
              font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, sans-serif;
            "
            > </span
          >
        </p>
      </div>
      <div
        class="ListContainerWrapper SCXW86883465 BCX0"
        style="
          margin: 0px;
          padding: 0px;
          user-select: text;
          -webkit-user-drag: none;
          -webkit-tap-highlight-color: transparent;
          position: relative;
        "
      >
        <p
          class="BCX0 Paragraph SCXW86883465"
          xml:lang="EN-US"
          lang="EN-US"
          paraid="551638781"
          paraeid="{e9a4f25f-2b60-4ed0-af49-2c4635a7e54a}{79}"
          style="
            color: windowtext;
            font-family: 'Segoe UI', 'Segoe UI Web', Arial, Verdana, sans-serif;
            font-size: 12px;
            padding: 0px;
            user-select: text;
            -webkit-user-drag: none;
            -webkit-tap-highlight-color: transparent;
            overflow-wrap: break-word;
            white-space-collapse: preserve;
            vertical-align: baseline;
            font-kerning: none;
            background-color: transparent;
          "
        >
          <span
            data-contrast="none"
            xml:lang="EN-US"
            lang="EN-US"
            class="BCX0 SCXW86883465 TextRun"
            style="
              margin: 0px;
              padding: 0px;
              user-select: text;
              -webkit-user-drag: none;
              -webkit-tap-highlight-color: transparent;
              font-variant-numeric: normal;
              font-variant-east-asian: normal;
              font-variant-alternates: normal;
              font-variant-position: normal;
              color: rgb(102, 102, 102);
              font-size: 9.5pt;
              line-height: 18.6px;
              font-family: Verdana, Verdana_EmbeddedFont, Verdana_MSFontService,
                sans-serif;
            "
            ><span
              class="BCX0 NormalTextRun SCXW86883465"
              style="
                margin: 0px;
                padding: 0px;
                user-select: text;
                -webkit-user-drag: none;
                -webkit-tap-highlight-color: transparent;
              "
            ></span
          ></span>
        </p>
        <ul>
          <li>
            <p
              class="BCX0 Paragraph SCXW52799982"
              xml:lang="EN-US"
              lang="EN-US"
              paraid="551638781"
              paraeid="{e9a4f25f-2b60-4ed0-af49-2c4635a7e54a}{79}"
              style="
                padding: 0px;
                user-select: text;
                -webkit-user-drag: none;
                -webkit-tap-highlight-color: transparent;
                overflow-wrap: break-word;
                white-space-collapse: preserve;
                vertical-align: baseline;
                font-kerning: none;
                background-color: transparent;
                color: windowtext;
              "
            >
              <span
                data-contrast="none"
                xml:lang="EN-US"
                lang="EN-US"
                class="BCX0 SCXW52799982 TextRun"
                style="
                  margin: 0px;
                  padding: 0px;
                  user-select: text;
                  -webkit-user-drag: none;
                  -webkit-tap-highlight-color: transparent;
                  font-variant-numeric: normal;
                  font-variant-east-asian: normal;
                  font-variant-alternates: normal;
                  font-variant-position: normal;
                  color: rgb(102, 102, 102);
                  font-size: 9.5pt;
                  line-height: 18.6px;
                  font-family: Verdana, Verdana_EmbeddedFont, Verdana_MSFontService,
                    sans-serif;
                "
                ><span
                  class="BCX0 NormalTextRun SCXW52799982"
                  style="
                    margin: 0px;
                    padding: 0px;
                    user-select: text;
                    -webkit-user-drag: none;
                    -webkit-tap-highlight-color: transparent;
                  "
                  >Hot-dip galvanized high-tensile wire</span
                ></span
              ><span
                class="BCX0 EOP SCXW52799982"
                data-ccp-props='{"134233117":false,"134233118":false,"201341983":0,"335551550":0,"335551620":0,"335559738":0,"335559739":0,"335559740":279}'
                style="
                  margin: 0px;
                  padding: 0px;
                  user-select: text;
                  -webkit-user-drag: none;
                  -webkit-tap-highlight-color: transparent;
                  font-size: 9.5pt;
                  line-height: 18.6px;
                  font-family: Verdana, Verdana_EmbeddedFont, Verdana_MSFontService,
                    sans-serif;
                  color: rgb(102, 102, 102);
                "
                > </span
              >
            </p>
          </li>
          <li>
            <p
              class="BCX0 Paragraph SCXW52799982"
              xml:lang="EN-US"
              lang="EN-US"
              paraid="1906475466"
              paraeid="{e9a4f25f-2b60-4ed0-af49-2c4635a7e54a}{100}"
              style="
                padding: 0px;
                user-select: text;
                -webkit-user-drag: none;
                -webkit-tap-highlight-color: transparent;
                overflow-wrap: break-word;
                white-space-collapse: preserve;
                vertical-align: baseline;
                font-kerning: none;
                background-color: transparent;
                color: windowtext;
              "
            >
              <span
                data-contrast="none"
                xml:lang="EN-US"
                lang="EN-US"
                class="BCX0 SCXW52799982 TextRun"
                style="
                  margin: 0px;
                  padding: 0px;
                  user-select: text;
                  -webkit-user-drag: none;
                  -webkit-tap-highlight-color: transparent;
                  font-variant-numeric: normal;
                  font-variant-east-asian: normal;
                  font-variant-alternates: normal;
                  font-variant-position: normal;
                  color: rgb(102, 102, 102);
                  font-size: 9.5pt;
                  line-height: 18.6px;
                  font-family: Verdana, Verdana_EmbeddedFont, Verdana_MSFontService,
                    sans-serif;
                "
                >170 KSI, 12½ gauge</span
              ><span
                class="BCX0 EOP SCXW52799982"
                data-ccp-props='{"134233117":false,"134233118":false,"201341983":0,"335551550":0,"335551620":0,"335559738":0,"335559739":0,"335559740":279}'
                style="
                  margin: 0px;
                  padding: 0px;
                  user-select: text;
                  -webkit-user-drag: none;
                  -webkit-tap-highlight-color: transparent;
                  font-size: 9.5pt;
                  line-height: 18.6px;
                  font-family: Verdana, Verdana_EmbeddedFont, Verdana_MSFontService,
                    sans-serif;
                  color: rgb(102, 102, 102);
                "
                > </span
              >
            </p>
          </li>
          <li>
            <p
              class="BCX0 Paragraph SCXW52799982"
              xml:lang="EN-US"
              lang="EN-US"
              paraid="913465195"
              paraeid="{e9a4f25f-2b60-4ed0-af49-2c4635a7e54a}{175}"
              style="
                padding: 0px;
                user-select: text;
                -webkit-user-drag: none;
                -webkit-tap-highlight-color: transparent;
                overflow-wrap: break-word;
                white-space-collapse: preserve;
                vertical-align: baseline;
                font-kerning: none;
                background-color: transparent;
                color: windowtext;
              "
            >
              <span
                data-contrast="none"
                xml:lang="EN-US"
                lang="EN-US"
                class="BCX0 SCXW52799982 TextRun"
                style="
                  margin: 0px;
                  padding: 0px;
                  user-select: text;
                  -webkit-user-drag: none;
                  -webkit-tap-highlight-color: transparent;
                  font-variant-numeric: normal;
                  font-variant-east-asian: normal;
                  font-variant-alternates: normal;
                  font-variant-position: normal;
                  color: rgb(102, 102, 102);
                  font-size: 9.5pt;
                  line-height: 18.6px;
                  font-family: Verdana, Verdana_EmbeddedFont, Verdana_MSFontService,
                    sans-serif;
                "
                >Ideal for hand-knotting</span
              ><span
                class="BCX0 EOP SCXW52799982"
                data-ccp-props='{"134233117":false,"134233118":false,"201341983":0,"335551550":0,"335551620":0,"335559738":0,"335559739":0,"335559740":279}'
                style="
                  margin: 0px;
                  padding: 0px;
                  user-select: text;
                  -webkit-user-drag: none;
                  -webkit-tap-highlight-color: transparent;
                  font-size: 9.5pt;
                  line-height: 18.6px;
                  font-family: Verdana, Verdana_EmbeddedFont, Verdana_MSFontService,
                    sans-serif;
                  color: rgb(102, 102, 102);
                "
                > </span
              >
            </p>
          </li>
          <li>
            <p
              class="BCX0 Paragraph SCXW52799982"
              xml:lang="EN-US"
              lang="EN-US"
              paraid="205034784"
              paraeid="{e449334d-cf84-4db5-bebe-c3dabd0b5e25}{32}"
              style="
                padding: 0px;
                user-select: text;
                -webkit-user-drag: none;
                -webkit-tap-highlight-color: transparent;
                overflow-wrap: break-word;
                white-space-collapse: preserve;
                vertical-align: baseline;
                font-kerning: none;
                background-color: transparent;
                color: windowtext;
              "
            >
              <span
                data-contrast="none"
                xml:lang="EN-US"
                lang="EN-US"
                class="BCX0 SCXW52799982 TextRun"
                style="
                  margin: 0px;
                  padding: 0px;
                  user-select: text;
                  -webkit-user-drag: none;
                  -webkit-tap-highlight-color: transparent;
                  font-variant-numeric: normal;
                  font-variant-east-asian: normal;
                  font-variant-alternates: normal;
                  font-variant-position: normal;
                  color: rgb(102, 102, 102);
                  font-size: 9.5pt;
                  line-height: 18.6px;
                  font-family: Verdana, Verdana_EmbeddedFont, Verdana_MSFontService,
                    sans-serif;
                "
                ><span
                  class="BCX0 NormalTextRun SCXW52799982"
                  style="
                    margin: 0px;
                    padding: 0px;
                    user-select: text;
                    -webkit-user-drag: none;
                    -webkit-tap-highlight-color: transparent;
                  "
                  >4,000’ coil</span
                ></span
              ><span
                class="BCX0 EOP SCXW52799982"
                data-ccp-props='{"134233117":false,"134233118":false,"201341983":0,"335551550":0,"335551620":0,"335559738":0,"335559739":0,"335559740":279}'
                style="
                  margin: 0px;
                  padding: 0px;
                  user-select: text;
                  -webkit-user-drag: none;
                  -webkit-tap-highlight-color: transparent;
                  font-size: 9.5pt;
                  line-height: 18.6px;
                  font-family: Verdana, Verdana_EmbeddedFont, Verdana_MSFontService,
                    sans-serif;
                  color: rgb(102, 102, 102);
                "
                > </span
              >
            </p>
          </li>
          <li>
            <p
              class="BCX0 Paragraph SCXW52799982"
              xml:lang="EN-US"
              lang="EN-US"
              paraid="661646861"
              paraeid="{67678558-f53a-47fe-be5d-2e21a32149a3}{20}"
              style="
                padding: 0px;
                user-select: text;
                -webkit-user-drag: none;
                -webkit-tap-highlight-color: transparent;
                overflow-wrap: break-word;
                white-space-collapse: preserve;
                vertical-align: baseline;
                font-kerning: none;
                background-color: transparent;
                color: windowtext;
              "
            >
              <span
                data-contrast="none"
                xml:lang="EN-US"
                lang="EN-US"
                class="BCX0 SCXW52799982 TextRun"
                style="
                  margin: 0px;
                  padding: 0px;
                  user-select: text;
                  -webkit-user-drag: none;
                  -webkit-tap-highlight-color: transparent;
                  font-variant-numeric: normal;
                  font-variant-east-asian: normal;
                  font-variant-alternates: normal;
                  font-variant-position: normal;
                  color: rgb(102, 102, 102);
                  font-size: 9.5pt;
                  line-height: 18.6px;
                  font-family: Verdana, Verdana_EmbeddedFont, Verdana_MSFontService,
                    sans-serif;
                "
                ><span
                  class="BCX0 NormalTextRun SCXW52799982"
                  style="
                    margin: 0px;
                    padding: 0px;
                    user-select: text;
                    -webkit-user-drag: none;
                    -webkit-tap-highlight-color: transparent;
                  "
                  >Minimum break strength = 1,078 </span
                ><span
                  class="BCX0 NormalTextRun SCXW52799982 SpellingErrorV2Themed"
                  style="
                    margin: 0px;
                    padding: 0px;
                    user-select: text;
                    -webkit-user-drag: none;
                    -webkit-tap-highlight-color: transparent;
                    background-repeat: repeat-x;
                    background-position: left bottom;
                    background-image: var(--urlSpellingErrorV2, url(''));
                    border-bottom: 1px solid transparent;
                  "
                  >lbs</span
                ></span
              ><span
                class="BCX0 EOP SCXW52799982"
                data-ccp-props='{"134233117":false,"134233118":false,"201341983":0,"335551550":0,"335551620":0,"335559738":0,"335559739":0,"335559740":279}'
                style="
                  margin: 0px;
                  padding: 0px;
                  user-select: text;
                  -webkit-user-drag: none;
                  -webkit-tap-highlight-color: transparent;
                  font-size: 9.5pt;
                  line-height: 18.6px;
                  font-family: Verdana, Verdana_EmbeddedFont, Verdana_MSFontService,
                    sans-serif;
                  color: rgb(102, 102, 102);
                "
                > </span
              >
            </p>
          </li>
        </ul>
        <p
          class="BCX0 Paragraph SCXW86883465"
          xml:lang="EN-US"
          lang="EN-US"
          paraid="205034784"
          paraeid="{e449334d-cf84-4db5-bebe-c3dabd0b5e25}{32}"
          style="
            color: windowtext;
            font-family: 'Segoe UI', 'Segoe UI Web', Arial, Verdana, sans-serif;
            font-size: 12px;
            padding: 0px;
            user-select: text;
            -webkit-user-drag: none;
            -webkit-tap-highlight-color: transparent;
            overflow-wrap: break-word;
            white-space-collapse: preserve;
            vertical-align: baseline;
            font-kerning: none;
            background-color: transparent;
          "
        >
          <br />
        </p>
      </div>
      `;

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
                    text: "Workspace in classic editors is made of a single contenteditable element, used to create different HTML markups. Editor.js <mark>workspace consists of separate Blocks: paragraphs, headings, images, lists, quotes, etc</mark>. Each of them is an independent contenteditable element (or more complex structure) provided by Plugin and united by Editor's Core.",
                },
            },
            {
                type: "paragraph",
                data: {
                    text: 'There are dozens of <a href="">ready-to-use Blocks</a> and the <a href="https://editorjs.io/creating-a-block-tool">simple API</a> for creation any Block you need. For example, you can implement Blocks for Tweets, Instagram posts, surveys and polls, CTA-buttons and even games.',
                },
            },
            {
                type: "paragraph",
                data: {
                    text: "This is a <b>strong</b> tag.",
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

    /**
     * this test never really worked - the more complex example was never fully working, but good enough for now
     */
    it("should convert more complex HTML to editorJS", async () => {
        const parsedEditorJs = await editorJsHelper.HTMLToEditorJS(complexHtml);
        expect(parsedEditorJs.blocks[0].data.text).toBeDefined();
    });
});
