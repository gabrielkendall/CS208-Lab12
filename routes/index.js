var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  try {
    req.db.query('SELECT * FROM todos;', (err, results) => {
      if (err) {
        console.error('Error fetching todos:', err);
        return res.status(500).send('Error fetching todos');
      }

      res.render('index', {
        title: 'TODO List Maker',
        todos: results,
        errorMessage: null
      });
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
});

// Create Task in DB
router.post('/create', function(req, res, next) {
  const task = req.body.task ? req.body.task.trim() : '';

  // Through error if field is all white space
  if (!task) {
    req.db.query('SELECT * FROM todos;', (err, results) => {
      if (err) {
        console.error('Error fetching todos:', err);
        return res.status(500).send('Error fetching todos');
      }

      return res.status(400).render('index', {
        title: 'TODO List Maker',
        todos: results,
        errorMessage: 'Task cannot be blank.'
      });
    });
    return;
  }

  // additional error handeling for if inster fails
  try {
    req.db.query(
      'INSERT INTO todos (task, completed) VALUES (?, 0);',
      [task],
      (err, results) => {
        if (err) {
          console.error('Error adding todo:', err);
          return res.status(500).send('Error adding todo');
        }

        console.log('Todo added successfully:', results);
        res.redirect('/');
      }
    );
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).send('Error adding todo');
  }
});

// Update Task in DB
router.post('/update', function(req, res, next) {
  const { id } = req.body;
  const task = req.body.task ? req.body.task.trim() : '';
  const completed = req.body.completed === '1' ? 1 : 0;

  // Through error if field is all white space
  if (!task) {
    req.db.query('SELECT * FROM todos;', (err, results) => {
      if (err) {
        console.error('Error fetching todos:', err);
        return res.status(500).send('Error fetching todos');
      }

      return res.status(400).render('index', {
        title: 'TODO List Maker',
        todos: results,
        errorMessage: 'Task cannot be blank.'
      });
    });
    return;
  }

  // additional error handeling for if inster fails
  try {
    req.db.query(
      'UPDATE todos SET task = ?, completed = ? WHERE id = ?;',
      [task, completed, id],
      (err, results) => {
        if (err) {
          console.error('Error updating todo:', err);
          return res.status(500).send('Error updating todo');
        }

        console.log('Todo updated successfully:', results);
        res.redirect('/');
      }
    );
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).send('Error updating todo');
  }
});

// Delete Task from DB
router.post('/delete', function(req, res, next) {
  const { id } = req.body;

  try {
    req.db.query('DELETE FROM todos WHERE id = ?;', [id], (err, results) => {
      if (err) {
        console.error('Error deleting todo:', err);
        return res.status(500).send('Error deleting todo');
      }

      console.log('Todo deleted successfully:', results);
      res.redirect('/');
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).send('Error deleting todo');
  }
});

module.exports = router;