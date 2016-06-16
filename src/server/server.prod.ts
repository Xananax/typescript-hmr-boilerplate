import http from 'http';
import express from 'express';
import path from 'path';
import {requestHandler} from './handler';

const static_path = path.resolve(__dirname,__STATIC_RELATIVE_DIR__);

export default function listen(app,cb,devApp){

	app.use(express.static(static_path));
	app.use(requestHandler);

}