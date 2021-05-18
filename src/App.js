import React, { useState, useEffect, Component } from 'react';
import Listado from './components/Listado';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import $ from 'jquery';
const URL = "http://127.0.0.1:8000/api/usuarios";
const URLID = "http://127.0.0.1:8000/api/usuarios/edit";
const URLDEL = "http://127.0.0.1:8000/api/usuarios/destroy";

class App extends Component {

  state = {
    data: [],
    modalInsertar: false,
    modalEliminar: false,
    form: {
      ID_Usuario: '',
      Nombre: '',
      Apellido: '',
      Correo: '',
      Telefono: '',
      FechaNacimiento: '',
      tipoModal: ''
    }
  }

  peticionGet = () => {
  
    axios.get(URL).then(response => {
      this.setState({ data: response.data })
      $(document).ready(function () {
        var table = window.$('.table').DataTable();
      });

    }).catch(error => {
      console.log(error.message);
    })
  }

  componentDidMount() {
    this.peticionGet();
  }

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  }

  handleChange = async e => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
  }

  peticionPost = async () => {
    delete this.state.form.ID_Usuario;
    await axios.post(URL, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
    }).catch(error => {
      console.log(error.message);
    })
  }

  seleccionarUsuario = (usuario) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        ID_Usuario: usuario.ID_Usuario,
        Nombre: usuario.Nombre,
        Apellido: usuario.Apellido,
        Correo: usuario.Correo,
        Telefono: usuario.Telefono,
        FechaNacimiento: usuario.FechaNacimiento,
      }
    })
  }

  peticionPut = () => {
    axios.put(URLID + this.state.form.ID_Usuario, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
    })
  }

  peticionDelete = () => {
    axios.post(URLDEL, this.state.form).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    })
  }
  render() {
    const { form } = this.state;
    return (
      <div>
        <button className="btn btn-secondary" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Usuario</button>

        <div class="container">
          <div class="col-lg-10 col-offset-lg-2">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellido</th>
                    <th scope="col">Correo</th>
                    <th scope="col">Telefono</th>
                    <th scope="col">FechaNacimiento</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.data.map(datos => {
                    return (
                      <tr>
                        <th scope="row">{datos.Nombre}</th>
                        <td>{datos.Apellido}</td>
                        <td>{datos.Correo}</td>
                        <td>{datos.Telefono}</td>
                        <td>{datos.FechaNacimiento}</td>
                        <td><button class="btn btn-primary" onClick={() => { this.seleccionarUsuario(datos); this.modalInsertar() }}>Modificar</button></td>
                        <td><button class="btn btn-danger" onClick={() => { this.seleccionarUsuario(datos); this.setState({ modalEliminar: true }) }}>Eliminar</button></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{ display: 'block' }}>
            <span style={{ float: 'right' }} onClick={() => this.modalInsertar()}>x</span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="ID_Usuario">ID</label>
              <input className="form-control" type="text" name="ID_Usuario" id="ID_Usuario" readOnly onChange={this.handleChange} value={form ? form.ID_Usuario : this.state.data.length + 1} />
              <br />
              <label htmlFor="Nombre">Nombre</label>
              <input className="form-control" type="text" name="Nombre" id="Nombre" onChange={this.handleChange} value={form ? form.Nombre : ''} />
              <br />
              <label htmlFor="Apellido">Apellido</label>
              <input className="form-control" type="text" name="Apellido" id="Apellido" onChange={this.handleChange} value={form ? form.Apellido : ''} />
              <br />
              <label htmlFor="Correo">Correo</label>
              <input className="form-control" type="email" name="Correo" id="Correo" onChange={this.handleChange} value={form ? form.Correo : ''} />
              <br />
              <label htmlFor="Telefono">Telefono</label>
              <input className="form-control" type="number" name="Telefono" id="Telefono" onChange={this.handleChange} value={form ? form.Telefono : ''} />
              <br />
              <label htmlFor="FechaNacimiento">Fecha Nacimiento</label>
              <input className="form-control" type="date" name="FechaNacimiento" id="FechaNacimiento" onChange={this.handleChange} value={form ? form.FechaNacimiento : ''} />
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal == 'insertar' ?
              <button className="btn btn-success" onClick={() => this.peticionPost()}>
                Insertar
                  </button> : <button className="btn btn-primary" onClick={() => this.peticionPut()}>
                Actualizar
                  </button>
            }
            <button className="btn btn-danger" onClick={() => this.modalInsertar()}>Cancelar</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            Estás seguro que deseas eliminar el usuario? {form && form.Nombre}
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => this.peticionDelete()}>Sí</button>
            <button className="btn btn-secundary" onClick={() => this.setState({ modalEliminar: false })}>No</button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default App;
