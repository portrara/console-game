// script.js — game logic for RPS polished UI

let humanScore = 0;
let computerScore = 0;
const WIN_TARGET = 5;

// DOM references
const resultText = document.getElementById('resultText');
const metaText = document.getElementById('metaText');
const scoreEl = document.getElementById('score');
const log = document.getElementById('log');
const cpuChoiceEl = document.getElementById('cpuChoice');

const rockBtn = document.getElementById('rock');
const paperBtn = document.getElementById('paper');
const scissorsBtn = document.getElementById('scissors');
const resetBtn = document.getElementById('reset');
const playAgainBtn = document.getElementById('play-again');

function getComputerChoice(){
  const r = Math.floor(Math.random()*3);
  return r===0?'rock':r===1?'paper':'scissors';
}

function choiceEmoji(choice){
  return choice==='rock'?'✊':choice==='paper'?'🖐️':'✌️';
}

function showResult(message, meta){
  resultText.textContent = message;
  metaText.textContent = meta || '';
  resultText.classList.add('pop');
  setTimeout(()=>resultText.classList.remove('pop'),300);
}

function prependLog(text){
  const el = document.createElement('div');
  el.textContent = text;
  log.prepend(el);
  while(log.children.length>12) log.removeChild(log.lastChild);
}

function updateScore(){
  scoreEl.textContent = `You: ${humanScore} | CPU: ${computerScore}`;
}

function disableChoices(disable){
  [rockBtn,paperBtn,scissorsBtn].forEach(b=>b.disabled=disable);
}

function announceFinal(){
  if(humanScore>computerScore){
    showResult('You win the game! 🎉', `Final — You ${humanScore} : ${computerScore} CPU`);
    prependLog('Game over — You won');
  } else if(computerScore>humanScore){
    showResult('You lost the game. 😢', `Final — You ${humanScore} : ${computerScore} CPU`);
    prependLog('Game over — CPU won');
  } else {
    showResult("It's a tie overall!", `Final — You ${humanScore} : ${computerScore} CPU`);
    prependLog('Game over — Tie');
  }
  disableChoices(true);
  playAgainBtn.style.display='inline-block';
}

function playRound(human){
  if(humanScore>=WIN_TARGET||computerScore>=WIN_TARGET) return;
  const cpu = getComputerChoice();
  cpuChoiceEl.textContent = choiceEmoji(cpu);

  if(human===cpu){
    showResult(`Tie — both chose ${human}`, `No score change`);
    prependLog(`Tie: ${human.toUpperCase()}`);
  } else if((human==='rock'&&cpu==='scissors')||(human==='paper'&&cpu==='rock')||(human==='scissors'&&cpu==='paper')){
    humanScore++;
    showResult(`You win this round — ${human} beats ${cpu}` , `+1 point`);
    prependLog(`You: ${human} beats ${cpu}`);
  } else {
    computerScore++;
    showResult(`CPU wins this round — ${cpu} beats ${human}` , `CPU +1 point`);
    prependLog(`CPU: ${cpu} beats ${human}`);
  }

  updateScore();

  if(humanScore>=WIN_TARGET||computerScore>=WIN_TARGET){
    announceFinal();
  }
}

// Event listeners
rockBtn.addEventListener('click', ()=>playRound('rock'));
paperBtn.addEventListener('click', ()=>playRound('paper'));
scissorsBtn.addEventListener('click', ()=>playRound('scissors'));

resetBtn.addEventListener('click', ()=>{
  humanScore=0; computerScore=0; updateScore(); cpuChoiceEl.textContent='—'; log.innerHTML=''; showResult('Make your move!','Waiting for your choice…'); disableChoices(false); playAgainBtn.style.display='none';
});

playAgainBtn.addEventListener('click', ()=>{ resetBtn.click(); });

// keyboard shortcuts R / P / S
window.addEventListener('keydown', (e)=>{
  if(document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
  if(e.key.toLowerCase()==='r') rockBtn.click();
  if(e.key.toLowerCase()==='p') paperBtn.click();
  if(e.key.toLowerCase()==='s') scissorsBtn.click();
});

// init
updateScore();
showResult('Make your move!','Waiting for your choice…');
