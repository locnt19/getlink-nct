const logger  = require('morgan');
const express = require('express');
const path = require('path');
const cheerio = require('cheerio');
const favicon = require('serve-favicon');
const axios = require('axios');
const app = express();
const http = require('http').Server(app);

const PORT = process.env.PORT || 3000;

app.use(logger('dev'));
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
app.use(function(req, res) {
  res.status(404).send('Page not Found');
});

// Handle 500
app.use(function(error, req, res, next) {
  res.status(500).send('Internal Server Error');
});


async function getLink(page) {
  let result = {};
  const body = await axios.get(page);
  const $ = cheerio.load(body.data);
  result.title = $('title').text();
  const flashPlayer = $('#flashPlayer').next().html();
  const flashxml = 'https://www.nhaccuatui.com/flash/xml?html5=true&key1=';
  if (flashPlayer.includes(flashxml)) {
    const text = flashPlayer.substring(flashPlayer.indexOf(flashxml));
    const location = text.substring(0, text.indexOf('"'));
    result.location = location;
    const body = await axios.get(location);
    const $ = cheerio.load(body.data);
    const cdata = $('location').html();
    const coverImage = $('coverimage').html();
    // console.log(location);
    result.link = cdata.substring(cdata.indexOf('https'), cdata.indexOf(']'));
    if (coverImage.includes('https')) {
      result.coverImage = coverImage.substring(coverImage.indexOf('https'), coverImage.indexOf(']'));
    } else {
      result.coverImage = '';
    }
  }
  // console.log(result);
  return result;
}


const server = http.listen(PORT, () => {
  console.log(`Server listening on localhost:${PORT}`);
})
