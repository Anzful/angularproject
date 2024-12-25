// src/app/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] // Use .scss if configured
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginError: string = '';
  returnUrl: string = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialize the form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Get the return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onLogin(): void {
    console.log('Login form submitted');
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe(success => {
        if (success) {
          console.log('Login successful');
          // Navigate to the return URL after successful login
          this.router.navigateByUrl(this.returnUrl);
        } else {
          console.log('Login failed');
          this.loginError = 'Invalid email or password.';
        }
      }, error => {
        console.error('Login error:', error);
        this.loginError = 'An error occurred during login. Please try again.';
      });
    }
  }
}
