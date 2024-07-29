import {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from "./ClerkExpoPasskeys.types";
import ClerkExpoPasskeys from "./ClerkExpoPasskeysModule";

export class AndroidPasskeys {
  public static async create(
    credentials: PublicKeyCredentialCreationOptionsJSON
  ) {
    try {
      const response = await ClerkExpoPasskeys.create(
        JSON.stringify(credentials)
      );
      return response;
    } catch (error: unknown) {
      console.log(error);
      throw error;
    }
  }

  public static async get(credentials: PublicKeyCredentialRequestOptionsJSON) {
    try {
      const response = await ClerkExpoPasskeys.get(JSON.stringify(credentials));
      return response;
    } catch (error: unknown) {
      console.log(error);
      throw error;
    }
  }
}
