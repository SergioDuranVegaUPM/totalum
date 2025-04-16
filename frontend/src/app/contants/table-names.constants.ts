export const TABLES = {
    PEDIDOS: 'pedidos',
    CLIENTES: 'clientes',
    PRODUCTOS: 'productos'
} as const;

export type TableNames = typeof TABLES[keyof typeof TABLES];  // Tipo que representa las llaves de TABLES
