/**
Home loan as investment simulation.

If you have enough money to pay for your house with cash,
should you do it?
Or should you take out a loan, and invest it in the stock market?
When I had an investment advisor, she took out a loan.
This script will help me figure out what the right thing to do is.
*/
/*
Loan setup:
yearly interest rate: 6%
number of months: 265
amount: $820,282

Stock market:
yearly return: 7%
standard deviation: 20%

Personal:
tax rate: 39.6% + 11%
mortgate interest tax deductible: y/n

http://stackoverflow.com/questions/7827352/excel-pmt-function-in-java
http://marginalrevolution.com/marginalrevolution/2014/07/average-stock-market-returns-arent-average.html
*/

function simulate1month() {
}

// Source: http://stackoverflow.com/questions/5294074/pmt-function-in-javascript
Excel = {
  PMT: function(rate, nperiod, pv, fv, type) {
    if (!fv) fv = 0;
    if (!type) type = 0;

    if (rate == 0) return -(pv + fv)/nperiod;

    var pvif = Math.pow(1 + rate, nperiod);
    var pmt = rate / (pvif - 1) * -(pv * pvif + fv);

    if (type == 1) {
        pmt /= (1 + rate);
    };

    return pmt;
  },
  IPMT: function(pv, pmt, rate, per) {
    var tmp = Math.pow(1 + rate, per);
    return 0 - (pv * tmp * rate + pmt * (tmp - 1));
  },
  PPMT: function(rate, per, nper, pv, fv, type) {
    if (per < 1 || (per >= nper + 1)) return null;
    var pmt = this.PMT(rate, nper, pv, fv, type);
    var ipmt = this.IPMT(pv, pmt, rate, per - 1);
    return pmt - ipmt;
  },
}

