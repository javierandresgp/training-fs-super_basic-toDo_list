/* VARIABLES */
const d = document,
  apiUrl = 'http://localhost:4000/api/v1/todos',
  $main = d.querySelector('main'),
  $input = d.createElement('input'),
  $btn = d.createElement('button'),
  $p = d.createElement('p'),
  $ul = d.createElement('ul');

let $infoBtns = null,
  $delBtns = null;

let todos = null;

$main.classList.add('container');

/* EVENTS */
d.addEventListener('DOMContentLoaded', () => {
  const $h1 = d.createElement('h1'),
    $form = d.createElement('form');
  $h1.classList.add('h1');
  $h1.textContent = 'My To-Do list';
  $input.setAttribute('type', 'text');
  $form.appendChild($input);
  $btn.textContent = 'Create';
  $btn.classList.add('btn', 'btn-add');
  $form.appendChild($btn);
  $form.classList.add('form');
  $main.appendChild($h1);
  $main.appendChild($form);
  readTodos();
  eventListeners();
});

const eventListeners = () => {
  $btn.addEventListener('click', createTodo);
};

const watchChecks = (checks) => {
  checks.forEach((check) => {
    const id = check.parentNode.parentNode.id;
    const task = check.parentNode.parentNode.dataset.task;
    const done = check.checked;
    check.addEventListener('click', () => updateTodo(id, task, done));
  });
};

const watchInfoBtns = (btns) => {
  btns.forEach((btn) => {
    const id = btn.parentNode.parentNode.id;
    btn.addEventListener('click', () => readTodo(id));
  });
};

const watchDelBtns = (btns) => {
  btns.forEach((btn) => {
    const id = btn.parentNode.parentNode.id;
    btn.addEventListener('click', () => deleteTodo(id));
  });
};

/* FUNCTIONS */
const createTodo = () => {
  const data = {
    name: $input.value,
    completed: false,
  };

  if (!data.name) return alert('to-do required!');

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        readTodos();
        $input.value = null;
      }
    });
};

const readTodos = () => {
  $p.textContent = '';
  $ul.innerHTML = '';
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      todos = data.success;
      if (todos.length === 0) {
        $p.classList.add('p');
        $p.textContent = 'Without To-Dos';
        $main.appendChild($p);
      } else {
        todos.forEach((item) => {
          const $div = d.createElement('div');
          ($delBtn = d.createElement('button')),
            ($infoBtn = d.createElement('button')),
            ($checkbox = d.createElement('input')),
            ($li = d.createElement('li'));
          $infoBtn.classList.add('btn', 'btn-info');
          $infoBtn.textContent = 'More info';
          $delBtn.classList.add('btn', 'btn-del');
          $delBtn.textContent = 'Delete';
          $checkbox.setAttribute('type', 'checkbox');
          $checkbox.checked = item.completed;
          $li.setAttribute('id', item._id);
          $li.dataset.task = item.name;
          $li.dataset.done = item.completed;
          $li.appendChild(d.createTextNode(item.name));
          $div.appendChild($checkbox);
          $div.appendChild($infoBtn);
          $div.appendChild($delBtn);
          $li.appendChild($div);
          $ul.appendChild($li);
        });
        $ul.classList.add('ul');
        $main.appendChild($ul);
        $infoBtns = d.querySelectorAll('.btn-info');
        watchInfoBtns($infoBtns);
        $delBtns = d.querySelectorAll('.btn-del');
        watchDelBtns($delBtns);
        $checks = d.querySelectorAll('input[type=checkbox]');
        watchChecks($checks);
      }
    });
};

const readTodo = (id) => {
  if (!id) return alert('id required!');
  fetch(`${apiUrl}/${id}`)
    .then((res) => res.json())
    .then((data) => {
      const status = data.success.completed ? ', is ' : ', is not ';
      $p.classList.add('p');
      $p.textContent = 'The task: ' + data.success.name + status + 'completed';
      $main.appendChild($p);
    })
    .catch((err) => console.error('err:', err));
};

const updateTodo = (id, task, done) => {
  if (!id) return alert('id required!');
  const data = {
    name: task,
    completed: !done,
  };
  fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => readTodos())
    .catch((err) => console.error('err:', err));
};

const deleteTodo = (id) => {
  if (!id) return alert('id required!');
  fetch(`${apiUrl}/${id}`, {
    method: 'DELETE',
  })
    .then((res) => readTodos())
    .catch((err) => console.error('err:', err));
};
