const text = `Сложно сказать, почему
 непосредственные участники технического прогресса освещают чрезвычайно интересные особенности картины в целом, однако конкретные выводы, разумеется, описаны максимально подробно. Но действия представителей оппозиции разоблачены.
Независимые государства, вне зависимости от их уровня, должны быть обнародованы. Высокий уровень вовлечения представителей целевой аудитории является четким доказательством простого факта: консультация с широким активом требует определения и уточнения системы обучения кадров, соответствующей насущным потребностям. Современные технологии достигли такого уровня, что синтетическое тестирование, в своём классическом представлении, допускает внедрение экономической целесообразности принимаемых решений.
Не следует, однако, забывать, что сплочённость команды профессионалов играет определяющее значение для первоочередных требований. Независимые государства призывают нас к новым свершениям, которые, в свою очередь, должны быть объявлены нарушающими общечеловеческие нормы этики и морали. Господа, высокое качество позиционных исследований играет важную роль в формировании распределения внутренних резервов и ресурсов.`;

const inputTextEl = document.querySelector("#inputText");
const textExampleEl = document.querySelector("#textExample");

const lines = getLines(text);

let letterId = 1; // очередной символ, на кот польсозатель должен нажать

let startMoment = null; // мс от старта
let started = false; 

let letterCounter = 0;
let letterCounter_error = 0;
init();


function init() {
  updateDisplayedLines();

  inputTextEl.focus();

  inputTextEl.addEventListener("keydown", function (event) {
    // console.log(event)
    const currentLineNumber = getCurrentLineNumber();
    const currentLetter = getCurrentLetter();

    if(!started){
      started = true;
      startMoment = Date.now();
    }

    letterCounter++;

    const isKey = (event.key === currentLetter.original);
    const isEnter = (event.key === 'Enter' && currentLetter.original === '\n');

    colorize(event, true);

    if (event.key.startsWith('F') && event.key.length > 1) {
      return;
    }

    if (isKey || isEnter) {
      letterId++;
      updateDisplayedLines();
    }
    else {
      event.preventDefault(); // запрет на стандартную обработку события
      // подсвечиваем буквы с ошибкой
      if (event.key.length < 2){ //проверяем, что кнопка буква
        letterCounter_error++;
        for(const line of lines){
          for(const letter of line){          
            if(letter.original === currentLetter.original){
              letter.state = false;
            }
          }
        }
      }

      updateDisplayedLines();
    }

    if (currentLineNumber !== getCurrentLineNumber()) {
      inputTextEl.value = '';
      event.preventDefault(); // нужен для того, чтобы последний символ тоже стереть

      started = false;
      const currentTime = Date.now() - startMoment; // в милисек
      document.querySelector('#wordsSpeed').textContent = Math.round(60000 * letterCounter/currentTime);
      document.querySelector('#errorPercent').textContent = Math.floor(100 * 100 * letterCounter_error / letterCounter)/100 + '%';
      letterCounter = 0;
      letterCounter_error = 0;
    }
  });

  inputTextEl.addEventListener("keyup", function (event) {
    colorize(event, false);
  });

  function colorize(event, need) {
    const element = document.querySelector('[data-key="' + event.code + '"]');
    if (element) {
      (need) ? element.classList.add('hint') : element.classList.remove('hint')
    }
    // if (event.key == 'Tab') element.classList.remove('hint') // TODO ////////////////
  }

}

function getLines(text) {
  const lines = [];
  let line = [];
  let idCounter = 0;

  for (const originalLetter of text) {
    idCounter++;
    let letter = originalLetter;

    if (letter === ' ') {
      letter = '°';
    }

    if (letter === '\n') {
      letter = '¶\n';
    }

    line.push({
      id: idCounter,
      label: letter,
      original: originalLetter,
      state: true,
    });

    if (line.length >= 70 || letter === "¶\n") {
      lines.push(line);
      line = [];
    }
  }

  if (line.length > 0) {
    lines.push(line);
  }
  return lines;
}

function lineToHtml(line) {
  const divElement = document.createElement("div"); // создали
  divElement.classList.add("line"); // дали имя класса

  for (const letter of line) {
    const spanElement = document.createElement("span");
    spanElement.textContent = letter.label; // положили символ

    divElement.append(spanElement); // заполнили буквами по одной

    if (letterId > letter.id) {
      spanElement.classList.add("done");
    }
    else if(!letter.state){
      spanElement.classList.add("hint")
    }
  }

  return divElement;
}

function getCurrentLineNumber() {
  for (let i = 0; i < lines.length; i++) {
    for (const letter of lines[i]) {
      if (letter.id === letterId) {
        return i;
      }
    }
  }
  return null;
}

function updateDisplayedLines() {
  const currentLineNumber = getCurrentLineNumber();
  textExampleEl.innerHTML = "";

  for (let i = 0; i < lines.length; i++) {
    const html = lineToHtml(lines[i]);
    textExampleEl.append(html);

    if (i < currentLineNumber || i > currentLineNumber + 2) {
      html.classList.add("hidden");
    }
  }
}

function getCurrentLetter() {
  for (const line of lines) {
    for (const letter of line) {
      if (letterId === letter.id) {
        return letter;
      }
    }
  }
  return null;
}

// 41.44 - 3 день // ок 10 мин до конца