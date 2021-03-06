import Koa from "koa";

import { port } from "./config";
import Cron from "./crons";
import * as Meta from "./meta";
import router from "./router";

Cron.init();

const app = new Koa();

app.use(router.routes());

app.listen(port, () => {
  console.log(`Server started on port ${port}.\n${Meta.formatted}`);
});
