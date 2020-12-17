const sqlite3 = require('sqlite3')//.verbose
let db = new sqlite3.Database("./DB_ideas.db")


db.serialize(function(){

    //Cria a tabela
    db.run(`
            CREATE TABLE IF NOT EXISTS ideas(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                image TEXT,
                title TEXT,
                category TEXT,
                description TEXT,
                link TEXT
            );

            CREATE TABLE IF NOT EXISTS usuarios(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT,
                password TEXT
            );
        `)
    

    //Isere dados na tabela
    const query = `
    INSERT INTO ideas(
        image,
        title,
        category,
        description,
        link
    ) VALUES(?,?,?,?,?);`

    const values = [
        "https://image.flaticon.com/icons/svg/2729/2729007.svg",
        "Curso de programação",
        "Estudo",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum repellendus necessitatibus aut nesciunt eum magnam sint assumenda tempore laborum! Excepturi iure numquam voluptatum vel omnis magni nobis ad, molestias expedita.",
        "https://rocketseat.com.br"
    ]

    /*db.run(query,  values, function(err){
        if(err) return console.log(err)

        console.log(this)
    })*/

    //Consulta dados na tabela
    /*db.all(`SELECT * FROM ideas`, function(err, rows){
        if(err) return console.log(err)

        console.log(rows)
    })*/

    //Deletar um dado da tabela
    /*db.run(`DELETE FROM ideas WHERE id = ?`, [2], function(err){
        if(err) return console.log(err)

        console.log('DELETEI', this)
    })*/
})

module.exports = db