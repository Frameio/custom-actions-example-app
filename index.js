const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/', function (req, res) {
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
