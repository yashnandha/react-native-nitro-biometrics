import Foundation
import LocalAuthentication
import NitroModules

class NitroBiometrics: HybridNitroBiometricsSpec {
  
  public func canAuthenticate(allowDeviceCredentials: Bool?) throws -> Promise<BiometricsStatus> {
    let promise = Promise<BiometricsStatus>()
    
    let context = LAContext()
    let policy: LAPolicy = (allowDeviceCredentials == true) ? .deviceOwnerAuthentication : .deviceOwnerAuthenticationWithBiometrics
    
    var laError: NSError?
    let canEvaluate = context.canEvaluatePolicy(policy, error: &laError)
    
    let biometryType: BiometryType
    var biometryTypes: [BiometryType] = []
    
    switch context.biometryType {
    case .faceID:
      biometryType = .faceId
      biometryTypes = [.faceId]
    case .touchID:
      biometryType = .touchId
      biometryTypes = [.touchId]
    case .opticID:
      biometryType = .opticId
      biometryTypes = [.opticId]
    case .none:
      biometryType = .none
    @unknown default:
      biometryType = .none
    }
    
    var isDeviceSecure = false
    var passcodeError: NSError?
    if context.canEvaluatePolicy(.deviceOwnerAuthentication, error: &passcodeError) {
      isDeviceSecure = true
    } else if let pErr = passcodeError, pErr.code != LAError.passcodeNotSet.rawValue {
      isDeviceSecure = true
    }
    
    let enrolled = (context.biometryType != .none) && (laError?.code != LAError.biometryNotEnrolled.rawValue)
    
    var mappedError: String? = nil
    if let error = laError {
      mappedError = mapLAErrorCode(error.code)
    }
    
    let status = BiometricsStatus(
      isAvailable: canEvaluate,
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
    
    let biometryType: BiometryType
    switch context.biometryType {
    case .faceID:
      biometryType = .faceId
    case .touchID:
      biometryType = .touchId
    case .opticID:
      biometryType = .opticId
    case .none:
      biometryType = .none
    @unknown default:
      biometryType = .none
    }
    
    let prompt = options.promptMessage
    
    context.evaluatePolicy(policy, localizedReason: prompt) { [weak self] success, error in
      guard let self = self else { return }
      
      if success {
        let result = AuthenticateResult(
          success: true,
          biometryType: (biometryType != .none) ? biometryType : nil,
          error: nil,
          warning: nil
        )
        promise.resolve(withResult: result)
      } else {
        var errorString = "unknown"
        if let laError = error as? LAError {
          errorString = self.mapLAErrorCode(laError.code.rawValue)
        } else if let nsError = error as? NSError {
          errorString = self.mapLAErrorCode(nsError.code)
        }
        
        let result = AuthenticateResult(
          success: false,
          biometryType: (biometryType != .none) ? biometryType : nil,
          error: errorString,
          warning: nil
        )
        promise.resolve(withResult: result)
      }
    }
    
    return promise
  }
  
  private func mapLAErrorCode(_ code: Int) -> String {
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
