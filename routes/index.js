var express = require('express');
var router = express.Router();
var request = require('request');
const puppeteer = require('puppeteer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getLinks', function(req, res, next) {

    console.log(req.query.url);

    (async () => {
        const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(req.query.url, {waitUntil: 'networkidle'});
    // await page.waitForNavigation(5);
    await page.waitFor(5*1000);
    let html = await page.content();
    browser.close();
    
        var urls=extract_urls(html);
        res.render('index', { data: urls });
})();


});

function extract_urls(htmlString){
    var extensions =['.mp3','.mp4'];
    body=htmlString.toLowerCase();

    var result=[];
    for(i=0;i<extensions.length;i++){
        var searchBegin=0;
        do{
            var searchResult=body.indexOf(extensions[i],searchBegin);
            if(searchResult>=0) {
                var start = body.lastIndexOf('="', searchResult);
                var end = body.indexOf('"', searchResult);
                var result_url = body.substring(start + 2, end);
                if (result_url.indexOf("http://") == 0 || result_url.indexOf("https://") == 0) {
                    result.push(result_url);
                }
                searchBegin = end + 1;
            }
        }while (searchResult!=-1)

    }
    return JSON.stringify(result)
 
}

module.exports = router;
