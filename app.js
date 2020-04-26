const express=require('express');
const app=express();
var braintree = require('braintree');
var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "",
    publicKey: "",
    privateKey: ""
  });
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/token',  (req,res)=>{
    gateway.clientToken.generate({
        customerId: req.body.customerId
      }, function (err, response) {
        res.send(response);
    });

});

app.post('/update', (req,res) =>{
    gateway.customer.update(user.customerId, {
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        phone : req.body.phone,
        email : req.body.email
      })
})

app.post('/signUp',  (req,res) => {
    gateway.customer.create({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        phone : req.body.phone,
        email : req.body.email
    }, function(err,result){
        if(result)
        {
            res.send({
                status : res.statusCode,
                customerId : result.customer.id,
            });
        }
        else
        {
            res.send({
                status : res.statusCode,
                error : err
            })
        }
    });
})


app.post("/checkout", function (req, res) {
    var nonceFromTheClient = req.body.nounce;
    gateway.transaction.sale({
        amount: req.body.amount,
        paymentMethodNonce: nonceFromTheClient
      }, function (err, result) {
        res.send(result);
      });
    
});

app.use(express.json());
app.listen(80, ()=> console.log('Server Up. Listening to port 80.........'));
