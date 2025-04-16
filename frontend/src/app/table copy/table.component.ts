/*
TO DO

(1) Contador total de páginas
(2) Poner botones Next/Prev para las páginas
(3) Añadir botones para editar o eliminar fila
(4) Añadir botón para agregar fila
(5) Descargar tabla en forma de archivo PDF o Excel
*/

import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as tablesConfig from '../../assets/config/tables-config.json'; // Importamos el archivo JSON con la configuración de cada tabla
import { OnInit } from '@angular/core';
import { TotalumPedidosService } from '../services/totalum-pedidos.service';
import { Producto } from '../models/Producto';
import { Cliente } from '../models/Cliente';
import { Pedido } from '../models/Pedido';
import { TableNames, TABLES } from '../contants/table-names.constants';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { CapitalizePipe } from "../pipes/capitalize.pipe";
import { UnderscoreToSpacePipe } from "../pipes/underscore-to-space.pipe";
import { AddSymbolPipe } from "../pipes/add-symbol.pipe";

@Component({
  selector: 'app-table-copy',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule, CapitalizePipe, UnderscoreToSpacePipe, AddSymbolPipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})

export class TableComponentCopy implements OnInit {

  // Iconos de modo oscuro y modo claro
  faMoon = faMoon;
  faSun = faSun;

  // Indica si estamos en modo oscuro (true) o no (false)
  isDarkMode: boolean = false;

  menuVisible = false; // True si debe mostrarse el menú de tipos de tablas, false en caso contrario

  @ViewChild('menu') menuRef!: ElementRef; // Puntero al menú de tipos de tablas

  tableNames: (typeof TABLES)[keyof typeof TABLES][] = Object.values(TABLES); // Contiene los nombres de las tablas
  tables = tablesConfig.tables; // Configuración de las tablas
  selectedTable: TableNames = TABLES.PEDIDOS; // Tabla seleccionada para visualizar
  items: Record<string, Pedido[] | Cliente[] | Producto[]> = {}; // Lista de items a mostrar en las tablas

  page = 1; // Página actual de la tabla
  limit = 10; // Límite de ítems por página

  searchTerm = ""; // Término de búsqueda

  constructor(private totalumPedidosService: TotalumPedidosService) { }

  // Al iniciar la componente, será la tabla de pedidos la mostrada
  ngOnInit() {
    this.getAllItems(this.selectedTable);
  }

  // Cogemos los items pertinentes al tipo de tabla en cuestión
  async getAllItems(tableName: TableNames) {
    const page = this.page - 1; // El usuario empieza a contar las páginas desde 1, pero la API desde 0
    this.items[tableName] = await this.totalumPedidosService.getAllItems(tableName, page, this.limit);
  }

  // Cambia el valor de selectedTable a la nueva tabla seleccionada
  selectTable(table: TableNames) {
    this.selectedTable = table;
    this.page = 1; // Como no sabemos el número de páginas de la nueva tabla, reiniciamos a la primera
    this.searchTerm = "", // Reiniciamos el filtro ante la aparición de una nueva tabla
    this.getAllItems(table);
    this.menuVisible = false;
  }

  // Alterna el valor de menuVisible
  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  // Si se hace click fuera del menú de tipos de tablas, este debe cerrarse
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInsideMenu = this.menuRef?.nativeElement.contains(event.target);
    if (!clickedInsideMenu) {
      this.menuVisible = false;
    }
  }

  // Retorna las columnas del tipo de entidad que hay en la lista de items
  objectKeys(): string[] {
    return Object.keys(this.items[this.selectedTable][0]);
  }

  /*
  Retorna true si la tabla ha sido cargada en items y tiene datos que mostrar
  */
  existTable(): boolean {
    return this.items && Object.keys(this.items).length > 0
      && this.items[this.selectedTable] && this.items[this.selectedTable].length > 0;
  }

  // Alterna el valor de isDarkMode y agrega la clase dark al documento
  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    const htmlElement = document.documentElement;

    if (this.isDarkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }

  // Devuelve los items a visualizar
  get selectedItems(): any[] {
    return this.items[this.selectedTable] || [];
  }

  // Actualiza los ítems mostrados
  fetchData() {
    this.getAllItems(this.selectedTable);
  }

  // Retorna true si algún campo del item contiene el término de búsqueda
  isFiltered(item: any): boolean {
    const term = this.searchTerm.toLowerCase().trim();

    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        const value = String(item[key]).toLowerCase();
        if (value.includes(term)) {
          return true;
        }
      }
    }

    return false;
  }

}
