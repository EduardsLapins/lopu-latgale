const path = require("path");
const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");
const fs = require("fs");
const util = require("util");
const mkdir = util.promisify(fs.mkdir);
const access = util.promisify(fs.access);
const pipeline = util.promisify(require("stream").pipeline);

fastify.register(cors, {
    origin: true // Reflect the request origin, or set specific ones you trust
});

// Setup static files
fastify.register(require("@fastify/static"), {
    root: path.join(__dirname, "build"),
    prefix: "/", // optional: default '/'
});

// Register multipart plugin for file uploads
fastify.register(require("@fastify/multipart"));

// Parse incoming forms
fastify.register(require("@fastify/formbody"));

// Register point-of-view for templating
fastify.register(require("@fastify/view"), {
    engine: {
        handlebars: require("handlebars"),
    },
});

// Sample tasks for teams
const tasks = {
    Beka_Beha: [
        { id: 1, name: 'Task 1', locked: false },
        { id: 2, name: 'Task 2', locked: true }
    ],
    Karla_Kariete: [
        { id: 3, name: 'Task 3', locked: false },
        { id: 4, name: 'Task 4', locked: true }
    ],
    Ievas_Jetta: [
        { id: 5, name: 'Task 5', locked: false },
        { id: 6, name: 'Task 6', locked: true }
    ]
};

// API endpoint to get tasks for a team
fastify.get('/api/tasks', (request, reply) => {
    const team = request.query.team;
    if (!team || !tasks[team]) {
        return reply.status(400).send({ error: 'Invalid team specified' });
    }
    reply.send(tasks[team]);
});

// File upload endpoint for specific tasks
fastify.post('/upload', async (req, reply) => {
    const data = await req.file();
    const team = req.query.team;
    const task = req.query.task;

    if (!team || !task) {
        return reply.status(400).send({ error: 'Team or task not specified' });
    }

    const uploadDir = path.join(__dirname, 'uploads', team, task);
    await ensureDir(uploadDir);

    const filePath = path.join(uploadDir, data.filename);
    await pipeline(data.file, fs.createWriteStream(filePath));

    reply.send({ status: 'File uploaded successfully' });
});

// Catch-all route to support client-side routing in React
fastify.setNotFoundHandler((request, reply) => {
    if (request.method === 'GET') {
        reply.sendFile('index.html');
    } else {
        reply.status(404).send('Not Found');
    }
});

// Ensure directory exists
async function ensureDir(dir) {
    try {
        await access(dir);
    } catch (e) {
        await mkdir(dir, { recursive: true });
    }
}

// Start the server
fastify.listen(
    { port: process.env.PORT || 3000, host: "0.0.0.0" },
    function (err, address) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Server listening on ${address}`);
    }
);
