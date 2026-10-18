const express = require('express');
const app = express();

const users = {
  // 1: { id: 1, name: 'Alice', email: 'alice@example.com' },
  1: { id: 1, fullName: 'Alice', email: 'alice@example.com' },
};

app.get('/users/:id', (req, res) => {
  const user = users[req.params.id];
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

module.exports = app;