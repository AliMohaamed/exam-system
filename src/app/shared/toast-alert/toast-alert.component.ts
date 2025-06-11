import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-alert.component.html',
  styleUrls: ['./toast-alert.component.css'],
})
export class ToastAlertComponent implements OnInit {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() duration: number = 3000;
  visible = true;
  isFading = false;

  ngOnInit() {
    // Start fade out animation 500ms before hiding
    setTimeout(() => {
      this.isFading = true;
    }, this.duration - 500);

    // Hide the alert after duration
    setTimeout(() => {
      this.visible = false;
    }, this.duration);
  }
}
