import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" [class.show]="isVisible">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header" [ngClass]="type">
            <div class="modal-icon">
              <i [class]="icon"></i>
            </div>
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" (click)="onCancel()"></button>
          </div>
          <div class="modal-body">
            <p>{{ message }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" (click)="onCancel()">
              {{ cancelText }}
            </button>
            <button type="button" [class]="'btn ' + confirmButtonClass" (click)="onConfirm()">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConfirmationModalComponent {
  @Input() isVisible = false;
  @Input() title = '';
  @Input() message = '';
  @Input() type: 'warning' | 'danger' | 'info' = 'warning';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  get icon(): string {
    switch (this.type) {
      case 'warning': return 'bi bi-exclamation-triangle-fill';
      case 'danger': return 'bi bi-x-octagon-fill';
      case 'info': return 'bi bi-info-circle-fill';
      default: return 'bi bi-question-circle-fill';
    }
  }

  get confirmButtonClass(): string {
    switch (this.type) {
      case 'warning': return 'btn-warning';
      case 'danger': return 'btn-danger';
      case 'info': return 'btn-primary';
      default: return 'btn-primary';
    }
  }

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
