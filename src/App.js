import './App.css';
import { useState } from "react";
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';



function App() {

  const [nombre,setNombre] = useState("");
  const [edad,setEdad] = useState();
  const [pais,setPais] = useState("");
  const [cargo,setCargo] = useState("");
  const [antiguedad,setAntiguedad] = useState();
  const [id,setId] = useState();

  const [editar,setEditar] = useState(false);

  const [empleadosList,setEmpleados] = useState([]);

  const add = ()=>{
    Axios.post("http://localhost:3001/create",{
      nombre:nombre,
      edad:edad,
      pais:pais,
      cargo:cargo,
      antiguedad:antiguedad
    }).then(()=>{
      getEmpleados();
      limpiarCampos();
      Swal.fire({
        title: "<strong>Registro completado!</strong>",
        html: "<i>El empleado <strong>"+  nombre + "</strong> fue registrado con exito!!</i>",
        icon: 'success',
        timer:3000
      })
    }).catch(function(error){
      Swal.fire({
        icon:"error",
        title:"Oops...",
        text: JSON.parse(JSON.stringify(error)).message==="Network Error"?"Intente mas tarde":JSON.parse(JSON.stringify(error)).message
        })
    });
  }

  const update = ()=>{
    Axios.put("http://localhost:3001/update",{
      id:id,
      nombre:nombre,
      edad:edad,
      pais:pais,
      cargo:cargo,
      antiguedad:antiguedad
    }).then(()=>{
      getEmpleados();
      limpiarCampos();
      Swal.fire({
        title: "<strong>Actualización completada!!</strong>",
        html: "<i>El empleado <strong>"+  nombre + "</strong> fue actualizado con exito!!</i>",
        icon: 'success',
        timer:3000
      })
    });
  }

  const deleteEmpleado = (val)=>{

    Swal.fire({
      title: '¿Confirmar eliminado?',
      html: "<i>Realmente desea eliminara <strong>"+  val.nombre + "</strong>?</i>",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete/${val.id}`).then(()=>{
        getEmpleados();
        limpiarCampos();
        Swal.fire({
          icon: 'success',
          title: val.nombre+' fue eliminado.',
          showConfirmButton:false,
          timer: 3000
         });      
        }).catch(function(error){
          Swal.fire({
            icon:"error",
            title:"Oops...",
            text: "No se logro eliminar el empleado",
            footer: JSON.parse(JSON.stringify(error)).message==="Network Error"?"Intente mas tarde":JSON.parse(JSON.stringify(error)).message
            })

        });
        
      }
    });
  }

  const limpiarCampos =()=>{
    setNombre("");
    setEdad("");
    setCargo("");
    setPais("");
    setAntiguedad('');
    setEditar(false);
  }

  const editarEmpleado = (val)=>{
    setEditar(true);

    setNombre(val.nombre);
    setEdad(val.edad);
    setCargo(val.cargo);
    setPais(val.pais);    
    setAntiguedad(val.antiguedad);
    setId(val.id);
  }


  const getEmpleados = ()=>{
    Axios.get("http://localhost:3001/empleados").then((response)=>{
      setEmpleados(response.data);
    });
  }

  getEmpleados();

  return (
    <div className="container">
    
        <div className="card text-center">
      <div className="card-header">
        GESTION DE EMPLEADOS
      </div>
      <div className="card-body">
        <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">Nombre:</span>
        <input type="text" value={nombre}
        onChange={(event)=>{
          setNombre(event.target.value);
        }}
        className="form-control"  placeholder="Ingrese un nombre" aria-label="Username" aria-describedby="basic-addon1"/>
        </div>

        <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">Edad:</span>
        <input type="number" value={edad}
            onChange={(event)=>{
            setEdad(event.target.value);
          }}
        className="form-control" placeholder="Ingrese una edad" aria-label="Username" aria-describedby="basic-addon1"/>
        </div>

        <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">Paìs:</span>
        <input type="text" value={pais}
        onChange={(event)=>{
          setPais(event.target.value);
        }}
        className="form-control" placeholder="Ingrese un país" aria-label="Username" aria-describedby="basic-addon1"/>
        </div>
          
        <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">Cargo:</span>
        <input type="text" value={cargo}
        onChange={(event)=>{
          setCargo(event.target.value);
        }}
        className="form-control" placeholder="Ingrese un cargo" aria-label="Username" aria-describedby="basic-addon1"/>
        </div>

        <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">Años de experiencia:</span>
        <input type="number" value={antiguedad}
           onChange={(event)=>{
            setAntiguedad(event.target.value);
          }}
        className="form-control" placeholder="Ingrese los años" aria-label="Username" aria-describedby="basic-addon1"/>
        </div>        
        
      </div>
      <div className="card-footer text-muted">
        {
            editar?
            <div>
              <button type="button" className="btn btn-warning btn-lg m-2" onClick={update}>Actualizar</button>  
              <button type="button" className="btn btn-info btn-lg" onClick={limpiarCampos}>Cancelar</button>       
            </div>
            :<button type="button" className="btn btn-primary btn-lg" onClick={add}>Registrar</button>
        }
      </div>
    </div>

    <table className="table table-striped table-hover">
    <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Nombre</th>
          <th scope="col">Edad</th>
          <th scope="col">Paìs</th>
          <th scope="col">Cargo</th>
          <th scope="col">Experiencia</th>
          <th scope='col'>Acciones</th>
        </tr>
      </thead>
      <tbody>
          {
          empleadosList.map((val,key)=>{
            return <tr key={val.id}>
                  <th>{val.id}</th>
                  <td>{val.nombre}</td>
                  <td>{val.edad}</td>
                  <td>{val.pais}</td>
                  <td>{val.cargo}</td>
                  <td>{val.antiguedad}</td>
                  <td>
                    <div className="btn-group" role="group" aria-label="Basic example">
                    <button type="button" 
                    onClick={()=>{
                      editarEmpleado(val);
                    }}
                    className="btn btn-info">Editar</button>
                    <button type="button" onClick={()=>{
                      deleteEmpleado(val);
                    }} className="btn btn-danger">Eliminar</button>
                    </div>
                  </td>
                  </tr>
          })
          }
          </tbody>
    </table>
        
    </div>
  );
}

export default App;
