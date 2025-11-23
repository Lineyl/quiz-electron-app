import { validateAllAnswer } from "./validator.js";
const SHOW_RESULTS_COLOR_MODE = false;
let data;

fetch('./data/questions.json')
    .then(response => response.json())
    .then(fetchedData => {
      const quiz = document.querySelector('.quiz');
      data = fetchedData;
      for (let item of fetchedData.questions) {
        let question = document.createElement('div');
        question.className = 'question';
        question.setAttribute('data-id', item.id);

        let questionNumber = document.createElement('div');
        questionNumber.className = 'question__number';
        questionNumber.textContent = item.id;

        let questionText = document.createElement('p');
        questionText.className = 'question__text';
        questionText.textContent = item.text;

        let questionInput;

        if (item.type === "text") {

          questionInput = document.createElement('input');
          questionInput.className = 'question__input';
          questionInput.setAttribute('data-id', item.id);
          questionInput.setAttribute('type', 'text');

        } else if (item.type === "radio") {
          questionInput = document.createElement('div');
          questionInput.className = 'question__options';

          for (let op of item.options) {
            let questionLabel = document.createElement('label');
            questionLabel.className = 'question__label';

            let radioOption = document.createElement('input');
            radioOption.className = 'question__option';
            radioOption.setAttribute("type", "radio");
            radioOption.setAttribute("name", `question_${item.id}`);
            radioOption.setAttribute('value', op);
            radioOption.setAttribute('data-id', item.id);

            let optionText = document.createElement('p');
            optionText.className = 'option__text';
            optionText.textContent = op;

            questionLabel.appendChild(radioOption);
            questionLabel.appendChild(optionText);

            questionInput.appendChild(questionLabel);
          }
        } else {
          console.log('Hello')
          continue;
        }

        question.appendChild(questionNumber);
        question.appendChild(questionText);
        question.appendChild(questionInput);

        quiz.appendChild(question);
      }
    })
    .catch(error => console.error('Ошибка:', error));

const disableAllInputs = () => {
  const allInputs = document.querySelectorAll('input');
  for (let input of allInputs) {
    input.disabled = true;
  }
}

const renderResults = (results) => {
  for (let res of results) {
    const question = document.querySelector(`[data-id="${res.id}"]`);
    if (res.isCorrect) {
      question.classList.add('correct');
    } else {
      question.classList.add('incorrect');
    }
  }
}

const renderResultsModal = (results) => {
  let correctCount = 0;
  let totalCount = results.length;

  for (let res of results) {
    if (res.isCorrect) {
      correctCount++;
    }
  }

  const modal = document.createElement('div');
  modal.className = 'results-modal';

  const modalContent = document.createElement('div');
  modalContent.className = 'results-modal__content';

  const madalTitle = document.createElement('h2');
  madalTitle.className = 'results-modal__title';
  madalTitle.textContent = 'Результаты'
  modalContent.appendChild(madalTitle);

  const modalScore = document.createElement('p');
  modalScore.className = 'results-modal__score';
  modalScore.textContent = `Правильных ответов ${correctCount} из ${totalCount}`;
  modalContent.appendChild(modalScore);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'results-modal__close-btn';
  closeBtn.textContent = 'Закрыть';

  closeBtn.addEventListener('click', () => {
    modal.remove();
  })

  modalContent.appendChild(closeBtn);
  modal.appendChild(modalContent);

  document.body.appendChild(modal);
}

const saveBtn = document.getElementById('save-btn');
let resultsData = null;

saveBtn.addEventListener('click', (e) => {
  const headerInputs = document.querySelectorAll('.header__input');

  const questionInputs = document.querySelectorAll('.question__input');
  const questionOptions = document.querySelectorAll('.question__options');

  const answers = [];

  let allFilled = true;

  for (let item of headerInputs) {
    if (item.value.trim() === '') {
      allFilled = false;
      item.style.borderColor = 'red';
    } else {
      item.style.borderColor = '';
    }
  }

  for (let item of questionInputs) {
    if (item.value.trim() === '') {
      allFilled = false;
      item.style.borderColor = 'red';
    } else {
      item.style.borderColor = '';
      answers.push({
        id: parseInt(item.getAttribute('data-id')),
        type: "text",
        userAnswer: item.value,
      });
    }
  }

  for (let options of questionOptions) {
    const checked = options.querySelector('input[type="radio"]:checked');
    if (!checked) {
      allFilled = false;
      options.style.border = '2px solid red';
    } else {
      options.style.border = '';
      const questionId = checked.getAttribute('data-id');
      answers.push({
        id: parseInt(questionId),
        type: "radio",
        userAnswer: checked.value,
      });
    }
  }

  if (allFilled) {
    const results = validateAllAnswer(answers, data.questions);
    if (!resultsData){
      if (SHOW_RESULTS_COLOR_MODE) {
        renderResults(results);
      }
      renderResultsModal(results);
      disableAllInputs();

      resultsData = results;
      saveBtn.textContent = 'Посмотреть результат';

      window.electron.saveResults({
        surname: document.querySelector('[id="surname"]').value,
        name: document.querySelector('[id="name"]').value,
        group: document.querySelector('[id="group_number"]').value,
        results: results,
      })
    } else {
      renderResultsModal(resultsData);
    }
  }
})

document.addEventListener('input', (e) => {
  if (e.target.classList.contains('header__input') ||
      e.target.classList.contains('question__input')) {
    e.target.style.borderColor = '';
  }
});

document.addEventListener('change', (e) => {
  if (e.target.getAttribute('type') === 'radio') {
    const container = e.target.closest('.question__options');
    if (container) {
      container.style.border = '';
    }
  }
});