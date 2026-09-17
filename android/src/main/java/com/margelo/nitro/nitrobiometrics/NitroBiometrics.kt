package com.margelo.nitro.nitrobiometrics
  
import com.facebook.proguard.annotations.DoNotStrip

@DoNotStrip
class NitroBiometrics : HybridNitroBiometricsSpec() {
  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }
}
