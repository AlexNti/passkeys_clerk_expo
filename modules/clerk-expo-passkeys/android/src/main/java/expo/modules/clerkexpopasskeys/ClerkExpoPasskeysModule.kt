package expo.modules.clerkexpopasskeys

import AuthenticationResponseJSON
import PublicKeyCredentialCreationOptions
import PublicKeyCredentialRequestOptions
import RegistrationResponseJSON
import androidx.credentials.CreatePublicKeyCredentialRequest
import androidx.credentials.CredentialManager
import androidx.credentials.GetCredentialRequest
import androidx.credentials.GetPublicKeyCredentialOption
import androidx.credentials.exceptions.CreateCredentialCancellationException
import androidx.credentials.exceptions.CreateCredentialException
import androidx.credentials.exceptions.CreateCredentialInterruptedException
import androidx.credentials.exceptions.CreateCredentialProviderConfigurationException
import androidx.credentials.exceptions.CreateCredentialUnknownException
import androidx.credentials.exceptions.CreateCredentialUnsupportedException
import androidx.credentials.exceptions.GetCredentialCancellationException
import androidx.credentials.exceptions.GetCredentialException
import androidx.credentials.exceptions.GetCredentialInterruptedException
import androidx.credentials.exceptions.GetCredentialProviderConfigurationException
import androidx.credentials.exceptions.GetCredentialUnknownException
import androidx.credentials.exceptions.GetCredentialUnsupportedException
import androidx.credentials.exceptions.NoCredentialException
import androidx.credentials.exceptions.publickeycredential.CreatePublicKeyCredentialDomException
import androidx.credentials.exceptions.publickeycredential.GetPublicKeyCredentialDomException
import com.google.gson.Gson
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch


class ClerkExpoPasskeysModule : Module() {
  private val mainScope = CoroutineScope(Dispatchers.Default)

  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ClerkExpoPasskeys')` in JavaScript.
    Name("ClerkExpoPasskeys")

    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    Constants(
      "PI" to Math.PI
    )

    

      Function("isSupported") {
            val minApiLevelPasskeys = 28
            val currentApiLevel = android.os.Build.VERSION.SDK_INT
            return@Function currentApiLevel >= minApiLevelPasskeys
      }

    

      AsyncFunction("create") { request: PublicKeyCredentialCreationOptions, promise: Promise ->
        val credentialManager =
            CredentialManager.create(appContext.reactContext?.applicationContext!!)
        val json = Gson().toJson(request)
        val createPublicKeyCredentialRequest = CreatePublicKeyCredentialRequest(json)


        // mainScope.launch {
        //     try {
        //         val result = appContext.currentActivity?.let {
        //             credentialManager.createCredential(it, createPublicKeyCredentialRequest)
        //         }
        //         val response =
        //             result?.data?.getString("androidx.credentials.BUNDLE_KEY_REGISTRATION_RESPONSE_JSON")
        //         val createCredentialResponse =
        //             Gson().fromJson(response, RegistrationResponseJSON::class.java)
        //         promise.resolve(createCredentialResponse)
        //     } catch (e: CreateCredentialException) {
        //         promise.reject("Passkey Create", getRegistrationException(e), e)
        //     }
        // }
    }

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      "Hello world! 👋"
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { value: String ->
      // Send an event to JavaScript.
      sendEvent("onChange", mapOf(
        "value" to value
      ))
    }

    // Enables the module to be used as a native view. Definition components that are accepted as part of
    // the view definition: Prop, Events.
    View(ClerkExpoPasskeysView::class) {
      // Defines a setter for the `name` prop.
      Prop("name") { view: ClerkExpoPasskeysView, prop: String ->
        println(prop)
      }
    }
  }
}
