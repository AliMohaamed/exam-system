import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title',
  imports: [],
  template: `<p class="titles">{{ text }}</p>`,
  styleUrl: './title.component.css'
})
export class TitleComponent {
  @Input() text: string = '';
}
