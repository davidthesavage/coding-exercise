var util = require('util');

module.exports = function (xmlObj) {
  // Ensure xmlObj is in the format we're expecting before trying to map it to avoid errors
  if (xmlObj && xmlObj.document && xmlObj.document.span && Array.isArray(xmlObj.document.span)) {
    return xmlObj.document.span.map((item) => {
      return {
        category: item['$'].category.toLowerCase(),
        start: Number(item.extent[0].charseq[0]['$'].START),
        end: Number(item.extent[0].charseq[0]['$'].END)
      }
    });
  }
}