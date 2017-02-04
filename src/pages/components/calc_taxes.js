import React from 'react';
import logo from '../../logo.svg';
import '../../App.css';

class CalcTaxes extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			result: ''
		};

		this.handleEnter = this.handleEnter.bind(this);
	}

	round2Decimals(Number) {
		return Math.round(Number *100) / 100;
	}

	handleEnter(event) {
		 if(event.key === 'Enter') {
		 	if(isNaN(event.target.value)) {
		 		// console.log("It is not a number");
		 		return;
		 	}

			// this.calcProvTax(event.target.value);	
			let federalTax=this.calcFederalTax(event.target.value);	
			let provincialTax=this.calcProvTax(event.target.value);
			// console.log("Value Calculated",federalTax, provincialTax);
			// Calc CPP and EI
			let calcCpp = (event.target.value * (2.48/100)) > 1282.05 ? 1282.05 : this.round2Decimals(event.target.value * (2.48/100));
			let calcEi 	= (event.target.value * (1.63/100)) > 836.19 ? 836.19 : this.round2Decimals(event.target.value * (1.63/100));
			// Calc total and Money Left
			let calcTotal = this.round2Decimals(federalTax + provincialTax + calcCpp + calcEi);
			let calcMoneyLeft = this.round2Decimals(event.target.value - calcTotal);
			// Prepare the object with the information needed
			let resultView = {
				grossSalary: event.target.value,
				federal: federalTax,
				provincial: provincialTax,
				cpp: calcCpp,
				ei: calcEi,
				total: calcTotal,
				left: calcMoneyLeft
			}


			this.setState({result: resultView});
		}
	}

	calcFederalTax = (value) => {
		const federal = [
			[0, 11474, 0],
			[11474.01, 45282, 15],
			[45282.01, 90563, 20.5],
			[90563.01, 140388, 26],
			[140388.01, 200000, 29],
			[200000.01, 270000, 33]
		]

		let valueLeft = value;
		let federalTaxAmount=0;
		for(let x=0; x < federal.length; x++) {
			// getting the object for test
			let testTax = federal[x];
			// calculate value between
			let difference = (testTax[1]-testTax[0]);		
			
			if(value < difference) {
				// Dont Subtract the difference
				federalTaxAmount += (testTax[2] / 100)*value;
				break;
			} else if(valueLeft < difference){
				// Dont Subtract the difference
				federalTaxAmount += (testTax[2] / 100)*valueLeft;
				break;
			} else {
				federalTaxAmount += (testTax[2] / 100)*difference;
				// Subtract the difference
				valueLeft -= difference;
				if(valueLeft < 0) {
					valueLeft = 0;
					break;
				} 
			}
		}
	 return this.round2Decimals(federalTaxAmount);
	}

	calcProvTax(value) {	
		const provincial = [
			[0, 38210, 5.06],
			[38210.01, 76421, 7.7],
			[76421.01, 87741, 10.5],
			[87741.01, 106543, 12.29],
			[106543.01, 126500, 14.7]
		]

		let valueLeft = value;
		let provincialTaxAmount=0;
		for(let x = 0; x < provincial.length; x++) { 
			// getting the object for test
			let testTax = provincial[x];
			// calculate value between
			let difference = (testTax[1]-testTax[0]);		
			
			if(value < difference) {
				// Dont Subtract the difference
				provincialTaxAmount += (testTax[2] / 100)*value;
				break;
			} else if(valueLeft < difference){
				// Dont Subtract the difference
				provincialTaxAmount += (testTax[2] / 100)*valueLeft;
				break;
			} else {
				provincialTaxAmount += (testTax[2] / 100)*difference;
				// Subtract the difference
				valueLeft -= difference;
				if(valueLeft < 0) {
					valueLeft = 0;
					break;
				} 
			}
		}
	 return this.round2Decimals(provincialTaxAmount);
	}

	render() {
		return (
			<div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          	<div>
          		<div>
          			<h1>Tax calculator</h1>
          		</div>
          		<div>
          			Insert the value here
          		</div>
          		<input 
								type="text" 
								placeholder="Annualy Salary to Calculate"
								onKeyDown={this.handleEnter}
							/>
          	</div>
        </div>
        <div>
        	<h2>
        		Check out how your income taxes
        	</h2>
        </div>
        <div>
        	<h4 className="App-result">
        	  Gross Salary: {this.state.result.grossSalary}<br />
        	  Federal Taxes: {this.state.result.federal}<br />
        	  Provincial Taxes: {this.state.result.provincial}<br />
        	  CPP: {this.state.result.cpp}<br />
        	  EI: {this.state.result.ei}<br />
        	  Total Amount in Taxes: {this.state.result.total}<br />
        	  Money Left: {this.state.result.left}<br />
        	  Bi-Weekly: {this.round2Decimals((this.state.result.left / 52)*2)}
        	</h4>
        </div>
      </div>			
		)
	}
}

export default CalcTaxes;