const cluster = require('cluster');
const https = require('https');
const fs = require('fs');
const numCPUs = 2;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    const serverOptions = {
        cert: fs.readFileSync('certs/kibana/kibana.crt'),
        key: fs.readFileSync('certs/kibana/kibana.key')
    };

    const requestListener = function (req, res) {
        res.writeHead(200);
        res.end('hello world\n');
    };

    https.createServer(serverOptions, requestListener).listen(8080);

    console.log(`Worker ${process.pid} started`);
}