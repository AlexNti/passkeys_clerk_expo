import { PublicKeyCredentialCreationOptionsJSON } from "./ClerkExpoPasskeys.types";
import ClerkExpoPasskeys from "./ClerkExpoPasskeysModule";

export class AndroidPasskeys {
  public static async create(
    credentials: PublicKeyCredentialCreationOptionsJSON
  ) {
    try {
      console.log(credentials.user.id);
      const response = await ClerkExpoPasskeys.create(
        JSON.stringify(credentials)
      );
      return response;
    } catch (error: unknown) {
      console.log(error);
      throw error;
    }
  }
}
