//1 Express
const express = require('express');
const app = express();

//2 urlencoded para capturar datos del formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//3 Dotenv
const dotenv = require('dotenv')
dotenv.config({path:'./env/.env'});

//4 Carpeta public
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

//5 Plantillas ejs
app.set('view engine', 'ejs');

//6 bcryptsjs hash de contraseña
const bcryptjs = require('bcryptjs');

//7 Variables de sesion
const session = require('express-session');
app.use(session({
    secret:'1234',
    resave: true,
    saveUninitialized:true
}));

//8 Conexion con base de datos phpMyAdmin
const connection = require('./database/db');
const { error } = require('console');

//9 Rutas
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

//11 Autenticar
app.post('/auth', async (req, res)=>{
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    if(user && pass){
        connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results)=>{
            if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))){
                res.render('login',{
                    alert:true,
                    alertTitle: "ERROR",
                    alertMessage: "Incorrect user or password",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false,
                    ruta:'login'
                });
            }else{
                req.session.loggedin = true;
                req.session.name = results[0].name
                res.render('login',{
                    alert:true,
                    alertTitle: "Successful connection",
                    alertMessage: "",
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta:''
                });
            }
        })
    }else{
                res.render('login',{
                    alert:true,
                    alertTitle: "Warning",
                    alertMessage: "Enter a username and password",
                    alertIcon: "warning",
                    showConfirmButton: true,
                    timer: false,
                    ruta:'login'
        });
    }
})

//12 Auth Pagina
app.get('/', (req, res)=>{
    if(req.session.loggedin){
        res.render('index',{
            login: true,
            name: req.session.name
        })
    }else{
        res.render('index',{
            login: false,
            name: 'You must login'
        })
    }
})

//13 Logout
app.get('/logout', (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
})

//Servidor
app.listen(3000, (req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:3000');
})