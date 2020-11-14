const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')

const port = 3000;

const app = express();

app.use(bodyParser.json());

//datos de conexion a la base de datos
const connection = mysql.createConnection({
    host: '192.168.10.10',
    user: 'homestead',
    password: 'secret',
    database: 'homestead'
});

//Routes

//Obtener todos los formularios
app.get('/forms', (req, res) => {
    const sql = 'SELECT * FROM forms';

    connection.query(sql, (err, results) => {
        if(err) res.json({ok:false,error: err});
        if(results.length > 0){
            res.json({ok:'true',response:results})
        }else{
            res.json({ok:'true',msg:'No hay resultados'})
        }
    })
})

//Obtener todos los formularios de un usuario por ID
app.get('/forms/user/:id', (req, res) => {
    const {id} = req.params
    const sql = `SELECT * FROM forms WHERE user_id=${id}`;

    connection.query(sql, (err, results) => {
        if(err) res.json({ok:false,error: err});
        if(results.length > 0){
            res.json({ok:'true',response:results})
        }else{
            res.json({ok:'true',msg:'No hay resultados'})
        }
    })
})


//Guardar un nuevo formulario
app.post('/forms/add', (req,res) => {
    const sql = 'INSERT INTO forms SET ?';

    //Obtenemos la fecha actual
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();

    today = yyyy+ '-' + mm + '-' + dd;

    //Objeto a guardar del formulario
    const formObj = {
        user_id: req.body.user_id,
        info_description: req.body.info_description,
        correct_information: req.body.correct_information,
        fast_site: req.body.fast_site,
        created_at: today
    }

    connection.query(sql, formObj, err => {
        if(err) res.json({ok:false,error: err});
        res.json({ok:'true',msg:'Formulario creado'})
    })

})




connection.connect(error => {
    if(error) throw error
    console.log('Database corrriendo')
})

app.listen(port, () => {
    console.log('Servidor corriendo')
})