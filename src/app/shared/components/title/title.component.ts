import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title',
  imports: [],
  template: `<p class="title">{{ text }}</p>`,
  styleUrl: './title.component.css'
})
export class TitleComponent {
  @Input() text: string = '';
}
