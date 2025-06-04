import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  @Input() delay: number = 2000; 
  @Input() isLoading: boolean = true;

  ngOnInit() {
    if (this.delay) {
      setTimeout(() => {
        this.isLoading = false;
      }, this.delay);
    }
  }
} 