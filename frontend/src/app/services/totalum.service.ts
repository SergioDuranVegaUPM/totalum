import { Injectable } from '@angular/core';
import { TotalumApiSdk } from 'totalum-api-sdk';
import { Pedido } from '../models/Pedido';
import { TableNames, TABLES } from '../contants/table-names.constants';
import { Cliente } from '../models/Cliente';
import { Producto } from '../models/Producto';

@Injectable({
  providedIn: 'root'
})

export class TotalumService {

  options = {
    apiKey: {
      'api-key': 'sk-eyJrZXkiOiIxZjk4YTllZjJjZTU0ZDMxOThjY2Y0ZTEiLCJuYW1lIjoiRGVmYXVsdCBBUEkgS2V5IGF1dG9nZW5lcmF0ZWQgMnB3byIsIm9yZ2FuaXphdGlvbklkIjoic2VyZ2lvLWR1cmFuLXZlZ2EtcHJ1ZWJhLXRlY25pY2EifQ__'
    }
  };

  totalumSdk = new TotalumApiSdk(this.options);

  /*
  Devuelve todos los pedidos existentes en la página page de tamaño limit
  y que cumplan con el término de búsqueda searchTerm (busca en nombre_cliente)
*/
  async getAllPedidos(page: number, limit: number, searchTerm: string): Promise<Pedido[]> {
    // Filtro de búsqueda
    const filter: any[] = [{ nombre_cliente: { regex: searchTerm, options: 'i' } }];

    try {
      // Llamada a la API
      const response = await this.totalumSdk.crud.getItems(TABLES.PEDIDOS, {
        filter: filter,
        sort: { createdAt: 1 },
        pagination: { page, limit }
      });

      // Mapeo de la respuesta al objeto Pedido
      return response.data.data.map((item: any) => ({
        id: item.id,
        numero_pedido: item.numero_pedido,
        importe: item.importe,
        importe_impuestos: item.importe_impuestos,
        cantidad_productos: item.cantidad_productos,
        fecha: item.fecha.split('T')[0],
        nombre_cliente: item.nombre_cliente,
      } as Pedido));
    } catch (error: any) {
      throw error;
    }
  }

  /*
  Devuelve todos los clientes existentes en la página page de tamaño limit
  y que cumplan con el término de búsqueda searchTerm (busca en nombre o email)
*/
  async getAllClientes(page: number, limit: number, searchTerm: string): Promise<Cliente[]> {
    // Filtro de búsqueda
    const filter: any[] = [{
      or: [
        { nombre: { regex: searchTerm, options: 'i' } },
        { email: { regex: searchTerm, options: 'i' } }
      ]
    }];

    // Llamada a la API
    try {
      const response = await this.totalumSdk.crud.getItems(TABLES.CLIENTES, {
        filter,
        sort: { createdAt: 1 },
        pagination: { page, limit }
      });

      // Mapeo de la respuesta al objeto Cliente
      return response.data.data.map((item: any) => ({
        id: item.id,
        nombre: item.nombre,
        fecha_nacimiento: item.fecha_nacimiento.split('T')[0],
        email: item.email,
        telefono: item.telefono
      } as Cliente));
    } catch (error: any) {
      throw error;
    }
  }

  /*
  Devuelve todos los productos existentes en la página page de tamaño limit
  y que cumplan con el término de búsqueda searchTerm (busca en nombre o categoría)
*/
  async getAllProductos(page: number, limit: number, searchTerm: string): Promise<Producto[]> {
    // Filtro de búsqueda
    const filter: any[] = [{
      or: [
        { nombre: { regex: searchTerm, options: 'i' } },
        { categoria: { regex: searchTerm, options: 'i' } }
      ]
    }];

    // Llamada a la API
    try {
      const response = await this.totalumSdk.crud.getItems(TABLES.PRODUCTOS, {
        filter,
        sort: { createdAt: 1 },
        pagination: { page, limit }
      });

      // Mapeo de la respuesta al objeto Producto
      return response.data.data.map((item: any) => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        categoria: item.categoria,
        cantidad: item.cantidad
      } as Producto));
    } catch (error: any) {
      throw error;
    }
  }

  // Crea el pedido dado como parámetro de entrada
  async createPedido(pedido: Omit<Pedido, 'id'>) {
    try {
      await this.totalumSdk.crud.createItem(TABLES.PEDIDOS, pedido);
    } catch (error: any) {
      console.error(error.toString());
      console.error(error?.response?.data);
    }
  }

  // Crea un producto dado como parámetro de entrada
  async createProducto(producto: Omit<Producto, 'id'>) {
    try {
      await this.totalumSdk.crud.createItem(TABLES.PRODUCTOS, producto);
    } catch (error: any) {
      console.error(error.toString());
      console.error(error?.response?.data);
    }
  }

  // Crea un cliente dado como parámetro de entrada
  async createCliente(cliente: Omit<Cliente, 'id'>) {
    try {
      await this.totalumSdk.crud.createItem(TABLES.CLIENTES, cliente);
    } catch (error: any) {
      console.error(error.toString());
      console.error(error?.response?.data);
    }
  }

  // Elimina un pedido por ID
  async deletePedido(id: string) {
    try {
      await this.totalumSdk.crud.deleteItemById(TABLES.PEDIDOS, id);
    } catch (error: any) {
      console.error(error.toString());
      console.error(error?.response?.data);
    }
  }

  // Elimina un cliente por ID
  async deleteCliente(id: string) {
    try {
      await this.totalumSdk.crud.deleteItemById(TABLES.CLIENTES, id);
    } catch (error: any) {
      console.error(error.toString());
      console.error(error?.response?.data);
    }
  }

  // Elimina un producto por ID
  async deleteProducto(id: string) {
    try {
      await this.totalumSdk.crud.deleteItemById(TABLES.PRODUCTOS, id);
    } catch (error: any) {
      console.error(error.toString());
      console.error(error?.response?.data);
    }
  }

}

