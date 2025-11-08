// 1. Importar dependencias
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Configurar middleware para que Express pueda leer cuerpos de solicitud JSON
app.use(bodyParser.json());

// Ruta de Bienvenida (Home) para evitar el error "Cannot GET /"
app.get('/', (req, res) => {
    res.status(200).send(`
        <h1>🚀 Servidor API de Proyectos Activo</h1>
        <p>El servidor está funcionando. Para acceder a la API, usa la URL base: 
        <strong>/api/v1/projects</strong>, <strong>/api/v1/tasks</strong>, etc.</p>
        <p>Asegúrate de usar herramientas como Postman o Insomnia para probar los endpoints.</p>
    `);
});

// Definición de la URL base
const BASE_URL = '/api/v1';

// --- Base de Datos en Memoria (Arreglos) ---

// Contadores para asignar IDs únicos automáticamente
let projectIdCounter = 2; 
let taskIdCounter = 2;
let peopleIdCounter = 2;

// Datos iniciales para que las pruebas no estén vacías
let projects = [
    { "id": 1, "name": "Plataforma educativa", "description": "Sistema de cursos online" }
];
let tasks = [
    { "id": 1, "title": "Diseñar UI", "description": "Pantalla principal", "status": "todo", "projectID": 1, "assignedTo": 1 }
];
let people = [
    { "id": 1, "name": "James Montealegre", "email": "james@correo.com", "role": "Lider tecnico" }
];
// --- Endpoints para PROJECTS ---

// 1. GET /api/v1/projects (Lista todos)
app.get(`${BASE_URL}/projects`, (req, res) => {
    res.json(projects);
});

// 2. GET /api/v1/projects/:id (Obtiene uno)
app.get(`${BASE_URL}/projects/:id`, (req, res) => {
    const id = parseInt(req.params.id);
    const project = projects.find(p => p.id === id);
    if (project) {
        res.json(project);
    } else {
        res.status(404).json({ message: "Proyecto no encontrado" });
    }
});

// 3. POST /api/v1/projects (Crea uno)
app.post(`${BASE_URL}/projects`, (req, res) => {
    const newProject = req.body;
    if (!newProject.name) { // Validación básica
        return res.status(400).json({ message: "El nombre es obligatorio." });
    }
    newProject.id = projectIdCounter++;
    projects.push(newProject);
    res.status(201).json({ message: "Proyecto creado", project: newProject });
});

// 4. PUT /api/v1/projects/:id (Actualiza uno)
app.put(`${BASE_URL}/projects/:id`, (req, res) => {
    const id = parseInt(req.params.id);
    const index = projects.findIndex(p => p.id === id);

    if (index !== -1) {
        // Combina el proyecto existente con los datos del body (req.body)
        projects[index] = { ...projects[index], ...req.body, id: id };
        res.json({ message: "Proyecto actualizado", project: projects[index] });
    } else {
        res.status(404).json({ message: "Proyecto no encontrado" });
    }
});

// 5. DELETE /api/v1/projects/:id (Elimina uno)
app.delete(`${BASE_URL}/projects/:id`, (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = projects.length;
    
    // Filtra para crear un nuevo arreglo sin el proyecto eliminado
    projects = projects.filter(p => p.id !== id);

    if (projects.length < initialLength) {
        // También eliminar tareas asociadas para simular integridad referencial
        tasks = tasks.filter(t => t.projectID !== id); 
        res.json({ message: "Proyecto eliminado" });
    } else {
        res.status(404).json({ message: "Proyecto no encontrado" });
    }
});

// --- Endpoints para TASKS ---

// 6. GET /api/v1/tasks (Lista todas)
app.get(`${BASE_URL}/tasks`, (req, res) => {
    res.json(tasks);
});

// 7. GET /api/v1/tasks/:id (Obtiene una)
app.get(`${BASE_URL}/tasks/:id`, (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (task) {
        res.json(task);
    } else {
        res.status(404).json({ message: "Tarea no encontrada" });
    }
});

// 8. POST /api/v1/tasks (Crea una)
app.post(`${BASE_URL}/tasks`, (req, res) => {
    const newTask = req.body;
    if (!newTask.title || !newTask.projectID) {
        return res.status(400).json({ message: "Título y projectID son obligatorios." });
    }
    newTask.id = taskIdCounter++;
    newTask.status = newTask.status || "todo"; // Establece 'todo' si no se especifica
    tasks.push(newTask);
    res.status(201).json({ message: "Tarea creada", task: newTask });
});

// 9. PUT /api/v1/tasks/:id (Actualiza una)
app.put(`${BASE_URL}/tasks/:id`, (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(t => t.id === id);

    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...req.body, id: id };
        res.json({ message: "Tarea actualizada", task: tasks[index] });
    } else {
        res.status(404).json({ message: "Tarea no encontrada" });
    }
});

// 10. DELETE /api/v1/tasks/:id (Elimina una)
app.delete(`${BASE_URL}/tasks/:id`, (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = tasks.length;
    tasks = tasks.filter(t => t.id !== id);

    if (tasks.length < initialLength) {
        res.json({ message: "Tarea eliminada" });
    } else {
        res.status(404).json({ message: "Tarea no encontrada" });
    }
});

// --- Endpoints para PEOPLE ---

// 11. GET /api/v1/people (Lista todas)
app.get(`${BASE_URL}/people`, (req, res) => {
    res.json(people);
});

// 12. GET /api/v1/people/:id (Obtiene una)
app.get(`${BASE_URL}/people/:id`, (req, res) => {
    const id = parseInt(req.params.id);
    const person = people.find(p => p.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).json({ message: "Persona no encontrada" });
    }
});

// 13. POST /api/v1/people (Crea una)
app.post(`${BASE_URL}/people`, (req, res) => {
    const newPerson = req.body;
    if (!newPerson.name || !newPerson.email) {
        return res.status(400).json({ message: "Nombre y email son obligatorios." });
    }
    newPerson.id = peopleIdCounter++;
    people.push(newPerson);
    res.status(201).json({ message: "Persona creada", person: newPerson });
});

// 14. PUT /api/v1/people/:id (Actualiza una)
app.put(`${BASE_URL}/people/:id`, (req, res) => {
    const id = parseInt(req.params.id);
    const index = people.findIndex(p => p.id === id);

    if (index !== -1) {
        people[index] = { ...people[index], ...req.body, id: id };
        res.json({ message: "Persona actualizada", person: people[index] });
    } else {
        res.status(404).json({ message: "Persona no encontrada" });
    }
});

// 15. DELETE /api/v1/people/:id (Elimina una)
app.delete(`${BASE_URL}/people/:id`, (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = people.length;
    people = people.filter(p => p.id !== id);

    if (people.length < initialLength) {
        // También reasignar o eliminar tareas donde la persona era assignedTo
        tasks.forEach(t => {
            if (t.assignedTo === id) {
                t.assignedTo = null; // O -1, o reasignar
            }
        });
        res.json({ message: "Persona eliminada" });
    } else {
        res.status(404).json({ message: "Persona no encontrada" });
    }
});

// --- Inicio del Servidor ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Base URL: ${BASE_URL}`);
});
