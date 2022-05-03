require('dotenv').config()
var createError = require('http-errors')
var express = require('express')
var app = express()

var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
// ========== PASSPORT FILES ========== //
const passport = require('passport')
const GitHubStrategy = require('passport-github2')
// ==================== //
console.log(GitHubStrategy)

// const helmet = require('helmet')
// app.use(
//   helmet({
//     contentSecurityPolicy: false,
//   })
// )

// app.use(
//   helmet.contentSecurityPolicy({
//     useDefaults: true,
//     directives: {
//       'img-src': ["'self'", 'https: data:'],
//     },
//   }),
//   helmet.crossOriginResourcePolicy({
//     policy: 'cross-origin',
//   })
// )

// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
//         fontSrc: ["'self'", 'https:', 'data:'],
//         imgSrc: ["'self'", 'https://image.tmdb.org'],
//         scriptSrc: ["'self'", "'unsafe-inline'"],
//         blockAllMixedContent: [],
//         upgradeInsecureRequests: [],
//         baseUri: ["'self'"],
//         frameAncestors: ["'self'"],
//       },
//     },
//   })
// )

var indexRouter = require('./routes/index')

const clientID = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const callbackUrl = process.env.CALLBACK_URL

console.log(clientID)
console.log(clientSecret)
console.log(callbackUrl)

const passportConfig = {
  clientID,
  clientSecret,
  callbackUrl,
}

// ========== PASSPORT CONFIG ========== //
passport.use(
  new GitHubStrategy(passportConfig, function (
    accessToken,
    refreshToken,
    profile,
    done
  ) {
    console.log(profile)
    // return done(null, profile)
  })
)
// ==================== //

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app