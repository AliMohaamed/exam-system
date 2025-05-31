import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StudentsService } from '../../../services/students.service';
import { RouterModule, Router } from '@angular/router';
import { Student } from '../../../models/student';
import { TitleComponent } from "../../../shared/components/shared/title/title.component";
import { LoadingComponent } from "../../../shared/loading/loading.component";

@Component({
  selector: 'app-student-form',
  imports: [ReactiveFormsModule, TitleComponent, RouterModule, LoadingComponent],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {
  studentForm!: FormGroup;
  idFromRoute: string = '';
  student?: Student
  showMessage: boolean = false;
  isLoading:boolean=true;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idFromRoute = params['id'] || '0';

      this.studentForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ]],
        password: ['',
          this.idFromRoute !== '0'
            ? []
            : [Validators.required,
            Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/)
            ]
        ],
        level: ['', Validators.required]
      });

      if (this.idFromRoute !== '0') {
        this.studentService.getStudentById(this.idFromRoute).subscribe({
          next: res => {
            this.isLoading=false
            this.student = res.data;
            this.studentForm.patchValue({
              name: this.student?.name,
              password: this.student?.password,
              email: this.student?.email,
              level: this.student?.level,
            });
          },
          error: err => {
            this.isLoading=false
            console.error('Error fetching student:', err);
          }
        });
      }
    });
  }


  submitForm() {
    if (this.studentForm.valid) {
      const studentData = this.studentForm.value;
      console.log(studentData)
      console.log(this.idFromRoute)

      if (this.idFromRoute !== '0') {

        // Update
        this.studentService.editStudent(this.idFromRoute, studentData).subscribe({
          next: res => {
            console.log('Student Updated:', res);
            this.showMessage = true;
            this.showMessageAndNavigate()
          },
          error: err => {
            console.error('Error updating student:', err);
          }
        });
      } else {

        // Add
        this.studentService.AddNewStudent(studentData).subscribe({
          next: res => {
            console.log('Student Added:', res);
            this.showMessage = true;
            this.showMessageAndNavigate()
          },
          error: err => {
            console.error('Error adding student:', err);
          }
        });
      }
    } else {
      this.studentForm.markAllAsTouched();
    }
  }
  showMessageAndNavigate() {
    setTimeout(() => {
      this.showMessage = false;
      this.router.navigate(['/students']);
    }, 2000);
  }
}