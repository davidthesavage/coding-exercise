import { snapSelectionToWord, getOffsetsFromSelection } from './utils';

let currentChapter, chapterTextNode;

const sortAnnotations = (annotations) => {
  return annotations.sort((a, b) => {
    return a.start - b.start;
  });
};

export function setChapter(chapter, chapterNode) {
  currentChapter = chapter;
  chapterTextNode = chapterNode;
};

export function selectAnnotation() {
  let start = 0;
  const selection = window.getSelection();

  // Ensure we have characters selected
  if (!selection.isCollapsed) {
    snapSelectionToWord(selection);

    const updatedSelection = window.getSelection(),
          offsets = getOffsetsFromSelection(updatedSelection, chapterTextNode);

    currentChapter.annotations.push({
      category: 'uncategorized',
      start: offsets.start,
      end: offsets.end
    });

    chapterTextNode.innerHTML = applyAnnotations(currentChapter.annotations, currentChapter);
  }
};

export function applyAnnotations(annotations, chapter) {
  let lastSliceEnd = 0,
      text = chapter.text,
      formattedText = '';

  // This methodology requires that annotations be iterated in sequential order
  annotations = sortAnnotations(annotations);

  annotations.forEach((annotation, index) => {
    // If we aren't slicing exactly from where we finished the last slice, we need to get all the text in between and not format it
    if (annotation.start !== lastSliceEnd) {
      formattedText += text.slice(lastSliceEnd, annotation.start);
    }

    // Have to add 1 as slice is 0 index based
    const annotationEnd = annotation.end + 1;

    // Wrap the annotation in a span that provides styling and hover events
    formattedText += `<span class="annotation" onmouseover="showEditControls(event, this, ${index})" onmouseout="hideEditControlsTimeout(event)"><span class="annotation__tag annotation__tag--${annotation.category}">${text.slice(annotation.start, annotationEnd)}</span><span class="annotation__remove" onclick="removeAnnotation(event, ${index})"></span></span>`;

    lastSliceEnd = annotationEnd;
  });

  // When done applying all annotations, we need to ensure we include any text after the last annotation
  if (lastSliceEnd < text.length) {
    formattedText += text.slice(lastSliceEnd)
  }

  return formattedText;
};

// Setup annotation event listeners
export function initializeAnnotateControls() {
  const annotateControls = document.getElementById('annotateControls');
  let timeout, annotationIndex, currentAnnotation;

  // Add events to the window as these will be inacessible outside the module otherwise
  window.showEditControls = (event, annotation, index) => {
    // Clear any existing timeout that would hide the edit controls
    if (timeout) {
      clearTimeout(timeout);
    }

    const activeAnnotation = currentChapter.annotations[index];

    // Select the correct radio button if the active annotation is categorized
    if (activeAnnotation.category !== 'uncategorized') {
      document.querySelector(`[data-category="${activeAnnotation.category}"`).checked = true;
    }

    const bodyRect = document.body.getBoundingClientRect(),
          annotationRect = annotation.getBoundingClientRect(),

          // Place the edit controls just below the annotation
          offsetTop = (annotationRect.top - bodyRect.top) + annotationRect.height,
          offsetLeft = annotationRect.left - bodyRect.left;

    // Make the annotate controls visible and position them
    annotateControls.classList.add('annotateControls--active');
    annotateControls.style.left = `${offsetLeft}px`;
    annotateControls.style.top = `${offsetTop}px`;

    // Stateful variables to be used by other event listeners
    annotationIndex = index;
    currentAnnotation = annotation;
  };

  const hideEditControls = () => {
    annotateControls.classList.remove('annotateControls--active');
  };

  window.hideEditControlsTimeout = (event) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(hideEditControls, 1500);
  };

  window.updateAnnotation = (category) => {
    currentChapter.annotations[annotationIndex].category = category;
    hideEditControls();

    // Make sure all radio buttons are unchecked after selecting
    [].forEach.call(annotateControls.querySelectorAll('input[type="radio"]'), (radio) => { radio.checked = false; });
    chapterTextNode.innerHTML = applyAnnotations(currentChapter.annotations, currentChapter);
  };

  window.removeAnnotation = (event, index) => {
    event.preventDefault();
    delete currentChapter.annotations[index];
    hideEditControls();
    chapterTextNode.innerHTML = applyAnnotations(currentChapter.annotations, currentChapter);
  };

  annotateControls.addEventListener('mouseover', (event) => { window.showEditControls(event, currentAnnotation, annotationIndex) });
  annotateControls.addEventListener('mouseout', window.hideEditControlsTimeout);
};
