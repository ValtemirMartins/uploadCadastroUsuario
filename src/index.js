require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTIONSTRING, {useNewUrlParser: true,  useUnifiedTopology: true })
.then(() => {
  console.log('conectei a base de dados')
   app.emit('pronto');
})
.catch(e => console.log(e));

app.use(express.json());
app.use(express.urlencoded({extended: false}));


require('../src/app/controllers/index')(app);


app.on('pronto', () => {
  app.listen(3000, ()=> console.log('API rodando na porta 3000'))
});


