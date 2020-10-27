const express = require("express");
const cors = require("cors");

const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(request, response, next) {
  const { id } = request.params;
  if (!validate(id)) {
    return response.status(400).json({ error: "Invalid repository id." });
  }
  return next();
}
app.use("/repositories/:id", validateId);

app.get("/repositories", (_request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);
  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );
  if (repositoryIndex >= 0) {
    const { likes } = repositories[repositoryIndex];
    const repository = { id, title, url, techs, likes };
    repositories[repositoryIndex] = repository;
    return response.json(repository);
  } else {
    return response.status(404).json({ error: "Repository not found." });
  }
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );
  if (repositoryIndex >= 0) {
    repositories.splice(repositoryIndex, 1);
    return response.status(204).json();
  } else {
    return response.status(404).json({ error: "Repository not found." });
  }
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );
  if (repositoryIndex >= 0) {
    const repository = repositories[repositoryIndex];
    repository.likes++;
    return response.json(repository);
  } else {
    return response.status(404).json({ error: "Repository not found." });
  }
});

module.exports = app;
