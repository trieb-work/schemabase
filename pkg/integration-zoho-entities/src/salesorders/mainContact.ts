import { ILogger } from "@eci/pkg/logger";
import { Order, ZohoContactPerson, Contact, PrismaClient } from "@prisma/client";
import { Warning } from ".";

type OrderWithZohoContacts = Order & {
    contacts: (Contact & {
        zohoContactPersons: ZohoContactPerson[];
    })[];
    mainContact: (Contact & {
        zohoContactPersons: ZohoContactPerson[];
    }) | null;
}

export async function orderToMainContactId(order: OrderWithZohoContacts, db: PrismaClient, logger: ILogger): Promise<string> {
    let mainContact = order.mainContact;
    // TODO if mainContact is mandatory in DB we can delete this fallback
    if (!mainContact) {
        // TODO: jannik please check if this fallback makes sense
        const fallbackContact = order?.contacts?.[0];
        if(!fallbackContact?.id){
            throw new Error("Can not sync order from ECI to Zoho because no contacts and no mainContact are attached to this order in ECI DB");
        }
        logger.warn("mainContact not set falling back to first contact and update mainContact in DB", {
            newMainContactId: fallbackContact.id
        });
        await db.order.update({
            where: {
                id: order.id
            },
            data: {
                mainContact: {
                    connect: {
                        id: fallbackContact.id,
                    }
                }
            }
        });
        mainContact = fallbackContact;
    }
    if(!mainContact.zohoContactPersons || mainContact.zohoContactPersons.length === 0){
        throw new Warning("No zohoContactPersons set for the mainContact of this order. Aborting sync of this order. Try again after zoho contacts sync.");
    }
    if(mainContact.zohoContactPersons.length > 1){
        throw new Error("Multiple zohoContactPersons set for the mainContact of this order. Aborting sync of this order.");
    }
    return mainContact.zohoContactPersons[0].zohoContactId;
}