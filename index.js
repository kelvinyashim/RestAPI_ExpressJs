const config = require('config');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const log = require('./middleware/logger');//custom middleware
const helmet = require('helmet');//3rd party middleware
const morgan = require('morgan');//3rd party middleware
const Joi = require('joi');

const courses = require('./routes/courses');
const home = require('./routes/homepage');
const  express = require('express');
const app = express();

app.set('view engine','pug');


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/courses', courses);
app.use('/', home);

//Configuration
console.log(`Application name: ${config.get('name')}`);
console.log(`Mail name: ${config.get('mail.host')}`);
console.log(`Mail password: ${config.get('mail.password')}`);


if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    startupDebugger("Logging enabled in dev mode");
}

//db
dbDebugger("Database is up and runnning");
app.use(log);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});