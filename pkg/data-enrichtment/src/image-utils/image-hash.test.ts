import {
    describe,
    it,
    expect,
    beforeAll,
    afterAll,
    afterEach,
} from "@jest/globals";
import { ImageHasher } from "./image-hash";
// eslint-disable-next-line import/no-extraneous-dependencies
import nock from "nock";

describe("ImageHasher", () => {
    beforeAll(() => {
        nock.disableNetConnect();
    });

    afterAll(() => {
        nock.enableNetConnect();
        nock.cleanAll();
    });

    afterEach(() => {
        nock.cleanAll();
    });

    it("should generate the same hash for identical images", async () => {
        const imageData = Buffer.from("fake-image-data");
        const imageUrl1 = "http://example.com/image1.jpg";
        const imageUrl2 = "http://example.com/image2.jpg";

        nock("http://example.com").get("/image1.jpg").reply(200, imageData);

        nock("http://example.com").get("/image2.jpg").reply(200, imageData);

        const result = await ImageHasher.areImagesIdentical(
            imageUrl1,
            imageUrl2,
        );
        expect(result).toBe(true);
    });

    it("should generate different hashes for different images", async () => {
        const imageData1 = Buffer.from("fake-image-data-1");
        const imageData2 = Buffer.from("fake-image-data-2");
        const imageUrl1 = "http://example.com/image1.jpg";
        const imageUrl2 = "http://example.com/image2.jpg";

        nock("http://example.com").get("/image1.jpg").reply(200, imageData1);

        nock("http://example.com").get("/image2.jpg").reply(200, imageData2);

        const result = await ImageHasher.areImagesIdentical(
            imageUrl1,
            imageUrl2,
        );
        expect(result).toBe(false);
    });

    it("should throw an error for invalid URLs", async () => {
        const imageUrl = "http://example.com/nonexistent.jpg";

        nock("http://example.com").get("/nonexistent.jpg").reply(404);

        await expect(ImageHasher.generateImageHash(imageUrl)).rejects.toThrow(
            "Failed to fetch image: Not Found",
        );
    });
});
