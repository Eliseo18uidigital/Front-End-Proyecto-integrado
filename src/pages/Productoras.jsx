import CrudPage from '../components/CrudPage';
import { crearServicio } from '../services/crearServicio';

const servicio = crearServicio('productoras');

const campos = [
  { name: 'nombre_productora', label: 'Nombre de la productora', tipo: 'text' },
  { name: 'estado', label: 'Estado', tipo: 'select', opciones: ['Activo', 'Inactivo'], defecto: 'Activo' },
  { name: 'slogan', label: 'Slogan (opcional)', tipo: 'text', requerido: false },
  { name: 'descripcion', label: 'Descripción', tipo: 'textarea' },
];

export default function Productoras() {
  return <CrudPage titulo="Productoras" servicio={servicio} campos={campos} />;
}