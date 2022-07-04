import { CronJob } from "cron";
import { NexysCron } from "./type";
import { cronNameToFunction, getCronsFromHost } from "./utils";

class Cron {
  // this Map will keep all crons in memory.
  // Global var... can do better/differently?
  cronJobs: Map<string, CronJob>;

  constructor() {
    this.cronJobs = new Map();
  }

  getAll = (running: boolean = true): [string, CronJob][] =>
    Array.from(this.cronJobs.entries()).filter(
      ([, v]) => v.running === running
    );

  get = (name: any) => {
    if (typeof name !== "string") {
      throw Error('query arg "name" must be given');
    }

    const cron = this.cronJobs.get(name);

    if (!cron) {
      throw Error(`cron with name "${name}" could not be found`);
    }

    return cron;
  };

  init = async () => {
    // get all crons
    const crons: NexysCron[] = await getCronsFromHost();

    crons.forEach(({ cronstring, ...cron }) => {
      const fx = () => cronNameToFunction(cron);
      const job = new CronJob(cronstring, fx);
      job.start();

      this.cronJobs.set(cron.name, job);
    });

    console.log(`Crons started, n=${this.getAll().length}`);
  };
}

export default new Cron();
