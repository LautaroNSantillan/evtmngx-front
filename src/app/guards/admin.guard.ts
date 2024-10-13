import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, switchMap, take } from 'rxjs';
import { LoginService } from '../services/auth/login.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);  
  const router = inject(Router); 
  
  return loginService.isAdmin.pipe(
    take(1),  // fix: observable completes after the first emitted value, and it avoids waiting for any future updates
    map(isAdmin => {
      if (isAdmin) {
        return true;
      } else {
        router.navigate(['/home']);
        return false;
      }
    })
  );
};
