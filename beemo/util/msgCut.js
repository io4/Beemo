module.exports = (text, length) => {
            text = text.toString();
            if (text.length > length) return `${text.substring(0, length - 3)}...`;
            return text + ' '.repeat(length - text.length);
}
