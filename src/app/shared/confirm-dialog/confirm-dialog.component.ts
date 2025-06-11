import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="confirm-dialog-overlay" *ngIf="show">
      <div class="confirm-dialog">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <div class="dialog-buttons">
          <button class="cancel-btn" (click)="onCancel()">Cancel</button>
          <button class="confirm-btn" (click)="onConfirm()">Confirm</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000000;
    }

    .confirm-dialog {
      background: white;
      padding: 20px;
      border-radius: 8px;
      min-width: 300px;
      max-width: 400px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    h3 {
      margin: 0 0 10px 0;
      color: #333;
    }

    p {
      margin: 0 0 20px 0;
      color: #666;
    }

    .dialog-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }

    .cancel-btn {
      background: #e5e7eb;
      color: #374151;
    }

    .confirm-btn {
      background: #ef4444;
      color: white;
    }

    .cancel-btn:hover {
      background: #d1d5db;
    }

    .confirm-btn:hover {
      background: #dc2626;
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() show: boolean = false;
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to proceed?';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
} 