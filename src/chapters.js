import service from './service';
import { applyAnnotations } from './annotations';

const updateChapters = (chapters) => {
  const chaptersList = document.createElement('select');

  chapters.forEach((number) => {
    const option = document.createElement('option');
    option.value = number;
    option.text = `Chapter ${number}`;
    chaptersList.appendChild(option);
  });

  chaptersList.addEventListener('change', function() {
    loadChapter(this.value);
  });

  document.getElementsByClassName('controls__current')[0].appendChild(chaptersList);
  document.getElementsByClassName('controls__loading')[0].classList.add('controls__loading--loaded');
};

const displayChapter = (chapter) => {
  let chapterText = chapter.formattedText;

  if (chapter.annotations) {
    chapterText = applyAnnotations(chapter.annotations, chapter);
  }

  const chapterTextNode = document.getElementsByClassName('chapter__text')[0];
  chapterTextNode.innerHTML = chapterText;

  chapterTextNode.addEventListener('mouseup', () => {
    const selection = window.getSelection();
    addAnnotation(selection, chapter);
  });
};

export function loadChapters() {
  const fetchChapters = service.get('chapters');
  fetchChapters.then(updateChapters);
  return fetchChapters;
};

export function loadChapter(chapter) {
  service.get(`chapter/${chapter}`).then(displayChapter);
};