//1
const express = require('express');
const app = express();

//2
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//3
const dotenv = require('dotenv')
dotenv.config({path:'./env/.env'});

//4
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

//5
app.set('view engine', 'ejs');

//6
const bcryptjs = require('bcryptjs');

//7
const session = require('express-session');
app.use(session({
    secret:'1234',
    resave: true,
    saveUninitialized:true
}));

//8
const connection = require('./database/db');
const { error } = require('console');

//9 Rutas
app.get('/', (req, res)=>{
    res.render('index', {msg:'Ejemplo 1'});
})
app.get('/login', (req, res)=>{
    res.render('login');
})
app.get('/register', (req, res)=>{
    res.render('register');
})

//10 Registrar
app.post('/register', async (req, res)=>{
    const user = req.body.user;
    const name = req.body.name;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    connection.query('INSERT INTO users SET ?', {user:user, name:name, pass: passwordHaash}, async(error, results)=>{
        if(error){
            console.log(error);
        }else{
            res.render('register',{
                alert: true,
                alertTitle: "Registration",
                alertMessage: "Successful Registration!",
                alertIcon: "success",
                showConfirmButton: false,
                timer: 1500,
                ruta: "/"
            })
        }
    })
})

app.listen(3000, (req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:3000');
})