const generateTxRef = () => {
	return `tx-${String(Date.now()).split(-6)}`;
}

const generateUniqueEmailForTest = () => {
	return `test${String(Date.now()).split(-6)}@gmail.com`
}
module.exports = {
	generateTxRef,
	generateUniqueEmailForTest
}