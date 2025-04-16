import { Component } from '@angular/core';
import { TableComponent } from "./table/table.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{}