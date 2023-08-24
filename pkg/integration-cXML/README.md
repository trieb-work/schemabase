# Generic cXML integration. 
This integration works with cXML data, which is an XML-based protocol that is used to transmit business documents between procurement applications, e-commerce hubs and suppliers.
We transform the cXML to JSON and create orders, customers and addresses internally. 
Example XML: 

```xml
<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE cXML SYSTEM "http://xml.cxml.org/schemas/cXML/1.2.054/cXML.dtd">
<cXML payloadID="1692861887.197.707583.2347@eu-hub" timestamp="2023-08-24T07:24:47+00:00">
  <Header>
    <From>
      <Credential domain="ProminateCompanyCode">
        <Identity>prominate</Identity>
      </Credential>
    </From>
    <To>
      <Credential domain="ProminateCompanyCode">
        <Identity>pfeffer-frost</Identity>
      </Credential>
    </To>
    <Sender>
      <Credential domain="ProminateCompanyCode">
        <Identity>prominate-hub</Identity>
        <SharedSecret>ChdGE6SE</SharedSecret>
      </Credential>
      <UserAgent>Prominate platform global hub</UserAgent>
    </Sender>
  </Header>
  <Request>
    <OrderRequest>
      <OrderRequestHeader orderID="siemens-ag-XQMfayUG8W7tTw-1-1" orderDate="2023-08-24T07:24:46+00:00" type="new">
        <Total>
          <Money currency="EUR">182.70</Money>
        </Total>
        <ShipTo>
          <Address>
            <Name xml:lang="en">Artem Sichkar Prominate GmbH</Name>
            <PostalAddress>
              <DeliverTo>Prominate GmbH</DeliverTo>
              <DeliverTo>Artem Sichkar</DeliverTo>
              <Street>Prinzenstraße 2a</Street>
              <City>Solingen</City>
              <PostalCode>42697</PostalCode>
              <Country isoCountryCode="DE">Germany</Country>
            </PostalAddress>
          </Address>
          <CarrierIdentifier domain="SCAC">UPSN</CarrierIdentifier>
          <CarrierIdentifier domain="sku">SHIP-1-1-001</CarrierIdentifier>
          <CarrierIdentifier domain="carrierMethod">11</CarrierIdentifier>
          <TransportInformation>
            <ShippingContractNumber>A5264T</ShippingContractNumber>
          </TransportInformation>
        </ShipTo>
        <BillTo>
          <Address>
            <Name xml:lang="en">Prominate GmbH</Name>
            <PostalAddress>
              <DeliverTo>Prominate GmbH</DeliverTo>
              <Street>An den Eichen 18</Street>
              <City>Solingen</City>
              <Country isoCountryCode="DE">Germany</Country>
            </PostalAddress>
          </Address>
        </BillTo>
        <Shipping>
          <Money currency="EUR">3.28</Money>
          <Description xml:lang="en">UPS Standard</Description>
        </Shipping>
        <Contact role="buyer">
          <Name xml:lang="en">Artem Sichkar</Name>
          <Email>artem.sichkar@zincgroup.com</Email>
        </Contact>
        <Contact role="endUser">
          <Name xml:lang="en">Artem Sichkar</Name>
          <Email>artem.sichkar@zincgroup.com</Email>
        </Contact>
        <Contact role="buyerAccount">
          <Name xml:lang="en">Artem Sichkar</Name>
          <Email>artem.sichkar@zincgroup.com</Email>
        </Contact>
      </OrderRequestHeader>
      <ItemOut lineNumber="1" quantity="7" requestedDeliveryDate="2023-09-04">
        <ItemID>
          <SupplierPartID>PF-DOSE-5-AD-GEMISCHT-SIEMENS</SupplierPartID>
          <BuyerPartID>SIEM-0000-6337</BuyerPartID>
        </ItemID>
        <ItemDetail>
          <UnitPrice>
            <Money currency="EUR">20.25</Money>
          </UnitPrice>
          <Description xml:lang="en">Gingerbread tin Alec Doherty mixed</Description>
          <UnitOfMeasure>EA</UnitOfMeasure>
          <Classification domain="supplier_part_id">PF-DOSE-5-AD-GEMISCHT-SIEMENS</Classification>
        </ItemDetail>
      </ItemOut>
      <ItemOut lineNumber="2" quantity="7" requestedDeliveryDate="2023-09-04">
        <ItemID>
          <SupplierPartID>PF-BRIEF-NATUR-SIEMENS</SupplierPartID>
          <BuyerPartID>SIEM-0000-6338</BuyerPartID>
        </ItemID>
        <ItemDetail>
          <UnitPrice>
            <Money currency="EUR">5.85</Money>
          </UnitPrice>
          <Description xml:lang="en">Gingerbread letter Natural Vegan</Description>
          <UnitOfMeasure>EA</UnitOfMeasure>
          <Classification domain="supplier_part_id">PF-BRIEF-NATUR-SIEMENS</Classification>
        </ItemDetail>
      </ItemOut>
    </OrderRequest>
  </Request>
</cXML>
```

