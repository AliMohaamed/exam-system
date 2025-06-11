import {
  Injectable,
  ComponentRef,
  createComponent,
  ApplicationRef,
  EnvironmentInjector,
  Injector,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

export interface AlertConfig {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertSubject = new BehaviorSubject<AlertConfig | null>(null);
  alert$ = this.alertSubject.asObservable();
  private confirmationModalRef?: ComponentRef<ConfirmationModalComponent>;

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private environmentInjector: EnvironmentInjector
  ) {}

  success(message: string, duration = 3000): void {
    this.show({ message, type: 'success', duration });
  }

  error(message: string, duration = 3000): void {
    this.show({ message, type: 'error', duration });
  }

  warning(message: string, duration = 3000): void {
    this.show({ message, type: 'warning', duration });
  }

  info(message: string, duration = 3000): void {
    this.show({ message, type: 'info', duration });
  }
  confirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Create a wrapper div for the modal to avoid circular reference
      const modalWrapperElement = document.createElement('div');
      modalWrapperElement.id = 'confirmation-modal-wrapper';
      document.body.appendChild(modalWrapperElement);

      // Create the confirmation modal component dynamically
      const modalComponentRef = createComponent(ConfirmationModalComponent, {
        environmentInjector: this.environmentInjector,
        hostElement: modalWrapperElement, // Use the wrapper element instead of document.body
      });

      // Set properties
      modalComponentRef.instance.message = message;
      modalComponentRef.instance.visible = true;

      // Listen for the result
      modalComponentRef.instance.confirmed.subscribe((result: boolean) => {
        // Clean up the component
        modalComponentRef.destroy();

        // Remove the wrapper element
        if (modalWrapperElement.parentNode) {
          modalWrapperElement.parentNode.removeChild(modalWrapperElement);
        }

        resolve(result);
      });

      // Attach to the application
      this.appRef.attachView(modalComponentRef.hostView);

      this.confirmationModalRef = modalComponentRef;
    });
  }

  private show(config: AlertConfig): void {
    this.alertSubject.next(config);

    // Auto-hide after duration
    setTimeout(() => {
      if (this.alertSubject.value === config) {
        this.alertSubject.next(null);
      }
    }, config.duration || 3000);
  }
}
