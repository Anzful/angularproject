// src/app/services/course.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courses = [
    { title: 'Angular Basics', description: 'Learn the basics of Angular and build dynamic web applications.' },
    { title: 'React Fundamentals', description: 'Intro to React JS and building interactive UIs.' },
    { title: 'Vue Essentials', description: 'Getting started with Vue for modern web development.' },
    { title: 'Advanced TypeScript', description: 'Deep dive into TypeScript features and best practices.' },
    { title: 'Node.js for Beginners', description: 'Build backend applications using Node.js and Express.' },
    // Add more courses as needed
  ];

  constructor() {}

  // Renamed method
  getAllCourses() {
    return this.courses;
  }
}
