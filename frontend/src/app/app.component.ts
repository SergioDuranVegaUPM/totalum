import { Component, OnInit } from '@angular/core';
import { TableComponent } from "./table/table.component";
import { Pedido } from './models/Pedido';
import { TotalumPedidosService } from './services/totalum-pedidos.service';
import { Producto } from './models/Producto';
import { Cliente } from './models/Cliente';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private totalumPedidosService: TotalumPedidosService) { }

  /*
  Al iniciar la aplicación, preguntamos si queremos crear 50 items
  aleatorios de cada tabla
  */
  ngOnInit(): void {
    // Descomentar para generar ítems en las tablas aleatoriamente
    /*
    this.askToGeneratePedidos();
    this.askToGenerateProductos();
    this.askToGenerateClientes();
    */
    }

  // Función que pregunta si se quiere generar los pedidos aleatorios
  askToGeneratePedidos() {
    const confirmation = window.confirm('¿Quieres generar 50 pedidos aleatorios?');

    if (confirmation) {
      this.generateRandomPedidos(50); // Genera 50 pedidos aleatorios
    }
  }

  // Función que pregunta si se quiere generar 50 productos aleatorios
  askToGenerateProductos() {
    const confirmation = window.confirm('¿Quieres generar 50 productos aleatorios?');
    if (confirmation) {
      this.generateRandomProductos(50); // Genera 50 productos aleatorios
    }
  }

  // Función que pregunta si se quiere generar 50 clientes aleatorios
  askToGenerateClientes() {
    const confirmation = window.confirm('¿Quieres generar 50 clientes aleatorios?');
    if (confirmation) {
      this.generateRandomClientes(50); // Genera 50 clientes aleatorios
    }
  }

  // Función que crea un número determinado de pedidos aleatorios
  generateRandomPedidos(numPedidos: number) {
    for (let i = 0; i < numPedidos; i++) {
      const nuevoPedido = this.createRandomPedido();
      this.totalumPedidosService.createItem(nuevoPedido); // Crea el pedido a través del servicio
    }
  }

  // Función que crea un número determinado de productos aleatorios
  generateRandomProductos(numProductos: number) {
    for (let i = 0; i < numProductos; i++) {
      const nuevoProducto = this.createRandomProducto();
      this.totalumPedidosService.createProducto(nuevoProducto); // Crea el producto a través del servicio
    }
  }

  // Función que crea un número determinado de clientes aleatorios
  generateRandomClientes(numClientes: number) {
    for (let i = 0; i < numClientes; i++) {
      const nuevoCliente = this.createRandomCliente();
      this.totalumPedidosService.createCliente(nuevoCliente); // Crea el cliente a través del servicio
    }
  }

  // Función que genera un pedido aleatorio
  createRandomPedido(): any {
    const randomDate = new Date(new Date().getTime() - Math.random() * 10000000000); // Fecha aleatoria
    const numeroPedido = Math.random().toString(36).substring(2, 15); // Genera un número de pedido aleatorio

    return {
      numero_pedido: numeroPedido,
      importe: parseFloat((Math.random() * 500).toFixed(2)), // Importe aleatorio
      importe_impuestos: parseFloat((Math.random() * 100).toFixed(2)), // Importe de impuestos aleatorio
      cantidad_productos: Math.floor(Math.random() * 10) + 1, // Cantidad aleatoria de productos
      fecha: randomDate.toISOString().split('T')[0], // Fecha en formato YYYY-MM-DD
      nombre_cliente: `Cliente ${Math.floor(Math.random() * 1000)}` // Nombre de cliente aleatorio
    };
  }

  // Función que genera un producto aleatorio
  createRandomProducto(): any {
    return {
      nombre: `Producto ${Math.floor(Math.random() * 1000)}`,
      precio: parseFloat((Math.random() * 500).toFixed(2)), // Precio aleatorio
      categoria: `Categoría ${Math.floor(Math.random() * 10)}`, // Categoría aleatoria
      cantidad: Math.floor(Math.random() * 100) + 1 // Cantidad aleatoria de productos
    };
  }

  // Función que genera un cliente aleatorio
  createRandomCliente(): any {
    const fechaNacimiento = new Date(new Date().getTime() - Math.random() * 10000000000); // Fecha de nacimiento aleatoria
    return {
      nombre: `Cliente ${Math.floor(Math.random() * 1000)}`,
      fecha_nacimiento: fechaNacimiento.toISOString().split('T')[0], // Fecha en formato YYYY-MM-DD
      email: `cliente${Math.floor(Math.random() * 1000)}@email.com`, // Email aleatorio
      telefono: 12345678 + Math.floor(Math.random() * 1000) // Teléfono aleatorio
    };
  }

}
