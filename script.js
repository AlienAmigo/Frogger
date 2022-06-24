'use strict';

console.log('hello');

const TILE_HEIGHT = 84;
const TILE_WIDTH = 101;
const FIELD_HEIGHT = TILE_HEIGHT * 6;
const FIELD_WIDTH = TILE_WIDTH * 7;

const levelElement = document.querySelector('.game__level');
let myLevel = 1;

const changeLevel = lvl => {

};

const hero = {
  view: document.querySelector('.game__hero'),
  x: 0,
  y: 0,
};

const random = (from, to) => from + (Math.random() * (to - from));

const move = item => {
  item.view.style.transform = `translate(${item.x}px, ${item.y}px)`;
};

const bugs = [...document.querySelectorAll('.game__bug')].map(view => ({
  view,
  x: 0,
  y: 0,
  speed: 0,  
}));

const resetHero = () => {
  hero.x = TILE_WIDTH * 3;
  hero.y = TILE_HEIGHT * 5;
  move(hero);
};

const resetBug = (bug) => {
  bug.x = - random(1, 2) * TILE_WIDTH;
  bug.y = TILE_HEIGHT * Math.floor( random(1, 5) );
  bug.speed = random(0.2, 1) * (0.9 + 1.2 * myLevel); 
  move(bug);
};

const moveBug = bug => {
  if (bug.x >= FIELD_WIDTH) {
    resetBug(bug);
    return;
  }

  bug.x += bug.speed;
  move(bug);
};

const resetLevel = (lvl) => {
  myLevel = lvl;
  levelElement.textContent = myLevel;
  resetHero();
  bugs.forEach(resetBug);
} 

const checkMove = (x, y) => 
  x >= 0 && x < FIELD_WIDTH && 
  y >= 0 && y < FIELD_HEIGHT;

const onKeyDown = ({code}) => {
  let newX = hero.x;
  let newY = hero.y;

  switch (code) {
    case 'ArrowUp':
      newY -= TILE_HEIGHT;
      break;
    case 'ArrowDown':
      newY += TILE_HEIGHT;
      break;
    case 'ArrowLeft':
      newX -= TILE_WIDTH;
      break;
    case 'ArrowRight':
      newX += TILE_WIDTH;
      break;
  } 

  if (!checkMove(newX, newY)) {
    return;
  }

  if(newY <= 0) {
    console.log('win win');
    resetLevel(myLevel + 1);
    return;
  };

  hero.x = newX;
  hero.y = newY;
  move(hero);
};

const checkCollision = item => 
  hero.y === item.y && 
  hero.x < item.x + TILE_WIDTH * 0.75 &&
  item.x < hero.x + TILE_WIDTH * 0.75;

const onRaf = () => {
  if (bugs.some(checkCollision)) {
    console.log('die');
    resetLevel(1);
  }
  bugs.forEach(moveBug);
  requestAnimationFrame(onRaf);
};

const start = () => {
  resetLevel(1);
  bugs.forEach( resetBug );

  window.addEventListener('keydown', onKeyDown);
  requestAnimationFrame(onRaf);
};

start();