const express = require('express')
const fs = require('fs')
const lodash = require('lodash');
const bodyParser = require('body-parser');


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
        const user = lodash.find(json, (item) => (item.id == req.params.id))
        !user ? res.send({ 'message': 'user not found' }) : res.send(user)
    })
})


app.post('/add', (req, res) => {
    (async () => {
        const name = req.body.name
        const password = req.body.password
        const profession = req.body.profession
        const users = fs.readFileSync('userList.json')
        const json = JSON.parse(users)
        var usersList = json
        const lastUser = lodash.last(json)
        const existingName = lodash.find(usersList, (item) => (item.name == req.body.name))
        if (existingName) {
            res.send({ 'message': 'user already exist' })
        } else {
            usersList.push({ "id": lastUser.id + 1, "name": name, "password": password, "profession": profession })
            fs.writeFile('userList.json', JSON.stringify(usersList), (err) => {
                err ? res.send({ 'message': 'add user fail' }) : res.send({ 'message': 'add user success' })
            })
        }
    })()
})


app.delete('/delete/:id', (req, res) => {
    const users = fs.readFileSync('userList.json')
    var json = JSON.parse(users)
    const user = lodash.find(json, (item) => (item.id == req.params.id))
    if (!user) {
        res.send({ 'message': 'user not found' })
    } else {
        json.splice(json.indexOf(user), 1)
        fs.writeFile('userList.json', JSON.stringify(json), (err) => {
            err ? res.send({ 'message': 'delete user fail' }) : res.send({ 'message': 'delete user success' })
        })

    }

})


app.listen(3000)