const express = require('express');
const path = require('path');
const cheerio = require('cheerio');
const favicon = require('serve-favicon');
const axios = require('axios');
const app = express();
const http = require('http').Server(app);

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));

// routes
app.get('/', (req, res) => {
  res.render('index.html');
})

app.post('/api/get-link', async (req, res) => {
  let page = req.body.linkNCT;
  try {
    let done = await getLink(page);
    res.send(done);
  } catch (error) {
    res.send();
  }
});

// Handle 404
app.use(function (req, res) {
  res.status(404).send('Page not found.');
});

// Handle 500
app.use(function (error, req, res, next) {
  res.status(500).send('Internal Server Error');
});


async function getLink(page) {
  let result = {
    title: '',
    coverImage: '',
    link: '',
    message: ''
  };
  let body = await axios.get(page);
  let $ = cheerio.load(body.data);
  const flashPlayer = $('#box_playing_id').html();
  const flashxml = 'https://www.nhaccuatui.com/flash/xml?html5=true&key1=';
  result.title = $('title').text();
  // result.flashPlayer = flashPlayer;

  // Copyright in your country
  if ($('.txt-alert-universal').text().length > 0) {
    result.message = $('.txt-alert-universal').text();
    return result;
  };
  if (flashPlayer.indexOf(flashxml) !== -1) {
    const text = flashPlayer.substring(flashPlayer.indexOf(flashxml));
    const location = text.substring(0, text.indexOf('"'));
    body = await axios.get(location);
    $ = cheerio.load(body.data);
    const cdata = $('location').html();
    const coverImage = $('coverimage').html();
    result.link = cdata.substring(cdata.indexOf('https'), cdata.indexOf(']'));
    if (coverImage.indexOf('https') !== -1) {
      result.coverImage = coverImage.substring(coverImage.indexOf('https'), coverImage.indexOf(']'));
    }
  }
  return result;
}


const server = http.listen(PORT, () => {
  console.log(`Server listening on port:${PORT}`);
})
