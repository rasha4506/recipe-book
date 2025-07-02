
// import { Component } from '@angular/core';
// import { NgForm, FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { AuthService } from './auth.service';
// import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';

// @Component({
//   selector: 'app-auth',
//   standalone: true,
//   imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
//   templateUrl: './auth.component.html',
// })
// export class AuthComponent {
//   isLoginMode = true;
//   isLoading = false;
//   error: string | null = null;

//   constructor(private authService: AuthService) {}

//   onSwitchMode() {
//     this.isLoginMode = !this.isLoginMode;
//   }

//   onSubmit(form: NgForm) {
//     if (!form.valid) {
//       return;
//     }

//     const email = form.value.email;
//     const password = form.value.password;

//     this.isLoading = true;
//     this.error = null;

//     if (this.isLoginMode) {
//       this.authService.login(email, password).subscribe({
//         next: (resData) => {
//           console.log('Login success:', resData);
//           this.isLoading = false;
//         },
//         error: (errorRes) => {
//           const rawMessage = errorRes?.error?.error?.message;
//           console.error('Login error code:', rawMessage); // 👈 helpful for debugging
//           const errorMessage = this.getErrorMessage(rawMessage);
//           this.error = errorMessage;
//           this.isLoading = false;
//         }
//       });
//     } else {
//       this.authService.signup(email, password).subscribe({
//         next: (resData) => {
//           console.log('Signup success:', resData);
//           this.isLoading = false;
//         },
//         error: (errorRes) => {
//           const rawMessage = errorRes?.error?.error?.message;
//           console.error('Signup error code:', rawMessage); // 👈 helpful for debugging
//           const errorMessage = this.getErrorMessage(rawMessage);
//           this.error = errorMessage;
//           this.isLoading = false;
//         }
//       });
//     }

//     form.reset();
//   }

//   private getErrorMessage(message: string | undefined): string {
//   switch (message) {
//     case 'EMAIL_EXISTS':
//     case 'auth/email-already-in-use':
//       return 'This email address is already registered.';
//     case 'EMAIL_NOT_FOUND':
//     case 'auth/user-not-found':
//       return 'This email is not registered.';
//     case 'INVALID_PASSWORD':
//     case 'auth/wrong-password':
//       return 'The password you entered is incorrect.';
//     case 'INVALID_LOGIN_CREDENTIALS': // ✅ Firebase sometimes returns this combined message
//       return 'Invalid email or password.';
//     case 'USER_DISABLED':
//     case 'auth/user-disabled':
//       return 'This user account has been disabled.';
//     default:
//       return 'An unknown error occurred!';
//   }
// }
// }


import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { Router } from '@angular/router'; // ✅ Import Router

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {} // ✅ Inject Router

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;
    this.error = null;

    if (this.isLoginMode) {
      this.authService.login(email, password).subscribe({
        next: (resData) => {
          console.log('Login success:', resData);
          this.isLoading = false;
          this.router.navigate(['/recipes']); // ✅ Navigate after login
        },
        error: (errorRes) => {
          const rawMessage = errorRes?.error?.error?.message;
          console.error('Login error code:', rawMessage);
          const errorMessage = this.getErrorMessage(rawMessage);
          this.error = errorMessage;
          this.isLoading = false;
        }
      });
    } else {
      this.authService.signup(email, password).subscribe({
        next: (resData) => {
          console.log('Signup success:', resData);
          this.isLoading = false;
          this.router.navigate(['/recipes']); // ✅ Navigate after signup
        },
        error: (errorRes) => {
          const rawMessage = errorRes?.error?.error?.message;
          console.error('Signup error code:', rawMessage);
          const errorMessage = this.getErrorMessage(rawMessage);
          this.error = errorMessage;
          this.isLoading = false;
        }
      });
    }

    form.reset();
  }

  private getErrorMessage(message: string | undefined): string {
    switch (message) {
      case 'EMAIL_EXISTS':
      case 'auth/email-already-in-use':
        return 'This email address is already registered.';
      case 'EMAIL_NOT_FOUND':
      case 'auth/user-not-found':
        return 'This email is not registered.';
      case 'INVALID_PASSWORD':
      case 'auth/wrong-password':
        return 'The password you entered is incorrect.';
      case 'INVALID_LOGIN_CREDENTIALS':
        return 'Invalid email or password.';
      case 'USER_DISABLED':
      case 'auth/user-disabled':
        return 'This user account has been disabled.';
      default:
        return 'An unknown error occurred!';
    }
  }
}
