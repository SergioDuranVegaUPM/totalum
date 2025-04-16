// Modelo de Producto
export interface Producto {
    id: string,        // Identificador en la base de datos
    nombre: string;    // Nombre del producto
    precio: number;    // Precio del producto
    categoria: string; // Categoría del producto
    cantidad: number;  // Cantidad disponible del producto en inventario
}
