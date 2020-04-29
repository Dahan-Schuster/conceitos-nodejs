const express = require("express");
const cors = require("cors");

const { celebrate, Segments, Joi } = require('celebrate')
const { uuid, isUuid } = require("uuidv4");

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


/**
 * Deve alterar apenas o title, a url e as techs do repositório que possua o id 
 * igual ao id presente nos parâmetros da rota
 */
app.put("/repositories/:id", celebrate({
    [Segments.BODY]: Joi.object().keys({
        title: Joi.string(),
        url: Joi.string(),
		techs: Joi.array(),
		likes: Joi.invalid()
    })
}), (request, response) => {
	const { title, url, techs } = request.body
	const { id } = request.params

	if (!isUuid(id)) {
		return response.status(400).json({ error: 'ID inválido' })
	}

	const repositoryIndex = repositories
		.findIndex(repository => repository.id === id)

	if (repositoryIndex < 0) {
		return response.status(400).json({
			error: 'Nenhum repositório encontrado com o ID enviado'
		})

	}

	const oldRepository = repositories[repositoryIndex]

	const newRepository = {
		id,
		title: title ? title : oldRepository.title,
		url: url ? url : oldRepository.url,
		techs: techs ? techs : oldRepository.techs,
		likes: oldRepository.likes
	}

	repositories[repositoryIndex] = newRepository

	return response.json(newRepository)
});


/**
 * Deve deletar o repositório com o id presente nos parâmetros da rota
 */
app.delete("/repositories/:id", (request, response) => {
	const { id } = request.params

	if (!isUuid(id)) {
		return response.status(400).json({ error: 'ID inválido' })
	}

	const repositoryIndex = repositories
		.findIndex(repository => repository.id === id)

	if (repositoryIndex < 0) {
		return response.status(400).json({
			error: 'Nenhum repositório encontrado com o ID enviado'
		})
	}

	repositories.splice(repositoryIndex, 1)

	return response.status(204).send()
});


/**
 * Deve aumentar o número de likes do repositório específico escolhido através 
 * do id presente nos parâmetros da rota, a cada chamada dessa rota, o número 
 * de likes deve ser aumentado em 1
 */
app.post("/repositories/:id/like", (request, response) => {
	const { id } = request.params

	if (!isUuid(id)) {
		return response.status(400).json({ error: 'ID inválido' })
	}

	const repositoryIndex = repositories
		.findIndex(repository => repository.id === id)

	if (repositoryIndex < 0) {
		return response.status(400).json({
			error: 'Nenhum repositório encontrado com o ID enviado'
		})
	}

	repositories[repositoryIndex].likes++

	return response.json(repositories[repositoryIndex])
});

module.exports = app;
