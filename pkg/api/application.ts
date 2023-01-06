import { createApplication } from "graphql-modules";

import { baseModule } from "./modules/base";
import { trackingModule } from "./modules/tracking";
import { userLoginRegisterModule } from "./modules/userloginregister";

export const application = createApplication({
  modules: [baseModule, trackingModule, userLoginRegisterModule],
});
