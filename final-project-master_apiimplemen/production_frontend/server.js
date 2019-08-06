var port = 9000;
//Instantiate express
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const allowedExt = [
	'.js',
	'.ico',
	'.css',
	'.png',
	'.woff2',
	'.woff',
	'.ttf',
	'.svg'
];

const app = express();
app.listen(port, function(){
	console.log('Express server is running on port:'+ port);
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.get('*',function(req, res){
	var fileName = req.url.split('.').pop();
	if (allowedExt.indexOf('.' + fileName) === 0) {
		res.sendFile(path.resolve(`public/${req.url}`));
	} else {
		res.sendFile(path.resolve('public/index.html'));
	}
});
module.exports=app;