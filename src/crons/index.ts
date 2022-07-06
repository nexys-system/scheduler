import { CronJob } from "cron";
import { cronNameToFunction, getCronsFromHost } from "./nexys-request";

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
    const crons = await getCronsFromHost();

    crons.forEach(({ cronString, ...cron }) => {
      const fx = () => cronNameToFunction(cron);
      const job = new CronJob(cronString, fx);
      job.start();
      console.log(`== CRON "${cron.name}" started`);

      // const name = getCronName(cron);
      this.cronJobs.set(cron.name, job);
    });

    console.log(
      `End initialization: all crons started, n=${this.getAll().length}`
    );
  };
}

export default new Cron();
