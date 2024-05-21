import {CryptoBase} from "./cryptoBase.js";


class Crypto extends CryptoBase{

    constructor(id,nombre, simbolo, fechaCreacion, precioActual, consenso, cantidadCirculacion, algoritmo, sitioWeb)
    {
        super(id,nombre, simbolo, fechaCreacion, precioActual);
        this.consenso = consenso;
        this.cantidadCirculacion = cantidadCirculacion;
        this.algoritmo = algoritmo;
        this.sitioWeb = sitioWeb;
    }

    validarDatos()
    {
        let mensajeError = "";
        if(this.nombre != "" && this.simbolo != "" && this.sitioWeb ){
            if(parseInt(this.precioActual) > 0 && parseInt(this.cantidadCirculacion) > 0){
                let regExSitioWeb = new RegExp('^https:\/\/[a-zA-Z0-9]+\.(com|org/net)$'); // "https://monedasvirtuales.com"
                if(regExSitioWeb.test(this.sitioWeb)){
                    return true;
                }else{
                    mensajeError = "El sitio web no es valido!";
                }
            }else{
                mensajeError = "Precio actual o Cant. Circulacion deben ser mayor a 0!";
            }
        }else{
            mensajeError = "El nombre o el simbolo no fueron ingresados!";
        }
        alert(mensajeError);
        return false;
    }
}

export {Crypto};