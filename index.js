require('dotenv').config()

const express = require("express")
const ejs = require('ejs')
const session = require('express-session')
const path = require('path')
const Joi = require('joi')
const ejsMate = require('ejs-mate')
const flash = require('connect-flash')
const mongoose = require('mongoose');
var cors = require('cors')
const nodemailer = require("nodemailer");
const { google } = require('googleapis')
const jwt = require('jsonwebtoken')
const EmailList = require('./models/email-list')

mongoose.connect(process.env.databseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("CONNECTION OPEN, mongo is working!!!")
    })
    .catch(err => {
        console.log("OH NO ERROR WITH MONGO!!!!")
        console.log(err)
    })

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(flash())


const sessionOptions = {
    secret: 'secret', 
    resave: false, 
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: + 1000 * 60 * 60 * 24 * 7
    }
}



app.use(session(sessionOptions))



app.use((req, res, next) => {
    res.locals.es = req.flash('es') //email sent
    res.locals.ens = req.flash('ens') //email not sent
    next();
})



const oauth2client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, 
    process.env.REDIRECT_URI)

    oauth2client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})


const maxAge = 1 * 24 * 60 * 60
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_TOKEN, {
    expiresIn: maxAge
    })
}









app.get('/', (req, res) => {
    return res.render('main')
})

app.post('/email-updates-confirm', async (req, res) => {
    try{
    const email = req.body.email
    const emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/
    const validEmail = emailRegex.test(email) 
    if(!validEmail){
    req.flash('ens', 'error! please try again')
    return res.redirect('/')
    }else{
    var formattedDate = new Date();
    var yyyy = formattedDate.getFullYear();
    let mm = formattedDate.getMonth() + 1;
    let dd = formattedDate.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    formattedDate = dd + '/' + mm + '/' + yyyy;

    const token = createToken(email)
    console.log(token)
    const addEmail = new EmailList()
    addEmail.email = email
    addEmail.created = Date.now()
    addEmail.createdFormatted = formattedDate
    await addEmail.save()
    const accessToken = await oauth2client.getAccessToken()

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.USER,
            pass: process.env.PASS,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken
        }
      })
      ejs.renderFile("views/welcome-email.ejs",  { token }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mainOptions = {
                from: 'no-reply@virtconcerts.com',
                to: email,
                subject: 'you have been added to our mailing list',
                html: data
            };
            console.log("html data ======================>", mainOptions.html);
            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });
}
})
    }
    req.flash('es', 'email successfully saved. you will now receive email updates from us')
    return res.redirect('/')
    }catch(e){
    console.log(e)
    req.flash('ens', 'error! please try again')
    return res.redirect('/')
    }
    })





app.get('/email-updates-cancel', (req, res) => {
    const { token } = req.params
    console.log(token)
    return res.render('unsub-confirm', { token })
})

app.post('/email-updates-cancel', async (req, res) => {
    try{
    const { token } = req.body
    console.log(token)
    jwt.verify(token, process.env.JWT_TOKEN, async (err, decodedToken) => {
        if(err){
            console.log('error for token verification')
            console.log(err)
            return res.redirect('/') 
        }else{
            console.log(decodedToken.id)
        }  
    const email = decodedToken.id
    if(email == null || undefined){
        return res.redirect('/')
    }
    const findEmail = await EmailList.findOne({email: email})
    if(findEmail == null || undefined){
        return res.redirect('/')
    }
    console.log(findEmail)
    const deleteEmail = await EmailList.findByIdAndDelete(findEmail.id)
    res.send('unsubscribed from mailing list')
})}catch(e){
    return res.redirect('/')
}
})



//handling

app.use((req, res) => {
    res.redirect('/')
})

app.use((err, req, res) => {
    res.redirect('/')
})

app.use((err, req, res) => {
    res.redirect('/')
})

app.get('*', (req, res) => {
    res.redirect('/')
})


const PORT = 5000


app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`)
})