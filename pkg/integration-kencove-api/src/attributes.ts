// the kencoveApiAppattributesync class that is used to sync attributes.
// from kencove to our internal database. It works similar than the product sync
import { AttributeType, KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiClient } from "./client";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { isSameHour, subHours, subYears } from "date-fns";
import { id } from "@eci/pkg/ids";
import { normalizeStrings } from "@eci/pkg/normalization";

interface KencoveApiAppAttributeSyncServiceConfig {
  logger: ILogger;
  db: PrismaClient;
  kencoveApiApp: KencoveApiApp;
}

export class KencoveApiAppAttributeSyncService {
  private readonly logger: ILogger;

  private readonly db: PrismaClient;

  public readonly kencoveApiApp: KencoveApiApp;

  private readonly cronState: CronStateHandler;

  public constructor(config: KencoveApiAppAttributeSyncServiceConfig) {
    this.logger = config.logger;
    this.db = config.db;
    this.kencoveApiApp = config.kencoveApiApp;
    this.cronState = new CronStateHandler({
      tenantId: this.kencoveApiApp.tenantId,
      appId: this.kencoveApiApp.id,
      db: this.db,
      syncEntity: "attributes",
    });
  }

  // takes a string and tries to map it to our internal attribute type.
  // Switch case that return all possible enums from
  // DROPDOWN
  // MULTISELECT
  // FILE
  // REFERENCE
  // NUMERIC
  // RICH_TEXT
  // PLAIN_TEXT
  // SWATCH
  // BOOLEAN
  // DATE
  // DATE_TIME
  private kenAttributeToEciAttribute(kenAttribute: string): AttributeType {
    switch (kenAttribute) {
      case "select":
        return AttributeType.DROPDOWN;
      case "radio":
        return AttributeType.MULTISELECT;
      case "FILE":
        return AttributeType.FILE;
      case "REFERENCE":
        return AttributeType.REFERENCE;
      case "NUMERIC":
        return AttributeType.NUMERIC;
      case "RICH_TEXT":
        return AttributeType.RICH_TEXT;
      case "PLAIN_TEXT":
        return AttributeType.PLAIN_TEXT;
      case "color":
        return AttributeType.SWATCH;
      case "BOOLEAN":
        return AttributeType.BOOLEAN;
      case "DATE":
        return AttributeType.DATE;
      case "DATE_TIME":
        return AttributeType.DATE_TIME;
      default:
        throw new Error(`Unknown attribute type: ${kenAttribute}`);
    }
  }

  public async syncToECI() {
    const cronState = await this.cronState.get();
    const now = new Date();
    let createdGte: Date;
    if (!cronState.lastRun) {
      createdGte = subYears(now, 1);
      this.logger.info(
        // eslint-disable-next-line max-len
        `This seems to be our first sync run. Syncing data from: ${createdGte}`,
      );
    } else {
      // for security purposes, we sync one hour more than the last run
      createdGte = subHours(cronState.lastRun, 1);
      this.logger.info(`Setting GTE date to ${createdGte}.`);
    }

    const client = new KencoveApiClient(this.kencoveApiApp);
    const kencoveApiAppattributes = await client.getAttributes(createdGte);
    this.logger.info(
      `Found ${kencoveApiAppattributes.length} kencoveApiAppattributes to sync`,
    );
    if (kencoveApiAppattributes.length === 0) {
      this.logger.info("No kencoveApiAppattributes to sync. Exiting.");
      await this.cronState.set({ lastRun: new Date() });
      return;
    }

    const existingkencoveApiAppAttributes =
      await this.db.kencoveApiAttribute.findMany({
        where: {
          kencoveApiAppId: this.kencoveApiApp.id,
          id: {
            in: kencoveApiAppattributes.map(
              (attribute) => attribute.attribute_id,
            ),
          },
        },
      });

    for (const kenAttribute of kencoveApiAppattributes) {
      const existingkencoveApiAppAttribute =
        existingkencoveApiAppAttributes.find(
          (attribute) => attribute.id === kenAttribute.attribute_id,
        );
      // if the updatedAt timestamp in our db is the same as the one from kencove,
      // we skip this attribute
      if (
        existingkencoveApiAppAttribute &&
        isSameHour(
          existingkencoveApiAppAttribute.updatedAt,
          new Date(kenAttribute.updatedAt),
        )
      ) {
        continue;
      }
      const createdAt = new Date(kenAttribute.createdAt);
      const updatedAt = new Date(kenAttribute.updatedAt);
      const type = this.kenAttributeToEciAttribute(kenAttribute.display_type);
      const normalizedName = normalizeStrings.attributeNames(
        kenAttribute.attribute_name,
      );
      await this.db.kencoveApiAttribute.upsert({
        where: {
          id_kencoveApiAppId: {
            id: kenAttribute.attribute_id,
            kencoveApiAppId: this.kencoveApiApp.id,
          },
        },
        create: {
          id: kenAttribute.attribute_id,
          createdAt,
          updatedAt,
          kencoveApiApp: {
            connect: {
              id: this.kencoveApiApp.id,
            },
          },
          attribute: {
            connectOrCreate: {
              where: {
                normalizedName_tenantId: {
                  normalizedName: normalizedName,
                  tenantId: this.kencoveApiApp.tenantId,
                },
              },
              create: {
                id: id.id("attribute"),
                tenant: {
                  connect: {
                    id: this.kencoveApiApp.tenantId,
                  },
                },
                name: kenAttribute.attribute_name,
                normalizedName,
                type: type,
                slug: kenAttribute.slug,
              },
            },
          },
        },
        update: {
          attribute: {
            update: {
              normalizedName,
              name: kenAttribute.attribute_name,
              type: type,
              slug: kenAttribute.slug,
            },
          },
        },
      });

      await this.cronState.set({
        lastRun: new Date(),
        lastRunStatus: "success",
      });
    }
  }
}
