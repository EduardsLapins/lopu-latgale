const path = require("path");
const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");
const fs = require("fs").promises;
const util = require("util");
const mkdir = util.promisify(fs.mkdir);
const access = util.promisify(fs.access);
const pipeline = util.promisify(require("stream").pipeline);

fastify.register(cors, {
    origin: true // Reflect the request origin, or set specific ones you trust
});

// Setup static files for serving the React build
fastify.register(require("@fastify/static"), {
    root: path.join(__dirname, "build"),
    prefix: "/", // optional: default '/'
});


// Ensure directory exists
async function ensureDir(dir) {
    try {
        await access(dir);
    } catch (e) {
        await mkdir(dir, { recursive: true });
    }
}

// Read team tasks from JSON file
async function readTeamTasks(team) {
    const filePath = path.join(__dirname, 'public', 'teams', `${team}.json`);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
}

// Write team tasks to JSON file
async function writeTeamTasks(team, tasks) {
    const filePath = path.join(__dirname, 'public', 'teams', `${team}.json`);
    await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), 'utf8');
}

// API endpoint to get tasks for a team
fastify.get('/api/tasks', async (request, reply) => {
    const team = request.query.team;
    if (!team) {
        return reply.status(400).send({ error: 'Team not specified' });
    }
    try {
        const data = await readTeamTasks(team);
        reply.send(data.tasks);
    } catch (err) {
        reply.status(500).send({ error: 'Error reading tasks' });
    }
});

// API endpoint to get task details for a team
fastify.get('/api/task-details', async (request, reply) => {
    const { team, task } = request.query;
    if (!team || !task) {
        return reply.status(400).send({ error: 'Invalid request' });
    }
    try {
        const taskDir = path.join(__dirname, 'public', 'tasks', 'shared', task);
        const descriptionFile = path.join(taskDir, `${task}.txt`);
        const description = await fs.readFile(descriptionFile, 'utf8');
        const files = await fs.readdir(taskDir);
        const taskFiles = files.filter(file => file !== `${task}.txt`).map(file => ({
            name: file,
            url: `/tasks/shared/${task}/${file}`
        }));

        const teamTasks = await readTeamTasks(team);
        const selectedFile = teamTasks.tasks.find(t => t.name === task)?.selectedFile;

        reply.send({ description, files: taskFiles, selectedFile });
    } catch (err) {
        reply.status(500).send({ error: 'Error reading task details' });
    }
});

// API endpoint to select specific file for a task
fastify.post('/api/select-task-file', async (request, reply) => {
    const { team, task, selectedFile } = request.body;
    if (!team || !task || !selectedFile) {
        return reply.status(400).send({ error: 'Invalid request' });
    }
    try {
        const taskDir = path.join(__dirname, 'public', 'tasks', 'shared', task);
        const files = await fs.readdir(taskDir);
        const validFile = files.includes(selectedFile);
        if (!validFile) {
            return reply.status(400).send({ error: 'Invalid file selected' });
        }
        const teamTasks = await readTeamTasks(team);
        const taskIndex = teamTasks.tasks.findIndex(t => t.name === task);
        if (taskIndex === -1) {
            teamTasks.tasks.push({ name: task, locked: true, selectedFile });
        } else {
            teamTasks.tasks[taskIndex].selectedFile = selectedFile;
        }
        await writeTeamTasks(team, teamTasks);
        reply.send({ status: 'Task file selected successfully' });
    } catch (err) {
        reply.status(500).send({ error: 'Error selecting task file' });
    }
});

// Catch-all route to support client-side routing in React
fastify.setNotFoundHandler((request, reply) => {
    if (request.method === 'GET') {
        reply.sendFile('index.html');
    } else {
        reply.status(404).send('Not Found');
    }
});

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
