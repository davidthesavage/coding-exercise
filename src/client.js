import { loadChapters, loadChapter } from './chapters';

// Initialize the client-side javascript by loading a list of chapters and then loading the first chapter
const init = () => {
  loadChapters().then((chapters) => {
    loadChapter(chapters[0]);
  });
};

init();