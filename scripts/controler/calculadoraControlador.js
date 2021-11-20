class CalculadoraControlador {
	get displayCalc() {
		return this._$displayCalc.textContent;
	}

	set displayCalc(value) {
		this._$displayCalc.textContent = value;
	}

	constructor() {
		this._lastOperator = '';
		this._lastNumber = '';
		this._operator = [];
		this._locale = 'pt-BR';
		this._$displayCalc = document.querySelector('#display');
		this._$date = document.querySelector('#data');
		this._$time = document.querySelector('#hora');
		this._currentDate;
		this.initialize();
		this.initButtonsEvents();
	}

	initialize() {
		this.setDisplayDateTime();
		setInterval(() => this.setDisplayDateTime(), 1000);
		this.setLastToDisplay();
	}

	addEventListenerAll(element, events, func) {
		events.split(' ').forEach((event) => {
			element.addEventListener(event, func, false);
		});
	}

	setError() {
		this.displayCalc = 'Error';
	}

	clearAll() {
		this._operator = [];
		this._lastNumber = '';
		this.lastOperator = '';

		this.setLastToDisplay();
	}

	clearEntry() {
		this._operator.pop();
		this.setLastToDisplay();
	}

	isOperator(value) {
		return (['+', '-', '*', '/', '%'].indexOf(value) > -1);
	}

	setLastOperator(value) {
		this._operator[this._operator.length - 1] = value;
	}

	getLastOperator() {
		return this._operator[this._operator.length - 1];
	}

	getResult() {
		return eval(this._operator.join(''));
	}

	calc() {
		let last = '';
		this._lastOperator = this.getLastItem();

		if (this._operator.length < 3) {
			let fisrtItem = this._operator[0];
			this._operator = [fisrtItem, this._lastOperator, this.lastNumber];
		}

		if (this._operator.length > 3) {
			last = this._operator.pop();
			this._lastNumber = this.getResult();
		} else if (this._operator.length == 3) {
			this._lastNumber = this.getLastItem(false);
		}

		let result = this.getResult();


		if (last == '%') {
			result /= 100;
			this._operator = [result];

		} else {
			this._operator = [result];
			if (last) this._operator.push(last);
		}
		this.setLastToDisplay();
	}

	pushOperator(value) {
		this._operator.push(value);
		if (this._operator.length > 3) {
			this.calc();
		}

	}
	getLastItem(isOperator = true) {
		let lastItem;
		for (let i = this._operator.length - 1; i >= 0; i--) {

			if (this.isOperator(this._operator[i]) == isOperator) {
				lastItem = this._operator[i];
				break;
			}

		}
		if (!lastItem) {
			lastItem = (isOperator) ? this._lastOperator : this.lastNumber;
		}


		return lastItem;

	}

	setLastToDisplay() {
		let lastNumber = this.getLastItem(false);
		if (!lastNumber) lastNumber = 0;
		this.displayCalc = lastNumber;
	}

	addDot() {
		let lastOperator = this.getLastOperator()
		if(this.isOperator(lastOperator) || !lastOperator) {
			this.pushOperator('0.');
		}else{
			this.setLastOperator(lastOperator.toString() + '.');
		}
		this.setLastToDisplay();
	}


	addOperation(value) {
		if (isNaN(this.getLastOperator())) {
			if (this.isOperator(value)) {
				this.setLastOperator(value);
			} else {
				this.pushOperator(value);
				this.setLastToDisplay();
			}
		} else {
			if (this.isOperator(value)) {
				this.pushOperator(value);
			} else {
				let newValue = this.getLastOperator().toString() + value.toString();
				this.setLastOperator(parseFloat(newValue));
				this.setLastToDisplay();
			}
		}
	}

	execBtn(value) {
		switch (value) {
			case 'ac':
				this.clearAll();
				break;
			case 'ce':
				this.clearEntry();
				break;
			case 'soma':
				this.addOperation('+');
				break;
			case 'subtracao':
				this.addOperation('-');
				break;
			case 'multiplicacao':
				this.addOperation('*');
				break;
			case 'igual':
				this.calc();
				break;
			case 'divisao':
				this.addOperation('/');
				break;
			case 'porcento':
				this.addOperation('%');
				break;
			case 'ponto':
				this.addDot();
				break;
			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
				this.addOperation(parseFloat(value));
				break;

			default:
				this.setError();
				break;
		}
	}

	initButtonsEvents() {
		let buttons = document.querySelectorAll('#buttons > g, #parts > g');

		buttons.forEach((btn, index) => {
			// btn.addEventListener('click drag', e => {
			this.addEventListenerAll(btn, 'click drag', (e) => {
				//trocamos btn por this para ser generico deixamos a função também reutilizavel
				let textBtn = btn.className.baseVal.replace('btn-', '');

				this.execBtn(textBtn);
			});

			this.addEventListenerAll(btn, 'mouseover mouseup mousedown', (e) => {
				btn.style.cursor = 'pointer';
			});
		});
	}

	setDisplayDateTime() {
		this.displayDate = this.currentDate.toLocaleDateString(this._locale);
		this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
	}

	get displayTime() {
		return this._$time.textContent;
	}

	set displayTime(value) {
		this._$time.textContent = value;
	}

	get displayDate() {
		return this._$date.textContent;
	}

	set displayDate(value) {
		this._$date.textContent = value;
	}

	get currentDate() {
		return new Date();
	}

	set currentDate(value) {
		this._dataAtual = value;
	}
}