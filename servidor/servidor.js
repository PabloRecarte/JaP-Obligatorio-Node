const bodyParser = require('body-parser');
var express = require('express');
const fs = require('fs');
var app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Hola Probando Endpoint',
        success: true
    })
});

const pedidos = {
    "/categories": "./ecommerce-api-master/category/all.json",
    "/publish_product": "./ecommerce-api-master/product/publish.json",
    "/category_info": "./ecommerce-api-master/category/1234.json",
    "/products": "./ecommerce-api-master/product/all.json",
    "/product_info": "./ecommerce-api-master/product/5678.json",
    "/product_info_comments": "./ecommerce-api-master/product/5678-comments.json",
    "/cart_info": "./ecommerce-api-master/cart/987.json",
    "/cart2_info": "./ecommerce-api-master/cart/654.json",
    "/cart_buy": "./ecommerce-api-master/cart/buy.json"
}

app.get("*", (req, res) => {
    if (req.originalUrl != "/creararchivo"){
        fs.readFile(pedidos[req.originalUrl], function(err, data){
            if(err) {
                res.json({
                    message: err,
                    success: false
                })
                return;
            }
            res.json({
                data: JSON.parse(data),
                success: true
            })
        });
    }
});

app.post("/creararchivo", (req, res) => {
    var fechaActual = actualDate();
    let datos = req.body.data;
    let elArchivo = fs.createWriteStream("./compras/" + fechaActual, {
        flags: 'a' //flags: 'a' preserva data existente
    })

    for(let i = 0; i < datos.length; i++){
        elArchivo.write(datos[i]+'\r\n');
    }

    console.log("¡Nueva compra " + fechaActual + "creada satisfactoriamente!");
});

app.listen(3000, () => {
    console.log('Servidor de Pablo funcionando en puerto 3000');
});

// funciones

function actualDate(){
    let today = new Date();
    let sec = ("0" + today.getSeconds()).slice(-2);
    let min = ("0" + today.getMinutes()).slice(-2);
    let hour = ("0" + today.getHours()).slice(-2);
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    
    var fecha = "" + year + month + date;
    var hora = "" + hour + min + sec;
    var miliseconds = "" + today.getMilliseconds();

    return fecha + "_" + hora + "_" + miliseconds;
}