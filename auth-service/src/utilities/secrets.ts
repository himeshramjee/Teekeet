import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class Secrets {
  static async toHashedPassword(password: string, salt?: string) {
    salt = salt ? salt : randomBytes(16).toString("hex");
    const buffer = (await scryptAsync(password, salt, 64)) as Buffer;

    const theHash = `${buffer.toString("hex")}.${salt}`;
    return theHash;
  }

  static async comparePasswordHashes(
    storedHash: string,
    suppliedPassword: string
  ) {
    const [hashedStoredPassword, salt] = storedHash.split(".");
    const [hashedSuppliedPassword, salty] = await this.toHashedPassword(
      suppliedPassword,
      salt
    ).then((hash) => {
      return hash.split(".");
    });

    return hashedStoredPassword === hashedSuppliedPassword;
  }
}
