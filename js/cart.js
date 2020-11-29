
var currentCart = {};
var currentCartElements = [];
var fadeTime = 300;

function showCartElementsList(){
    let htmlContentToAppend = "";
    for(let i = 0; i < currentCartElements.length; i++){
        let element = currentCartElements[i];

        htmlContentToAppend += `
        <div class="producto">
            <div class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-3">
                        <img src="` + element.src + `" alt="` + element.name + `" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1 prodname">`+ element.name + `</h4>
                            <div>
                            <p class="mb-1">Precio unitario:  <span class="moneda">` + element.currency + `</span> <span class="precio">` + element.unitCost +`</span></p>
                            <!-- <p class="mb-1">Unidades:  ` + element.count + `</p> -->
                            <div class="remover-producto">
                                <button class="` + element.name + ` btn btn-danger boton-remover" type="button" style="float: right; vertical-align: text-bottom;">Quitar</button>
                            </div>
                            </div>
                        </div>
                        <p>Cantidad: <input class="cantidad" type="number" min="0" value=`+ element.count +`></p>
                        <p class="subtotalProdAmbasMonedas">Subtotal: <span class="moneda">` + element.currency +`</span> <span class="subtotalProd"></span> <span class="uyus"></span></p>
                    </div>
                </div>
            </div>
        </div>
        `
    }
    document.getElementById("cart-list-container").innerHTML = htmlContentToAppend;
}

// actualiza los campos de subtotales por producto, usd->uyu, unidades, subtotal, costoenvio, total
function actualizarSubtotales(){
    // variables globales
    let productos = document.getElementsByClassName("producto");
    let subtotal = 0;
    let unidades = 0;
    let producto;

    // variables por producto
    let cantidad, precio, precioxcantUYU, moneda, precioxcant, subtotalProdELEM;

    for(let i = 0; i < productos.length; i++){
        producto = productos[i];
        cantidad = producto.getElementsByClassName("cantidad")[0].value;
        moneda = producto.getElementsByClassName("moneda")[0].textContent;
        precio = producto.getElementsByClassName("precio")[0].textContent;

        precioxcant = precio*cantidad;

        if(moneda == "USD"){
            precioxcantUYU = precioxcant*40;
            producto.getElementsByClassName("uyus")[0].innerHTML = `(UYU ` + precioxcantUYU + `)`;
        } else {
            precioxcantUYU = precioxcant;
        }

        subtotalProdELEM = producto.getElementsByClassName("subtotalProd")[0];
        subtotalProdELEM.innerHTML = precioxcant;

        // actualizacion variables resumen compra
        unidades += Number.parseInt(cantidad);
        subtotal += Number.parseInt(precioxcantUYU);
    }

    // insercion variables resumen compra actualizadas
    let subtotalELEM = document.getElementById("subtotal");
    let cantotalELEM = document.getElementById("totalUnidades");

    subtotalELEM.innerHTML = subtotal;
    cantotalELEM.innerHTML = unidades;

    let costoEnvio = Number.parseInt(document.getElementById("metodoEnvio").value);
    let costoEnvioELEM = document.getElementById("costoEnvio");
    let totalELEM = document.getElementById("total");
    if(costoEnvio != 0){
        costoEnvioELEM.innerHTML = subtotal*costoEnvio/100;
        totalELEM.innerHTML = Math.round(subtotal*(1+costoEnvio/100)*100)/100;
    } else {
        costoEnvioELEM.innerHTML = "--";
        totalELEM.innerHTML = "--";
    }
}

// agrega eventos para actualizar en variaciones de cantidad y costo de envio
function agregarEventosCantidades(){
    let todasLasCantidades = document.getElementsByClassName("cantidad");
    for(let i = 0; i < todasLasCantidades.length; i++){
        todasLasCantidades[i].addEventListener("input", function(e){
            actualizarSubtotales();
        });
    }
    let cambiaEnvio = document.getElementById("metodoEnvio");
    cambiaEnvio.addEventListener("input", function(e){
        actualizarSubtotales();
    });
}

