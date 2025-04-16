// Modelo de la entidad Pedido
export interface Pedido {
    id: string,                     // Identificador en la base de datos
    numero_pedido: string,          // Número de pedido
    importe: number;                // Importe del pedido
    importe_impuestos: number;      // Importe con impuestos del pedido
    cantidad_productos: number;     // Cantidad de productos del pedido
    fecha: string;                  // Fecha del pedido
    nombre_cliente: string;         // Nombre del cliente del pedido
}
