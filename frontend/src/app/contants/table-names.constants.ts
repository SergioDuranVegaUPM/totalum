// Nombre de las tablas
export const TABLES = {
    PEDIDOS: 'pedidos',
    CLIENTES: 'clientes',
    PRODUCTOS: 'productos'
} as const;

// Tipo que representa las llaves de TABLES
export type TableNames = typeof TABLES[keyof typeof TABLES];

// Define las interfaces de los nombres de las columnas de las tablas con un índice dinámico
interface PedidoColumns {
    [key: string]: string; // Permite acceder a las propiedades con cualquier string
    id: string;
    numero_pedido: string;
    importe: string;
    importe_impuestos: string;
    cantidad_productos: string;
    fecha: string;
    nombre_cliente: string;
}

interface ClienteColumns {
    [key: string]: string; // Permite acceder a las propiedades con cualquier string
    id: string;
    nombre: string;
    fecha_nacimiento: string;
    email: string;
    telefono: string;
}

interface ProductoColumns {
    [key: string]: string; // Permite acceder a las propiedades con cualquier string
    id: string;
    nombre: string;
    precio: string;
    categoria: string;
    cantidad: string;
}

/*
Nombre de las columnas de cada tabla, tal que:
nombre del atributo en la base de datos - nombre que queremos mostrar en su lugar en el frontend
*/
export const columnNames: {
    pedidos: PedidoColumns,
    clientes: ClienteColumns,
    productos: ProductoColumns
} = {
    pedidos: {
        id: 'ID',
        numero_pedido: 'Número pedido',
        importe: 'Importe',
        importe_impuestos: 'Importe impuestos',
        cantidad_productos: 'Cantidad productos',
        fecha: 'Fecha',
        nombre_cliente: 'Nombre cliente'
    },
    clientes: {
        id: 'ID',
        nombre: 'Nombre',
        fecha_nacimiento: 'Fecha nacimiento',
        email: 'Email',
        telefono: 'Teléfono'
    },
    productos: {
        id: 'ID',
        nombre: 'Nombre',
        precio: 'Precio',
        categoria: 'Categoría',
        cantidad: 'Cantidad'
    }
};
