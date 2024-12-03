const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database('./database.db');

db.serialize(function() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL
    );
  `);

  db.run(`
    INSERT INTO users (name, email) VALUES ('Juan Pérez', 'juan@example.com');
  `);
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener usuarios' });
    } else {
      const users = rows.map((row) => ({ id: row.id, name: row.name, email: row.email }));
      res.json(users);
    }
  });
});

app.post('/users', (req, res) => {
  const { name, email } = req.body;
  db.run(`
    INSERT INTO users (name, email) VALUES (?, ?);
  `, [name, email], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al agregar usuario' });
    } else {
      res.json({ message: 'Usuario agregado con éxito' });
    }
  });
});

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  db.run(`
    UPDATE users SET name = ?, email = ? WHERE id = ?;
  `, [name, email, id], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al actualizar usuario' });
    } else {
      db.get(`
        SELECT * FROM users WHERE id = ?;
      `, [id], (err, row) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'Error al obtener usuario actualizado' });
        } else {
          res.json({ message: 'Usuario actualizado con éxito', user: row });
        }
      });
    }
  });
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  db.run(`
    DELETE FROM users WHERE id = ?;
  `, [id], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al eliminar usuario' });
    } else {
      res.json({ message: 'Usuario eliminado con éxito' });
    }
  });
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
