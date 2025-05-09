import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private router: Router) {}

   hidePassword = true;

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  forgotPassword() {
    console.log('Forgot password clicked');
  }

  registerNow() {
    this.router.navigate(['/signup']);
  }

  passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  productForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      (control) => {
        const regex =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(control.value)) {
          return { invalidEmail: true };
        }
        return null;
      },
    ]),
    password: new FormControl('', [Validators.required, Validators.pattern(this.passwordRegex)]),
  });


  get getEmail(){
    return this.productForm.get('email')
  }

  get getPassword(){
    return this.productForm.get('password');
  }

  onSubmit(){
    if (this.productForm.invalid) {
    this.productForm.markAllAsTouched();
    return;
  }

  console.log('Form Data:', this.productForm.value);
  this.productForm.reset();
  }


}
