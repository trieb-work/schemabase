# DHL Tracking Integration
This integration can be used to retreive shipment tracking infornmation for the carrier DHL.
We are using the Unified Shipment Tracking Integration, that can be used to retreive data from ANY DHL service.
We auto-generate the Typescript Axios client using the OpenAPI specs from here: https://developer.dhl.com/sites/default/files/2022-12/utapi-traking-api-1.4.1.yaml 
And the OpenApi generator online tool: https://api.openapi-generator.tech/index.html
```
curl 'https://api.openapi-generator.tech/api/gen/clients/typescript-axios' \
  -H 'accept: */*' \
  -H 'content-type: application/json' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36' \
  --data-raw $'{\n  "openAPIUrl": "https://developer.dhl.com/sites/default/files/2022-12/utapi-traking-api-1.4.1.yaml",\n  "options": {},\n  "spec": {}\n}' \
  --compressed
```
It will return you a download link. To enable upgrades in a later step, we just leave the returning folder as it is and  copy it in this repository.