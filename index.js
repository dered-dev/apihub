var express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');


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
    const { name, email, issueDate, expiryDate, groupId } = req.body;

    certifier.auth(process.env.CERTTOKEN);

    axios
    .request({
        method: 'POST',
        url: 'https://api.certifier.io/v1/credentials/create-issue-send',
        headers: {
          accept: 'application/json',
          'Certifier-Version': '2022-10-26',
          'content-type': 'application/json',
          authorization: 'Bearer cfp_DyFnAJwdsJB2NqxVNwHIFWunY5h5thQsRQlx'
        },
        data: {
            recipient: {
                name: name,
                email: email
            },
            issueDate: issueDate,
            expiryDate: expiryDate,
            groupId: groupId
        }
    })
    .then(({ data }) => res.json(data))
    .catch(err => {
        console.error(err)
        res.status(500).send('Error processing request')
    })

})

app.listen(
    3000,
    () => {
        console.log('Server listen in port 3000')
    }
)