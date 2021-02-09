const express = require("express");
const bodyParse = require('body-parser');
const cors = require('cors')
const app = express();
const Sequelize = require('sequelize');
const sequelize = new Sequelize('IconeDB','root','password',{
    host:"localhost",
    dialect: 'mysql'
});

sequelize.authenticate().then(function(){
    console.log("Conectado com sucesso!");
}).catch(function(erro){
    console.log("falha ao se conectar: "+erro);
});
const { QueryTypes } = require('sequelize');

app.use(cors());
app.use(express.json());
app.use(bodyParse.urlencoded({extended: true}));
const funcaoA = (req,res)=>{
    res.send("Done!")
};

app.get("/f", funcaoA)

app.get("/retornaclientes", async(req,res)=>{
    const sqlCliente = "SELECT cli.CNPJ, cli.Nome, cli.Data_fundacao, cli.Tipo, cli.Telefone, cli.Endereco, Pessoa.Nome as responsavel FROM `IconeDB`.`Cliente` as cli JOIN `IconeDB`.`Pessoa_relacionada` as Pessoa ON Pessoa.id = cli.id_responsavel;";
    const result = await sequelize.query(sqlCliente, {type: QueryTypes.SELECT});
    res.status(200).json(result)
})

app.post("/createaccount", async(req,res)=>{
    const loginReg = req.body.loginReg;
    const passReg = req.body.passReg;

    const sqlInsert = "INSERT INTO `IconeDB`.`accounts` (`login`, `pass`) VALUES ($1,$2);";
    const a = await sequelize.query(sqlInsert, {bind:[loginReg,passReg]});
    if (a[1] = 1){
        res.status(200).json({mensagem: "Criado com sucesso!"})
    }else{
        res.status(200).json({mensagem: "Error"})
    }    
});

app.post("/login", async(req,res)=>{
    const login = req.body.login;
    const pass = req.body.pass;

    const sqlLogin = "SELECT * FROM `IconeDB`.`accounts` WHERE login = $1 AND pass = $2;";
    const result = await sequelize.query(sqlLogin, {bind:[login,pass], type: QueryTypes.SELECT});
    if (result[0] != undefined){
        res.status(200).json({message: "Login efetuado com sucesso!", token: result[0].id})
    }else{
        res.status(200).json({message: "Login ou senha incorretos!"});
    }
});

app.listen(3001, () => {
    console.log("running on port 3001");
});
