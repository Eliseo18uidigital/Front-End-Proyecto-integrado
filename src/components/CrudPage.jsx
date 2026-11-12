import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const mensajeError = (err) => {
  const data = err.response?.data;
  if (!data) return 'No se pudo comunicar con el servidor';
  if (String(data.error).includes('E11000')) {
    return 'Ya existe un registro con ese valor (campo único duplicado)';
  }
  return data.error ? `${data.mensaje}: ${data.error}` : data.mensaje;
};

const fecha = (f) => (f ? new Date(f).toLocaleString() : '');

export default function CrudPage({ titulo, servicio, campos }) {
  const vacio = Object.fromEntries(campos.map((c) => [c.name, c.defecto ?? '']));
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(vacio);
  const [editandoId, setEditandoId] = useState(null);

  const cargar = async () => {
    try {
      const res = await servicio.listar();
      setItems(res.data);
    } catch (err) {
      Swal.fire('Error', mensajeError(err), 'error');
    }
  };

  useEffect(() => { cargar(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = editandoId
        ? await servicio.actualizar(editandoId, form)
        : await servicio.crear(form);
      Swal.fire(editandoId ? 'Actualizado' : 'Creado', res.data.mensaje, 'success');
      setForm(vacio);
      setEditandoId(null);
      cargar();
    } catch (err) {
      Swal.fire('Error', mensajeError(err), 'error');
    }
  };

  const handleEditar = (item) => {
    setEditandoId(item._id);
    setForm(Object.fromEntries(campos.map((c) => [c.name, item[c.name] ?? ''])));
  };

  const handleCancelar = () => {
    setEditandoId(null);
    setForm(vacio);
  };

  const handleEliminar = async (item) => {
    const r = await Swal.fire({
      title: '¿Eliminar este registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!r.isConfirmed) return;
    try {
      const res = await servicio.eliminar(item._id);
      Swal.fire('Eliminado', res.data.mensaje, 'success');
      cargar();
    } catch (err) {
      Swal.fire('Error', mensajeError(err), 'error');
    }
  };

  return (
    <div>
      <h2>{titulo}</h2>

      <form onSubmit={handleSubmit} className="card card-body mb-4">
        <div className="row g-3">
          {campos.map((c) => (
            <div className="col-md-6" key={c.name}>
              <label className="form-label">{c.label}</label>
              {c.tipo === 'select' ? (
                <select className="form-select" name={c.name} value={form[c.name]} onChange={handleChange}>
                  {c.opciones.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : c.tipo === 'textarea' ? (
                <textarea className="form-control" name={c.name} value={form[c.name]}
                  onChange={handleChange} required={c.requerido !== false} />
              ) : (
                <input className="form-control" name={c.name} value={form[c.name]}
                  onChange={handleChange} required={c.requerido !== false} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-3">
          <button type="submit" className="btn btn-primary me-2">
            {editandoId ? 'Actualizar' : 'Crear'}
          </button>
          {editandoId && (
            <button type="button" className="btn btn-secondary" onClick={handleCancelar}>Cancelar</button>
          )}
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              {campos.map((c) => <th key={c.name}>{c.label}</th>)}
              <th>Creación</th><th>Actualización</th><th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                {campos.map((c) => <td key={c.name}>{item[c.name]}</td>)}
                <td>{fecha(item.fecha_creacion)}</td>
                <td>{fecha(item.fecha_actualizacion)}</td>
                <td className="text-nowrap">
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditar(item)}>Editar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(item)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={campos.length + 3} className="text-center">No hay registros</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}