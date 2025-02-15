import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Promise<boolean> | Observable<boolean>;
}

export const candeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (component
  , currentRoute
  , currentState
  , nextState) => {
    return component.canDeactivate ? component.canDeactivate() : true;
};
