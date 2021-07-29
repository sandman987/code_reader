import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-camerafeed',
  templateUrl: './camerafeed.component.html',
  styleUrls: ['./camerafeed.component.css']
})
export class CamerafeedComponent implements OnInit {
  @Input() message: string;
  constructor() {}

  ngOnInit() {
  }
}
