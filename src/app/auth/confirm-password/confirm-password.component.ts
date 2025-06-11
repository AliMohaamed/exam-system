import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-password.component.html',
  styleUrl: './confirm-password.component.css',
  imports: [LoadingComponent],
})
export class ConfirmPasswordComponent implements OnInit {
  message: string = '';
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    const activationCode = this.route.snapshot.paramMap.get('activationCode');
    if (activationCode) {

      this.http
        .get(
          `https://exam-app-expressjs.vercel.app/api/v1/auth/confirmEmail/${activationCode}`
        )
        .subscribe({
          next: (res: any) => {
            this.message = res.message || 'Account activated successfully';
            this.loading = false;

            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 2000);
          },
          error: (err) => {
            this.message = err.error.message || 'Activation failed';
            this.loading = false;
          },
        });
    }
  }
}
