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

app.get('/', (req, res)=>{
    res.render('index', {msg:'MENSAJE DESDE NODE'});
})
app.get('/login', (req, res)=>{
    res.render('login');
})

app.listen(3000, (req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:3000');
})