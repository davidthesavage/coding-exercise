const sortAnnotations = (annotations) => {
  return annotations.sort((a, b) => {
    return a.start - b.start;
  });
};

const addAnnotation = (selection, chapter) => {
  if (selection.extentOffset - selection.anchorOffset > 0) {
    chapter.annotations.push({ category: 'person', start: selection.anchorOffset, end: selection.extentOffset - 1 });
    applyAnnotations(chapter.annotations, chapter);
  }
};

export function applyAnnotations(annotations, chapter) {
  let lastSliceEnd = 0,
      text = chapter.text,
      formattedText = '';

  annotations = sortAnnotations(annotations);

  annotations.forEach((annotation) => {
    if (annotation.start !== lastSliceEnd) {
      formattedText += text.slice(lastSliceEnd, annotation.start);
    }

    formattedText += `<span class="annotation annotation--${annotation.category.toLowerCase()}">${text.slice(annotation.start, annotation.end + 1)}</span>`;
    lastSliceEnd = annotation.end + 1;
  });

  return formattedText;
};