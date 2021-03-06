//const jwt = require('jwt-simple');
var jwt = require('jsonwebtoken');
const fs   = require('fs');
const bcrypt = require('bcrypt-nodejs');
var salt = bcrypt.genSaltSync(10);

const signin = function (objeto,req,res){
    if(!objeto[0]) return  res.status(400).send('Usuário não Encontrado!');
    const isMatch = bcrypt.compareSync(req.query.password, user.password);
    //const isMatch = (req.body.password == objeto[0].senha);
    if(!isMatch) return res.status(400).send('Email/Senha Inválidas!');
    const payload = {
        id: objeto[0].idProfessor,
        email: objeto[0].email,
        nome: objeto[0].nomeP,
        areaDoConhecimento: objeto[0].areaDoConhecimento,
        cpf: objeto[0].cpf,
        admGeral: objeto[0].admGeral,
        admRecursos: objeto[0].admRecursos
    }
    let idP = objeto[0].idProfessor
    var privateKey = fs.readFileSync('./private.key', 'utf8');
    var token = jwt.sign(payload, privateKey, { 
        expiresIn: 300, // 5min 
        algorithm:  "RS256" //SHA-256 hash signature
    }); 
    res.status(200).send({ auth: true, token: token,payload: payload}); 
}

module.exports = signin;