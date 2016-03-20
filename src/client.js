import service from './service';

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

const loadChapters = () => {
  const fetchChapters = service.get('chapters');
  fetchChapters.then(updateChapters);
  return fetchChapters;
};

const displayChapter = (chapter) => {
  document.getElementsByClassName('chapter__text')[0].innerHTML = chapter.text.replace(/(?:\n\n)/g, '<br /><br />');
};

const loadChapter = (chapter) => {
  service.get(`chapter/${chapter}`).then(displayChapter);
};

const init = () => {
  loadChapters().then((chapters) => {
    loadChapter(chapters[0]);
  });
};

init();