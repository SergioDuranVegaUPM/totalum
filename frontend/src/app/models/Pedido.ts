// Modelo de la entidad Pedido de la base de datos
export interface Pedido {
    numero_pedido: string;
    importe: number;
    importe_impuestos: number;
    cantidad_productos: number;
    fecha: string;
    nombre_cliente: string;
}
