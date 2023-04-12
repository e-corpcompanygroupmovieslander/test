const express = require('express')
var fs = require('fs');

const app = express()
app.use(express.static(`public`))
app.use(express.json());
const port = 3000

app.get('/', (req, res) => res.sendFile('public/index.html',{root:__dirname}))

app.post('/', (req, res) => {
    const data = req.body;
  
    fs.readFile('public/JSON/users.json', (err, fileData) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // File doesn't exist, so create it
          const initialData = [];
          fs.writeFile('public/JSON/users.json', JSON.stringify(initialData, null, 2), (err) => {
            if (err) {
              console.error(err);
              res.status(500).json({ message: 'An error occurred while processing the form.' });
              return;
            }
  
            addUser(data, res);
          });
        } else {
          console.error(err);
          res.status(500).json({ message: 'An error occurred while processing the form.' });
          return;
        }
      } else {
        const users = JSON.parse(fileData);
  
        const existingUser = users.find(user => user.email === data.email);
        if (existingUser) {
          res.json({ message: 'User already exists.' });
        } else {
          addUser(data, res);
        }
      }
    });
  });
  
  function addUser(data, res) {
    fs.readFile('public/JSON/users.json', (err, fileData) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while processing the form.' });
        return;
      }
  
      const users = JSON.parse(fileData);
      users.push(data);
  
      fs.writeFile('public/JSON/users.json', JSON.stringify(users, null, 2), (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'An error occurred while processing the form.' });
          return;
        }
  
        res.json({ message: 'User added successfully.' });
      });
    });
  }

app.listen(port, () => console.log(`Example app listening on port ${port}!`))




