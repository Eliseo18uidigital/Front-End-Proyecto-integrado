import CrudPage from '../components/CrudPage';
import { crearServicio } from '../services/crearServicio';

const servicio = crearServicio('directores');

const campos = [
  { name: 'nombres', label: 'Nombres', tipo: 'text' },
  { name: 'estado', label: 'Estado', tipo: 'select', opciones: ['Activo', 'Inactivo'], defecto: 'Activo' },
];

export default function Directores() {
  return <CrudPage titulo="Directores" servicio={servicio} campos={campos} />;
}