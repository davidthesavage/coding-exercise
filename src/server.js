var express = require('express'),
    fs = require('fs'),
    config = require('./config'),
    app = express();

// Set global view engine to jade and configure static asset folder
app.set('view engine', 'jade');
app.use(express.static('dist'));

// Base template for UI
app.get('/', (req, res) => {
  res.render('index');
});

// Returns a list of the chapter files found in data/txt
app.get('/chapters', (req, res) => {
  fs.readdir('data/txt', (err, files) => {
    // Map filenames to chapter numbers
    const chapters = files.map((item, index) => item.replace(/\D/g, ''));
    res.send(chapters);
  });
});

// Returns a specific chapter and any annotations (if available)
app.get('/chapter/:number', (req, res) => {
  fs.readFile(`data/txt/ch${req.params.number}.txt`, 'utf8', (err, text) => {
    fs.readFile(`data/xml/ch${req.params.number}.txt.xml`, 'utf8', (error, annotations) => {
      res.send({ text, annotations });
    });
  });
});

// Start an http server on configured port
app.listen(config.port, () => console.log(`Coding exercise express server listening on port ${config.port}`));