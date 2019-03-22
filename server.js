const http = require('http');
const app = require('./app');


const normalizePortNumber = val =>{
	const portNumber = parseInt(val,10);

	if(isNaN(portNumber)){
		return val;
	}
	if(portNumber >= 0){
		return portNumber;
	}
	return false;
}

const port = normalizePortNumber(process.env.PORT || '3000');

//set port number for app
app.set('port',port);

//create http server
const server = http.createServer(app);

//create error handler for server
const errorHandler = error =>{
	if(error.syscall !== 'listen'){
		throw error;
	}

	const address = server.address();
	const bind = typeof address === 'string' ? 'pipe: ' + address : 'port: ' + port;

	//check error code
	switch(error.code){
		case 'EACCESS':
			console.error(bind + " No enough permission to access this resource");
			break;
		case 'EADDRINUSE':
			console.error(bind + " This addresss is already in use");
			break;
		default:
			throw error;

	}
}

//add listeners
server.on('error', errorHandler);
server.on('listening', ()=>{
	const address = server.address();
	const bind = typeof address === 'string' ? 'pipe: ' + address : 'port: ' + port;
	console.log('Listening on '+bind);
});

server.listen(port);