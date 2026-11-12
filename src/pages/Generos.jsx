import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  getGeneros, createGenero, updateGenero, deleteGenero,
} from '../services/generoService';

const vacio = { nombre: '', estado: 'Activo', descripcion: '' };

const mensajeError = (err) => {
  const data = err.response?.data;
  if (!data) return 'No se pudo comunicar con el servidor';
  if (String(data.error).includes('E11000')) {
    return 'Ya existe un género con ese nombre';
  }
  return data.error ? `${data.mensaje}: ${data.error}` : data.mensaje;
};

export default function Generos() {
  const [generos, setGeneros] = useState([]);
  const [form, setForm] = useState(vacio);
  const [editandoId, setEditandoId] = useState(null);

  const cargar = async () => {
    try {
      const res = await getGeneros();
      setGeneros(res.data);
    } catch (err) {
      Swal.fire('Error', mensajeError(err), 'error');
    }
  };

  useEffect(() => { cargar(); }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        const res = await updateGenero(editandoId, form);
        Swal.fire('Actualizado', res.data.mensaje, 'success');
      } else {
        const res = await createGenero(form);
        Swal.fire('Creado', res.data.mensaje, 'success');
      }
      setForm(vacio);
      setEditandoId(null);
      cargar();
    } catch (err) {
      Swal.fire('Error', mensajeError(err), 'error');
    }
  };

  const handleEditar = (g) => {
    setEditandoId(g._id);
    setForm({ nombre: g.nombre, estado: g.estado, descripcion: g.descripcion });
  };

  const handleCancelar = () => {
    setEditandoId(null);
    setForm(vacio);
  };

  const handleEliminar = async (g) => {
    const r = await Swal.fire({
      title: `¿Eliminar "${g.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!r.isConfirmed) return;
    try {
      const res = await deleteGenero(g._id);
      Swal.fire('Eliminado', res.data.mensaje, 'success');
      cargar();
    } catch (err) {
      Swal.fire('Error', mensajeError(err), 'error');
    }
  };

  const fecha = (f) => (f ? new Date(f).toLocaleString() : '');

  return (
    <div>
      <h2>Géneros</h2>

      <form onSubmit={handleSubmit} className="card card-body mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Nombre</label>
            <input className="form-control" name="nombre"
              value={form.nombre} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <label className="form-label">Estado</label>
            <select className="form-select" name="estado"
              value={form.estado} onChange={handleChange}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          <div className="col-md-5">
            <label className="form-label">Descripción</label>
            <input className="form-control" name="descripcion"
              value={form.descripcion} onChange={handleChange} required />
          </div>
        </div>
        <div className="mt-3">
          <button type="submit" className="btn btn-primary me-2">
            {editandoId ? 'Actualizar' : 'Crear'}
          </button>
          {editandoId && (
            <button type="button" className="btn btn-secondary" onClick={handleCancelar}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th><th>Estado</th><th>Descripción</th>
            <th>Creación</th><th>Actualización</th><th></th>
          </tr>
        </thead>
        <tbody>
          {generos.map((g) => (
            <tr key={g._id}>
              <td>{g.nombre}</td>
              <td>{g.estado}</td>
              <td>{g.descripcion}</td>
              <td>{fecha(g.fecha_creacion)}</td>
              <td>{fecha(g.fecha_actualizacion)}</td>
              <td className="text-nowrap">
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditar(g)}>Editar</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(g)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {generos.length === 0 && (
            <tr><td colSpan="6" className="text-center">No hay géneros registrados</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}