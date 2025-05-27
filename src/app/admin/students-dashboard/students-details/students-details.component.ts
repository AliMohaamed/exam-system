import { Component, OnInit } from '@angular/core';
import { Student } from '../../../models/student';
import { StudentsService } from '../../../services/students.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from "../../../shared/components/loading/loading.component";

@Component({
  selector: 'app-students-details',
  imports: [LoadingComponent],
  templateUrl: './students-details.component.html',
  styleUrl: './students-details.component.css'
})
export class StudentsDetailsComponent {
  student?: Student
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentsService
  ) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.studentService.getStudentById(id).subscribe({
          next: res => {
            this.isLoading = false
            this.student = res.data;
            console.log(this.student);
          },
          error: err => {
            this.isLoading = false
            console.error(err)
          }
        });
      }
    });
  }
}
