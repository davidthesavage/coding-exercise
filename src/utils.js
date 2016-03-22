'use strict';

module.exports = {
  cleanXml: (xmlObj) => {
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
  },

  snapSelectionToWord: (selection) => {
    // Detect if selection is backwards
    const tmpRange = document.createRange();
    tmpRange.setStart(selection.anchorNode, selection.anchorOffset);
    tmpRange.setEnd(selection.focusNode, selection.focusOffset);

    const backwards = tmpRange.collapsed;
    tmpRange.detach();

    // modify() works on the focus of the selectionection
    const endNode = selection.focusNode, endOffset = selection.focusOffset;
    selection.collapse(selection.anchorNode, selection.anchorOffset);

    let direction = [];
    if (backwards) {
        direction = ['backward', 'forward'];
    } else {
        direction = ['forward', 'backward'];
    }

    selection.modify("move", direction[0], "character");
    selection.modify("move", direction[1], "word");
    selection.extend(endNode, endOffset);
    selection.modify("extend", direction[1], "character");
    selection.modify("extend", direction[0], "word");
  },

  getOffsetsFromSelection: (selection, element) => {
    const range = selection.getRangeAt(0),
          selected = range.toString().length,
          preCaretRange = range.cloneRange();

    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);

    // Clean out whitespace that might be added by spans from other annotations
    const rangeString = preCaretRange.toString().replace(/\s{2,}/g,' ');

    // Adjust for browser adding characters to length from selected
    const start = selected ? rangeString.length - selected : rangeString.length;
    const end = (range.endOffset - range.startOffset) + start - 1;

    return { start, end };
  }
};