import express from 'express';

const API = express();

API.get('/a',function(req,res){
	res.send({a:'a'})
})

API.get('/',function(req,res){
	res.send({a:'b'});
})

export default API;