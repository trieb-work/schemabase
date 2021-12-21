import { Logger } from "@eci/pkg/logger";
import { Topic, EntryEvent } from "@eci/pkg/integration-bulkorders";
import { env } from "@chronark/env";
import { strapiEntryCreate } from "./handler/strapiEntryCreate";
import { strapiEntryUpdate } from "./handler/strapiEntryUpdate";
import { PrismaClient } from "@eci/pkg/prisma";
import { Signer, KafkaSubscriber, newKafkaClient } from "@eci/pkg/events";

async function main() {
  const logger = new Logger({
    meta: {
      env: env.require("ECI_ENV"),
    },
  });

  let kafkaConnected = false;
  const kafka = newKafkaClient().admin();
  for (let i = 0; i <= 5; i++) {
    const timeout = 2 ** i;
    try {
      await kafka.connect();
      kafkaConnected = true;
      break;
    } catch (e) {
      logger.warn(`Failed to connect to kafka, retrying in ${timeout} seconds`);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000 * timeout));
  }
  if (!kafkaConnected) {
    throw new Error(`Unable to connect to kafka`);
  }
  await kafka.disconnect();

  const signer = new Signer({ signingKey: env.require("SIGNING_KEY") });
  await kafka.disconnect();
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
