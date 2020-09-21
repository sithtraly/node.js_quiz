const express = require('express')
const fs = require('fs')
const lodash = require('lodash');
const bodyParser = require('body-parser')


const app = express()


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get(['/', '/users'], (req, res) => {
    fs.readFile('userList.json', (err, data) => {
        const json = JSON.parse(data);
        const users = lodash.map(json, (item) => ({ id: item.id, name: item.name }))
        res.send(users)
    })
})


app.get(['/:id', '/users/:id'], (req, res) => {
    fs.readFile('userList.json', (err, data) => {
        const json = JSON.parse(data);
        const users = lodash.find(json, function (item) { return item.id == req.params.id })
        if (!users) {
            res.send({ 'message': 'user not found' })
        } else (
            res.send(users)
        )
    })
})


app.post('/add', (req, res) => {
    var name = req.body.name
    var password = req.body.password
    var profession = req.body.profession

    var userAdd
    fs.readFile('userList.json', (err, data) => {
        const json = JSON.parse(data)
        const lastUser = lodash.last(json)

        if (name && password && profession) {
            userAdd = {
                "id": lastUser.id + 1,
                "name": name,
                "password": password,
                "profession": profession
            }
        }
    })
            
    fs.appendFile('userList.json', userAdd, (err) => {
        if (err) {
            res.send({ 'message': 'user add fails' })
        } else (
            res.send({ 'message': 'user add successfully' })
        )
    })    
})


app.listen(3000)