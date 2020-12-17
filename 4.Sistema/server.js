// Express para criar as configurações do servidor
const express = require("express")
const server = express()

const db = require("./db")

/*const localtunnel = require("localtunnel")
const tunnel = localtunnel(80, {subdomain: 'appmarcos'})
*/

//Constante universal
let FullIdeas = []

// habilitar o uso do req.body
server.use(express.urlencoded({ extended: true}))

// configurar arquivos estáticos (css, scripts, imagens)
server.use(express.static("public"))

//Configuração do Nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views", {
    express: server,
    noCache: true,
    watch: true
})


// Criação da rota
// que captura o pedido do cliente para responder
server.get("/", function(req, res){
    const lastIdeas = []
    FullIdeas = []

    db.all(`SELECT * FROM ideas`, function(err, rows){
        if(err){
            console.log(err)
            return res.send("Erro no banco de dados!!\nContate o adm do sistema.")
        }

        for(let i=rows.length; i>0; i--){
            if(lastIdeas.length < 3){
                lastIdeas.push(rows[i-1])
            }
    
            FullIdeas.push(rows[i-1])
        }
    
        return res.render("index.html", {ideas: lastIdeas})
    })
})

server.get("/ideias", function(req, res){
    return res.render("ideias.html", {ideas: FullIdeas})
})

server.post("/", function(req, res){

    // campos do formulário
    const campos = 
    [
        "Link da imagem",
        "Título",
        "Categoria",
        "Digite uma descrição para essa ideia",
        "Link da ideia"
    ]

    // Valida dados antes da inserção
    const valoresForm = 
    [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link,
    ]

    for(let i=0; i<valoresForm.length; i++){
        if(!valoresForm[i].trim()){
            return res.send(`O campo "${campos[i]}" foi enviado vazio!`)
        }    
    }

     //Isere dados na tabela
     const query = `
     INSERT INTO ideas(
         image,
         title,
         category,
         description,
         link
     ) VALUES(?,?,?,?,?);`


    db.run(query,  valoresForm, function(err){
        if(err){
            console.log(err)
            return res.send("Erro ao inserir os dados no banco!!\nContate o adm do sistema.")
        }

        return res.redirect("/")
    })
})

//pagina de login nova
server.post("/cadastro", function(req, res)
{
    // campos do formulário
    const camposForm = 
    [
        "Nome",          
        "e-mail",
        "Password"
    ]

    //campos do formulário
    const valForm = 
    [
        req.body.name,
        req.body.email,
        req.body.password
    ]

    for(let i=0; i<valForm.length; i++){
        if(!valForm[i].trim()){
            return res.send(`O campo "${camposForm[i]}" foi enviado vazio!`)
        }    
    }

        //Isere dados na tabela
        const query = `
        INSERT INTO usuarios(
            name,
            email,
            password
        ) VALUES(?,?,?);`
   
   
       db.run(query, valForm, function(err){
           if(err){
               console.log(err)
               return res.send("Erro ao inserir os dados no banco!!\nContate o adm do sistema.")
           }
           
           return res.redirect('/login')
       })
})

// Método POST
// realização de login
server.post("/login", function(req, res)
{
    // campos do formulário
    const camposForm = 
    [         
        "e-mail",
        "Password"
    ]

    //campos do formulário
    const valForm = 
    [
        req.body.email,
        req.body.password
    ]

    for(let i=0; i<valForm.length; i++){
        if(!valForm[i].trim()){
            return res.send(`O campo "${camposForm[i]}" foi enviado vazio!`)
        }    
    }

    // Consulta dados na tabela
    const query = `
        SELECT
            email,
            password
        FROM usuarios WHERE email = ?;`

    db.all(query, valForm[0], function(err, rows){
        let email = null;
        let password = null;
        for(let j=0; j<rows.length; j++){
            email = rows[j].email
            password = rows[j].password
            console.log(email, password)
        }
        
        console.log(valForm[0], valForm[1])
        if(err){
            console.log(err)
            return res.send("Erro no banco de dados!!\nContate o adm do sistema.")
        }

        if(email == valForm[0] && password == valForm[1])
        {
            return res.redirect("/")
        }else
            {
                return res.send("usuário ou senha inválidos!")
            }
    })
})
server.get("/login", function(req, res){

    return res.render("login.html")
    
})


//Servidor ouvindo na porta 3000
//server.listen(80, '192.168.0.104')
server.listen(3000, `127.0.0.1`)