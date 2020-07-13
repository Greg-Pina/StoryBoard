const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const connect = require('mongoose')
const passport = require('passport')
const session = require('express-session')

// Load config 
dotenv.config({path: './config/config.env'})

//Pasport config
require('./config/passport')(passport)

//call the database
connectDB()

const app = express()


if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Handlebars
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')

//Sessions middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
