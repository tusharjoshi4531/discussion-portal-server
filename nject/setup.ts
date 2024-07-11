import { contextRegistry, DEFAULT, EXPRESS_CONTEXT_NAME, ExpressApplicationContext } from "njectjs";

const context = contextRegistry.registerContext(DEFAULT);
const expressContext = new ExpressApplicationContext(context);
contextRegistry.registerContext(EXPRESS_CONTEXT_NAME, expressContext);

import "./controller"

