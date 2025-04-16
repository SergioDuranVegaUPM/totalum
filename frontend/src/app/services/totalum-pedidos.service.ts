import { Injectable } from '@angular/core';
import { TotalumApiSdk } from 'totalum-api-sdk';
import { Pedido } from '../models/Pedido';
import { TableNames, TABLES } from '../contants/table-names.constants';
import { Cliente } from '../models/Cliente';
import { Producto } from '../models/Producto';

@Injectable({
  providedIn: 'root'
})

export class TotalumPedidosService {

  options = {
    apiKey: {
      'api-key': 'sk-eyJrZXkiOiIxZjk4YTllZjJjZTU0ZDMxOThjY2Y0ZTEiLCJuYW1lIjoiRGVmYXVsdCBBUEkgS2V5IGF1dG9nZW5lcmF0ZWQgMnB3byIsIm9yZ2FuaXphdGlvbklkIjoic2VyZ2lvLWR1cmFuLXZlZ2EtcHJ1ZWJhLXRlY25pY2EifQ__'
    }
  };

  totalumSdk = new TotalumApiSdk(this.options);

  /*
  Devuelve todos los items existentes en la tabla "tableName" en la página page de tamaño limit
  y que cumpla con el término de búsqueda searchTerm (el cual solo se busca en campos de tipo texto)
  */
  async getAllItems(tableName: TableNames, page: number, limit: number, searchTerm: string):
    Promise<Pedido[] | Producto[] | Cliente[]> {

    // Filtro para la búsqueda
    let filter: any[];

    // Dependiendo de la tabla, el filtro será uno u otro
    switch (tableName) {
      case TABLES.PEDIDOS:
        filter = [
          { nombre_cliente: { regex: searchTerm, options: 'i' } }
        ];
        break;

      case TABLES.CLIENTES:
        filter = [
          {
            or: [
              { nombre: { regex: searchTerm, options: 'i' } },
              { email: { regex: searchTerm, options: 'i' } }
            ]
          }
        ];
        break;

      case TABLES.PRODUCTOS:
        filter = [
          {
            or: [
              { nombre: { regex: searchTerm, options: 'i' } },
              { categoria: { regex: searchTerm, options: 'i' } }
            ]
          }
        ];
        break;

      default:
        filter = [];
    }

    try {
      const response = await this.totalumSdk.crud.getItems(tableName, {
        filter: filter,
        sort: {
          createdAt: 1
        },
        pagination: {
          page: page,
          limit: limit
        }
      });

      // Mapeamos cada ítem de la respuesta al objeto pertinente
      switch (tableName) {
        case TABLES.PEDIDOS:
          return response.data.data.map((item: any) => {
            return {
              id: item.id,
              numero_pedido: item.numero_pedido,
              importe: item.importe,
              importe_impuestos: item.importe_impuestos,
              cantidad_productos: item.cantidad_productos,
              fecha: item.fecha.split('T')[0],
              nombre_cliente: item.nombre_cliente,
            } as Pedido;
          });

        case TABLES.CLIENTES:
          return response.data.data.map((item: any) => {
            return {
              id: item.id,
              nombre: item.nombre,
              fecha_nacimiento: item.fecha_nacimiento.split('T')[0],
              email: item.email,
              telefono: item.telefono
            } as Cliente;
          });

        case TABLES.PRODUCTOS:
          return response.data.data.map((item: any) => {
            return {
              id: item.id,
              nombre: item.nombre,
              precio: item.precio,
              categoria: item.categoria,
              cantidad: item.cantidad
            } as Producto;
          });

        default:
          throw new Error(`Tabla inexistente: ${tableName}`);
      }

    } catch (error: any) {
      throw error;
    }
  }

  // Crea el pedido dado como parámetro de entrada
  async createItem(pedido: Pedido) {
    try {
      const response = await this.totalumSdk.crud.createItem('pedidos', pedido);
    } catch (error: any) {
      console.error(error.toString());
      console.error(error?.response?.data);
    }
  }

  // Crea un producto dado como parámetro de entrada
  async createProducto(producto: Producto) {
    try {
      const response = await this.totalumSdk.crud.createItem('productos', producto);
    } catch (error: any) {
      console.error(error.toString());
      console.error(error?.response?.data);
    }
  }

  // Crea un cliente dado como parámetro de entrada
  async createCliente(cliente: Cliente) {
    try {
      const response = await this.totalumSdk.crud.createItem('clientes', cliente);
    } catch (error: any) {
      console.error(error.toString());
      console.error(error?.response?.data);
    }
  }

}

