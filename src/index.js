const express = require('express');
const cors = require('cors');
const { v4 : uuidv4 , validate} = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

function logRequests(request, response, next){
    const { method, url } = request;

    const logMethodUrl = `[${method.toUpperCase()}] ${url}`;

    console.log(logMethodUrl);

    return next(); //sem o next(), a próxima requisição não é chamada
}

function validateBlogId(request, response, next){
    const { id } = request.params;
    //console.log("ID: " + id);
    if(!validate(id)){
        return response.status(400).json({ error: 'Invalid Blog ID!' });
    }
    
    return next();
}

app.use(logRequests);
app.use('/blogs/:id', validateBlogId);
const blogs = [{"id": "513eb15b-5975-4188-8dc7-754e2325c59c", "title": "Title lorem ipsum", "snippet": "Snippet lorem ipsum", "text": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laudantium est ducimus dicta recusandae harum neque maxime ullam omnis facere blanditiis dolorem quisquam inventore amet, delectus possimus sapiente veniam voluptas eligendi voluptatem illum? Vitae est dicta perferendis quod inventore officiis similique."}];

app.get('/blogs', (request, response) => {
    const { title } = request.query;
    
    const results = title
        ? blogs.filter(blog => blogs.title.includes(title))
        : blogs;

    return response.json(results);
});

app.post('/blogs', (request, response) => {
    const { title, snippet, text } = request.body; 

    const blog = {id: uuidv4(), title, snippet, text};
    //console.log(blog);
    blogs.push(blog);

    return response.json(blogs);
});

app.put('/blogs/:id', validateBlogId ,(request, response) => {
    const { id } = request.params;
    const { title, snippet, text } = request.body;

    //encontra objeto a ser atualizado
    const blogIndex = blogs.findIndex(blog => blog.id === id);
    
    if(blogIndex < 0){
        return response.status(400).json({error: 'Blog not found.'});
    }
    
    //novo objeto
    const blog = {
        id,
        snippet,
        text,
    };

    console.log(id, snippet, text);

    //substitui objeto
    blogs[blogIndex] = blog;

    return response.json(blog);
});

app.delete('/blogs/:id', (request, response) => {
    const { id } = request.params;

    const blogIndex = blogs.findIndex(blog => blog.id === id);

    if(blogIndex < 0){
        return response.status(400).json({error: 'Blog not found.'});
    }

    blogs.splice(blogIndex, 1);
    
    return response.status(204).send();
});

app.listen(3333, () => {
    console.log("🚀Server started.")
});
