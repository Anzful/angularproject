// src/app/courses/courses.component.ts
import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course.service';
import { AuthService, User } from '../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  courses: any[] = [];
  currentUser$: Observable<User | null>;

  constructor(private courseService: CourseService, private authService: AuthService, private router: Router) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.courses = this.courseService.getAllCourses();
  }

  enrollCourse(courseName: string, user: User | null): void {
    if (user) {
      // Implement enrollment logic, e.g., add to user's enrolled courses
      alert(`You have enrolled in ${courseName}!`);
      // Example: Store enrolled courses in localStorage
      const enrolledCourses = JSON.parse(localStorage.getItem(`${user.email}_enrollments`) || '[]');
      enrolledCourses.push(courseName);
      localStorage.setItem(`${user.email}_enrollments`, JSON.stringify(enrolledCourses));
    } else {
      alert('Please log in to enroll in courses.');
    }
  }

  redirectToLogin(): void {
    this.router.navigate(['/login'], { queryParams: { returnUrl: '/courses' } });
  }
}
