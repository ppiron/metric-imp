const express = require('express');
const helmet = require('helmet');
const evaluate = require('./evaluateExpr.js');

const app = express();
app.set('view engine', 'pug');
app.set('views', './views');

app.use(helmet.noSniff());
app.use(helmet.xssFilter());

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/api/convert', (req, res) => {
	let response;
	const input = req.query.input;
	if (!input) {
		res.send('invalid number and unit');
	}
	const units = {
		gal: ['L', 3.78541, 'liters', 'gallons'],
		L: ['gal', 1 / 3.78541, 'gallons', 'liters'],
		lbs: ['kg', 0.453592, 'kilograms', 'pounds'],
		kg: ['lbs', 1 / 0.453592, 'pounds', 'kilograms'],
		mi: ['km', 1.60934, 'kilometers', 'miles'],
		km: ['mi', 1 / 1.60934, 'miles', 'kilometers']
	};
	const unit = input.slice(input.match(/[a-zL]+/).index);
	let value = input.slice(0, input.match(/[a-zL]+/).index);
	value = evaluate(value);
	const isValidNumber = value !== 'invalid number';
	const isValidUnit = Object.keys(units).includes(unit);
	if (!isValidNumber && !isValidUnit) {
		response = 'invalid number and unit';
	} else if (!isValidNumber) {
		response = 'invalid number';
	} else if (!isValidUnit) {
		response = 'invalid unit';
	} else {
		response = {
			initNum: value,
			initUnit: unit,
			returnNum: (value * units[unit][1]).toFixed(5),
			returnUnit: units[unit][0],
			string: `${value} ${units[unit][3]} converts to ${(
				value * units[unit][1]
			).toFixed(5)} ${units[unit][2]}`
		};
	}
	res.send(response);
});

app.listen(3000, () => console.log('server started'));
