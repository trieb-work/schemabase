import {IdGenerator} from "@chronark/prefixed-id"


const prefixes = {
  "tenant": "t",
  "saleorApp": "sa"
}


export const idGenerator = new IdGenerator(prefixes)



