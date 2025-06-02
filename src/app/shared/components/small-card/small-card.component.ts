import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-small-card',
  imports: [CommonModule],
  templateUrl: './small-card.component.html',
  styleUrl: './small-card.component.css'
})
export class SmallCardComponent {
  @Input() icon: string = '';
  @Input() label: string = '';
  @Input() value: any;
  @Input() customStyle: { [klass: string]: any } = {};
  @Input() customStyle2: { [klass: string]: any } = {};
  @Input() customClass: string = '';
  @Input() customClass2: string = '';
}
