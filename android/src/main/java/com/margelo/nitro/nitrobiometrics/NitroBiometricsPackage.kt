package com.margelo.nitro.nitrobiometrics

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfoProvider

class NitroBiometricsPackage : BaseReactPackage() {
    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        reactApplicationContext = reactContext
        return null
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider { HashMap() }
    }

    companion object {
        var reactApplicationContext: ReactApplicationContext? = null

        init {
            System.loadLibrary("nitrobiometrics")
        }
    }
}
