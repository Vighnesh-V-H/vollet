import { randomBytes, secretbox } from "tweetnacl";
import { generateMnemonic } from "bip39";

export const generateWallet = (id: string, password: string) => {
  console.log(id, password);
  const mnemonic = generateMnemonic(256);
  console.log(mnemonic);
};
