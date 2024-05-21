import {Crypto} from "./crypto.js";
import {leer, escribir, limpiar} from "./localStorage.js";
document.addEventListener("DOMContentLoaded", onInit);

const formulario = document.getElementById("form-anuncio");
const btnCargarMoneda = document.getElementById("save-data");
const btnGuardar = document.getElementById("save-anuncio");
const btnEliminar = document.getElementById("delete-anuncio");
const btnCancelar = document.getElementById("cancel-anuncio");
const tabla = document.getElementById("table-items");
const BtnBorrarDatos = document.getElementById("btn-delete-all");


const items = [];
const KEY_STORAGE = "Crypto";

function onInit(){
    loadItems();
    manejadorGuardarMoneda();
    manejadorClickTabla();
    manejadorClickBotonesDeEdicion();
    manejadorClickBorrarDatos();
}

async function loadItems()
{
    inyectarSpinner();
    let objects = await leer(KEY_STORAGE) || [];
    objects.forEach(object => {
        const model = new Crypto(
            object.id,
            object.nombre,
            object.simbolo,
            object.fechaCreacion,
            object.precioActual,
            object.consenso,
            object.cantidadCirculacion,
            object.algoritmo,
            object.sitioWeb
        );
        items.push(model);
    });
    rellenarEncabezadoTabla();
    rellenarContenidoTabla();
    removerSpinner();
}

async function manejadorGuardarMoneda()
{
        formulario.addEventListener("submit", async (event) =>{
        console.log("entre al submit")
        event.preventDefault();
        const fechaAux = new Date();
        const fechaActual = fechaAux.getDate() + "/" + (fechaAux.getMonth() + 1) + "/" + fechaAux.getFullYear();
        const moneda = new Crypto(
            Date.now(),
            formulario.nombre.value,
            formulario.simbolo.value,
            fechaActual,
            formulario.precioActual.value,
            formulario.consenso.value,
            formulario.cantidadCirculacion.value,
            formulario.algoritmo.value,
            formulario.sitioWeb.value
        );

        if (moneda.validarDatos()){
            items.push(moneda);
            actualizarDatos();
        }
    })
}

function rellenarEncabezadoTabla() {
    const thead = tabla.getElementsByTagName("thead")[0];
    thead.innerHTML = '';

    const filaThead = document.createElement("tr");
    for (const key in items[0]) {
      if (key != "id") {
        const th = document.createElement("th");
        th.textContent = key;
        filaThead.appendChild(th);
      }
    }
    thead.appendChild(filaThead);
}

function rellenarContenidoTabla()
{
    const tbody = tabla.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    items.forEach((item) => {
        const nuevaFila = document.createElement("tr");
        for (const celda in item){
            if (celda == "id"){
                nuevaFila.setAttribute("data-id", item[celda]);
            }else{
                let nuevaCelda = document.createElement("td");
                nuevaCelda.textContent = item[celda];
                nuevaFila.appendChild(nuevaCelda);
            }
            
        }            
        tbody.appendChild(nuevaFila);
    });
    
}

function manejadorClickTabla()
{
    tabla.addEventListener("click", (event) => {
        if (event.target.matches("td")){
            let idMoneda = event.target.parentNode.dataset.id;
            const item = items.filter((item) => parseInt(item.id) === parseInt(idMoneda))[0];
            formulario.idMoneda.value = item.id;
            formulario.nombre.value = item.nombre;
            formulario.simbolo.value = item.simbolo;
            formulario.fechaCreacion.value = item.fechaCreacion;
            formulario.precioActual.value = item.precioActual;
            formulario.cantidadCirculacion.value = item.cantidadCirculacion;
            formulario.sitioWeb.value = item.sitioWeb;
            formulario.consenso.value = item.consenso;
            formulario.algoritmo.value = item.algoritmo;
            mostrarBotonesModificacion(true);            
        }
      });
}

async function manejadorClickBotonesDeEdicion()
{
    const botones = document.getElementById("btn-group");
    botones.addEventListener("click", async (event) => {
        if(event.target.matches("button"))
        {
            let index = items.findIndex(fila => parseInt(fila.id) == parseInt(formulario.idMoneda.value));
            if(index != -1)
            {
                switch(event.target.id)
                {
                    case "save-anuncio":
                        const moneda = new Crypto(
                            formulario.idMoneda.value,
                            formulario.nombre.value,
                            formulario.simbolo.value,
                            formulario.fechaCreacion.value,
                            formulario.precioActual.value,
                            formulario.consenso.value,
                            formulario.cantidadCirculacion.value,
                            formulario.algoritmo.value,
                            formulario.sitioWeb.value
                        );
                        if (moneda.validarDatos()){
                            items.splice(index, 1, moneda);
                            mostrarBotonesModificacion(false);
                            actualizarDatos();
                        }
                        break;
                    
                    case "delete-anuncio":
                        items.splice(index, 1);
                        mostrarBotonesModificacion(false);
                        actualizarDatos();
                        break;
    
                    case "cancel-anuncio":
                        mostrarBotonesModificacion(false);
                        actualizarFormulario();
                        break;
                }
            }
        }
    });
}


async function manejadorClickBorrarDatos() {
    BtnBorrarDatos.addEventListener("click", async (e) => {
        if(confirm("Desea eliminar todos los Items?")) {
            items.splice(0, items.length);
            inyectarSpinner();
            await limpiar (KEY_STORAGE);
            rellenarEncabezadoTabla();
            rellenarContenidoTabla();
            removerSpinner();
        }
    });
}

function mostrarBotonesModificacion(mostrar) {
    if (mostrar){
        btnCargarMoneda.classList.add("hidden");
        btnGuardar.classList.remove("hidden");
        btnCancelar.classList.remove("hidden");
        btnEliminar.classList.remove("hidden");
    }else{
        btnCargarMoneda.classList.remove("hidden");
        btnGuardar.classList.add("hidden");
        btnCancelar.classList.add("hidden");
        btnEliminar.classList.add("hidden");
    }
}

async function actualizarDatos()
{
    inyectarSpinner();
    actualizarFormulario();
    await escribir(KEY_STORAGE, items);
    rellenarEncabezadoTabla();
    rellenarContenidoTabla();
    removerSpinner();
}

function actualizarFormulario() {
    formulario.reset();
}

function inyectarSpinner() {
    const contenedor = document.getElementById("spinner-container");
    const spinner = document.createElement("img");
    spinner.setAttribute("src", "./assets/spinner.gif");
    spinner.setAttribute("alt", "imagen spinner");
    spinner.setAttribute("height", "64px");
    spinner.setAttribute("width", "64px");
    contenedor.appendChild(spinner);
  }

function removerSpinner() {
    const contenedor = document.getElementById("spinner-container");
    contenedor.removeChild(contenedor.firstChild);
}

