const generateTxRef = () => {
	return `tx-${String(Date.now()).split(-6)}`;
}

module.exports = {
	generateTxRef
}