// Modelo de Cliente
export interface Cliente {
    id: string,                // Identificador en la base de datos
    nombre: string;            // Nombre del cliente
    fecha_nacimiento: string;  // Fecha de nacimiento del cliente (formato YYYY-MM-DD)
    email: string;             // Correo electrónico del cliente
    telefono: number;          // Número de teléfono del cliente
}