// agrega eventos para quitar productos y actualizar al hacerlo
function agregarEventosBotones(){
    let botonesRemover = document.getElementsByClassName("boton-remover")
    let boton;
    for(let i = 0; i < botonesRemover.length; i++){
        boton = botonesRemover[i];
        boton.addEventListener("click", function(e){
            removerItem(this);
        })
    }
}

// remover cantidades
function removerItem(boton){
    var producto = boton.closest(".producto");
    producto.remove();
    actualizarSubtotales();
}

// (des)habilita tarjeta/cuenta segun radio seleccionado
function enableCardOrNot(){
    let transferenciaELEM = document.getElementById("selectorDatosCuenta");
    let sel = document.getElementById("selectorTarjeta");
    let tarjetaELEM = document.getElementById("tarjeta");
    let esTarjeta = tarjetaELEM.checked;
    if(esTarjeta){
        transferenciaELEM.disabled = true;
        sel.disabled = false;
    } else {
        transferenciaELEM.disabled = false;
        sel.disabled = true;
    }
}

// chequea que form tarjeta este completo y no vencida, se agrega si todo OK
function agregarTarjeta(){
    // se chequea el vencimiento

    let month = Number.parseInt(document.getElementById("mesExp").value);
    let year = Number.parseInt(document.getElementById("anioExp").value);
    let today = new Date();
    let vencimiento = new Date(year,month-1,today.getDate());

    if(vencimiento < today){
        if(!(vencimiento.getFullYear() == today.getFullYear() && vencimiento.getMonth() == today.getMonth())){
            alert("Ingrese una tarjeta vigente");
            return false;
        }
    }

    // se agrega
    let nuevaTarjeta = document.getElementById("cardnumber").value;
    let sel = document.getElementById("selectorTarjeta");
    var opt = document.createElement('option');
    opt.appendChild(document.createTextNode(nuevaTarjeta));
    opt.value = nuevaTarjeta;
    sel.appendChild(opt);
    alert("Tarjeta " + nuevaTarjeta + " agregada");

    // limpiar formulario
    let form = document.getElementById("formNuevaTarjeta");
    form.reset();

    // seteo email
    var elUser = document.getElementById("temail");
    elUser.value = window.localStorage.getItem("logueado");

    return false;
}

// chequea que form de envio este completo
function chequearDatosEnvio(){
    // chequeo de calle, nropuerta, esquina
    let calle = document.getElementById("calle").value;
    let nropuerta = document.getElementById("numeropuerta").value;
    let esquina = document.getElementById("esquina").value;
    let pais = document.getElementById("pais").value;
    let envio = document.getElementById("metodoEnvio").value;

    if(calle == ""){
        alert("Agregue una calle para el envío.");
        return false;
    } else if(nropuerta == ""){
        alert("Agregue un número de puerta para el envío.");
        return false;
    } else if(esquina == ""){
        alert("Agregue una esquina para el envío.");
        return false
    } else if(pais == ""){
        alert("Agregue un país para el envío.");
        return false;
    } else if(envio == 0){
        alert("Seleccione método de envío.");
        return false;
    }

    return true;
}

// chequea compra no vacia, form envio lleno, (tarjeta seleccionada) y confirmacion
function comprarValidacion(){
    let esTarjeta = document.getElementById("tarjeta").checked;
    let tarjeta = document.getElementById("selectorTarjeta").value;
    let unidades = document.getElementById("totalUnidades").textContent;

    if(unidades == 0){
        alert("No hay productos seleccionados para la compra");
        return false;
    }

    if(!chequearDatosEnvio()){
        return false;
    }
    
    if(esTarjeta){
        if(tarjeta == ""){
            alert("Seleccione una tarjeta, añadiéndola de ser necesario.");
            return false;
        }
    } else {
        if(!confirm("¿Desea confirmar la compra?")){
            return false;
        }
    }
    alert("Compra realizada, ¡muchas gracias!");
    return fetch(CREAR_ARCHIVO, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // user: {
            //     name: "John",
            //     email: "john@example.com",
            //     total: document.getElementById("total").textContent
            // }
            data: resumenCompra()
        })
    })
    .then(response => {
        if (response.ok) {
          return;
        }else{
          throw Error(response.statusText);
        }
      });
}

