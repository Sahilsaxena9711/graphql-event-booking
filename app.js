const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolver');
const isAuth = require('./middleware')

const app = express();

app.use(bodyParser.json());

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Auth' );
    if(req.method == 'OPTIONS'){
        return res.sendStatus(200); 
    }
    next();
})

app.use(isAuth);

app.use('/graphql', graphqlHttp({
    graphiql: true,
    schema: graphqlSchema,
    rootValue: graphqlResolver
}));

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@graphql-zbsbe.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
)
.then(() => {
    app.listen(8000)
}).catch(e => {
    console.log(e)
})

