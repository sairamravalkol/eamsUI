import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.css']
})
export class TimepickerComponent implements OnInit {
  meridian = true;

  toggleMeridian() {
      this.meridian = !this.meridian;
  }
  constructor() { }

  ngOnInit() {
  }

}
