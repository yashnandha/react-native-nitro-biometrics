import { NitroModules } from 'react-native-nitro-modules';
import type { NitroBiometrics } from './NitroBiometrics.nitro';

const NitroBiometricsHybridObject =
  NitroModules.createHybridObject<NitroBiometrics>('NitroBiometrics');

export function multiply(a: number, b: number): number {
  return NitroBiometricsHybridObject.multiply(a, b);
}
