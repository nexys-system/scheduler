import dotenv from "dotenv";

dotenv.config();

if (typeof process.env.APP_TOKEN !== "string") {
  throw Error(
    'the app can\'t be started because the env var "APP_TOKEN" is required'
  );
}

export const appToken: string = process.env.APP_TOKEN;
export const port = process.env.PORT ? Number(process.env.PORT) : 3000;
