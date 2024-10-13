import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/auth/login.service';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';

export const organizerGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);  
  const router = inject(Router); 
  
  return loginService.isOrganizer.pipe(
    take(1),  // fix: observable completes after the first emitted value, and it avoids waiting for any future updates
    map(isOrganizer => {
      if (isOrganizer) {
        return true;
      } else {
        router.navigate(['/home']);
        return false;
      }
    })
  );
};
