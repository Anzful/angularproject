// src/app/contact/contact.component.ts

import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'] // Use .css if not using SCSS
})
export class ContactComponent {

  constructor() { }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const { name, email, message } = form.value;
      console.log('Contact Form Submitted:', { name, email, message });

      // TODO: Implement actual form submission logic, e.g., send data to backend
      // For demonstration, we'll just show an alert
      alert('Your message has been sent successfully!');

      // Reset the form after submission
      form.resetForm();
    }
  }
}
