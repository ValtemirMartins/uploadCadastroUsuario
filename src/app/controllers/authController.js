const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');

const User = require('../models/user');
const router = express.Router();

function geradorToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn:86400,
  } );
}

//const mongoose = require('mongoose');


router.post('/register', async (req, res) => {
  const { email } = req.body;

  try {
    if (await User.findOne({ email }))
      return res.status(400).send({ error: 'Usuario ja existente' })

    const user = await User.create(req.body);

    user.password = undefined;

    return res.send({ 
      user,
      token: geradorToken({ id: user.id }),
    });

  } catch (erro) {
    console.log(erro)
    return res.status(400).send({ error: 'Usuario ja cadastraado' });
  }
});

router.post('/autenticacao', async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email }).select('+password');

    if (!user)
      return res.status(400).send({ error: 'Usuario não encontrado' });
      //console.log(user);
      
    if (!await bcrypt.compare( String(password), String(user.password)))
      return res.status(400).send({ error: 'Senha Invalida' });

      user.password = undefined;

      res.send({ 
        user, 
        token: geradorToken({ id: user.id }), 
      });
      
  } 
  catch (erro) {
    console.log(erro)
    return res.status(400).send({ error: 'falha na autenticação' });
  }

});

module.exports = app => app.use('/auth', router);