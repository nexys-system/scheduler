import { appToken } from "../config";

import * as T from "./type";

/**
 *
 * @returns gets all cron from nexys
 */
export const getCronsFromHost = async (): Promise<T.NexysCron[]> => {
  const everySec = "* * * * * *";
  const c: T.NexysCron = {
    name: "my",
    cronstring: everySec,
    host: "https://service.nexys.ch",
  };

  return Promise.resolve([c]);
};

const getPath = (name: string, path?: string): string => {
  if (!path) {
    return "/cron?name=" + name;
  }

  return path;
};

/**
 * takes cron name and turn into a function that will call the right service with the right parameters
 * @param name take
 * @returns
 */
export const cronNameToFunction = async ({
  name,
  path: pathIn,
  host,
}: Omit<T.NexysCron, "cronstring">): Promise<T.CronResponse> => {
  const path = getPath(name, pathIn);
  const url = host + path;
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
  { body, status, dt }: T.CronResponse
): Promise<void> => {
  const date = new Date();
  console.log("logging", cronName, body, status, dt, date);
  return Promise.resolve();
};
