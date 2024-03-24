const  express = require('express');
const router = express.Router();

const courses = [
    {id: 1, name: 'CMP400'},
    {id: 2, name: 'CMP401'},
    {id: 3, name: 'CMP403'},
];

app.get('/', (req,res)=>{
    res.send(courses);
});

app.post('/', (req,res)=>{
    const {error} = validateCourse(req.body); //since we are only interested in the error property we can do object destructuring {error} this gives us the error value
    if(error){
    return  res.status(400).send(error.details[0].message);
    }


    //here we create a new course object
    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course); 
})

app.put('/:id', (req,res)=>{
    //look up the course
    //if it doesnt exist 404
    const course = courses.find(c=> c.id === parseInt(req.params.id));
    if(!course){
        res.status(404).send("CourseId doesnt exist");
    }

    //validation
    //if invalid
//we validate the entire request body not just the name even if we only have a name in this case
    const {error} = validateCourse(req.body); //since we are only interested in the error property we can do object destructuring {error} this gives us the error value
    if(error){
     return   res.status(400).send(error.details[0].message);
    }

    //update course
    course.name = req.body.name;
    //send the updated course
    res.send(course);
});

app.delete('/:id', (req,res)=>{
const course =  courses.find(c=> c.id == parseInt(req.params.id));
if(!course){
  return  res.status(404).send("Course with given ID does not exists.");
}  
const index =  courses.indexOf(course);
courses.splice(index,1);
res.send(course);
});

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course,schema);

}

app.get('/:id',(req,res)=>{
    //req.params.id returns a string and we are dealing with int
    //so we have to parse it
  const course =  courses.find(c=> c.id === parseInt(req.params.id));
  if(!course){
  return  res.status(404).send("The given courseId wasnt found"); 
  }
  res.send(course);
});

module.exports = router;