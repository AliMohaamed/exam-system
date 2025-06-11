import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ExamComponent } from '../../exams/exam/exam.component';

@Injectable({
  providedIn: 'root'
})
export class ExamGuard implements CanDeactivate<ExamComponent> {
  canDeactivate(component: ExamComponent): boolean | Promise<boolean> {
    return component.canDeactivate();
  }
}
