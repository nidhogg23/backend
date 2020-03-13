//Requisitando Funções Importantes e Executando a API
var http = require('http'); 
const express = require('express');
const app = express();         
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser'); 
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const fs   = require('fs');
const secret = "meu-segredo";//esse segredo do JWT seria uma config
const port = 3000;
const cors = require('cors');
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser()); 
app.use('/', router);
console.log("api iniciada");
//todas bibliotecas e inicialização da api



//variaveis destacadas 
let dataReq;
let tipoRecursosReq;
let objDataRecursos;
let professor;
let idHorario;
let horario;
let objData = [[0]];
let objHorarioProf;
let objVazio = [[0]];
let objTipo;
let objProfessor;
let dHPE;



//Require do Banco de Dados e suas querys
let selectData = require("./src/selectData");
let selectHorarioDataRecursos = require("./src/selectHorarioDataRecursos");
let selectTipoRecursos = require("./src/selectTipoRecursos");
let selectProfessorHorario = require("./src/selectProfessorHorario");
let selectProfessorHorarioEspec = require("./src/selectProfessorHorarioEspec");
let selectProfessor = require("./src/selectProfessor");
let insertProfessorHorario = require("./src/insertProfessorHorario");
let inserirTipoDeRecursos = require("./src/insertTipoDeRecursos");
let inserirRecursos = require("./src/insertRecursos");
let updateAprovadoProfessorHorario = require("./src/updateAprovadoProfessorHorario");
let updateRecusadoProfessorHorario = require("./src/updateRecusadoProfessorHorario");
let updateTipoDeRecursos = require("./src/updateTipoDeRecursos");
let deleteProfessorHorarioEspec = require("./src/deleteProfessorHorarioEspec");
let validacao = require("./auth");
let cadastroDeProfessor = require("./src/updateProfessor");



//Login do usuario usando o token
router.post('/login',(req,res)=>{
    console.log("email: ",req.body.email, " senha: " ,req.body.password)
    if(!req.body.email || !req.body.password){
        res.status(400).send('Informe usuário e senha!');
    }else{
       selectProfessor(validacao,req,res);
    }
});



//Puxando Data Especifica, caso não exista, adicionar no banco de dados
router.post('/data',(req, res) =>{
    objData[0][0] = req.body.data;
    console.log("Caso não tenha a data "+ objData[0][0]+" Inserir no banco de dados");
    selectData(objData,res);
});



//Tabela de Recursos e Horarios de uma Determinada Pessoa
router.get('/dataRecursos', (req, res) =>{
    dataReq = req.query.data.substring(0,100);
    tipoRecursosReq = req.query.tipoRecurso.substring(0,100);
    objDataRecursos = [[dataReq,tipoRecursosReq]];
    console.log("Criando tabela de Recursos e Datas");
    selectHorarioDataRecursos(objDataRecursos,res);
});



//tipos de recursos para seleção
router.get('/tipoDeRecursos', (req, res) =>{
    console.log("Informando os Tipos de Recursos");
    selectTipoRecursos(objData,res);
});



//inserir Um Pedido de Horario Pra uma Determinada Pessoa 
router.post('/insertProfessorHorario',verifyJWT,(req,res) =>{
    professor = req.query.professor.substring(0,100);
    idHorario = req.query.idhorario.substring(0,100);
    horario = req.query.horario.substring(0,100);
    objHorarioProf = [[professor,idHorario,horario]];
    insertProfessorHorario(objHorarioProf,res);
});



//Verificar Pedidos de Horarios Para Seleção
router.post('/selectProfessorHorario',verifyADMRecursos,(req,res)=>{
    console.log("Mostrando os professores e os horarios em pedidos");
    selectProfessorHorario(objVazio,res);
});



//Recurso para algum professor Identificar seus pedidos de horario
router.post('/selectProfessorHorarioEspec',verifyJWT,(req,res)=>{
    professor = req.body.payload;
    console.log(professor);
    console.log("Mostrando os professores e os horarios em pedidos ESPECIFICO");
    selectProfessorHorarioEspec(professor.email,res);
});



//Professor ADM de recursos aprovar uma requisição de horario
router.post('/updateAprovadoProfessorHorario',verifyADMRecursos,(req,res) =>{
    objVazio = req.body.item;
    console.log(objVazio);
    objHorarioProf = {
        professor: objVazio.email,
        sala: objVazio.numero,
        data: objVazio.data.slice(0,10),
        horario: objVazio.horario
    }
    console.log("Aprovando determinado horario para determinado professor");
    console.log(objHorarioProf)
    updateAprovadoProfessorHorario(objHorarioProf,res);
});



//Professor ADM de recursos recusar uma requisição de horario
router.post('/updateRecusadoProfessorHorario',verifyADMRecursos,(req,res) =>{
    objVazio = req.body.item;
    console.log(objVazio);
    objHorarioProf = {
        professor: objVazio.email,
        sala: objVazio.numero,
        data: objVazio.data.slice(0,10),
        horario: objVazio.horario
    }
    console.log("Recusando determinado horario para determinado professor");
    console.log(objHorarioProf)
    updateRecusadoProfessorHorario(objHorarioProf,res);
});



