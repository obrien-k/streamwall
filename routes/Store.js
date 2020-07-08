require('dotenv').config();
const express = require('express');
const router = express.Router();
const Store = require('../models/Store.js');
BigCommerce = require('node-bigcommerce');


const bigCommerce = new BigCommerce({
  logLevel: 'info',
  clientId: process.env.CLIENT,
  accessToken: process.env.TOKEN,
  secret: process.env.SECRET,
  storeHash: process.env.HASH,
  responseType: 'json',
  apiVersion: 'v2' // Default is v2
});
router.get('/store', (req, res) => {
  Store.find({}, (err, allStores) => {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      res.render('index', {
        title: 'MVC Example | View Store Info',
        Stores: allStores
      });
    }
  });
});
router.get('/store/update', (req, res) => {
  res.render('index', { message: 'Updating' });
  const getStoreInfo = new Promise(async function() {
    try{
     bigCommerce.get('/store').then(data => {
        console.log('RUNNING...')
        const context = {}
                context.data = data;
                const newStore = {}
                newStore.store_id = context.data.id;
                newStore.domain = context.data.domain;
                newStore.secure_url = context.data.secure_url;
                newStore.control_panel_base_url = context.data.base_url;
                newStore.status = context.data.status;
                newStore.name = context.data.name;

                console.log(newStore);
                Store.collection.insertOne(newStore , function(err, res) {
                  if (err) throw err;
                  console.log(
                    'Number of documents inserted: ' + res.insertedCount
                  );
                  });
                })
              }
      catch(err){
        console.log(err + 'line 71 Store.js');
        return err;
      }
  });
  getStoreInfo;
});
router.get('/store/:storeId', (req, res) => {
  let storeId = req.params.storeId;

  Store.findOne({store_id: storeId}).exec((err, ret) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.render('store', {
      title: 'Store Details',
      Store: ret,
      storeId: ret.storeId,
      message: ''
    });
  });
})


module.exports = router;
