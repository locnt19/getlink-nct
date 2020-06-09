const request = require('request');
const cheerio = require('cheerio');

let page = 'https://www.nhaccuatui.com/bai-hat/tinh-sau-thien-thu-muon-loi-vo-dinh-hieu.wVx961NiDHqY.html';
let location = '';
let download = '';

// console.log('URL Page: ' + page);

request(page, function (err, res, body) {
  if (err) console.log('Error: ' + err);

  // Check status code (200 is HTTP OK)
  if (res.statusCode === 200) {
    // Parse the document body
    const $ = cheerio.load(body);

    // console.log('Page title: ' + $('title').text());
    // console.log('================================================================================================');

    const data = $('#flashPlayer').next().html();

    const flashxml = 'https://www.nhaccuatui.com/flash/xml?html5=true&key1=';

    if (data.includes(flashxml)) {
      let text = data.substring(data.indexOf(flashxml));
      location = text.substring(0, text.indexOf('"'));

      // console.log('URI DATA OF SONG: ' + location);
      // console.log('================================ STEP 1 DONE ================================');

      request(location, function (err, res, body) {
        // if (err) console.log(err);

        if (res.statusCode === 200) {
          const $ = cheerio.load(body);
          const data = $('location').html();

          // console.log(data);

          download = data.substring(data.indexOf('https'), data.indexOf(']'));

          console.log('URI DOWNLOAD: ' + download);
          console.log('================================ DONE ================================');
        }
      });
    }
  } else {
    res.send('Cant access URL.')
  }
});
