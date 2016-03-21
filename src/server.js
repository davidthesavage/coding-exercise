var express = require('express'),
    fs = require('fs'),
    config = require('./config'),
    parseXML = require('xml2js').parseString,
    cleanXML = require('./cleanXML'),
    app = express();

// Set global view engine to jade and configure static asset folder
app.set('view engine', 'jade');
app.use(express.static('dist'));

// Use a catch-all error handler for any server side errors that occur from client requests
const sendError = (error, res) => {
  res.status(500);
  res.send({ error });
};

// Base template for UI
app.get('/', (req, res) => {
  res.render('index');
});

// Returns a list of the chapter files found in data/txt
app.get('/chapters', (req, res) => {
  fs.readdir('data/txt', (err, files) => {
    if (err) {
      return sendError(err, res);
    }

    // Map filenames to chapter numbers
    const chapters = files.map((item, index) => item.replace(/\D/g, ''));
    res.send(chapters);
  });
});

// Returns a specific chapter and any annotations (if available)
app.get('/chapter/:number', (req, res) => {
  // Load the chapter text file in utf8 format
  fs.readFile(`data/txt/ch${req.params.number}.txt`, 'utf8', (err, text) => {
    if (err) {
      return sendError(err, res);
    }

    // Format two newlines in a row to be a <br /> to aid in readability
    const formattedText = text.replace(/(?:\n\n)/g, '<br /><br />');

    // Load the annotation file (if it exists)
    // The callback will still be fired and annotations will be null if file is not present
    fs.readFile(`data/xml/ch${req.params.number}.txt.xml`, 'utf8', (error, annotations) => {
      // Handle errors other than unable to open the xml file as it is expected to sometimes be missing
      if (error && error.code !== 'ENOENT') {
        return sendError(error, res);
      }

      // If we have annotations for this chapter, convert the XML to a useable JSON format and return with the chapter text
      if (annotations) {
        parseXML(annotations, (err, result) => {
          annotations = cleanXML(result);
          res.send({ text, formattedText, annotations });
        });
      } else {
        res.send({ text, formattedText });
      }
    });
  });
});

// Start an http server on configured port
app.listen(config.port, () => console.log(`Coding exercise express server listening on port ${config.port}`));