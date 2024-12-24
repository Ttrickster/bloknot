// находим елементы на странице

const form = document.querySelector('#form');

const taskInput = document.querySelector('#taskInput');

const tasksList = document.querySelector('#tasksList');

const emptyList = document.querySelector('#emptyList');

// создаем масив для задач

let tasks = [];

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

// длбавление задачи

form.addEventListener('submit', addTask);

// удаление задачи

tasksList.addEventListener('click', deleteTask);

// отмечаем задачу завершоной

tasksList.addEventListener('click', doneTask);

// функции
function addTask(event) {
  // оменяем отправку формы

  event.preventDefault();

  // достаем такст задачи из поля вода

  const taskText = taskInput.value;

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  tasks.push(newTask);

  // Сохраняем список задачь в хранилище браузера  localStorage

  saveTolocalStorage();

  // рендерим задачу на страницу

  renderTask(newTask);

  // очещаем поле ввода и возращаем на него фокус

  taskInput.value = '';
  taskInput.focus();

  checkEmptyList();
}

function deleteTask(event) {
  // проверяем если клик был НЕ по кнопке "удалить задачу"

  if (event.target.dataset.action !== 'delete') {
    return;
  }

  const parenNode = event.target.closest('.list-group-item');

  // Определяем id задачи

  const id = Number(parenNode.id);

  // Удаляем задачу через фильтрацию масива

  tasks = tasks.filter((task) => task.id !== id);

  // Сохраняем список задачь в хранилище браузера  localStorage

  saveTolocalStorage();

  // Удаляем задачу из разметки
  parenNode.remove();

  checkEmptyList();
}

function doneTask(event) {
  // проверяем если клик  был  НЕ по кнопке "задача выполнена"

  if (event.target.dataset.action !== 'done') return;

  const parentNode = event.target.closest('.list-group-item');
  // Определяем id задачи

  const id = Number(parentNode.id);

  const task = tasks.find(function (task) {
    if (task.id === id) {
      return true;
    }
  });

  task.done = !task.done;

  // Сохраняем список задачь в хранилище браузера  localStorage

  saveTolocalStorage();

  const taskTitle = parentNode.querySelector('.task-title');
  taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
  console.log();
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
            <div class="empty-list__title">Список дел пуст</div>
          </li>`;

    tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector('#emptyList');
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveTolocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
  const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

  const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
           <span class="${cssClass}">${task.text}</span>
           <div class="task-item__buttons">
             <button type="button" data-action="done" class="btn-action">
               <img src="./img/tick.svg" alt="Done" width="18" height="18">
             </button>
             <button type="button" data-action="delete" class="btn-action">
               <img src="./img/cross.svg" alt="Done" width="18" height="18">
             </button>
           </div>
         </li>`;

  // доставляем задачу на страницу

  tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
