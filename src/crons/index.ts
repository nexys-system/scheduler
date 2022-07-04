import { CronJob } from "cron";
import { appToken } from "../config";

interface CronResponse {
  body: string;
  status: number;
  dt: number;
}

// this Map will keep all crons in memory.
// Global var... can do better/differently?
export const cronJobs: Map<string, CronJob> = new Map();

/**
 * every time a log is fired, the response is logged
 * @param param0
 * @returns
 */
const logResponse = (
  cronName: string,
  { body, status, dt }: CronResponse
): Promise<void> => {
  const date = new Date();
  console.log("logging", cronName, body, status, dt, date);
  return Promise.resolve();
};

/**
 * takes cron name and turn into a function that will call the right service with the right parameters
 * @param name take
 * @returns
 */
const cronNameToFunction = async (name: string): Promise<CronResponse> => {
  //
  const url = "https://service.nexys.io/cron?name=" + name;
  const headers = {
    "content-type": "application/json",
    Authorization: "bearer " + appToken,
  };

  // always get method
  const method = "GET";

  const t0 = new Date();
  const response = await fetch(url, { headers, method });
  const body = await response.text();
  const t1 = new Date();
  const status = response.status;

  const dt: number = t1.getTime() - t0.getTime();

  logResponse(name, { body, status, dt });

  return { body, status, dt };
};

/**
 *
 * @returns gets all cron from nexys
 */
const getCronsFromHost = async () => {
  const everySec = "* * * * * *";
  const c = { name: "my", cronstring: everySec };

  return Promise.resolve([c]);
};

export const init = async () => {
  // get all crons
  const crons: { name: string; cronstring: string }[] =
    await getCronsFromHost();

  crons.forEach((cron) => {
    const fx = () => cronNameToFunction(cron.name);
    const job = new CronJob(cron.cronstring, fx);
    job.start();

    cronJobs.set(cron.name, job);
  });

  console.log(`Crons started, n=${getCrons().length}`);
};

export const getCrons = (running: boolean = true): [string, CronJob][] =>
  Array.from(cronJobs.entries()).filter(([, v]) => v.running === running);

export const getCron = (name: any) => {
  if (typeof name !== "string") {
    throw Error('query arg "name" must be given');
  }

  const cron = cronJobs.get(name);

  if (!cron) {
    throw Error(`cron with name "${name}" could not be found`);
  }

  return cron;
};

// potentially useful code
/*
setTimeout(() => {
  console.log("enter timeout");
  const c = cronJobs.get("my");

  if (c) {
    c.stop();
  }
}, 3000);*
//job.start();

const job = new CronJob("* * * * * *", () =>
  console.log("you will see this message every second")
);
fetch("https://www.google.com").then((x) => {
  x.text().then((c) => {
    console.log(c);
  });
});*/

// get list of crons

// for each job:
// cronstring, url, apptoken in header
// result to be sent back and saved in logs

//
//const every5sec = "*/5 * * * * *";

//const cronFunction = () =>
//  /console.log("you will see this message every second");
