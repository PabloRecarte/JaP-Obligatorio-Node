const imagenVacia = "img/emptyAvatar.png";

function confirmarCambios(){
    let confirmado = document.getElementById("confirmarCambios").checked;
    
    let nombres = document.getElementById("nombres-wr");
    let apellidos = document.getElementById("apellidos-wr");
    let email = document.getElementById("email-wr");
    let edad = document.getElementById("edad-wr");
    let telefono = document.getElementById("telefono-wr");

    if(confirmado){
        nombres.readOnly = true;
        apellidos.readOnly = true;
        email.readOnly = true;
        edad.readOnly = true;
        telefono.readOnly = true;
    } else {
        nombres.readOnly = false;
        apellidos.readOnly = false;
        email.readOnly = false;
        edad.readOnly = false;
        telefono.readOnly = false;
    }
}

function cargarDatos(){
    let stringJSON = window.localStorage.getItem("infoUsuario");

    if(stringJSON != null){
        let infoJSON = JSON.parse(stringJSON);

        // cargo datos
        document.getElementById("nombres-rd").value = infoJSON.nombres;
        document.getElementById("apellidos-rd").value = infoJSON.apellidos;
        document.getElementById("email-rd").value = infoJSON.email;
        document.getElementById("edad-rd").value = infoJSON.edad;
        document.getElementById("telefono-rd").value = infoJSON.telefono;
        document.getElementById("imagen-rd").src = infoJSON.imagen;

        // pronto para modificar
        document.getElementById("nombres-wr").value = infoJSON.nombres;
        document.getElementById("apellidos-wr").value = infoJSON.apellidos;
        document.getElementById("email-wr").value = infoJSON.email;
        document.getElementById("edad-wr").value = infoJSON.edad;
        document.getElementById("telefono-wr").value = infoJSON.telefono;
        document.getElementById("imagen-prev").src = infoJSON.imagen;
    }
}

function guardarDatos(){
    let confirmado = document.getElementById("confirmarCambios").checked;

    if(!confirmado) {
        alert("Confirme los cambios.");
        return false;
    }

    let nombres = document.getElementById("nombres-wr").value;
    let apellidos = document.getElementById("apellidos-wr").value;
    let email = document.getElementById("email-wr").value;
    let edad = document.getElementById("edad-wr").value;
    let telefono = document.getElementById("telefono-wr").value;

    let oldJSONstring = window.localStorage.getItem("infoUsuario");
    
    let oldJSON = JSON.parse(oldJSONstring);

    let imagen = oldJSON.imagen;

    let infoJSON = {
        nombres,
        apellidos,
        email,
        edad,
        telefono,
        imagen
    }
    
    let stringJSON = JSON.stringify(infoJSON);

    window.localStorage.setItem("infoUsuario",stringJSON);

    cargarDatos();
}

function inicializarDatos(){
    let infoJSON = {
        nombres : "",
        apellidos : "",
        email : "",
        edad : "",
        telefono : "",
        imagen : imagenVacia
    }
    
    let stringJSON = JSON.stringify(infoJSON);

    window.localStorage.setItem("infoUsuario",stringJSON);        
}

function previsualizarImagen(e){
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function() {
        document.getElementById("imagen-prev").src = reader.result;
    }
    reader.readAsDataURL(file);
}

function quitarImagen(){
    let confirmado = document.getElementById("confirmarImagen").checked;

    if(!confirmado) {
        alert("Confirme los cambios.");
    } else {
        if(confirm("¿Desea eliminar su imagen?")){
            document.getElementById("imagen-prev").src = imagenVacia;
            let stringJSON = window.localStorage.getItem("infoUsuario");
            let infoJSON = JSON.parse(stringJSON);
            infoJSON.imagen = imagenVacia;
            stringJSON = JSON.stringify(infoJSON);
            window.localStorage.setItem("infoUsuario",stringJSON);    
            cargarDatos();
            window.location.reload();
        }
    }
}

// function guardarImagen(){
//     let stringJSON = window.localStorage.getItem("infoUsuario");
//     let infoJSON = JSON.parse(stringJSON);
//     let imgURL = document.getElementById("imagen-prev").src;
//     infoJSON.imagen = imgURL;
//     stringJSON = JSON.stringify(infoJSON);
//     window.localStorage.setItem("infoUsuario",stringJSON);    
//     cargarDatos();
// }

function guardarImagenUsandoCanvas(){
    let confirmado = document.getElementById("confirmarImagen").checked;

    if(!confirmado) {
        alert("Confirme los cambios.");
        return false;
    }

    let avatarImage = document.getElementById("imagen-prev");
    var imgCanvas = document.createElement("canvas");
    var imgContext = imgCanvas.getContext("2d");

    imgCanvas.width = avatarImage.width;
    imgCanvas.height = avatarImage.height;

    imgContext.drawImage(avatarImage,0,0,avatarImage.width,avatarImage.height);

    var imgAsDataURL = imgCanvas.toDataURL("image/png");

    
    let stringJSON = window.localStorage.getItem("infoUsuario");
    let infoJSON = JSON.parse(stringJSON);
    infoJSON.imagen = imgAsDataURL;
    stringJSON = JSON.stringify(infoJSON);
    window.localStorage.setItem("infoUsuario",stringJSON);    
    cargarDatos();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    if(window.localStorage.getItem("infoUsuario") == null){
        inicializarDatos();
    }
    cargarDatos();

    document.getElementById("confirmarCambios").addEventListener("click", function(){
        confirmarCambios();
    });

    document.getElementById("imagen-wr").addEventListener("change", function(e){
        previsualizarImagen(e);
    });

    document.getElementById("quitarImagen").addEventListener("click", function(e){
        quitarImagen();
    });
});