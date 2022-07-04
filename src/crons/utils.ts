import { appToken } from "../config";

interface CronResponse {
  body: string;
  status: number;
  dt: number;
}

/**
 *
 * @returns gets all cron from nexys
 */
export const getCronsFromHost = async () => {
  const everySec = "* * * * * *";
  const c = { name: "my", cronstring: everySec };

  return Promise.resolve([c]);
};

/**
 * takes cron name and turn into a function that will call the right service with the right parameters
 * @param name take
 * @returns
 */
export const cronNameToFunction = async (
  name: string
): Promise<CronResponse> => {
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
