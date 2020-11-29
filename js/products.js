var currentProductsArray = [];
var currentSortCriteria = undefined;
var minCount = undefined;
var maxCount = undefined;
var originalArray = [];
var texto = "";

const ORDER_ASC_BY_PRICE = "09";
const ORDER_DESC_BY_PRICE = "90";
const ORDER_BY_SOLD_COUNT = "Cant. ";

// ordena segun costo y cantidad
function sortProducts(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_PRICE)
    {
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_PRICE){
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_SOLD_COUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}

// filtra segun costo
function filterProductsPrice(min,max,array){
    if (min == undefined && max == undefined){
        currentProductsArray = array;
    } else {
        let result = array.filter(function(value) {
            if (min == undefined){
                return (value.cost <= max);
            } else if (max == undefined){
                return (value.cost >= min);
            } else {
                return (value.cost >= min && value.cost <= max);
            }
        })
        currentProductsArray = result;
    }
}

// muestra los productos
function showProductsList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentProductsArray.length; i++){
        let product = currentProductsArray[i];

        htmlContentToAppend += `
        <div class="col-md-4 producto">
            <a href="product-info.html" class="card mb-4 shadow-sm custom-card">
                <img class="bd-placeholder-img card-img-top" src="` + product.imgSrc + `" alt="` + product.description + `">
                <h3 class="m-3 prodname">`+ product.name + `</h3>
                <div class="card-body">
                    <small class="text-muted">` + product.soldCount + ` artículos</small>
                    <p class="mb-1 proddescription">` + product.description + `</p>
                    <p class="mb-1">Precio: ` + product.currency + ` ` + product.cost +`</p>
                </div>
            </a>
        </div>
        `

    }
    document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
}

// indica que moestrar e invoca la funcion que muestra
function sortAndShowProducts(sortCriteria, productsArray){
    currentSortCriteria = sortCriteria;

    if(productsArray != undefined){
        currentProductsArray = productsArray;
        originalArray = productsArray;
    }

    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    //Muestro los productos ordenados
    showProductsList();
    filterProductsWords();
}

// filtrado de searchbox
function filterProductsWords(){
    texto = document.getElementById("busqueda").value.toUpperCase();
    var productos = document.getElementsByClassName("producto");
    var busqueda;
    var soloNombre = document.getElementById("busquedanombre").checked;
    for (let i = 0; i < productos.length; i++){
        busqueda = "";
        var nombres = productos[i].getElementsByClassName("prodname");
        var descripciones = productos[i].getElementsByClassName("proddescription");
        for (let j = 0; j < nombres.length; j++){
            busqueda += " " + nombres[j].textContent.toUpperCase();
            if(!soloNombre){
                busqueda += " " + descripciones[j].textContent.toUpperCase();
            }
        }
        if (busqueda.indexOf(texto) > -1){
            productos[i].style.display = "";
        } else {
            productos[i].style.display = "none";
        }
    }
}


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            sortAndShowProducts(ORDER_ASC_BY_PRICE, resultObj.data.data);
        }
    });

    // eventos para ordenar
    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_BY_PRICE);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_PRICE);
    });

    document.getElementById("sortByCount").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_SOLD_COUNT);
    });

    // eventos para borrar filtro
    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        filterProductsPrice(minCount,maxCount,originalArray);
        sortAndShowProducts(currentSortCriteria,currentProductsArray);
    });

    // eventos para filtrar
    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de unidades vendidas por artículo.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        }
        else{
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        }
        else{
            maxCount = undefined;
        }
        sortAndShowProducts(currentSortCriteria,filterProductsPrice(minCount,maxCount,originalArray));
    });

    // eventos para searchbox
    document.getElementById("busquedanombre").addEventListener("click", function(){
        filterProductsWords()
    });

    document.getElementById("busquedatodo").addEventListener("click", function(){
        filterProductsWords()
    });
});