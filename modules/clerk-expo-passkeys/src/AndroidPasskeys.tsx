import { PublicKeyCredentialCreationOptionsJSON } from "./ClerkExpoPasskeys.types";
import ClerkExpoPasskeys from "./ClerkExpoPasskeysModule";

export class AndroidPasskeys {
  public static async create(
    credentials: PublicKeyCredentialCreationOptionsJSON
  ) {
    try {
      console.log("Android PASSKEYS");
      const response = await ClerkExpoPasskeys.create(
        JSON.stringify(credentials)
      );
      console.log(response);
      return response;
    } catch (error: unknown) {
      console.log("mesa sto error");
      console.log(error);
      throw error;
    }
  }
}
