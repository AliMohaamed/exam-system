import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="visible" (click)="onOverlayClick($event)">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Confirmation</h3>
          <button class="close-button" (click)="onCancel()">&times;</button>
        </div>
        <div class="modal-body">
          <p>{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button class="cancel-button" (click)="onCancel()">Cancel</button>
          <button class="confirm-button" (click)="onConfirm()">Confirm</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1050;
        animation: fadeIn 0.3s ease-out;
      }

      .modal-container {
        width: 90%;
        max-width: 450px;
        background-color: white;
        border-radius: 16px;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        transform: translateY(0);
        animation: slideUp 0.3s ease-out;
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        background-color: #f9fafb;
        border-bottom: 1px solid #e5e7eb;
      }

      .modal-header h3 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: #111827;
      }

      .close-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #6b7280;
        padding: 0;
        margin: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }

      .close-button:hover {
        background-color: rgba(0, 0, 0, 0.05);
        color: #111827;
      }

      .modal-body {
        padding: 20px;
        font-size: 1rem;
        color: #4b5563;
        line-height: 1.5;
      }

      .modal-footer {
        padding: 16px 20px;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        border-top: 1px solid #e5e7eb;
      }

      .cancel-button,
      .confirm-button {
        padding: 10px 16px;
        border-radius: 8px;
        font-weight: 500;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s;
      }

      .cancel-button {
        background-color: #f9fafb;
        border: 1px solid #d1d5db;
        color: #374151;
      }

      .cancel-button:hover {
        background-color: #f3f4f6;
        border-color: #9ca3af;
      }

      .confirm-button {
        background-color: #3b82f6;
        border: 1px solid transparent;
        color: white;
      }

      .confirm-button:hover {
        background-color: #2563eb;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slideUp {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `,
  ],
})
export class ConfirmationModalComponent {
  @Input() message: string = '';
  @Input() visible: boolean = false;
  @Output() confirmed = new EventEmitter<boolean>();

  onConfirm(): void {
    this.confirmed.emit(true);
    this.visible = false;
  }

  onCancel(): void {
    this.confirmed.emit(false);
    this.visible = false;
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).className === 'modal-overlay') {
      this.onCancel();
    }
  }
}
