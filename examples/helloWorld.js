// Example Application for Frame.io's custom action feature.  

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// GET is not used with custom actions, but tools like Glitch or Postman are often set to try a GET request.
// This is provided so you don't receive a 'Can't GET' notification.

app.get('/', function (req, res) {
  res.end('Hello World');
});

// Send a POST request to /actions to create a form in the Frame.io web app

app.post('/actions', function (req, res) {
  if (req.body.data) {
    const { name, color } = req.body.data;

    res.json({
      title: '🎉 Success!',
      description: `Hi there ${name}! Your favorite color is ${color}.`,
    });
    return;
  }

  res.json({
    title: 'Hello World!',
    description: 'Tell me about yourself!',
    fields: [
      {
        type: 'text',
        name: 'name',
        label: 'Name',
      },
      {
        type: 'select',
        name: 'color',
        label: 'Favorite Color',
        options: [
          {
            name: 'Blue',
            value: 'blue',
          },
          {
            name: 'Red',
            value: 'red',
          },
        ],
      },
    ],
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
