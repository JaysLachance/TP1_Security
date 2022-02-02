const express = require('express')
const bodyParser = require('body-parser')
const {check, validationResult, body} = require('express-validator')
const fs = require('fs')
const app = express()
const port = 5000
const cookieParser = require('cookie-parser');
const crypto = require('crypto')
const urlEncodedParser = bodyParser.urlencoded({extended:false})

app.use(cookieParser('MY SECRET'));
module.exports = crypto
app.set('view engine', 'ejs')

let options = {
    maxAge: 1000 * 60 * 15,
    httpOnly: true,
    signed: true
}

app.get('', (req, res) => {
    randomID = crypto.randomUUID()
    cookieName = crypto.randomUUID()
    res.cookie(cookieName, randomID, options,{ signed : true });
    res.render('index')
})

app.get('/register', (req, res)=> {
    randomID = crypto.randomUUID()
    cookieName = crypto.randomUUID()
    res.cookie(cookieName, randomID, options,{ signed : true });
    res.render('register')
})

app.post('/register', urlEncodedParser,
    [
        check('username', 'This username must be 3+ characters long').exists().isLength(({min : 3})),
        check('email', 'Email is not valid').isEmail().normalizeEmail(),
        check('password', 'Your password require an uppercase Letter, a special character and a number.').isStrongPassword(),
    ],
    (req, res)=> {
     const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const alert = errors.array()
            res.render('register', {
                alert
            })
        }
        else {
            let name = req.body.username
            let email = req.body.email
            let password = req.body.password
            let data = `Username : ${name.concat(" Email: ", email, " Password: ", password)}`;
            fs.writeFile('accounts.txt', data+"\n", { flag: 'a+' },(err) => { if (err) throw err; });
            }
    })

app.listen(port, () => console.info(`App listening on port: ${port}`))
