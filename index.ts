// Import stylesheets
import { BehaviorSubject, fromEvent, interval, map, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import './style.css';
const mainContainer = document.querySelector('div#main');
const playingArea = mainContainer.querySelector('div#main div.playingArea');
const gameConfig = {
  score: 0,
  level: 1,
  alphaBetGenrationSpeed: 500,
  screenUpdateSpeed: 50,
  highScore: 12456,
  randomRange: 25,
  leftPosition: [10, window.innerWidth - 50],
  maxTop: playingArea.clientHeight,
  alphabetHeight: 24,
};

console.clear();
// Write TypeScript code!
function updatePosition() {
  let allchild = playingArea.children;
  for (let i = 0; i < allchild.length; i++) {
    let currentTop = parseInt(
      (allchild[i] as HTMLElement).style.top.split('px')[0]
    );
    if (currentTop + gameConfig.alphabetHeight >= gameConfig.maxTop) {
      boundryReached$.next(true);
    }
    (allchild[i] as HTMLElement).style.top = currentTop + 1 + 'px';
  }
}
function addNewAlphabet(albhabet: string) {
  let newDiv = document.createElement('div');
  newDiv.classList.add('letterDiv');
  newDiv.textContent = albhabet;
  newDiv.style.top = '-2px';
  newDiv.style.left =
    gameConfig.leftPosition[0] +
    Math.floor(
      Math.random() * (gameConfig.leftPosition[1] - gameConfig.leftPosition[0])
    ) +
    'px';
  playingArea.append(newDiv);
}
const aplhabetString = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const getRandomString = () => {
  let rn = Math.floor(Math.random() * gameConfig.randomRange);
  return aplhabetString[rn];
};
const reSizeEvetn = fromEvent(window, 'resize');
const boundryReached$ = new Subject();
const updatePosition$ = interval(gameConfig.screenUpdateSpeed).pipe(
  takeUntil(boundryReached$)
);
const alphbetSource$ = interval(gameConfig.alphaBetGenrationSpeed).pipe(
  takeUntil(boundryReached$),
  map((v) => {
    return getRandomString();
  })
);
const keyBoardEvent$ = fromEvent(document, 'keypress').pipe(
  map((v) => {
    return (v as KeyboardEvent).key;
  })
);
const score$ = new BehaviorSubject(0);
score$.subscribe(() => {
  let currentScore = mainContainer.querySelector('div#score');
  currentScore.textContent = (
    parseInt(currentScore.textContent) + 1
  ).toString();
});
reSizeEvetn.subscribe(() => {
  gameConfig.leftPosition = [10, window.innerWidth - 50];
  gameConfig.maxTop = playingArea.clientHeight;
});
alphbetSource$.subscribe(addNewAlphabet);
updatePosition$.subscribe(updatePosition);
keyBoardEvent$.subscribe((key) => {
  let lastEle = playingArea.querySelector('div.letterDiv:not(.zoom-in-out)');
  if (lastEle.textContent == key) {
    lastEle.textContent = '@';
    lastEle.classList.add('zoom-in-out');
    lastEle.addEventListener('animationend', () => {
      lastEle.remove();
      score$.next(1);
    });
  }
});
