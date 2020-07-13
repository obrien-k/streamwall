require('dotenv').config();

const express = require('express'),
  router = express.Router(),
  BigCommerce = require('node-bigcommerce');
  bodyParser = require('body-parser');
  exphbs = require('express-handlebars');
  mongoose = require('mongoose');
  (app = express()),
  (hbs = exphbs.create({
    /* config */
  }));

  const productRoute = require('./routes/product');
  const Product = require('./models/Product.js');  
  const storeRoute = require('./routes/store');
  const Store = require('./models/Store.js');
  

const server = app.listen(process.env.PORT, () => {
  console.log('Express listening at ', server.address().port);
});

// MongoDB setup
mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true });

const bigCommerce = new BigCommerce({
  logLevel: 'info',
  clientId: process.env.CLIENT,
  accessToken: process.env.TOKEN,
  secret: process.env.SECRET,
  storeHash: process.env.HASH,
  responseType: 'json',
  apiVersion: 'v3' // Default is v2
});

// View Setup
app.engine(
  '.hbs',
  exphbs({
    extname: '.hbs',
    helpers: {
      toJSON: function(object) {
        return JSON.stringify(object);
      },
      link: function(thisStore, thisProduct) {
        let Store = thisStore,
            Product = thisProduct;
            
       return("http://store-" + Store + ".mybigcommerce.com/cart.php?action=add&product_id=" + Product);
    },
    linkSku: function(thisStore, thisProduct) {
      let Store = thisStore,
          Product = thisProduct;
          
     return("<a href='http://store-" + Store + ".mybigcommerce.com/cart.php?action=add&sku=" + Product + "'>");
  }
    }
  })
);
mongoose.set('debug', true);
app.set('view engine', '.hbs');
app.set('views', __dirname + '/views');
app.use(express.static('views/images')); 
app.use(bodyParser.json());
app.use(productRoute);
app.use(storeRoute);

// ROUTES
app.get('/', function(req, res) {
  try {
    console.log(req + 'requestVal');
    
        Product.find({}, (err, allProducts) => {
          if (err) {
            console.log(err);
          } else {
            Store.find({}, (err, allStores) => {
              if(err){
                console.log(err);
              } else {
                res.render('index', {
                  title: 'MVC Example',
                  Products: allProducts,
                  Stores: allStores
                });
              }
            })
            
          }
        });
  } catch (err) {
    console.log(err);
  }
});

router.get('/auth', (req, res, next) => {
  bigCommerce
    .authorize(req.query)
    .then(data =>
      res
        .render('integrations/auth', { title: 'Authorized!', data: data })
        .catch(next)
    );
});

router.get('/load', (req, res, next) => {
  try {
    const data = bigCommerce.verify(req.query['signed_payload']);
    res.render('integrations/welcome', { title: 'Welcome!', data: data });
  } catch (err) {
    next(err);
  }
});