// S&P500 monthly returns, 1950-2017
var SP500MonthlyReturn = [1.92 ,1.76 ,3.29 ,-1.76 ,-0.14 ,-0.10 ,3.54 ,0.23 ,1.44 ,0.42 ,6.33 ,-0.24 ,-4.81 ,-1.87 ,-0.02 ,8.32 ,-2.54 ,-6.29 ,1.78 ,-2.16 ,0.96 ,0.86 ,-1.77 ,5.40 ,-3.10 ,-0.33 ,2.45 ,2.36 ,-1.59 ,3.81 ,-1.61 ,1.89 ,2.08 ,0.53 ,0.79 ,4.31 ,-3.43 ,2.31 ,2.68 ,4.41 ,2.79 ,-3.34 ,4.72 ,-1.56 ,2.08 ,1.81 ,3.60 ,1.11 ,5.04 ,0.70 ,0.28 ,-1.99 ,2.43 ,1.98 ,1.25 ,3.99 ,-6.26 ,-0.75 ,3.12 ,4.06 ,4.25 ,0.86 ,-0.32 ,10.79 ,-7.19 ,-5.70 ,-2.15 ,-1.83 ,-1.47 ,2.57 ,-0.21 ,2.95 ,2.27 ,5.99 ,-0.44 ,3.48 ,8.71 ,-5.25 ,6.84 ,-5.20 ,-8.34 ,1.32 ,5.80 ,2.85 ,-3.82 ,1.48 ,5.74 ,-1.77 ,3.68 ,3.07 ,7.24 ,-0.43 ,5.32 ,9.98 ,9.36 ,-10.69 ,-8.54 ,1.65 ,-7.48 ,-16.79 ,-9.43 ,1.06 ,-0.73 ,-8.55 ,1.04 ,4.46 ,-0.58 ,-3.48 ,-6.09 ,-0.76 ,-4.18 ,1.45 ,3.58 ,1.29 ,-3.28 ,-1.78 ,3.25 ,4.33 ,1.00 ,-2.16 ,1.43 ,1.26 ,1.66 ,3.15 ,2.46 ,1.98 ,0.52 ,0.01 ,-3.09 ,0.59 ,1.11 ,0.05 ,2.55 ,-0.10 ,3.52 ,-1.77 ,0.69 ,-1.12 ,3.60 ,-0.01 ,3.00 ,-2.01 ,-1.91 ,1.89 ,-2.53 ,3.25 ,3.86 ,1.40 ,0.94 ,0.23 ,-3.43 ,1.80 ,1.21 ,-1.68 ,-1.64 ,1.22 ,1.73 ,5.08 ,0.71 ,5.50 ,-1.19 ,1.79 ,1.62 ,1.13 ,5.09 ,8.10 ,0.84 ,-1.70 ,-2.74 ,-6.03 ,5.71 ,8.64 ,-11.00 ,0.49 ,-7.90 ,-7.25 ,-0.91 ,-6.14 ,3.67 ,-2.08 ,-1.56 ,0.76 ,7.52 ,1.81 ,-8.17 ,-6.41 ,-1.08 ,-2.50 ,0.51 ,7.68 ,-6.42 ,-9.23 ,3.46 ,0.41 ,-8.01 ,-0.50 ,-5.35 ,6.07 ,-1.63 ,2.39 ,-2.19 ,-3.08 ,9.67 ,-2.01 ,-5.09 ,5.78 ,1.91 ,6.25 ,-2.86 ,-0.63 ,-3.20 ,5.44 ,-2.50 ,3.79 ,3.88 ,-3.23 ,4.10 ,5.64 ,5.91 ,8.03 ,6.24 ,-14.58 ,-1.16 ,3.94 ,-1.88 ,0.91 ,4.99 ,7.04 ,1.02 ,1.57 ,4.46 ,-3.45 ,5.32 ,-5.74 ,7.81 ,4.35 ,5.86 ,5.84 ,-4.26 ,0.59 ,6.13 ,-2.15 ,7.34 ,2.61 ,5.42 ,1.88 ,-4.57 ,0.23 ,2.29 ,1.34 ,0.79 ,0.69 ,3.26 ,1.74 ,4.10 ,-0.50 ,4.01 ,-0.03 ,3.18 ,2.13 ,3.62 ,2.80 ,2.73 ,3.61 ,2.44 ,1.26 ,-3.93 ,2.09 ,-2.69 ,3.76 ,3.15 ,-2.68 ,1.24 ,1.18 ,-4.58 ,-3.00 ,3.24 ,0.98 ,-1.29 ,1.94 ,-1.00 ,3.44 ,-0.53 ,0.07 ,2.27 ,-2.54 ,1.87 ,1.05 ,0.71 ,1.01 ,3.03 ,0.21 ,0.91 ,-2.40 ,3.92 ,-1.74 ,0.10 ,2.79 ,-2.18 ,0.96 ,-1.98 ,11.19 ,-4.39 ,1.18 ,-1.91 ,1.96 ,4.48 ,-4.78 ,3.86 ,0.03 ,2.22 ,6.73 ,4.16 ,2.48 ,6.00 ,-0.69 ,-5.12 ,-9.43 ,-0.52 ,-0.90 ,9.20 ,-2.69 ,2.43 ,0.85 ,-6.88 ,2.14 ,1.65 ,-2.52 ,-0.65 ,1.55 ,8.84 ,-0.79 ,3.51 ,5.01 ,2.08 ,-2.89 ,7.11 ,1.48 ,-1.89 ,2.60 ,3.97 ,-3.86 ,-0.54 ,4.33 ,0.31 ,0.94 ,-3.33 ,4.19 ,4.03 ,7.28 ,-8.51 ,-21.76 ,-2.42 ,3.51 ,4.83 ,4.78 ,1.08 ,-1.11 ,2.65 ,3.69 ,13.18 ,-2.83 ,2.15 ,5.47 ,-8.54 ,7.12 ,-5.80 ,1.95 ,5.02 ,-1.41 ,5.28 ,7.15 ,0.24 ,4.51 ,6.51 ,4.26 ,-3.47 ,-1.20 ,-0.48 ,1.21 ,5.41 ,-0.46 ,-0.29 ,0.86 ,7.43 ,2.24 ,-1.51 ,-0.01 ,-0.35 ,10.63 ,-1.63 ,1.75 ,-5.94 ,0.55 ,1.35 ,-3.89 ,-0.92 ,-0.87 ,1.74 ,-1.47 ,1.02 ,1.27 ,-3.30 ,3.24 ,-1.23 ,7.53 ,3.30 ,1.91 ,3.31 ,1.50 ,3.60 ,11.06 ,0.75 ,10.96 ,-2.22 ,-2.11 ,-3.52 ,4.00 ,-1.02 ,-5.59 ,-1.75 ,-3.01 ,3.27 ,4.91 ,-5.38 ,-6.21 ,-0.22 ,-1.04 ,-0.17 ,-2.35 ,3.60 ,1.38 ,-4.57 ,-3.39 ,10.24 ,1.60 ,2.52 ,0.58 ,6.50 ,2.70 ,4.66 ,4.11 ,-10.18 ,-0.44 ,5.76 ,1.68 ,4.26 ,-6.75 ,0.00 ,5.31 ,0.87 ,3.87 ,-2.63 ,0.20 ,5.52 ,-3.65 ,3.97 ,1.16 ,0.61 ,-9.16 ,-0.73 ,2.59 ,5.39 ,-1.76 ,0.42 ,8.55 ,2.49 ,-2.48 ,-6.15 ,0.28 ,2.86 ,-4.34 ,-0.25 ,-2.10 ,-1.62 ,4.54 ,-2.36 ,0.02 ,-1.40 ,-2.17 ,-5.05 ,5.25 ,-0.78 ,-2.22 ,2.26 ,-0.51 ,-0.81 ,4.09 ,-1.44 ,-1.10 ,3.07 ,-1.14 ,11.83 ,-1.15 ,2.47 ,6.16 ,-3.46 ,-2.11 ,-6.77 ,4.24 ,4.41 ,4.73 ,2.17 ,5.99 ,12.13 ,-1.78 ,-5.32 ,16.30 ,-11.93 ,-9.03 ,-7.78 ,-1.47 ,-3.36 ,-3.91 ,-2.33 ,-0.36 ,-1.00 ,1.79 ,-11.39 ,-0.13 ,4.01 ,-3.62 ,3.96 ,-0.66 ,-1.89 ,-4.08 ,-0.14 ,-3.75 ,-1.72 ,1.18 ,4.56 ,0.93 ,-0.49 ,3.45 ,0.23 ,-2.18 ,1.73 ,0.44 ,0.59 ,2.53 ,1.81 ,8.62 ,-0.25 ,-4.18 ,-0.70 ,3.61 ,-3.61 ,-0.93 ,-4.16 ,3.63 ,3.68 ,0.91 ,4.05 ,5.68 ,4.74 ,-1.25 ,3.41 ,4.45 ,7.33 ,-5.00 ,-6.10 ,-9.05 ,0.15 ,5.27 ,-7.65 ,-1.87 ,-3.41 ,4.30 ,-2.50 ,3.91 ,-6.02 ,-5.56 ,-0.22 ,2.15 ,3.44 ,-4.74 ,-0.82 ,-4.16 ,4.80 ,0.72 ,3.85 ,1.15 ,-1.85 ,0.87 ,1.25 ,6.97 ,0.94 ,-3.12 ,-4.38 ,2.63 ,0.75 ,-3.53 ,3.28 ,-1.17 ,4.53 ,1.75 ,-5.24 ,4.22 ,3.94 ,0.20 ,7.82 ,-0.15 ,0.31 ,4.75 ,-0.70 ,-7.66 ,-1.35 ,-1.61 ,-5.41 ,2.05 ,-2.18 ,-1.79 ,0.49 ,0.90 ,-0.88 ,2.73 ,3.20 ,2.25 ,1.34 ,-4.86 ,-0.77 ,3.42 ,-1.45 ,-0.15 ,3.32 ,0.39 ,-0.52 ,0.81 ,2.87 ,-1.62 ,1.82 ,1.64 ,1.15 ,0.61 ,1.52 ,0.99 ,2.69 ,2.44 ,-1.05 ,3.22 ,-1.10 ,4.87 ,-0.35 ,-2.02 ,1.43 ,4.85 ,3.55 ,-3.05 ,4.91 ,1.35 ,10.16 ,0.44 ,-4.82 ,1.53 ,6.36 ,-8.18 ,-8.60 ,-6.20 ,-0.59 ,1.63 ,-3.79 ,-0.32 ,3.77 ,2.77 ,-2.14 ,1.04 ,2.38 ,-2.88 ,2.13 ,-0.44 ,2.57 ,2.49 ,7.31 ,5.08 ,2.97 ,0.06 ,-6.25 ,2.58 ,-2.72 ,1.84 ,3.14 ,-1.91 ,-1.20 ,0.29 ,-7.18 ,2.03 ,1.52 ,1.02 ,-3.38 ,-1.83 ,2.61 ,-0.27 ,1.79 ,3.41 ,-0.52 ,0.36 ,0.02 ,4.78 ,1.78 ,2.70 ,4.29 ,0.55 ,4.22 ,2.10 ,1.26 ,3.60 ,2.36 ,-2.85 ,3.40 ,-3.31 ,3.17 ,-3.98 ,-6.65 ,-5.38 ,1.01 ,0.00 ,3.06 ,3.62 ,0.85 ,-3.05 ,-3.20 ,1.50 ,-3.10 ,1.97 ,-5.30 ,-4.25 ,5.24 ,3.05 ,-6.15 ,-0.66 ,6.46 ,2.98 ,-2.97 ,0.29 ,7.64 ,-0.35 ,0.69 ,0.58 ,5.66 ,8.09 ,-0.34 ,2.73 ,-0.68 ,0.11 ,-0.33 ,5.85 ,7.71 ,-1.89 ,7.56 ,-3.74 ,5.72 ,0.07 ,3.47 ,4.01 ,2.63 ,0.62 ,4.53 ,0.12 ,0.41 ,4.47 ,-0.30 ,-6.12 ,2.10 ,-0.04 ,-0.77 ,-2.50 ,-2.47 ,-2.30 ,-0.60 ,3.47 ,4.31 ,0.16 ,-2.43 ,-1.65 ,1.11 ,4.87 ,2.98 ,-3.56 ,4.64 ,-4.28 ,1.43 ,3.30 ,-0.95 ,-2.26 ,-0.09 ,3.42 ,6.16 ,-2.42 ,-4.48 ,5.21 ,-1.69 ,0.14 ,4.29 ,3.92 ,-0.26 ,-0.81 ,4.85 ,2.22 ,1.13 ,-5.75 ,3.07 ,2.45 ,0.29 ,1.00 ,2.34];

