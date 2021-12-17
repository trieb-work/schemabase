import { Logger } from "@eci/util/logger";
import { Topic, EntryEvent } from "@eci/integrations/strapi-orders-to-zoho";
import { env } from "@chronark/env";
import { strapiEntryCreate } from "./handler/strapiEntryCreate";
import { strapiEntryUpdate } from "./handler/strapiEntryUpdate";
import { PrismaClient } from "@eci/data-access/prisma";
import { Signer, KafkaSubscriber } from "@eci/events";

async function main() {
  const logger = new Logger({
    meta: {
      env: env.require("ECI_ENV"),
    },
  });

  const signer = new Signer({ signingKey: env.require("SIGNING_KEY") });
  const prisma = new PrismaClient();

  const strapiEntryCreateConsumer = await KafkaSubscriber.new<
    Topic,
    EntryEvent & { zohoAppId: string }
  >({
    topics: [Topic.ENTRY_CREATE],
    signer,
    logger,
    groupId: "strapiEntryCreateConsumer",
  });

  strapiEntryCreateConsumer.subscribe(strapiEntryCreate({ prisma, logger }));

  const strapiEntryUpdateConsumer = await KafkaSubscriber.new<
    Topic,
    EntryEvent & { zohoAppId: string }
  >({
    topics: [Topic.ENTRY_UPDATE],
    signer,
    logger,
    groupId: "strapiEntryUpdateConsumer",
  });
  strapiEntryUpdateConsumer.subscribe(strapiEntryUpdate({ prisma, logger }));
}

main();
