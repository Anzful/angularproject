// src/app/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateToCourses(): void {
    this.router.navigate(['/courses']);
  }

  enrollCourse(courseName: string): void {
    alert(`You have enrolled in ${courseName}!`);
    // Implement enrollment logic here, such as adding to a user's enrolled courses
  }
}
