import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  let userloggedin = sessionStorage.getItem("isloggedin");

  const router = inject(Router);
  if(userloggedin){
    alert("user is logged in");
    router.navigate(['dashboard']);
  }
  return true;
};
