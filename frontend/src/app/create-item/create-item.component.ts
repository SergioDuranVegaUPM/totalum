import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TABLES } from '../contants/table-names.constants';

@Component({
  selector: 'app-create-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-item.component.html',
  styleUrl: './create-item.component.css'
})

export class CreateItemComponent implements OnInit {
  @Input() selectedTable!: string; // Tabla del nuevo ítem
  @Output() cerrarFormulario = new EventEmitter<boolean>(); // Señal para cerrar el popup
  itemForm!: FormGroup; // Formulario del ítem

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
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
          telefono: [0, [Validators.required, Validators.min(100000000)]],
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
  onSubmit() {
    if (this.itemForm.valid) {
      const item = this.itemForm.value;
      console.log(item);
    }
  }

  // Informamos a otras componentes de que el popup se cierra
  cerrar(): void {
    this.cerrarFormulario.emit(true);
  }

}

