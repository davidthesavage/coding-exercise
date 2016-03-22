import service from './service';
import { applyAnnotations, selectAnnotation, setChapter, initializeAnnotateControls } from './annotations';

const chapterTextNode = document.getElementsByClassName('chapter__text')[0];

const chapters = {};

// Update the list of chapters wtih data from the service
const updateChapters = (chapters) => {
  const chaptersList = document.createElement('select');

  // Create option for each chapter returned from service
  chapters.forEach((number) => {
    const option = document.createElement('option');
    option.value = number;
    option.text = `Chapter ${number}`;
    chaptersList.appendChild(option);
  });

  // Load a chapter when changing select value
  chaptersList.addEventListener('change', function() {
    loadChapter(this.value);
  });

  document.getElementsByClassName('controls__current')[0].appendChild(chaptersList);
  document.getElementsByClassName('controls__loading')[0].classList.add('controls__loading--loaded');
};

// Format the chapter and apply any annotations
const displayChapter = (chapter) => {
  chapters[chapter.number] = chapter;

  let chapterText = chapter.text;

  if (chapter.annotations) {
    chapterText = applyAnnotations(chapter.annotations, chapter);
  } else {
    chapter.annotations = [];
  }

  chapterTextNode.innerHTML = chapterText;
  setChapter(chapter, chapterTextNode);
};

// Load a list of chapters from the service
export function loadChapters() {
  const fetchChapters = service.get('chapters');
  fetchChapters.then(updateChapters);

  // Initialize controls and annotation selecting
  chapterTextNode.addEventListener('mouseup', selectAnnotation);
  initializeAnnotateControls();

  return fetchChapters;
};

// Load a chapter from the service (if not already loaded) and then display it
export function loadChapter(chapter) {
  if (!chapters[chapter]) {
    service.get(`chapter/${chapter}`).then(displayChapter);
  } else {
    displayChapter(chapters[chapter]);
  }
};