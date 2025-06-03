import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-alert.component.html',
  styleUrls: ['./toast-alert.component.css']
})
export class ToastAlertComponent implements OnInit {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() duration: number = 3000; 
  visible = true;

  ngOnInit() {
    setTimeout(() => {
      this.visible = false;
    }, this.duration);
  }
} 