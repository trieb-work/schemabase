import { test } from "@jest/globals";
import auth from "./auth";


test("should work to handle the auth and store tokens in DB", async () => {

    await auth();

});