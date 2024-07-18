const express = require("express");
const consolidate = require('consolidate');

const app = express();
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views/`);

const citeRouter = require('./Router');

app.use(citeRouter);

app.listen(3000, ()=>console.log("Сервер запущен..."));
