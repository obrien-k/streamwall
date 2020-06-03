require('dotenv').config();

const express = require('express');
const router = express.Router();
const Product = require('../models/Product.js');
BigCommerce = require('node-bigcommerce');
const HashTable = require('hashtable');

const bigCommerce = new BigCommerce({
  logLevel: 'info',
  clientId: process.env.CLIENT,
  accessToken: process.env.TOKEN,
  secret: process.env.SECRET,
  storeHash: process.env.HASH,
  responseType: 'json',
  apiVersion: 'v3' // Default is v2
});
router.get('/products', (req, res) => {
  Product.find({}, (err, allProducts) => {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      res.render('index', {
        title: 'MVC Example | View Products',
        Products: allProducts
      });
    }
  });
});
router.get('/products/update', (req, res) => {
  res.render('index', { message: 'Updating' });
  const getProducts = new Promise(async function(resolve) {
    try{
     bigCommerce.get('/catalog/products').then(data => {
        console.log('RUNNING...')
        /* Retrieves the Catalog API Products Endpoint and assigns each of the returned objects' IDs to 
        the array 'pArr' */
        Arr = data.data;
        let pArr = [];
        for ([key, value] of Object.entries(Arr)) {
          if (value.id) {
            pArr.push(value.id);
          }
        }
        // A nested asynchronous function, run for the length of pArr
        e();
        async function e(res) {
          for (i = 0; i < pArr.length; i++) {
            s = [];
            await bigCommerce.get('/catalog/products/' + pArr[i] + "/?include=variants").then(data => {
              prodArr = data.data;
              v = [prodArr];
              v.forEach(element => s.push(element))
              return res;
            });
            
            hashtable = new HashTable();
            hashtable.put('data', {value: s});
            try {
              hashtable.forEach((k,v) =>{ v = JSON.stringify(v); });
              hashtable.forEach((k,v) =>{
                v['value'].forEach((g) =>{
                  // These if statements are likely both true, should be tested further.
                  if (g.hasOwnProperty('id')) {
                    delete g['id'];
                    delete g['brand_id'];
                    delete g['option_set_id'];
                    delete g['option_set_display'];
                }
                  
                  /* Though this is true for variants without the array populated,
                  this causes an error: TypeError: v.forEach is not a function */
  
                  /* This can be worked around by manually setting the product ID in the original 
                  get request to BigCommerce and should be fixed long-term*/
  
                  /* I may have resolved this by using [prodArr] instead of prodArr on line 38
                  which also resolved the comment on line 49. To verify this, pages should be iterated
                  to ensure each work as it requires hard coding to change the page*/
  
                  if(g.hasOwnProperty('option_values')){
                    // Assign the option_values array of the current value to 'o'
                    o = g.option_values;
                    console.log('o')
                    o.forEach((f) =>{
                      if (err) throw err;
                      delete f['id'];
                      delete f['option_id'];
                      console.log('value is: ' + JSON.stringify(f));
                    })
                    
                  }
                const context = {}
                context.data = g;
                Product.collection.insertOne(context.data , function(err, res) {
                  if (err) throw err;
                  console.log(
                    'Number of documents inserted: ' + res.insertedCount
                  );
                  });
                })
              });
              
            }
            catch(err) {
              console.log(err + 'line 87');
              return err;
            }
            
            console.log('DONE line 91')
            }
           
      }
     });
     console.log('log before return resolve line 96')
     return resolve;
    }
      catch(err){
        console.log(err + 'line 100');
        return err;
      }
  });
  getProducts;
});

// These routes are actually useless, but could be used in future iterations.

router.post('/products/add', (req, res) => {
  let message = '';
  let id = req.body.id;
  let name = req.body.name;
  let sku = req.body.sku;

  let newProduct = { id: id, name: name, sku: sku };
  Product.create(newProduct, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      console.log(newlyCreated);
      res.redirect('/');
    }
  });
});
router.get('/products/:id', (req, res) => {
  let productId = req.params.id;

  Product.findById(productId).exec((err, ret) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.render('index', {
      title: 'Edit Product',
      product: ret,
      message: ''
    });
  });
});
router.post('/products/edit/:id', (req, res) => {
  let productId = req.params.id;

  Product.findByIdAndUpdate(productId, req.body).exec((err, ret) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect('/');
  });
});
router.get('/products/delete/:id', (req, res) => {
  let productId = req.params.product_id;

  Product.findByIdAndRemove(productId, req.body).exec((err, ret) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect('/');
  });
});
module.exports = router;
