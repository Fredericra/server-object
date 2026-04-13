import { config } from "dotenv";
import { SimpleCrypto } from "simple-crypto-js";
import type { resData } from "../Type";
import type { Response, Request } from "express";
config();

const key = process.env.SECRET?.trim();
const crypto = new SimpleCrypto(`${key}`);

const encrypte = async (data: any): Promise<string> => {
  return crypto.encrypt(JSON.stringify(data));
};

const code = async (need: number): Promise<string> => {
  const text = "AZERTYUIOPQDFGHJKLMWXCVBN0123456789";
  let random = "";
  for (let i = 0; i < need; i++) {
    random += text[Math.floor(Math.random() * text.length)];
  }
  return random;
};

const decrypte = async (data: any): Promise<any> => {
  return crypto.decrypt(data);
};

const resParams = (data: resData) => {
  return encrypte(data);
};

const Requete = async (
  req: Request,
  res: Response,
  callback:Function,
) => {
  try {
    callback()
  } catch (error) {
    return res.json(
      await Utility.resParams({
        message: `erreur survenue${error}`,
        status: false,
        field: "error",
      }),
    );
  }
};

const Utility = {
  encrypte,
  decrypte,
  resParams,
  code,
  Requete
};

export default Utility;
