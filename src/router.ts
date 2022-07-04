import KoaRouter from "koa-router";

import * as Meta from "./meta";
import Cron from "./crons";

const router = new KoaRouter();

router.get("/see", async (ctx) => {
  const { active } = ctx.query;

  const running =
    typeof active === "string" && active.toLowerCase() === "false"
      ? false
      : true;
  const crons = Cron.getAll(running).map(([k]) => k);

  ctx.body = { crons, n: crons.length, active: running };
});

router.get("/start", async (ctx) => {
  const { name } = ctx.query;

  try {
    const cron = Cron.get(name);

    if (cron.running === true) {
      ctx.status = 400;
      ctx.body = { message: `cron "${name}" is already running` };
      return;
    }

    cron.start();

    ctx.body = { message: `cron "${name}" was started` };
  } catch (err) {
    ctx.status = 400;
    ctx.body = { error: (err as Error).message };
    return;
  }
});

router.get("/stop", async (ctx) => {
  const { name } = ctx.query;

  try {
    const cron = Cron.get(name);

    if (cron.running === false) {
      ctx.status = 400;
      ctx.body = { message: `cron "${name}" was already stopped` };
      return;
    }

    cron.stop();

    ctx.body = { message: `cron "${name}" was stoppoed` };
  } catch (err) {
    ctx.status = 400;
    ctx.body = { error: (err as Error).message };
    return;
  }
});

router.get("/startAll", async (ctx) => {
  const crons = Cron.getAll(false).map(([k, v]) => {
    console.log("starting " + k);
    v.start();
    return k;
  });

  ctx.body = {
    n: crons.length,
    cronList: crons.join(", "),
    message: "all crons started",
  };
});

router.get("/stopAll", async (ctx) => {
  const crons = Cron.getAll(true).map(([k, v]) => {
    console.log("stopping " + k);
    v.stop();
    return k;
  });

  ctx.body = {
    n: crons.length,
    cronList: crons.join(", "),
    message: "all crons stopped",
  };
});

router.get("/", (ctx) => {
  const { formatted, ...metaDisplay } = Meta;
  ctx.body = { ...metaDisplay };
});

export default router;
