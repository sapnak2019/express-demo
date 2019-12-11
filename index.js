const Joi = require('joi');

const logger = require('./loggerMiddlewareFunction');
                          

const express = require('express');

const app = express();

app.use(express.json());

app.use(function(req,resp, next){
    console.log("Logging");
    next();
});

app.use(logger);

const courses = [
    { id:1, name: 'course1' },
    { id:2, name: 'course2' },
    { id:3, name: 'course3' },
    { id:4, name: 'course4' },
    { id:5, name: 'course5' }
];

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port... ${port} `));


app.get('/',(req,res) => {
    res.send('Hello World');
});


app.get('/api/courses',(req,res) => {
    //res.send('Hello World');
    res.send(courses);
});


app.get('/api/courses/:id',(req,res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course)//404
    {
       return  res.status(404).send('The course with the given id was not found');
    }
    res.send(course);
    
})

app.post('/api/courses', (req,res) => {
   
    const result = validateNameInCourse(req.body);

    if(result.error){
        return res.status(400).send(result.error.details[0].message);       
    }
   
    const course = {        
        id: courses[courses.length-1].id + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});


app.put('/api/courses/:id', (req,res) => {
    
    //check if id exist to update else send 404 not found error
    
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course)//404
    {
        return res.status(404).send('The course with the given id was not found');
    }
    
    //validate if name exist as per requirement else send 400 bad req error

    const result = validateNameInCourse(req.body);
    //or const {error} = validateNameInCourse(req.body);

    if(result.error){//or if(error){
        return res.status(400).send(result.error.details[0].message);
    }

    //if all ok.... update the record and send resp.
    course.name = req.body.name;
    res.send(course);

});

app.delete('/api/courses/:id', (req,res) => {
    //check is given course id exist to delete else return not found 404 error
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course)//404
    {
        return res.status(404).send('The course with the given id was not found');
    }

    //get the index of the given id in courses array
    //remove that id data from courses array

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    //send the course in response
    res.send(course);
});

function validateNameInCourse (course){
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
    //console.log(result);
};


//without query string
app.get('/api/posts/:year/:month',(req,res) => {
    res.send(req.params);
})
//or for query string
//http://localhost:3000/api/postsQuery/2019/10?sortBy=name
app.get('/api/postsQuery/:year/:month',(req,res) => {
    res.send(req.query);
});

