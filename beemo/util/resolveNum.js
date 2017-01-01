module.exports = (content) => {
    var regex = new RegExp(/([0-9]*)/);
    if (regex.test(content)) {
        var num = parseInt(content);
        if(num == NaN) {
        	return false;
        }
        return num;
    } else {
        return false;
    }
}