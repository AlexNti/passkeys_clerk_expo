import { PublicKeyCredentialCreationOptionsJSON } from "./ClerkExpoPasskeys.types";
import ClerkExpoPasskeys from "./ClerkExpoPasskeysModule";

export class AndroidPasskeys {
  public static async create(
    credentials: PublicKeyCredentialCreationOptionsJSON
  ) {
    try {
      const response = await ClerkExpoPasskeys.create(credentials);
      return response;
    } catch (error: unknown) {
      throw error;
    }
  }
}