Corresponding JSON:
```JSON
{
  "@payloadID": "1692861887.197.707583.2347@eu-hub",
  "@timestamp": "2023-08-24T07:24:47+00:00",
  "Header": {
    "From": {
      "Credential": {
        "@domain": "ProminateCompanyCode",
        "Identity": "prominate"
      }
    },
    "To": {
      "Credential": {
        "@domain": "ProminateCompanyCode",
        "Identity": "pfeffer-frost"
      }
    },
    "Sender": {
      "Credential": {
        "@domain": "ProminateCompanyCode",
        "Identity": "prominate-hub",
        "SharedSecret": "ChdGE6SE"
      },
      "UserAgent": "Prominate platform global hub"
    }
  },
  "Request": {
    "OrderRequest": {
      "OrderRequestHeader": {
        "@orderID": "siemens-ag-XQMfayUG8W7tTw-1-1",
        "@orderDate": "2023-08-24T07:24:46+00:00",
        "@type": "new",
        "Total": {
          "Money": {
            "@currency": "EUR",
            "#text": "182.70"
          }
        },
        "ShipTo": {
          "Address": {
            "Name": {
              "@lang": "en",
              "#text": "Artem Sichkar Prominate GmbH"
            },
            "PostalAddress": {
              "DeliverTo": [
                "Prominate GmbH",
                "Artem Sichkar"
              ],
              "Street": "Prinzenstraße 2a",
              "City": "Solingen",
              "PostalCode": "42697",
              "Country": {
                "@isoCountryCode": "DE",
                "#text": "Germany"
              }
            }
          },
          "CarrierIdentifier": [
            {
              "@domain": "SCAC",
              "#text": "UPSN"
            },
            {
              "@domain": "sku",
              "#text": "SHIP-1-1-001"
            },
            {
              "@domain": "carrierMethod",
              "#text": "11"
            }
          ],
          "TransportInformation": {
            "ShippingContractNumber": "A5264T"
          }
        },
        "BillTo": {
          "Address": {
            "Name": {
              "@lang": "en",
              "#text": "Prominate GmbH"
            },
            "PostalAddress": {
              "DeliverTo": "Prominate GmbH",
              "Street": "An den Eichen 18",
              "City": "Solingen",
              "Country": {
                "@isoCountryCode": "DE",
                "#text": "Germany"
              }
            }
          }
        },
        "Shipping": {
          "Money": {
            "@currency": "EUR",
            "#text": "3.28"
          },
          "Description": {
            "@lang": "en",
            "#text": "UPS Standard"
          }
        },
        "Contact": [
          {
            "@role": "buyer",
            "Name": {
              "@lang": "en",
              "#text": "Artem Sichkar"
            },
            "Email": "artem.sichkar@zincgroup.com"
          },
          {
            "@role": "endUser",
            "Name": {
              "@lang": "en",
              "#text": "Artem Sichkar"
            },
            "Email": "artem.sichkar@zincgroup.com"
          },
          {
            "@role": "buyerAccount",
            "Name": {
              "@lang": "en",
              "#text": "Artem Sichkar"
            },
            "Email": "artem.sichkar@zincgroup.com"
          }
        ]
      },
      "ItemOut": [
        {
          "@lineNumber": "1",
          "@quantity": "7",
          "@requestedDeliveryDate": "2023-09-04",
          "ItemID": {
            "SupplierPartID": "PF-DOSE-5-AD-GEMISCHT-SIEMENS",
            "BuyerPartID": "SIEM-0000-6337"
          },
          "ItemDetail": {
            "UnitPrice": {
              "Money": {
                "@currency": "EUR",
                "#text": "20.25"
              }
            },
            "Description": {
              "@lang": "en",
              "#text": "Gingerbread tin Alec Doherty mixed"
            },
            "UnitOfMeasure": "EA",
            "Classification": {
              "@domain": "supplier_part_id",
              "#text": "PF-DOSE-5-AD-GEMISCHT-SIEMENS"
            }
          }
        },
        {
          "@lineNumber": "2",
          "@quantity": "7",
          "@requestedDeliveryDate": "2023-09-04",
          "ItemID": {
            "SupplierPartID": "PF-BRIEF-NATUR-SIEMENS",
            "BuyerPartID": "SIEM-0000-6338"
          },
          "ItemDetail": {
            "UnitPrice": {
              "Money": {
                "@currency": "EUR",
                "#text": "5.85"
              }
            },
            "Description": {
              "@lang": "en",
              "#text": "Gingerbread letter Natural Vegan"
            },
            "UnitOfMeasure": "EA",
            "Classification": {
              "@domain": "supplier_part_id",
              "#text": "PF-BRIEF-NATUR-SIEMENS"
            }
          }
        }
      ]
    }
  }
}
```
