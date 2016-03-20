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

  document.getElementById('chapterControl').appendChild(chaptersList);
};

const loadChapters = () => {
  const fetchChapters = service.get('chapters');
  fetchChapters.then(updateChapters);
  return fetchChapters;
};

const displayChapter = (chapter) => {
  document.getElementById('chapterText').innerHTML = chapter.text;
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