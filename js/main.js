const text = `Сложно сказать, почему непосредственные участники технического прогресса освещают чрезвычайно интересные особенности картины в целом, однако конкретные выводы, разумеется, описаны максимально подробно. Но действия представителей оппозиции разоблачены.
Независимые государства, вне зависимости от их уровня, должны быть обнародованы. Высокий уровень вовлечения представителей целевой аудитории является четким доказательством простого факта: консультация с широким активом требует определения и уточнения системы обучения кадров, соответствующей насущным потребностям. Современные технологии достигли такого уровня, что синтетическое тестирование, в своём классическом представлении, допускает внедрение экономической целесообразности принимаемых решений.
Не следует, однако, забывать, что сплочённость команды профессионалов играет определяющее значение для первоочередных требований. Независимые государства призывают нас к новым свершениям, которые, в свою очередь, должны быть объявлены нарушающими общечеловеческие нормы этики и морали. Господа, высокое качество позиционных исследований играет важную роль в формировании распределения внутренних резервов и ресурсов.`

const inputTextEl = document.querySelector('#inputText');
const textExampleEl = document.querySelector('#textExample');

const lines = getLines (text);
let letterId = 1; // очередной символ, на кот польсозатель должен нажать
updateDisplayedLines();
// lineToHtml(lines[0]);

inputTextEl.addEventListener('keydown', function (event){
  const currentLetter = getCurrentLetter();
  if(event.key === currentLetter.label){
    letterId++;
  }
  updateDisplayedLines();
})

function getLines (text){
  const lines = [];
  let line = [];
  let idCounter = 0;

  for (const letter of text) {
    idCounter++;

    line.push({
      id: idCounter,
      label: letter,
      state: true,
    })

    if(line.length >= 70 || letter === '\n'){
      lines.push(line);
      line = [];
    }
  }

  if (line.length > 0){
    lines.push(line)
  }
  return lines
}

function lineToHtml (line){

  const divElement = document.createElement('div'); // создали
  divElement.classList.add('line'); // дали имя класса

  for (const letter of line) {
    const spanElement = document.createElement('span');
    spanElement.textContent = letter.label; // положили символ

    divElement.append(spanElement); // заполнили буквами по одной

    if (letterId > letter.id){
      spanElement.classList.add('done');
    }
  }

  return divElement;
}

function getCurrentLineNumber(){ 
  for (let i=0; i<lines.length; i++){
    for(const letter of lines[i]){
      if (letter.id === letterId){
        return i;
      }      
    }
  }
  return null;
}

function updateDisplayedLines(){
  const currentLineNumber = getCurrentLineNumber();
  textExampleEl.innerHTML = '';

  for (let i = 0; i < lines.length; i++) {
    const html = lineToHtml(lines[i]);
    textExampleEl.append(html);

    if(i<currentLineNumber || i>currentLineNumber+2){
      html.classList.add('hidden');
    }
  }
}

function getCurrentLetter(){
  for (const line of lines){
    for(const letter of line){
      if(letterId === letter.id){
        return letter;
      }
    }
  }
  return null;
}