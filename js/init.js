const CATEGORIES_URL = "http://localhost:3000/categories";
const PUBLISH_PRODUCT_URL = "http://localhost:3000/publish_product";
const CATEGORY_INFO_URL = "http://localhost:3000/category_info";
const PRODUCTS_URL = "http://localhost:3000/products";
const PRODUCT_INFO_URL = "http://localhost:3000/product_info";
const PRODUCT_INFO_COMMENTS_URL = "http://localhost:3000/product_info_comments";
const CART_INFO_URL = "http://localhost:3000/cart_info";
const CART2_INFO_URL = "http://localhost:3000/cart2_info";
const CART_BUY_URL = "http://localhost:3000/cart_buy";
const CREAR_ARCHIVO = "http://localhost:3000/creararchivo";

var showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

var getJSONData = function(url){
    var result = {};
    showSpinner();
    console.log("llega hasta aqui " + url);
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

function debeLoguearse(){
  if(!window.localStorage.getItem('logueado') && !(window.location.href.includes("login.html"))){
    window.location.href="login.html";
  }
  
  else if(window.localStorage.getItem('logueado') && window.location.href.includes("login.html")){
    alert("Usted ya está logueado");
    window.location.href="index.html";
  }
}

function mostrarUsuario(){
  if (!window.location.href.includes("login.html")){
    var elUser = document.getElementsByClassName("usuario-carrito")[0];
    elUser.innerHTML = ``+ window.localStorage.getItem("logueado") + ` `;
  }
}

function cerrarSesion(){
  localStorage.removeItem('logueado');
  window.location.href="index.html";
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
  debeLoguearse();
  mostrarUsuario();

  if (!window.location.href.includes("login.html")){
    document.getElementsByClassName("logout")[0].addEventListener("click", function(e){
      cerrarSesion();
    });   
  }
});