import CrudPage from '../components/CrudPage';
import { crearServicio } from '../services/crearServicio';

const servicio = crearServicio('tipos');

const campos = [
  { name: 'nombre', label: 'Nombre', tipo: 'text' },
  { name: 'descripcion', label: 'Descripción', tipo: 'textarea' },
];

export default function Tipos() {
  return <CrudPage titulo="Tipos" servicio={servicio} campos={campos} />;
}