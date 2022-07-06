import { appToken, nexysHost } from "../config";

import * as T from "./type";
import * as U from "./utils";

// here use 'app-token' and not authorization
// todo: do not use apptoken directly wrap in a class/function
const headers = { "app-token": appToken, "content-type": "application/json" };

/**
 *
 * @returns gets all cron from nexys
 */
export const getCronsFromHost = async (): Promise<T.NexysCron[]> => {
  const path = "/cron/list";
  const url = nexysHost + path;
  const method = "GET";

  const response = await fetch(url, { headers, method });

  if (response.status !== 200) {
    throw Error(
      "could not fetch cron from nexys service, status=" + response.status
    );
  }

  const jBody: Partial<T.NexysCron>[] = await response.json();

  // only get entries that have path and hostx
  const r = jBody.filter(U.isNexysCron);

  console.log(`Crons fetched, n=${r.length} `);

  return r;
};

/**
 * takes cron name and turn into a function that will call the right service with the right parameters
 * @param name take
 * @returns
 */
export const cronNameToFunction = async ({
  uuid,
  name,
  path: pathIn,
  host,
}: Omit<T.NexysCron, "cronString">): Promise<T.CronResponse> => {
  const path = U.getPath(name, pathIn);
  const url = host + path;

  // always get method
  const method = "GET";

  const t0 = new Date();
  const response = await fetch(url, { headers, method });
  const body = await response.text();
  const t1 = new Date();
  const status = response.status;

  const dt: number = t1.getTime() - t0.getTime();

  logResponse(uuid, { body, status, dt });

  return { body, status, dt };
};

/**
 * every time a log is fired, the response is logged
 * @param param0
 * @returns
 */
const logResponse = async (
  uuid: string,
  { body, status, dt }: T.CronResponse
): Promise<number> => {
  // console.log("logging", uuid, cronName, body, status, dt, date);

  const sBody = JSON.stringify({
    scheduler: { uuid },
    response: body,
    statusCode: status,
    responseTime: dt,
  });

  const r = await fetch(nexysHost + "/cron/log/insert", {
    method: "POST",
    body: sBody,
    headers,
  });

  if (r.status != 200) {
    throw Error("could not insert log");
  }

  return r.status;
};
