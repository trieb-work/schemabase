import { createApplication } from "graphql-modules";
import { baseModule } from "./modules/base";
import { trackingModule } from "./modules/tracking";
import { userLoginRegisterModule } from "./modules/userloginregister";
import { dataEntitiesModule } from "./modules/dataentities";

export const application = createApplication({
    modules: [
        baseModule,
        userLoginRegisterModule,
        dataEntitiesModule,
        trackingModule,
    ],
});
