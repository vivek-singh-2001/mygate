import { AppInitializationService } from './services/AppInitialization';
import { firstValueFrom } from 'rxjs';

export function initializeApp(
  appInitializationService: AppInitializationService
) {
  return () => firstValueFrom(appInitializationService.initialize());
}