function resumenCompra(){
    let resumen = [];
    let articulos = document.getElementsByClassName("producto");
    let unidades;
    let precio;
    let moneda;
    let nombreProducto;
    for (let i = 0; i < articulos.length; i++){
        nombreProducto = articulos[i].getElementsByClassName("prodname")[0].textContent;
        moneda = articulos[i].getElementsByClassName("moneda")[0].textContent
        unidades = Number.parseInt(articulos[i].getElementsByClassName("cantidad")[0].value);
        precio = Number.parseFloat(articulos[i].getElementsByClassName("precio")[0].textContent);
        resumen.push("Producto: " + nombreProducto);
        resumen.push("Precio: " + moneda + ` ` + precio);
        resumen.push("Unidades: " + unidades);
        resumen.push("Subtotal producto: " + moneda + ` ` + precio*unidades);
        resumen.push("");
    }
    let unidadesTotal = document.getElementById("totalUnidades").textContent;
    let subtotalTotal = document.getElementById("subtotal").textContent;
    let costoenvioTotal = document.getElementById("costoEnvio").textContent;
    let totalTotal = document.getElementById("total").textContent;

    let metodoEnvio = document.getElementById("metodoEnvio").value;
    let infoEnvio = " ";
    if (metodoEnvio == "15"){
        infoEnvio += "(Premium, 15%)";
    } else if (metodoEnvio == "7"){
        infoEnvio += "(Express, 7%)";
    } else {
        infoEnvio += "(Standard, 5%)"
    }
    
    resumen.push("----------");
    resumen.push("");
    resumen.push("Resumen compra: ");
    resumen.push("");
    resumen.push("Unidades: " + unidadesTotal);
    resumen.push("Subtotal: UYU " + subtotalTotal);
    resumen.push("Costo Envio: UYU " + costoenvioTotal + infoEnvio);
    resumen.push("Total: UYU " + totalTotal);
    resumen.push("");

    let calle = document.getElementById("calle").value;
    let nro = document.getElementById("numeropuerta").value;
    let esquina = document.getElementById("esquina").value;
    let pais = document.getElementById("pais").value;

    resumen.push("----------");
    resumen.push("");
    resumen.push("Envío: ");
    resumen.push("");
    resumen.push("Dirección: " + calle + ", " + nro);
    resumen.push("Esquina: " + esquina);
    resumen.push("País: " + pais);
    resumen.push("");

    let esTarjeta = document.getElementById("tarjeta").checked;

    resumen.push("----------");
    resumen.push("");
    resumen.push("Pago: ");
    resumen.push("");
    if(esTarjeta) {
        let nroTarjeta = document.getElementById("selectorTarjeta").value;
        resumen.push("Nº de tarjeta: " + nroTarjeta);
    } else {
        resumen.push("Transferencia bancaria a:");
        resumen.push("eMercado JAP 2020");
        resumen.push("1111-2222-3333-4444");
    }

    return resumen
}



//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(CART2_INFO_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            currentCart = resultObj.data.data
            currentCartElements = currentCart["articles"];
            showCartElementsList();
            actualizarSubtotales();
        }
        // agrego eventos
        agregarEventosCantidades();
        agregarEventosBotones();
        enableCardOrNot();

        document.getElementById("tarjeta").addEventListener("click", function(){
            enableCardOrNot();
        });

        document.getElementById("transferencia").addEventListener("click", function(){
            enableCardOrNot();
        });

        
        var elUser = document.getElementById("temail");
        elUser.value = window.localStorage.getItem("logueado");
    });
});