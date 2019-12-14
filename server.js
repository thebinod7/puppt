const fs = require('fs');
const express = require('express');
const ejs = require('ejs');
//const paypal = require('paypal-rest-sdk');
const app = express();

//files
const bot = require('./bot/start.js');
const products = require("./products.js");
const adminpassword = require("./adminpassword.js");
var keylist = fs.readFileSync('keylist.js').toString().trim().split(",");
var users = JSON.parse(fs.readFileSync('users.json'));



//const hosturl = "http://localhost";
const port = 5000;

/*
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AZ7Ye_KFy4gMtZWG05VCa9In50KfwHHdkIpDMvoQqK0Ksb1RQ6kQy2gNkqCCYAASsoteZJhkGvXaG1WV',
  'client_secret': 'EEw3QrnFoyz_ORJPvkB0F_yCSl1XQsN-y9CJlJv8TTmA-9XkrvpdkJGtN_ndCPJoXz5zmedqadN68M9d'
});
*/

app.set('view engine', ejs);
app.use(express.static('public'));
app.use(express.urlencoded());


function writeUsers(){
  fs.writeFile('./users.json', JSON.stringify(users), function (err) {
    if (err) throw err;
    console.log('Replaced!');
    users = JSON.parse(fs.readFileSync('users.json'));
    return;
  });
}

function writeKeylist(){
  fs.writeFile('./keylist.js', keylist, function (err) {
    if (err) throw err;
    console.log('Replaced!');
    keylist = fs.readFileSync('keylist.js').toString().split(",");
    return;
  });
}


app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/dc', (req, res) => {
  res.redirect('https://discord.gg/DXAwvrW');
});

app.get('/createaccount', (req, res) => {
  res.render('createaccount.ejs');
});

app.post('/createaccount', (req, res) => {
  var name = req.body.name;
  var pass = req.body.pass;
  users.push({"name":name,"pass":pass,"key":"none","today":0,"trialkey":0});
  writeUsers();
  res.send('succes');
});

app.get('/key', (req, res) => {
  res.render('addkey.ejs');
});

app.post('/key', (req, res) => {
  var name = req.body.name;
  var pass = req.body.pass;
  var key = req.body.key;
  var keyvalue = key.charAt(key.length - 1);
  console.log(key);
  console.log(keyvalue);
  keylist.forEach((_key, index) => {
    console.log(keylist[index]);
    if(_key == key){
      users.forEach(user => {
        if(user.name == name && user.pass == pass){
          if(user.key == "none" || user.key < keyvalue){
            user.key = keyvalue;
            if(keyvalue == 0){
              user.trialkey = new Date().getTime();
            }
            writeUsers();
            keylist.splice(index, 1);
            writeKeylist();
            res.send('succes');
          }
        }
      });
    }
  });
  try{res.send('error');}catch(e){};
});


app.get('/add', (req, res) => {
  res.render('add.ejs');

  var name = req.query.name;
  var pass = req.query.pass;
  var lang = req.query.lang;
  var xp = parseInt(req.query.xp);

  users.forEach(user => {
    console.log("looped");
    if(user.name == name && user.pass == pass){
      console.log("correct");
      if(user.key == "none"){console.log("no key");return;}
      if(xp <= products[user.key].button){
        if(user.today < products[user.key].limit){
          console.log("prestart");
          (async() => {
            await console.log("bot started");
            await bot.start(name, pass, lang, xp);
            await console.log("added: "+xp);
            user.today += await parseInt(xp);
            await console.log(users);
            await console.log(user);
            await writeUsers();
            return;
          })();
        }else{
          console.log("limit exceeded");
        }
      }else{
        console.log("key not sufficient");
      }
    }
  })
});


app.get('/store', (req, res) => {
  res.render('store.ejs', {
    products: products
  });
});


app.post('/store/info', (req, res) => {
  res.render('storeinfo.ejs', {
    id: req.body.id,
    products: products
  });
});

app.get('/store/info/buy', (req, res) => {
  res.render('storeinfobuy.ejs');
});



app.get('/admin/key', (req, res) => {
  res.render('adminlogin.ejs');
});

app.post('/admin/key', (req, res) => {
  if(req.body.pass){
    if(req.body.pass == adminpassword){
      res.render('createkey.ejs', {
        keys: keylist,
	users: JSON.stringify(users)
      });
    }else{
      res.render('adminlogin.ejs');
    }
  }else if(req.body.key){
    keylist += req.body.key+",";
    writeKeylist();
    res.render('createkey.ejs', {
      keys: keylist,
      users: JSON.stringify(users)
    });
  }else{
    res.render('adminlogin.ejs');
  }
});

/*

app.get('/pay/succes', (req, res) => {

  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
      "amount": {

      }
    }]
  }

  paypal.payment.execute(paymentId, execute_payment_json, function(error, payment){
    if(error){
      console.log(error.response);
      throw error;
    }else{
      console.log("Get payment response");
      console.log(JSON.stringify(payment));
      res.render('payment_succes.ejs');
    }
  });
});

app.get('/pay/canceled', (req, res) => {
  res.render('payment_cancelled.ejs');
});



app.post('/pay', (req, res) => {

  var id = req.body.id;

  const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": hosturl+":"+port+"/pay/succes",
        "cancel_url": hosturl+":"+port+"/pay/cancelled"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": products[id].name,
                "sku": id,
                "price": products[id].price/100,
                "currency": "EUR",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "EUR",
            "total": products[id].price/100
        },
        "description": products[id].name+" will give you access to DuoHacker"
    }]
  };


  paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
          throw error;
      } else {
          console.log("Create Payment Response");
          payment.links.forEach((link) => {
            if(link.rel == "approval_url"){
              res.redirect(link.href);
            }
          });
      }
  });
});

*/

var lastDate = parseFloat(fs.readFileSync('./lastreset.txt'));
console.log(lastDate);


var resetTimer = setInterval(() => {

  var currentDay = parseFloat(new Date().getTime()/1000/60/60/24);

  console.log(currentDay);

  if(currentDay >= lastDate + 1){ //1day

    fs.writeFile('./lastreset.txt', currentDay, function (err) {
      if (err) throw err;
      console.log('Replaced date!');
      lastDate = parseFloat(fs.readFileSync('./lastreset.txt'));
      resetDaily();
      return;
    });

  }

  users.forEach(user => {
    if(user.key == 0 && user.trialkey /1000/60/60/24 >= currentDay + 1){
      user.key = "none";
    }
  });

  writeUsers();

}, 1000 * 60 * 60); //1 hour


function resetDaily(){
  users.forEach(user => {
    user.today = 0;
  });
  writeUsers();
}



app.listen(process.env.PORT || port || 5000, () => {
  console.log("started server");
});
