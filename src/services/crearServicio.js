import api from './api';

export const crearServicio = (recurso) => ({
  listar: () => api.get(`/${recurso}`),
  crear: (data) => api.post(`/${recurso}`, data),
  actualizar: (id, data) => api.put(`/${recurso}/${id}`, data),
  eliminar: (id) => api.delete(`/${recurso}/${id}`),
});