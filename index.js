var express = require('express');
var bodyParser = require("body-parser");
const cors = require('cors'); // Import the cors package



var app = express();
app.use(cors()); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.get(
    '/',
    (request, response) => {
        response.send('pagina Principal')
    }
);


app.post('/', function (req, res) {
    var email = req.body.email

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + process.env.HSAPIKEY);

    const raw = JSON.stringify({
    "filters": [
        {
        "propertyName": "email",
        "operator": "EQ",
        "value": email
        }
    ]
    });

    const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
    };

    fetch("https://api.hubapi.com/crm/v3/objects/contacts/search", requestOptions)
    .then((response) => response.text())
    .then((result) => {
        res.end(result)
    })
    .catch((error) => console.error(error));
    
});

app.listen(
    3000,
    () => {
        console.log('Servidor corriendo')
    }
)


