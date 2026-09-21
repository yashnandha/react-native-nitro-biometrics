package com.margelo.nitro.nitrobiometrics

import android.app.KeyguardManager
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.os.Handler
import android.os.Looper
import androidx.annotation.Keep
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.Promise

@DoNotStrip
@Keep
class NitroBiometrics : HybridNitroBiometricsSpec() {

  private val context: Context?
    get() = NitroModules.applicationContext ?: NitroBiometricsPackage.reactApplicationContext

  override fun canAuthenticate(allowDeviceCredentials: Boolean?): Promise<BiometricsStatus> {
    val promise = Promise<BiometricsStatus>()
    val ctx = context
    if (ctx == null) {
      promise.resolve(
        BiometricsStatus(
          isAvailable = false,
          biometryType = BiometryType.NONE,
          biometryTypes = emptyArray(),
          enrolled = false,
          isDeviceSecure = false,
          error = "contextUnavailable"
        )
      )
      return promise
    }

    val authenticators = if (allowDeviceCredentials == true) {
      BiometricManager.Authenticators.BIOMETRIC_STRONG or
        BiometricManager.Authenticators.BIOMETRIC_WEAK or
        BiometricManager.Authenticators.DEVICE_CREDENTIAL
    } else {
      BiometricManager.Authenticators.BIOMETRIC_STRONG or
        BiometricManager.Authenticators.BIOMETRIC_WEAK
    }

    val biometricManager = BiometricManager.from(ctx)
    val canAuthResult = biometricManager.canAuthenticate(authenticators)

    val pm = ctx.packageManager
    val biometryList = mutableListOf<BiometryType>()

    if (pm.hasSystemFeature(PackageManager.FEATURE_FINGERPRINT)) {
      biometryList.add(BiometryType.FINGERPRINT)
    }
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q && pm.hasSystemFeature(PackageManager.FEATURE_FACE)) {
      biometryList.add(BiometryType.FACE)
    }
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q && pm.hasSystemFeature(PackageManager.FEATURE_IRIS)) {
      biometryList.add(BiometryType.IRIS)
    }

    val primaryType = when {
      biometryList.contains(BiometryType.FACE) -> BiometryType.FACE
      biometryList.contains(BiometryType.FINGERPRINT) -> BiometryType.FINGERPRINT
      biometryList.contains(BiometryType.IRIS) -> BiometryType.IRIS
      else -> BiometryType.NONE
    }

    val keyguardManager = ctx.getSystemService(Context.KEYGUARD_SERVICE) as? KeyguardManager
    val isDeviceSecure = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      keyguardManager?.isDeviceSecure ?: false
    } else {
      @Suppress("DEPRECATION")
      keyguardManager?.isKeyguardSecure ?: false
    }

    val isAvailable = canAuthResult == BiometricManager.BIOMETRIC_SUCCESS
    val enrolled = canAuthResult != BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED &&
      canAuthResult != BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE

    val error = when (canAuthResult) {
      BiometricManager.BIOMETRIC_SUCCESS -> null
      BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED -> "notEnrolled"
      BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE -> "notSupported"
      BiometricManager.BIOMETRIC_ERROR_HW_UNAVAILABLE -> "hardwareUnavailable"
      BiometricManager.BIOMETRIC_ERROR_SECURITY_UPDATE_REQUIRED -> "securityUpdateRequired"
      else -> "unknown"
    }

    val status = BiometricsStatus(
      isAvailable = isAvailable,
      biometryType = primaryType,
      biometryTypes = biometryList.toTypedArray(),
      enrolled = enrolled,
      isDeviceSecure = isDeviceSecure,
      error = error
    )

    promise.resolve(status)
    return promise
  }

  override fun authenticate(options: AuthenticateOptions): Promise<AuthenticateResult> {
    val promise = Promise<AuthenticateResult>()
    val reactContext = NitroModules.applicationContext ?: NitroBiometricsPackage.reactApplicationContext
    val currentActivity = reactContext?.currentActivity

    val fragmentActivity = currentActivity as? FragmentActivity
    if (fragmentActivity == null) {
      promise.resolve(
        AuthenticateResult(
          success = false,
          biometryType = null,
          error = "activityUnavailable",
          warning = "Current activity is not a FragmentActivity or is unavailable"
        )
      )
      return promise
    }

    val pm = fragmentActivity.packageManager
    val primaryType = when {
      Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q && pm.hasSystemFeature(PackageManager.FEATURE_FACE) -> BiometryType.FACE
      pm.hasSystemFeature(PackageManager.FEATURE_FINGERPRINT) -> BiometryType.FINGERPRINT
      Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q && pm.hasSystemFeature(PackageManager.FEATURE_IRIS) -> BiometryType.IRIS
      else -> null
    }

    Handler(Looper.getMainLooper()).post {
      try {
        val authenticators = if (options.allowDeviceCredentials == true) {
          BiometricManager.Authenticators.BIOMETRIC_STRONG or
            BiometricManager.Authenticators.BIOMETRIC_WEAK or
            BiometricManager.Authenticators.DEVICE_CREDENTIAL
        } else {
          BiometricManager.Authenticators.BIOMETRIC_STRONG or
            BiometricManager.Authenticators.BIOMETRIC_WEAK
        }

        val promptInfoBuilder = BiometricPrompt.PromptInfo.Builder()
          .setTitle(options.promptMessage)
          .setAllowedAuthenticators(authenticators)

        options.subtitle?.let { promptInfoBuilder.setSubtitle(it) }
        options.description?.let { promptInfoBuilder.setDescription(it) }

        if (options.confirmationRequired != null) {
          promptInfoBuilder.setConfirmationRequired(options.confirmationRequired)
        }

        if (options.allowDeviceCredentials != true) {
          promptInfoBuilder.setNegativeButtonText(options.cancelButtonText ?: "Cancel")
        }

        val promptInfo = promptInfoBuilder.build()
        val executor = ContextCompat.getMainExecutor(fragmentActivity)

        val biometricPrompt = BiometricPrompt(
          fragmentActivity,
          executor,
          object : BiometricPrompt.AuthenticationCallback() {
            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
              super.onAuthenticationSucceeded(result)
              promise.resolve(
                AuthenticateResult(
                  success = true,
                  biometryType = primaryType,
                  error = null,
                  warning = null
                )
              )
            }

            override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
              super.onAuthenticationError(errorCode, errString)
              val mappedError = when (errorCode) {
                BiometricPrompt.ERROR_USER_CANCELED,
                BiometricPrompt.ERROR_NEGATIVE_BUTTON -> "userCanceled"
                BiometricPrompt.ERROR_CANCELED -> "systemCanceled"
                BiometricPrompt.ERROR_LOCKOUT -> "lockout"
                BiometricPrompt.ERROR_LOCKOUT_PERMANENT -> "lockoutPermanent"
                BiometricPrompt.ERROR_NO_BIOMETRICS -> "notEnrolled"
                BiometricPrompt.ERROR_HW_NOT_PRESENT,
                BiometricPrompt.ERROR_HW_UNAVAILABLE -> "hardwareUnavailable"
                BiometricPrompt.ERROR_NO_DEVICE_CREDENTIAL -> "passcodeNotSet"
                BiometricPrompt.ERROR_TIMEOUT -> "timeout"
                else -> "unknown"
              }

              promise.resolve(
                AuthenticateResult(
                  success = false,
                  biometryType = primaryType,
                  error = mappedError,
                  warning = errString.toString()
                )
              )
            }

            override fun onAuthenticationFailed() {
              super.onAuthenticationFailed()
              // BiometricPrompt keeps session active for retries until user cancels or lockout
            }
          }
        )

        biometricPrompt.authenticate(promptInfo)
      } catch (e: Throwable) {
        promise.resolve(
          AuthenticateResult(
            success = false,
            biometryType = primaryType,
            error = "unknown",
            warning = e.message
          )
        )
      }
    }

    return promise
  }
}