//Cadastro de Professor
router.post('/cadastroDeProfessor',(req,res) =>{
    const salt = 10;
    if(!req.query.emailProfessor) return res.status(401).send('Informe o Email!');
    if(!req.query.emailConfirma) return res.status(401).send('Confirme o Email!');
    if(!req.query.nomeProfessor) return res.status(401).send('Informe o seu Nome!');
    if(!req.query.senhaProfessor) return res.status(401).send('Informe a senha!');
    if(!req.query.areaDoConhecimento) return res.status(401).send('Informe a area do conhecimento!');
    if(!req.query.cpfProfessor) return res.status(401).send('Informe o cpf do Professor!');
    if(req.query.emailProfessor!=req.query.emailConfirma) return res.status(401).send('Confirma o Email, Emails nao batem!');

    let emailP = req.query.emailProfessor.substring(0,100);
    let nomeP = req.query.nomeProfessor.substring(0,100);
    let senhaP = bcrypt.hash(req.query.senhaProfessor.substring(0,100),salt);
    let areaDCP = req.query.areaDoConhecimento.substring(0,100);
    let cpfP = req.query.cpfProfessor.substring(0,100);
    console.log(senhaP);
    res.json(senhaP);
    const isMatch = bcrypt.compareSync(req.query.senhaProfessor,senhaP);
    if(!isMatch) return res.status(401).send('deu ruim pai');
    objProfessor = {
        email: emailP,
        nome: nomeP,
        senha: senhaP,
        area: areaDCP,
        cpf: cpfP
    }
    cadastroDeProfessor(objProfessor,req,res);
});



//cadastro de tipo de recursos
router.post('/insertTipoDeRecursos',verifyADMRecursos,(req,res) =>{
    if(!req.body.recType) return res.status(401).send('Confirme o nome do tipo!');
    let nomeTipo = req.body.recType;
    let rec = req.body.payload;
    console.log("Inserindo Tipo de recursos");
    objTipo = {
        nomeTipo: nomeTipo.nome,
        emailProfessor: 'vitor@'
    }
    console.log(objTipo);
    inserirTipoDeRecursos(objTipo,res);
});



router.put('/insertTipoDeRecursos',verifyADMRecursos,(req,res) =>{
    if(!req.body.recType) return res.status(401).send('Confirme o nome do tipo!');
    let nomeTipo = req.body.recType;
    let rec = req.body.payload;
    console.log("Inserindo Tipo de recursos");
    objTipo = {
        nomeTipo: nomeTipo.nome,
        emailProfessor: 'vitor@'
    }
    console.log(objTipo);
    updateTipoDeRecursos(objTipo,res);
});



//cadastro de tipo de recursos
router.post('/insertRecursos',verifyADMRecursos,(req,res) =>{
    if(!req.body.recursos) return res.status(401).send('Informe o Email!');
    if(!req.body.tipoRecurso) return res.status(401).send('Confirme o Email!');
    let recursos = req.query.recursos.substring(0,100);
    let tipoRecurso = req.query.tipoRecurso.substring(0,100);
    console.log("Inserindo Recursos");
    objTipo = {
        recursos: recursos,
        tipoRecurso: tipoRecurso
    }
    console.log(objTipo);
    //inserirRecursos(objTipo,res);
});



//cancelar reserva
router.post('/deleteProfessorHorarioEspec',verifyJWT,(req,res) =>{
    let item = req.body.item;
    dHPE = {
        data : item.data.slice(0,10),
        recursos: item.numero,
        professor: item.email,
        horario: item.horario 
    }
    console.log("Deletando horario do professor especifico");
    deleteProfessorHorarioEspec(dHPE,res);
});



//rota de logout
app.post('/logout',verifyJWT, function(req, res) { 
    console.log("Fez logout e cancelou o token!");
    res.status(200).send({ auth: false, token: null }); 
});

//função que verifica se o JWT é validado atravez do token
function verifyJWT(req, res, next){
    var token = req.headers['x-access-token']; 
    if (!token) 
        return res.status(401).send({ auth: false, message: 'Token não informado.' }); 
    var publicKey  = fs.readFileSync('./public.key', 'utf8');
    jwt.verify(token, publicKey, {algorithm: ["RS256"]}, function(err, decoded) { 
        if (err)
            return res.status(500).send({ auth: false, message: 'Token inválido.' });         
        next(); 
    });
}



//função que verifica se o JWT é validado atravez do token e se é adm De Recursos
function verifyADMRecursos(req, res, next){ 
    var token = req.headers['x-access-token'];
    if (!token) 
        return res.status(401).send({ auth: false, message: 'Token não informado.' }); 
    if(!(req.body.payload.admRecursos == true)) return res.status(401).send({ auth: false, message: 'Apenas Administradores possuem acessos' }); 
    var publicKey  = fs.readFileSync('./public.key', 'utf8');
    jwt.verify(token, publicKey, {algorithm: ["RS256"]}, function(err, decoded) { 
        if (err) 
            return res.status(500).send({ auth: false, message: 'Token inválido.' }); 
        next(); 
    }); 
}



//função que verifica se o JWT é validado atravez do token mais validação de ADM Geral e de Recursos
function verifyADMGeral(req, res, next){ 
    var token = req.headers['x-access-token']; 
    if (!token) return res.status(401).send({ auth: false, message: 'Token não informado.' }); 
    if(!(req.query.admGeral == 'true')) return res.status(401).send({ auth: false, message: 'Apenas Administradores possuem acessos' }); 
    if(!(req.query.admRecursos == 'true')) return res.status(401).send({ auth: false, message: 'Apenas Administradores possuem acessos' });
    var publicKey  = fs.readFileSync('./public.key', 'utf8');
    jwt.verify(token, publicKey, {algorithm: ["RS256"]}, function(err, decoded) { 
        if (err) 
            return res.status(500).send({ auth: false, message: 'Token inválido.' }); 
        next(); 
    }); 
}



var server = http.createServer(app); 
server.listen(port);