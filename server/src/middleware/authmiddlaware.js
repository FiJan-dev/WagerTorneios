const express = require('express');
const jwt  = require('jsonwebtoken');
const router = express.Router();
const key = process.env.SECRET_KEY;

const autenticarToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];

    console.log('Authorization Header: ', authHeader);

    console.log('Token da Middleware: ', token);
    console.log('SECRET_KEY usado:', key);

    if(!token){
        console.log('sem token')
        return res.sendStatus(401).json({msg:'token nao fornecido'})
    }

    jwt.verify(token, key, (err, user)=>{
        if(err){
            console.log(err)
            return res.sendStatus(401).json({msg: 'erro do verify'});
        }

        console.log('Token decodificado com sucesso:', user);
        console.log("Data atual no servidor:", new Date());
        req.user = user;
        next();

    });

};

module.exports = autenticarToken;