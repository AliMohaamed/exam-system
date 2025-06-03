import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-alert.component.html',
  styleUrls: ['./success-alert.component.css']
})
export class SuccessAlertComponent {
  @Input() title: string = 'Reset password Successful!';
  @Input() message: string = 'your password has been successfully change';
  @Input() buttonText: string = 'Goto Sign in';
  @Output() action = new EventEmitter<void>();

  onAction() {
    this.action.emit();
  }
} 