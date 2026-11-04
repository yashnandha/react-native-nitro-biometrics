import Foundation
import LocalAuthentication
import NitroModules

class NitroBiometrics: HybridNitroBiometricsSpec {
  
  public func canAuthenticate(allowDeviceCredentials: Bool?) throws -> Promise<BiometricsStatus> {
    let promise = Promise<BiometricsStatus>()
    
    let context = LAContext()
    
    // Always evaluate biometric policy first to inspect hardware type and biometric enrollment status
    var bioError: NSError?
    let canEvaluateBiometrics = context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &bioError)
    
    let biometryType: BiometryType
    var biometryTypes: [BiometryType] = []
    
    switch context.biometryType {
    case .faceID:
      biometryType = .faceid
      biometryTypes = [.faceid]
    case .touchID:
      biometryType = .touchid
      biometryTypes = [.touchid]
    case .opticID:
      biometryType = .opticid
      biometryTypes = [.opticid]
    case .none:
      biometryType = .none
    @unknown default:
      biometryType = .none
    }
    
    // Check if device passcode is set
    var isDeviceSecure = false
    var passcodeError: NSError?
    if context.canEvaluatePolicy(.deviceOwnerAuthentication, error: &passcodeError) {
      isDeviceSecure = true
    } else if let pErr = passcodeError, pErr.code != LAError.passcodeNotSet.rawValue {
      isDeviceSecure = true
    }
    
    // Biometric credentials enrollment check (independent of device passcode)
    let enrolled = (context.biometryType != .none) && (bioError?.code != LAError.biometryNotEnrolled.rawValue)
    
    // Overall availability depends on whether device credentials fallback is allowed
    let isAvailable: Bool
    var mappedError: String? = nil
    
    if allowDeviceCredentials == true {
      var credError: NSError?
      isAvailable = context.canEvaluatePolicy(.deviceOwnerAuthentication, error: &credError)
      if let error = credError {
        mappedError = NitroBiometrics.mapLAErrorCode(error.code)
      }
    } else {
      isAvailable = canEvaluateBiometrics
      if let error = bioError {
        mappedError = NitroBiometrics.mapLAErrorCode(error.code)
      }
    }
    
    let status = BiometricsStatus(
      isAvailable: isAvailable,
      biometryType: biometryType,
      biometryTypes: biometryTypes,
      enrolled: enrolled,
      isDeviceSecure: isDeviceSecure,
      error: mappedError
    )
    
    promise.resolve(withResult: status)
    return promise
  }
  
  public func authenticate(options: AuthenticateOptions) throws -> Promise<AuthenticateResult> {
    let promise = Promise<AuthenticateResult>()
    let context = LAContext()
    
    if let fallbackTitle = options.fallbackButtonText {
      context.localizedFallbackTitle = fallbackTitle
    }
    if let cancelTitle = options.cancelButtonText {
      context.localizedCancelTitle = cancelTitle
    }
    
    let policy: LAPolicy = (options.allowDeviceCredentials == true) ? .deviceOwnerAuthentication : .deviceOwnerAuthenticationWithBiometrics
    
    // Evaluate policy support beforehand to populate context.biometryType
    var preError: NSError?
    _ = context.canEvaluatePolicy(policy, error: &preError)
    
    let prompt = options.promptMessage
    
    context.evaluatePolicy(policy, localizedReason: prompt) { success, error in
      let resolvedBiometryType: BiometryType
      switch context.biometryType {
      case .faceID:
        resolvedBiometryType = .faceid
      case .touchID:
        resolvedBiometryType = .touchid
      case .opticID:
        resolvedBiometryType = .opticid
      default:
        resolvedBiometryType = .none
      }
      
      let biometryTypeResult: BiometryType? = (resolvedBiometryType != .none) ? resolvedBiometryType : nil
      
      if success {
        let result = AuthenticateResult(
          success: true,
          biometryType: biometryTypeResult,
          error: nil,
          warning: nil
        )
        promise.resolve(withResult: result)
      } else {
        var errorString = "unknown"
        if let laError = error as? LAError {
          errorString = NitroBiometrics.mapLAErrorCode(laError.code.rawValue)
        } else if let nsError = error as? NSError {
          errorString = NitroBiometrics.mapLAErrorCode(nsError.code)
        }
        
        let result = AuthenticateResult(
          success: false,
          biometryType: biometryTypeResult,
          error: errorString,
          warning: nil
        )
        promise.resolve(withResult: result)
      }
    }
    
    return promise
  }
  
  private static func mapLAErrorCode(_ code: Int) -> String {
    switch code {
    case LAError.authenticationFailed.rawValue:
      return "failed"
    case LAError.userCancel.rawValue:
      return "userCanceled"
    case LAError.userFallback.rawValue:
      return "userFallback"
    case LAError.systemCancel.rawValue:
      return "systemCanceled"
    case LAError.passcodeNotSet.rawValue:
      return "passcodeNotSet"
    case LAError.biometryNotAvailable.rawValue:
      return "hardwareUnavailable"
    case LAError.biometryNotEnrolled.rawValue:
      return "notEnrolled"
    case LAError.biometryLockout.rawValue:
      return "lockout"
    case LAError.appCancel.rawValue:
      return "appCanceled"
    case LAError.invalidContext.rawValue:
      return "invalidContext"
    case LAError.notInteractive.rawValue:
      return "notInteractive"
    default:
      return "unknown"
    }
  }
}
