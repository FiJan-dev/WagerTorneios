const jwt  = require('jsonwebtoken');
const key = process.env.SECRET_KEY;

const autenticarToken = (req, res, next) => {
    console.log('MIDDLEWARE AUTENTICARTOKEN CHAMADO');
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];

    console.log('Authorization Header: ', authHeader);

    console.log('Token da Middleware: ', token);
    console.log('SECRET_KEY usado:', key);

    if(!token){
        console.log('sem token')
        return res.status(401).json({msg:'token nao fornecido'})
    }

    jwt.verify(token, key, (err, user)=>{
        if(err){
            console.log(err)
            return res.status(401).json({msg: 'erro do verify'});
        }

        console.log('Token decodificado com sucesso:', user);
        console.log("Data atual no servidor:", new Date());
        req.user = user;
        next();

    });

};

module.exports = autenticarToken;