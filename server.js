const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const logEvents = require('./logEvent');
const EventEmitter = require('events');

class Emitter extends EventEmitter{ };
//initialize object
const myEmitter = new Emitter();
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));


// define port to use
const PORT = process.env.PORT || 3500;

// function for 404 and redirect
const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath, 
            //allowing the server to access image 
            !contentType.includes('image') ? 'utf8' : 
            '');
        const data = contentType === 'application/json'
            ? JSON.parse(rawData) : rawData;
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200, 
            { 'content-Type': contentType});
        // stringfying json
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        );
    } catch (err) {
        console.log(err);
        myEmitter.emit('log', `${err.name}\t${err.message}`, 'errLog.txt');
        response.statusCode = 500;
        response.end();
    }
}

//create server
const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt');
    
    // define extension
    const extension = path.extname(req.url);

    //define content-type
    let contentType;

    //using switch statement to define every file value and extension
    switch(extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
            break;        
    }

        //using iternary to direct the url typed by the user
    let filePath = 
        //if it is a html/ find the file index.html
        contentType === 'text/html' && req.url === '/' 
            ? path.join(__dirname, 'views', 'index.html')
            //if the / is omitted still give index.html 
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? path.join(__dirname, 'views', req.url, 'index.html')
                // if it dont have the / at all give index.html
                : contentType === 'text/html'
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname, req.url);
    
                    //when the / and extension is not added still navigate || html not required
    if (!extension && req.url.slice(-1) !== '/') filePath += '.html';

    //checking if file exist
    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
        //serve the file
        serveFile(filePath, contentType, res);
    } else {
        //404 or 301 redirect
        switch(path.parse(filePath).base){
            case 'old-page.html':
                res.writeHead(301, {'location': '/new-page.html'});
                res.end();
                break
            case "www-page.html":
                res.writeHead(301, {'location': '/'});
                res.end();
                break
            default:
                //serve a 404 response
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
        };
    }
});


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));