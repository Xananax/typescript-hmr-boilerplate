import isString from './isString';

export default function stringToArr(str:string|string[]):string[]{
	return isString(str) ? 
		str.split(',').map(s=>s.trim()).filter(Boolean) :
		str
}