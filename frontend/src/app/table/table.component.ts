import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { TotalumService } from '../services/totalum.service'
import { TableNames, TABLES } from '../contants/table-names.constants';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { CapitalizePipe } from "../pipes/capitalize.pipe";
import { AddSymbolPipe } from "../pipes/add-symbol.pipe";
import { CreateItemComponent } from "../create-item/create-item.component";
import { columnNames } from '../contants/table-names.constants';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule, CapitalizePipe, AddSymbolPipe, CreateItemComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})

export class TableComponent implements OnInit {

  // Nombre de las columnas de cada tabla
  columnNames = columnNames;

  // Iconos de modo oscuro y modo claro
  faMoon = faMoon;
  faSun = faSun;
  // Iconos para añadir y eliminar ítems
  faSquarePlus = faSquarePlus;
  faTrash = faTrash;

  // Indica si estamos en modo oscuro (true) o no (false)
  isDarkMode: boolean = false;

  menuVisible = false; // True si debe mostrarse el menú de tipos de tablas, false en caso contrario

  @ViewChild('menu') menuRef!: ElementRef; // Puntero al menú de tipos de tablas

  tableNames: (typeof TABLES)[keyof typeof TABLES][] = Object.values(TABLES); // Contiene los nombres de las tablas
  selectedTable: TableNames = TABLES.PEDIDOS; // Tabla seleccionada para visualizar
  items: any[] = []; // Lista de items a mostrar en las tablas

  page: number = 1; // Página actual de la tabla
  limit: number = 10; // Límite de ítems por página

  searchTerm: string = ""; // Término de búsqueda

  addItem: boolean = false; // True si el usuario quiere añadir un ítem, en cuyo caso mostramos el popup correspondiente

  constructor(private totalumService: TotalumService) { }

  // Al iniciar la componente, será la tabla de pedidos la mostrada
  ngOnInit() {
    this.getAllItems();
  }

  // Cogemos los items pertinentes al tipo de tabla en cuestión
  async getAllItems() {
    const page = this.page - 1; // El usuario empieza a contar las páginas desde 1, pero la API desde 0

    // Dependiendo de la nueva selectedTable, llamamos a un servicio u otro
    switch (this.selectedTable) {
      case TABLES.PEDIDOS:
        this.items = await this.totalumService.getAllPedidos(page, this.limit, this.searchTerm);
        break;

      case TABLES.CLIENTES:
        this.items = await this.totalumService.getAllClientes(page, this.limit, this.searchTerm);
        break;

      case TABLES.PRODUCTOS:
        this.items = await this.totalumService.getAllProductos(page, this.limit, this.searchTerm);
        break;

      default:
        this.items[this.selectedTable] = [];
    }

  }

  // Cambia el valor de selectedTable a la nueva tabla seleccionada
  selectTable(table: TableNames) {
    this.selectedTable = table;
    this.page = 1; // Como no sabemos el número de páginas de la nueva tabla, reiniciamos a la primera
    this.searchTerm = "", // Reiniciamos el filtro ante la aparición de una nueva tabla
      this.getAllItems();
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
    return Object.keys(this.items[0]);
  }

  /*
  Retorna true si la tabla ha sido cargada en items y tiene datos que mostrar
  */
  existTable(): boolean {
    return this.items && Object.keys(this.items).length > 0;
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

  // Actualiza los ítems mostrados
  fetchData(step: number) {
    this.page += step;
    this.getAllItems();
  }

  // Actualiza los datos de la tabla según el término de búsqueda
  filter() {
    this.getAllItems();
  }

  // Elimina el ítem de selectedTable con el id dado como argumento
  async deleteItem(id: string) {
    // Dependiendo de selectedTable, llamamos a un servicio u otro
    switch (this.selectedTable) {
      case TABLES.PEDIDOS:
        await this.totalumService.deletePedido(id);
        break;

      case TABLES.CLIENTES:
        await this.totalumService.deleteCliente(id);
        break;

      case TABLES.PRODUCTOS:
        await this.totalumService.deleteProducto(id);
        break;
    }
    // Refrescamos la tabla tras haber quitado un ítem
    await this.getAllItems();
  }

  // Muestra el popup para añadir un ítem
  openAddItem() {
    this.addItem = true;
  }

  // Cierra el popup de creación de ítems
  async onCloseForm(wasCreated: boolean) {
    // Si se creó un nuevo ítem, refrescamos la tabla
    if(wasCreated){
      await this.getAllItems();
    }
    this.addItem = false; // Cerramos popup
  }

}
