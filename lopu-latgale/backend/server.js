const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const tasks = {
  team1: [{ id: 1, name: 'Task 1', locked: true }, { id: 2, name: 'Task 2', locked: false }],
  team2: [{ id: 3, name: 'Task 3', locked: true }, { id: 4, name: 'Task 4', locked: false }],
};

app.get('/api/tasks', (req, res) => {
  const team = req.query.team;
  res.json(tasks[team] || []);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
