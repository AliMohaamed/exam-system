import { Component } from '@angular/core';

@Component({
  selector: 'app-students-dashboard',
  imports: [],
  templateUrl: './students-dashboard.component.html',
  styleUrl: './students-dashboard.component.css'
})
export class StudentsDashboardComponent {
  students: { id: number, name: string, exam: string, degree: number }[] = [{ id: 1, name: "Maryam Mohamed", exam: "c++", degree: 100 }, { id: 2, name: "Ahmed Mohamed", exam: "java", degree: 100 }]
  
  deleteStudent(id: number) {
    this.students = this.students.filter(student => student.id !== id);
  }
}
