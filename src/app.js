const express = require("express");
const cors = require("cors");

const { celebrate, Segments, Joi } = require('celebrate')
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/**
 * Rota que lista todos os repositórios
 */
app.get("/repositories", (request, response) => {
    return response.json(repositories)
});

/**
 * Deve receber title, url e techs dentro do corpo da requisição, sendo a URL o 
 * link para o github desse repositório. Ao cadastrar um novo projeto, ele deve 
 * ser armazenado dentro de um objeto no seguinte formato: 
 * 	{ 
 * 		id: "uuid",
 * 		title: 'Desafio Node.js',
 * 		url: 'http://github.com/...',
 * 		techs: ["Node.js", "..."],
 * 		likes: 0
 * 	}; 
 * Certifique-se que o ID seja um UUID, e de sempre iniciar os likes como 0.
 */
app.post("/repositories", celebrate({
    [Segments.BODY]: Joi.object().keys({
        title: Joi.string().required(),
        url: Joi.string().required(),
        techs: Joi.array()
    })
}), (request, response) => {
    const { title, url, techs } = request.body

    const repository = {
        id: uuid(),
        title,
        url,
        techs,
        likes: 0
    }

    repositories.push(repository)

    return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  // TODO
});

app.delete("/repositories/:id", (request, response) => {
  // TODO
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
});

module.exports = app;
