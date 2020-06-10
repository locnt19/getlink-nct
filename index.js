const express = require('express');
const path = require('path');
const cheerio = require('cheerio');
const axios = require('axios');
const app = express();
const http = require('http').Server(app);

const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index.html');
})

const server = http.listen(PORT, () => {
  console.log('Server listening on localhost:3000');
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


async function getLink(page) {
  let link = '';
  const body = await axios.get(page);
  const $ = cheerio.load(body.data);
  const flashPlayer = $('#flashPlayer').next().html();
  const flashxml = 'https://www.nhaccuatui.com/flash/xml?html5=true&key1=';
  if (flashPlayer.includes(flashxml)) {
    const text = flashPlayer.substring(flashPlayer.indexOf(flashxml));
    const location = text.substring(0, text.indexOf('"'));
    const body = await axios.get(location);
    const $ = cheerio.load(body.data);
    const cdata = $('location').html();
    link = cdata.substring(cdata.indexOf('https'), cdata.indexOf(']'));
  }
  return link;
}
