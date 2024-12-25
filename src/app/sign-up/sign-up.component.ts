// src/app/sign-up/sign-up.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'] // Use .scss if configured
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  signUpError: string = '';
  signUpSuccess: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize the form
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  // Custom validator to check if password and confirmPassword match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSignUp(): void {
    console.log('Sign Up form submitted');
    if (this.signUpForm.valid) {
      const { name, email, password } = this.signUpForm.value;
      this.authService.register(name, email, password).subscribe(success => {
        if (success) {
          console.log('Registration successful');
          this.signUpSuccess = 'Registration successful! Redirecting to login...';
          this.signUpError = '';
          // Redirect to login after a short delay
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          console.log('Registration failed: Email exists');
          this.signUpError = 'Email already exists. Please use a different email.';
          this.signUpSuccess = '';
        }
      }, error => {
        console.error('Registration error:', error);
        this.signUpError = 'An error occurred during registration. Please try again.';
        this.signUpSuccess = '';
      });
    }
  }
}
