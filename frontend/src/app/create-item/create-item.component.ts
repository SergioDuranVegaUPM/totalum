import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TABLES } from '../contants/table-names.constants';
import { TotalumService } from '../services/totalum.service';

@Component({
  selector: 'app-create-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-item.component.html',
  styleUrl: './create-item.component.css'
})

export class CreateItemComponent implements OnInit {
  @Input() selectedTable!: string; // Tabla del nuevo ítem
  @Output() cerrarFormulario = new EventEmitter<boolean>(); // True para informar que se creó un ítem, false en caso de cerrarse el popup sin crear nada
  itemForm!: FormGroup; // Formulario del ítem

  constructor(private fb: FormBuilder, private totalumService: TotalumService) { }

  ngOnInit(): void {
    // Dependiendo de la tabla, cargaremos un formulario u otro
    switch (this.selectedTable) {
      case TABLES.PEDIDOS:
        this.itemForm = this.fb.group({
          numero_pedido: ['', Validators.required],
          importe: [0, [Validators.required, Validators.min(0)]],
          importe_impuestos: [0, [Validators.required, Validators.min(0)]],
          cantidad_productos: [1, [Validators.required, Validators.min(1)]],
          fecha: ['', Validators.required],
          nombre_cliente: ['', Validators.required],
        });
        break;

      case TABLES.CLIENTES:
        this.itemForm = this.fb.group({
          nombre: ['', Validators.required],
          fecha_nacimiento: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          telefono: [0, [Validators.required, Validators.min(1)]],
        });
        break;

      case TABLES.PRODUCTOS:
        this.itemForm = this.fb.group({
          nombre: ['', Validators.required],
          precio: [0, [Validators.required, Validators.min(0)]],
          categoria: ['', Validators.required],
          cantidad: [0, [Validators.required, Validators.min(0)]],
        });
        break;

      default:
        console.warn('Tabla no reconocida:', this.selectedTable);
        break;
    }
  }

  // Creación del nuevo ítem
  async onSubmit() {
    if (this.itemForm.valid) {
      const item = this.itemForm.value;
      const wasCreated = await this.createItem(item);
      this.cerrar(wasCreated); // Retornamos a la componente padre el resultado de la operación: creado (true) o no creado (false)
    }
    else {
      this.cerrar(false); // El formulario no era válido, así que nada se creó
    }
  }

  /*
  Informamos a otras componentes de que el popup se cierra
  */
  cerrar(output: boolean): void {
    this.cerrarFormulario.emit(true);
  }

  /*
  Crea el nuevo ítem
  Devuelve true si se creó, false en caso contrario
  */
  async createItem(item:any): Promise<boolean> {
    try {
      switch (this.selectedTable) {
        case TABLES.PEDIDOS:
          await this.totalumService.createPedido(item);
          return true;

        case TABLES.CLIENTES:
          await this.totalumService.createCliente(item);
          return true;

        case TABLES.PRODUCTOS:
          await this.totalumService.createProducto(item);
          return true;

        default:
          console.warn('Tabla no reconocida:', this.selectedTable);
          return false;
      }
    } catch (error) {
      console.error('Error al crear el ítem:', error);
      return false;
    }
  }


}

