const express = require('express')
const app = express()
const AppError = require('./AppError');
const bcrypt = require('bcrypt')
const User = require('./Models/user')
const session = require('express-session');
const flash = require('connect-flash')
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("views", express.static("views"));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);
app.use(flash())
app.use((req, res, next) => {
    res.locals.ErrorMessage = req.flash('fail')
    res.locals.SuccessMessage = req.flash('success')
    next();
})

app.get('/', (req, res, next) => {
    res.render('homepage', { userId: req.session.userId })
})

const RequireAdmin = (req,res,next) => {
    if(req.session.userId) next();
    req.flash('fail' , 'You need to be Admin to view this page')
    res.redirect(`/login?next=/protected`)
}
app.get('/protected', RequireAdmin, (req,res,next) => {
    res.send('This is Super Secret Only for Admin');
})
const ValidateLogin = (req,res,next) => {
    if(req.session.userId) return res.redirect('/');
    next();
}
app.get('/register',ValidateLogin, (req, res, next) => {
    res.render('registerPage')
})

const RegistrationValidation = async (req, res, next) => {
    const { username, password, confirmPassword } = req.body;
    if (password != confirmPassword) return next(new AppError(402, 'Password and Confirm Password should be same.'))
    const foundUser = await User.findOne({ username })
    if (foundUser) {
        return next(new AppError(402, 'User Already Exists.'))
    }
    next();
}
app.post('/register', RegistrationValidation, (req, res, next) => {
    try {
        const CreatedUser = new User({ username: req.body.username, password: req.body.password })
        // console.log(CreatedUser.username, CreatedUser.password)
        CreatedUser.save()
        req.session.userId = CreatedUser._id
        req.flash('success', 'Logged In')
    }
    catch (err) {
        return next(new AppError(402, err))
    }
    res.redirect('/')
})

app.post('/logout' , (req,res,next) => {
    req.session.userId = null;  
    req.flash('success' , 'Logged out SuccessFully !')
    res.redirect('/')
})
app.get('/login', ValidateLogin, (req, res, next) => {
    res.render('loginPage')
})

const LoginValidation = async (req,res, next) => {
    const { username , password } = req.body; 
    if(!username || !password) return next(new AppError(401, 'Username or password Empty !'))
    next();
}
app.post('/login',LoginValidation,  async (req, res, next) => {
    const { username , password } = req.body;
    const foundUser = await User.findOne({username})
    if(!foundUser) return next(new AppError(401, 'Username Not Found !'));
    const AuthSuccess = await bcrypt.compare(password, foundUser.password);
    if(!AuthSuccess){
        return next(new AppError(401, 'Invalid username or password !'))
    }
    // console.log(loggedIn)
    req.session.userId = foundUser._id
    if(req.query.next){
        return res.redirect(req.query.next)
    }
    req.flash('success' , 'Successfully Logged in !')
    return res.redirect('/')

})
app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err;
    // console.log(req)
    req.flash('fail', message)
    res.status(status).redirect(req.headers.referer);
})

app.use('*', (req, res) => {
    res.send('404 : Not Found')
})

app.listen(3000)