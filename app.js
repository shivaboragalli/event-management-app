const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose')
const graphQlSchema = require('./graphql/schema/index')
const graphQlResolvers = require('./graphql/resolvers/index')
const isAuth = require('./middleware/is-auth')
const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Controll-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
})
app.use(isAuth)
//graphqlHttp middleware function 
app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    // real endpoints where it can find schema
    //schema key needs to be present
    //query ->fetch data
    //mutation ->change data (create,update,delete)
    //RootQuery will define different real endpoint we support for incoming query
    //rootValue has all resolver functions should match schema endpoint by name
    rootValue: graphQlResolvers,
    graphiql: true
}))
var pw = encodeURIComponent(process.env.MONGO_PASSWORD)
console.log(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-6dqv5.mongodb.net/${process.env.MONGO_DB}`)
mongoose.connect(
        `mongodb+srv://${process.env.MONGO_USER}:${pw}@cluster0-6dqv5.mongodb.net/${process.env.MONGO_DB}`, {
            useNewUrlParser: true,
        })
    .then(() => {
        console.log("connected to graphQl server")
        app.listen(8000);
    }).catch(err => {
        console.log(err);
    })