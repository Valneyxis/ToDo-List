// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

// Funções
const createButton = (className, icon) => {
  const button = document.createElement("button");
  button.classList.add(className);
  button.innerHTML = `<i class="fa-solid fa-${icon}"></i>`;
  return button;
};

const saveTodo = (text, done = 0, save = true) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  todo.appendChild(createButton("finish-todo", "check"));
  todo.appendChild(createButton("edit-todo", "pen"));
  todo.appendChild(createButton("remove-todo", "xmark"));

  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    saveTodoLocalStorage({ text, done: 0 });
  }

  todoList.appendChild(todo);
  todoInput.value = "";
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
  document.querySelectorAll(".todo").forEach((todo) => {
    const todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;
      updateTodoLocalStorage(oldInputValue, text);
    }
  });
};

const getSearchedTodos = (search) => {
  document.querySelectorAll(".todo").forEach((todo) => {
    const todoTitle = todo.querySelector("h3").innerText.toLowerCase();
    todo.style.display = todoTitle.includes(search) ? "flex" : "none";
  });
};

const filterTodos = (filterValue) => {
  document.querySelectorAll(".todo").forEach((todo) => {
    const isDone = todo.classList.contains("done");
    todo.style.display = filterValue === "all" ||
                         (filterValue === "done" && isDone) ||
                         (filterValue === "todo" && !isDone) ? "flex" : "none";
  });
};

// Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = todoInput.value.trim();
  if (inputValue) saveTodo(inputValue);
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div.todo");
  if (!parentEl) return;

  const todoTitle = parentEl.querySelector("h3").innerText;

  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");
    updateTodoStatusLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();
    removeTodoLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();
    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const editInputValue = editInput.value.trim();
  if (editInputValue) updateTodo(editInputValue);
  toggleForms();
});

searchInput.addEventListener("keyup", (e) => getSearchedTodos(e.target.value.toLowerCase()));

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchInput.value = "";
  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => filterTodos(e.target.value));

// Local Storage
const getTodosLocalStorage = () => JSON.parse(localStorage.getItem("todos")) || [];

const loadTodos = () => {
  getTodosLocalStorage().forEach(({ text, done }) => saveTodo(text, done, false));
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage().filter(({ text }) => text !== todoText);
  localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoStatusLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage().map((todo) => {
    if (todo.text === todoText) todo.done = !todo.done;
    return todo;
  });
  localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodosLocalStorage().map((todo) => {
    if (todo.text === todoOldText) todo.text = todoNewText;
    return todo;
  });
  localStorage.setItem("todos", JSON.stringify(todos));
};

loadTodos();
