import dotenv from "dotenv";
dotenv.config();

import {
  contextRegistry,
  DEFAULT,
  ExpressApplicationContext,
  EXPRESS_CONTEXT_NAME,
} from "njectjs";

const context = contextRegistry.registerContext(DEFAULT);
const expressContext = new ExpressApplicationContext(context);
contextRegistry.registerContext(EXPRESS_CONTEXT_NAME, expressContext);

import "./nject";

expressContext.startServer();
