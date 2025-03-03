import { CanActivateFn , Router} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../Services/Auth/auth.service';

export const loginGuardGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router=inject(Router);
  const token= authService.getToken();

  if(token)
  {
    router.navigate(['/products']);
    return false;
  }
  else{
    return true;
  }
};
