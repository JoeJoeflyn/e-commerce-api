import { sign, verify } from "jsonwebtoken";

export const createTokens = (email: string) => {
  // console.log("process.env.SECRET_KEY", process.env.SECRET_KEY);
  const accessToken = sign({ email: email }, process.env.SECRET_KEY as string);

  return accessToken;
};
