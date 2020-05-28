var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var pageToVisit = 'https://www.nhaccuatui.com/bai-hat/tinh-sau-thien-thu-muon-loi-vo-dinh-hieu.wVx961NiDHqY.html';
var URIDataOfSong = '';
var URIDownload = '';

console.log('Visiting page ' + pageToVisit);

request(pageToVisit, function (error, response, body) {
  if (error) console.log('Error: ' + error);
  // Check status code (200 is HTTP OK)
  console.log('Status code: ' + response.statusCode);
  if (response.statusCode === 200) {
    // Parse the document body
    const $ = cheerio.load(body);
    console.log('Page title: ' + $('title').text());
    console.log('================================');
    fs.appendFileSync('source-html.txt', $('#flashPlayer').next());
    const data = fs.readFileSync('source-html.txt', 'utf8');
    console.log('Type of data file: ' + typeof (data));
    const flashxml = 'https://www.nhaccuatui.com/flash/xml?html5=true&key1=';

    if (data.includes(flashxml)) {
      console.log('Length of flashxml: ' + flashxml.length);
      console.log('Index of flashxml: ' + data.indexOf(flashxml));

      const lastIndexOfKey = data.indexOf(flashxml) + flashxml.length;
      console.log('Last index of flashxml: ' + lastIndexOfKey);

      var keyOfSong = '';
      for (var i = lastIndexOfKey; i < lastIndexOfKey + 32; i++) {
        keyOfSong += data[i];
      }
      console.log('Key of song: ' + keyOfSong);
      URIDataOfSong = flashxml + keyOfSong;
      console.log('URI download: ' + URIDataOfSong);

    }
    fs.unlinkSync('source-html.txt');
    console.log('================ STEP 1 DONE ================');
    request(URIDataOfSong, function (err, res, body) {
      if (err) console.log(err);
      console.log('Access URI download');
      console.log('Status code: ' + res.statusCode);
      if (res.statusCode === 200) {
        const $ = cheerio.load(body);
        fs.appendFileSync('xml-download.txt', $('location'));
        const data = fs.readFileSync('xml-download.txt', 'utf8');
        console.log('Position start of URI DOWNLOAD: ' + data.indexOf('https://'));
        console.log('Position end of URI DOWNLOAD: ' + data.indexOf(']'));
        var start = data.indexOf('https://');
        var end = data.indexOf(']');
        for (var i = start; i < end; i++) {
          URIDownload += data[i];
        }
        console.log('URI DOWNLOAD: ' + URIDownload);
        fs.unlinkSync('xml-download.txt');
        console.log('================ DONE ================');
      }
    })
  }
})
