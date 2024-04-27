import dotenv from "dotenv";
import path from "path";
import type { InitOptions } from "payload/config";
import payload from "payload";
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});
let catched = (global as any).payload;
if (!catched) {
  catched = (global as any).payload = { client: null, promise: null };
}
interface Args {
  initOptions?: Partial<InitOptions>;
}
export const getPayloadClient = async ({ initOptions }: Args = {}) => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD SECRET IS MISSING");
  }
  if (catched.client) {
    return catched.client;
  }
  if (!catched.promise) {
    catched.promise = payload.init({
      secret: process.env.PAYLOAD_SECRET,
      local: initOptions?.express ? false : true,
      ...(initOptions || {}),
    });
  }
  try {
    catched.client = await catched.promise;
  } catch (e: unknown) {
    catched.promise = null;
    throw e;
  }
  return catched.client;
};
