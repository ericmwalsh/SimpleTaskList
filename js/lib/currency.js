var formatCurrency = function(amount) {
	amount = amount.toString();
	amount = amount.replace(/^(?!\$)/g, "$")
	amount = amount.replace(/\B(?=(\d{2}$))/g, ".");
	if(amount === "$0")
		return "$0.00";
	return amount;
};

var formatCurrency2 = function(amount) {
	amount = amount.toString();
	amount = amount.replace(/^(?!\$)/g, "$")
	console.log(amount);
	if(!amount.match(/^\${0,1}\d*\.{0,1}\d{0,2}$/))
		return 'Invalid';
	if(amount.match(/\.\d{2}/))
		return amount;
	if(amount.match(/\.\d$/))
		return amount.replace(/$/, '0');
	return amount.replace(/$/, '.00');	
};

var unformatCurrency = function(amount) {
	return parseInt(amount.replace(/[$\.,]/g, ''));
};