export interface CronResponse {
  body: string;
  status: number;
  dt: number;
}

export interface NexysCron {
  uuid: string;
  host: string;
  path?: string;
  cronString: string;
  name: string;
}
