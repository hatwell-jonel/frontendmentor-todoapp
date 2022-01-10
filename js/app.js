const body = document.querySelector("body");
const inputTodoEl = document.querySelector("#input");
const formEl = document.querySelector(".form");
const todoListEl = document.querySelector(".todo-list");
const addTodoBtn = document.querySelector(".circle");
const themeSelectorBtn = document.querySelector
("#theme-selector");
const themeIcon = document.querySelector("#theme-selector .theme-icon");
const todoCount = document.querySelector(".count");
const completedTodoEl = document.querySelector("#completed");
const activeTodoEl = document.querySelector("#active");
const clearCompletedEl = document.querySelector("#clear");
const allTodoEl = document.querySelector("#all");
const filterBtns = document.querySelectorAll(".filter-btn");

let todoItems = [];
let todoId = 0;
let todo = "todo";

// ======= THEME SELECTION ===========

// LOCALSTORAGE FOR THEME SELECTION
let lightTheme = false;
let storeTheme = localStorage.getItem("theme");

if(storeTheme === "light-theme"){
  lightTheme = true;
  themeIcon.src = "./images/icon-moon.svg"
}else{
  lightTheme = false;
}

if(lightTheme){
  document.body.classList.toggle("light-theme");
}

//THEME SELECTION
themeSelectorBtn.addEventListener('click', (e) =>{
  document.body.classList.toggle("light-theme");

  localStorage.setItem("theme", document.body.classList.contains('light-theme') ? 'light-theme' : 'default');
  
  if(document.body.classList.contains('light-theme')){
    themeIcon.src = "./images/icon-moon.svg"
  }
  else{
    themeIcon.src = "./images/icon-sun.svg"
  }
})

// ======= EVENTS ============

// PREVENT FORM TO RELOAD
formEl.addEventListener("submit", event =>{
  event.preventDefault();
})

// ADD TODO BY PRESSING "ENTER"
inputTodoEl.addEventListener("keypress", event =>{
  if(event.charCode === 13 && inputTodoEl.value.length > 0){

    addTodo(inputTodoEl.value);
    inputTodoEl.value = "";
  }
})

// ADD TODO BY CLICKING THE CIRCLE BUTTON
addTodoBtn.addEventListener("click", event =>{
  if(inputTodoEl.value.length > 0){
    addTodo(inputTodoEl.value);
    inputTodoEl.value = "";
  }
})

// ============
// FUNCTIONS 
// ============

// THIS WILL ADD TODO TO DOM
function addTodo(text, isNew = true){
  let todoEl = document.createElement('li');

  todoEl.id = "" + todoId;
  todoEl.innerHTML = 
  `
  <button type="button" class="checkbox"></button>
  <p class="text">${text}</p>
  <img src="./images/icon-cross.svg"  class="btn img-fluid delete" alt="delete todo" id="delete" role="button" tabindex="0" />
  `;
  
  if(isNew){
    todoItems.push({
      active:true,
      content: text,
      DOMelement: todoEl,
      id: todoId++
    });
    setLocalStorage();
  }
  else{
    todoItems.forEach(obj =>{
      if(obj.id === todoId){
        obj.DOMelement = todoEl;
        if(!obj.active){
          todoEl.classList.add("checked");
        }
      }
    })
  }
  todoListEl.prepend(todoEl);

  // MARK THE TODO AS COMPLETED;
  const checkbox = document.querySelector('.checkbox');
  checkbox.addEventListener('click', () => {
    changeActiveState(todoEl);
  });

  // DELETE TODO
  const deleteBtn = document.querySelector(".delete");
  deleteBtn.addEventListener('click', e =>{
      removeTodo(todoEl);
  })

  // SHOW ONLY THE ACTIVE TODO
  activeTodoEl.addEventListener('click', e =>{
    activeElements(todoEl);
  })

  // SHOW ONLY THE COMPLETED TODO
  completedTodoEl.addEventListener('click', e =>{
    completedElements(todoEl);
  })

  // SHOW ALL TODO.
  allTodoEl.addEventListener('click', e =>{
    allElement(todoEl);
  })

  // CLEAR ALL COMPLETED TODO.
  clearCompletedEl.addEventListener('click', e => {
     clearCompleted(todoEl);
  })

  // ACTIVE FILTER BUTTON
  filterBtns.forEach(btn =>{
    btn.addEventListener('click', e =>{

      filterBtns.forEach(item =>{
        if(item !== btn){
          item.classList.remove('active');
        }
      });

      btn.classList.add('active');
    })
  })

  activeItemsCount();
}

// FILTER FUNCTIONS
function clearCompleted(element){
  if(element.classList.contains("checked")){
    removeTodo(element);
  }
}

function activeElements(element){
  if(element.classList.contains('checked')){
    element.style.display = 'none';
  }
  else{
    element.style.display = 'flex';
  }
}

function completedElements(element){
  if(element.classList.contains('checked')){
    element.style.display = 'flex';
  }
  else{
    element.style.display = 'none';
  }
}

function allElement(element){
  element.style.display = "flex";
}

// THIS WILL MARK TODO IF ITS ACTIVE OR NOT.
function changeActiveState(element){
  element.classList.toggle('checked');
  let isActive = true;
  if(element.classList.contains('checked')){
    isActive = false;
  }

  todoItems.forEach( obj =>{
    if(obj.id === +element.id){
      obj.active = isActive;
    }
  })

  setLocalStorage();
  activeItemsCount();
  
}

// COUNTS OF THE ACTIVE ELEMENTS
function activeItemsCount(){
  let count = todoItems.reduce( (count, obj) =>{
    // if the todo is is active theme count increases, if not count decreases.
    if(obj.active) count++;
    return count;
  }, 0)

  todoCount.innerHTML = count;
}

// UPDATE THE ID AFTER DELETION
function updateCurrentId(){
  if(!todoItems.length){
    todoId = 0;
  }
  else{
    todoId = todoItems[todoItems.length - 1].id + 1;
  }
}

// REMOVE THE ELEMENT FROM THE DOM
function removeTodoFromDOM(element){
  element.remove();
}

// REMOVE THE ELEMENT FROM THE STORAGE
function removeFromStorage(id){
  todoItems = todoItems.filter( obj =>{
    return obj.id !== +id;
  })

  // update localstorage after deletion
  setLocalStorage();
}

// REMOVE THE ELEMENT IN DOM ALSO IN STORAGE
function removeTodo(element){
  removeTodoFromDOM(element);
  removeFromStorage(+element.id);
  updateCurrentId();
  activeItemsCount();
}


//  LOCALSTORAGE
function setLocalStorage(){
  localStorage.setItem(todo, JSON.stringify(todoItems));
}


function getLocalStorage() {
  let getStorage = localStorage.getItem(todo);

  if(getStorage === null){
    localStorage.setItem(todo, JSON.stringify([]));
  }
  else if (JSON.parse(getStorage).length){
    todoItems = JSON.parse(getStorage);

    todoItems.forEach( todo =>{
      if(todoId < +todo.id) {
        todoId = +todo.id;
      } 
      addTodo(todo.content, false)
    })
    todoId++;
  }

  activeItemsCount();
}

getLocalStorage();

// DRAG (LIBRARY)
Sortable.create(todoListEl, {
  animation: 400
});
