const delay = 2.5;

export function leer(key)
{
    return new Promise ((resolve, reject) => {
        setTimeout(() =>{
            try {
                const str = localStorage.getItem(key);
                resolve(jsonToObject(str));
            } catch (error) {
                reject(error);
            }
        }, delay * 1000);
    });
    
}


export function escribir (key, valor)
{
    return new Promise ((resolve, reject) => {
        setTimeout(() =>{
            try {
                const str = objectToJson(valor); 
                localStorage.setItem(key, str);
                resolve();
            } catch (error) {
                reject(error);
            }
        }, delay * 1000);
        
    });
    
}

export function limpiar(key)
{
    return new Promise ((resolve, reject) => {
        
        setTimeout(() =>{
            try {
                localStorage.removeItem(key);
                resolve();
            } catch (error) {
                reject(error);
            }
        }, delay * 1000);
    });
    
}

// Función para convertir de JSON string a objeto 
export function jsonToObject(jsonString) {
    return JSON.parse(jsonString);
}


// Función para convertir de objeto a JSON string 
export function objectToJson(objeto) {
    return JSON.stringify(objeto);
}



