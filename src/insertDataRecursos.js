let sqlQUERY = require("./sqlQuerySemRes");
let funcao = require("./imprimirResults")
let objVazio;
//adicionando tipo de recursos ao banco
let selectDR = function select(results1, results2,res){
    objVazio = results1;
    results2.forEach(function(name){
        let query1 = "INSERT INTO afinal.datarecursos(iddata, idRecursos) VALUES ((SELECT iddata FROM afinal.data where afinal.data.data = '"+objVazio+"'), '"+name.idRecursos+"');";
        let query = query1;
        sqlQUERY(query,objVazio,funcao);
    });
    results2.forEach(function(name){
        let query2 = "INSERT INTO afinal.horario(`07:00-07:50`, `07:50-08:40`, `09:45-10:35`, `10:50-11:40`, `11:40-12:30`, `12:30-13:50`, `13:50-14:40`, `15:50-16:40`, `16:40-17:30`, `17:30-19:00`, `19:00-19:50`, `19:50-20:40`, `20:55-21:45`, `21:45-22:35`, `iddata`, `idRecursos`) VALUES ('1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', (SELECT iddata FROM afinal.data where afinal.data.data = '"+objVazio+"'), '"+name.idRecursos+"');"
        let query = query2;
        sqlQUERY(query,objVazio,funcao);
    });
    res.status(200).send("CERTO");
}
//criando modulo
module.exports = selectDR;