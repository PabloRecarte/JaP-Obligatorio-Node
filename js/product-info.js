var allProducts = [];
var currentProduct=[];
var currentComments = [];

// carga las imagenes en el carrousel
function showImages(array){
    let toAppend = ``;
    if (0 < array.length){
        toAppend += `
        <div class="carousel-item active" data-interval="4000">
            <img src="` + array[0] + `" class="d-block w-100" alt="imagen` + 0 + `">
        </div>`        
    }
    for (let i = 1; i < array.length; i++){
        toAppend += `
        <div class="carousel-item" data-interval="4000">
            <img src="` + array[i] + `" class="d-block w-100" alt="imagen` + i + `">
        </div>`
    }
    return toAppend;
}

// mmuestra la informacion del producto
function showProductInfo(){

let htmlContentToAppend = "";
    let product = currentProduct;

    htmlContentToAppend += `
    <div class="container">
        <div class="text-center p-4">
            <h2>`+ product.name +`</h2>
        </div>
        <div class="row justify-content-md-center">
            <div class="col-md-12 order-md-1">
                <h4 class="mb-3">
                    Información del producto
                </h4>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <h5>Precio</h5>
                        <p>`+ product.currency + ` ` +  product.cost +`</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-9 mb-3">
                        <h5>Decripción</h5>
                        <p>`+ product.description +`</p>
                    </div>
                </div>      
                <div class="row">
                    <div class="col">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <h5>Categoría</h5>
                                <a href="category-info.html">Autos</a>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <h5>Cantidad de vendidos</h5>
                                <p>`+ product.soldCount +`</p>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="row">
                            <div class="col-md-12">
                                <div style="width: 50%">
                                    <div id="carouselExampleFade" class="carousel slide" data-ride="carousel">
                                        <div class="carousel-inner">
                                    ` + showImages(product.images) + `
                                        </div>
                                        <a class="carousel-control-prev" href="#carouselExampleFade" role="button" data-slide="prev">
                                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span class="sr-only">Previous</span>
                                        </a>
                                        <a class="carousel-control-next" href="#carouselExampleFade" role="button" data-slide="next">
                                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span class="sr-only">Next</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--<div class="row">
                    <div class="col-md-12">
                        <h5>Imágenes ilustrativas:</h5>
                        <div style="width: 50%">
                            <div id="carouselExampleFade" class="carousel slide carousel-fade" data-ride="carousel">
                                <div class="carousel-inner">
                            ` + showImages(product.images) + `
                                </div>
                                <a class="carousel-control-prev" href="#carouselExampleFade" role="button" data-slide="prev">
                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span class="sr-only">Previous</span>
                                </a>
                                <a class="carousel-control-next" href="#carouselExampleFade" role="button" data-slide="next">
                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span class="sr-only">Next</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>-->
            </div>
        </div>
    </div>
    `

    document.getElementById("informaciondeproducto").innerHTML = htmlContentToAppend;
}

// muestra la puntuacion
function showPuntuacion(num){
    let res = "";
    for (let i = 1; i <= num; i++){
        res += `
        <span class="fa fa-star checked"></span>`
    }
    for (let j = 5; j > num; j--){
        res += `
        <span class="fa fa-star"></span>`
    }
    return res;
}

// despliega cada comentario
function showCadaComentario(){
    let res = "";
    for(let i = 0; i < currentComments.length; i++){
        res += `
        <h6 class="mb-3"><span class="usercomment">` + currentComments[i].user + `</span> - ` + currentComments[i].dateTime + ` - ` + showPuntuacion(currentComments[i].score) + `</h6>
        <div class="d-block my-3">
            <p>` + currentComments[i].description + `</p>
        </div>
        <hr class="mb-4">`
    }
    return res;
}

