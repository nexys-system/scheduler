import * as T from "./type";

export const isNexysCron = (a: Partial<T.NexysCron>): a is T.NexysCron =>
  !!a.host && !!a.path && !!a.cronString && !!a.uuid && !!a.name;

export const getPath = (name: string, path?: string): string => {
  if (!path) {
    return "/cron?name=" + name;
  }

  return path;
};
