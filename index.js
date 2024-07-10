var express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
const certifier = require('@api/certifier');

var app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (request, response) => {
    response.send('pagina Principal');
});

app.post('/', function (req, res) {
    var email = req.body.email

    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append("Authorization", "Bearer " + process.env.HSAPIKEY)

    const raw = JSON.stringify({
    "filters": [{
        "propertyName": "email",
        "operator": "EQ",
        "value": email
        }]
    })

    const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
    }

    fetch("https://api.hubapi.com/crm/v3/objects/contacts/search", requestOptions)
    .then((response) => response.text())
    .then((result) => {
        res.end(result)
    })
    .catch((error) => console.error(error))
    
})

// certifier
app.post('/certifier', function (req, res) {
    const { name, email, issueDate, expiryDate } = req.body;

    // Autenticación con Certifier
    certifier.auth(process.env.CERTTOKEN);

    // Crear y enviar la credencial
    certifier.createIssueSendACredential({
        recipient: {
            name: name,
            email: email
        },
        issueDate: issueDate,
        expiryDate: expiryDate
    }, { 'Certifier-Version': '2022-10-26' })
    .then(({ data }) => res.json(data))
    .catch(err => {
        console.error(err);
        res.status(500).send('Error processing request');
    });
});
// certifier


app.listen(
    3000,
    () => {
        console.log('Server listen in port 3000')
    }
)


