import { createApplication } from "graphql-modules";

import { baseModule } from "./modules/base";
import { trackingModule } from "./modules/tracking";

export const application = createApplication({
  modules: [baseModule, trackingModule],
});