// muestra el conjunto de comentarios
function showComentarios(){
    let htmlContentToAppend = `
    <div class="container">
    <hr class="mb-4">
        <div class="row justify-content-md-center">
            <div id="comentarios" class="col-md-12 order-md-1">
                <h4 class="mb-4">
                    Comentarios
                </h4>
                ` + showCadaComentario() + `
            </div>
        </div>
    </div>
    `
    
    document.getElementById("comentariosdeproducto").innerHTML = htmlContentToAppend;
}

// formato fecha y hora
function adecuacionFechaHora(num){
    res = "";
    if (num < 10){
        res += "0";
    }
    res += num;
    return res;
}

// chequea calificacion, agrega comentario
function validacionNuevoComentario(){
    var form = document.getElementById("formnuevocomentario");
    var contenido = document.getElementById("descripcion-producto").value;
    var calificacion = document.getElementById("valoracion-producto").value;
    if (calificacion == -1){
        alert("La calificación es obligatoria");
    } else {
        if (contenido != "" || confirm("¿Desea enviar el comentario vacío?")){
            //adapto la fecha
            var today = new Date();
            var fecha = today.getFullYear();
            fecha += "-" + adecuacionFechaHora(today.getMonth()+1);
            fecha += "-" + adecuacionFechaHora(today.getDate());

            //adapto la hora
            var hora = "";
            hora += adecuacionFechaHora(today.getHours());
            hora += ":" + adecuacionFechaHora(today.getMinutes());
            hora += ":" + adecuacionFechaHora(today.getSeconds()); 

            //html del nuevo comentario
            var add = `
            <h6 class="mb-3"><span class="usercomment">` + window.localStorage.getItem('logueado') + `</span> - ` + fecha + ` ` + hora + ` - ` + showPuntuacion(calificacion) + `</h6>
            <div class="d-block my-3">
                <p>` + contenido + `</p>
            </div>
            <hr class="mb-4">`;

            //creo el nodo donde lo insertare
            var div = document.createElement("div");
            div.classList.add("nuevocomentario");
            document.getElementById("comentarios").appendChild(div);

            //agrego el comentario a la pagina
            var comments = document.getElementsByClassName("nuevocomentario");
            comments[comments.length-1].innerHTML = add;

            //reseteo el formulario
            form.reset();
        }
    }
    return false;    
}

// despliega cada asociado
function showCadaAsociado(){
    let res = "";
    let nroProd;
    for(let i = 0; i < currentProduct.relatedProducts.length; i++){
        nroProd = currentProduct.relatedProducts[i];
        res += `
        <div class="list-group-item">
            <div class="row">
                <div class="col-3">
                    <img height="150px" src="` + allProducts[nroProd].imgSrc + `" alt="imagenProducto" />
                </div>
                <div class="col">
                    <h6 class="mb-3"><span class="usercomment">` + allProducts[nroProd].name + `</span> - ` + allProducts[nroProd].currency + ` ` + allProducts[nroProd].cost + `</h6>
                    <p>` + allProducts[nroProd].description + `</p>
                </div>
            </div>
        </div>
        `
    }
    return res;    
}

// muestra asociados
function showAsociados(){
    let htmlContentToAppend = `
    <div class="container">
        <hr class="mb-4">
        <div class="row">
            <div id="comentarios" class="col-md-12 order-md-1">
                <h4 class="mb-4">
                    Productos asociados
                </h4>
                ` + showCadaAsociado() + `
            </div>
        </div>
    </div>
    `
    document.getElementById("productosrelacionados").innerHTML = htmlContentToAppend;
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
        
    getJSONData(PRODUCT_INFO_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            currentProduct = resultObj.data.data;
            showProductInfo();
            
            getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(resultObj){
                if (resultObj.status === "ok"){
                    currentComments = resultObj.data.data;
                    showComentarios();

                    getJSONData(PRODUCTS_URL).then(function(resultObj){
                        if (resultObj.status === "ok"){
                            allProducts = resultObj.data.data;
                            showAsociados();
                        }
                    });
                }
            });
        }
    });
});
