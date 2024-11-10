const express = require('express');
const cors = require('cors');
const db = require('./models');
const {AllRouters}= require('./Router.js');

const dotenv = require('dotenv')

dotenv.config();
const app = express();


app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(cors({
    origin:true,
    exposedHeaders: ['Authorization']

}))



app.use('/api',AllRouters)

db.syncTablesInOrder().then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on port ${process.env.PORT}`);
    });
  }).catch(err => {
    console.error('Unable to connect to the database:', err);
  });