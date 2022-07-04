export interface CronResponse {
  body: string;
  status: number;
  dt: number;
}

export interface NexysCron {
  host: string;
  path?: string;
  cronstring: string;
  name: string;
}
