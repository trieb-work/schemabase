import { Topic } from "@eci/events/strapi";
import { ZohoClientInstance } from "@trieb.work/zoho-ts";
import { integrationsStrapiOrdersToZoho } from "./integrations-strapi-orders-to-zoho";

const mockData = {
  event: Topic.ENTRY_UPDATE as Topic.ENTRY_UPDATE,
  created_at: "2021-09-21T16:41:53.094Z",
  model: "auftrag" as "auftrag",
  entry: {
    id: 74,
    kundenname: "Siemens Healthineers",
    zohoCustomerId: "99945864",
    greetingCardJSON: null,
    auftragsToken: "59995f02-6dac-43fa-a92f-b6be1aba170b",
    created_at: "2021-09-03T10:50:31.014Z",
    updated_at: "2021-09-21T16:41:53.059Z",
    editorURL:
      "https://pfeffer-frost-frontend-git-testing-triebwork.vercel.app/grusskarten/editor/59995f02-6dac-43fa-a92f-b6be1aba170b",
    terminationDate: null,
    Status: "Draft" as "Draft",
    adressen: [
      {
        id: 1,
        vorname: "User",
        nachname: "Test",
        strasse: "Vorrastraße",
        plz: 90482,
        ort: "Nürnberg",
        firmenname: null,
        land: "Deutschland",
        nummer: null,
        fullname: null,
      },
    ],
    adressenCSV: null,
  },
};

const mockZohoClient = {} as unknown as ZohoClientInstance;

describe("integrationsStrapiOrdersToZoho", () => {
  it("should work", () => {
    expect(
      new integrationsStrapiOrdersToZoho({
        ...mockData,
        zohoClient: mockZohoClient,
      }),
    );
  });
});
