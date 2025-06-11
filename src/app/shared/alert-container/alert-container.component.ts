import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AlertService, AlertConfig } from '../services/alert.service';
import { ToastAlertComponent } from '../toast-alert/toast-alert.component';

@Component({
  selector: 'app-alert-container',
  standalone: true,
  imports: [CommonModule, ToastAlertComponent],
  template: `
    <div class="alert-container">
      <div class="alerts-wrapper">
        <div
          *ngFor="let alert of alerts; let i = index"
          class="alert-item"
          [style.top.px]="i * 80"
        >
          <app-toast-alert
            [message]="alert.message"
            [type]="alert.type"
            [duration]="alert.duration || 3000"
          ></app-toast-alert>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .alert-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
      }

      .alerts-wrapper {
        position: relative;
        min-height: 60px;
      }

      .alert-item {
        position: absolute;
        right: 0;
        transition: top 0.3s ease-in-out;
      }
    `,
  ],
})
export class AlertContainerComponent implements OnInit, OnDestroy {
  alerts: AlertConfig[] = [];
  private subscription?: Subscription;
  private readonly MAX_ALERTS = 3;

  constructor(private alertService: AlertService) {}
  ngOnInit() {
    this.subscription = this.alertService.alert$.subscribe((alert) => {
      if (alert) {
        this.addAlert(alert);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private addAlert(alert: AlertConfig): void {
    // Add the new alert to the beginning of the array
    this.alerts.unshift(alert);

    // Limit the number of displayed alerts
    if (this.alerts.length > this.MAX_ALERTS) {
      this.alerts = this.alerts.slice(0, this.MAX_ALERTS);
    }

    // Remove the alert after its duration
    setTimeout(() => {
      const index = this.alerts.indexOf(alert);
      if (index > -1) {
        this.alerts.splice(index, 1);
      }
    }, alert.duration || 3000);
  }
}