// Given setup, runs a loan simulation until paid off
// Setup:
// interestRate: 0.0375, (yearly)
// numberMonths: 265,
// loanAmount: 820282,
// // investment
// yearlyReturn: 0.07,
// returnDeviation: 0.2,
// // personal
// taxRate: 0.39 + 0.11,
// taxDeductible: true

function Simulation(setup) {
  this.params = {};
  for (prop in setup)
    this.params[prop] = setup[prop];
}


Simulation.prototype = {
  calculateMonthlyPayment: function(month) {
    var payment = Excel.PMT(this.params.interestRate / 12, this.params.numberMonths, this.params.loanAmount);
    var interest = Excel.IPMT(this.params.loanAmount, payment, this.params.interestRate / 12, month);
    var principal = Excel.PPMT(this.params.interestRate / 12, month, this.params.numberMonths, this.params.loanAmount);
    return {
      payment: -payment,
      interest: -interest,
      principal: -principal
    }
  },

  // Modeling market returns is hard
  // Use real data instead https://sixfigureinvesting.com/2016/03/modeling-stock-market-returns-with-laplace-distribution-instead-of-normal/
  getMonthlyInvestmentReturn: function(month) {
    return SP500MonthlyReturn[this.sp500startMonth + month];
  },

  run: function() {
    this.sp500startMonth = Math.trunc( Math.random() * (SP500MonthlyReturn.length - this.params.numberMonths));

    var balance = this.params.loanAmount;
    var taxDeduction = 0;
    var balancesByMonth = [balance];
    var taxDeductionsByMonth = [0];
    for (var m=0; m < this.params.numberMonths; m++) {
      var payment = this.calculateMonthlyPayment(m);
      var monthlyReturn = this.getMonthlyInvestmentReturn(m);
      var investmentReturn = balance > 0 ? balance * monthlyReturn / 100 : 0;

      // Every month, you earn money in two ways:
      // investmentReturn
      // taxDeduction
      // You lose money by paying off loan:
      balance += investmentReturn - payment.payment;
      balancesByMonth.push(balance);
      taxDeduction += payment.interest * this.params.taxRate;
      taxDeductionsByMonth.push(taxDeduction);
    }
    return {
      balances: balancesByMonth,
      taxDeductions: taxDeductionsByMonth,
      finalBalance: balancesByMonth[balancesByMonth.length -1]
    }
  }
}

