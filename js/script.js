// Classes
class toDo {
  constructor(name) {
    this.name = name,
      this.status = 'notCompleted'
  }
  checkIfObjectIsValid() {
    for (let i in this) {
      if (this[i] === undefined || this[i] === null || this[i] === '') {
        return false
      }
      return true
    }
  }
}

class DB {
  constructor() {
    let id = localStorage.getItem('id')

    // check whether id exist or not
    !id && localStorage.setItem("id", "0")
  }

  // get next id 
  getNextId() {
    let id = localStorage.getItem('id')
    return parseInt(id) + 1
  }

  // save items in localStorage
  saveItem(item) {
    let id = this.getNextId()
    localStorage.setItem(id, JSON.stringify(item))
    localStorage.setItem("id", id)
  }

  // get all the items from localStorage in a array of objects
  getItemsFromLocalStorage() {
    let items = []
    let id = localStorage.getItem("id")

    for (let i = 0; i <= id; i++) {
      let item = JSON.parse(localStorage.getItem(i))

      if (item == null) {
        continue
      }
      item.id = i

      items.push(item)
    }

    return items
  }

  changeToDoStatus(id) {
    let todo = JSON.parse(localStorage.getItem(id))

    switch (todo.status) {
      case ('notCompleted'):
        todo.status = 'completed'
        break;
      case ('completed'):
        todo.status = 'notCompleted'
        break;
    }

    localStorage.setItem(id, JSON.stringify(todo))

  }

  checkHowManyItemsAreLeft() {
    let itemsLeft = 0
    let id = localStorage.getItem("id")

    for (let i = 0; i <= id; i++) {
      let item = JSON.parse(localStorage.getItem(i))

      if (item == null || item.status === 'completed' || item.status === 'inactive') {
        continue
      }

      itemsLeft++
    }

    return itemsLeft
  }

  deleteToDo(id) {
    let todo = JSON.parse(localStorage.getItem(id))

    todo.status = 'inactive';

    localStorage.setItem(id, JSON.stringify(todo))
  }

  // filter all tasks with the selected category
  filterTasks(status) {
    let items = this.getItemsFromLocalStorage()
    let filteredItems = []

    filteredItems = items.filter(todo => todo.status === status)

    return filteredItems
  }

  // clear all tasks with the status equal to "Completed"
  clearCompleted() {
    let items = this.getItemsFromLocalStorage()

    items.forEach(todo => {

      let id = todo.id

      if (todo.status == 'completed') {
        todo.status = 'inactive'
      }

      localStorage.setItem(id, JSON.stringify(todo))
    })
  }

  // it edits the text of an specific element
  editTaskText(id, text) {

    let taskToBeEdited = JSON.parse(localStorage.getItem(id))

    taskToBeEdited.name = text

    localStorage.setItem(id, JSON.stringify(taskToBeEdited))
  }

}

const db = new DB


const input = document.getElementById('todoInput')

// listen to the enter keypress
input.addEventListener('keyup', (e) => {

  const key = e.keyCode
  const addTodoDiv = document.querySelector('.addTodoDiv')

  input.value && addTodoDiv.classList.add('typing')
  !input.value && addTodoDiv.classList.remove('typing')

  if (key == 13) {
    addToDo()
    ShowToDos()
  }
})

// add a todo
function addToDo() {
  const name = input.value
  const task = new toDo(name)
  if (task.checkIfObjectIsValid()) {
    db.saveItem(task)
    input.value = ''
    document.querySelector('.addTodoDiv').classList.remove('typing')
  } else {
    alert('Input Cannot Be Blank!')
  }
}

// function to show all the todo tasks in the body
function ShowToDos(array = [], filter = false) {

  // check what category is active
  let currentOption = document.querySelector('.option.active').getAttribute('data-filter').toLowerCase()

  switch (currentOption) {
    case ('active'):
      filter = true
      array = db.filterTasks('notCompleted')
      break;
    case ('completed'):
      filter = true
      array = db.filterTasks('completed')
      break;
    case ('all'):
      filter: false;
      array = db.getItemsFromLocalStorage()
  }

  let list = document.getElementById('TodoList')
  let itemsLeft = document.getElementById('itemsLeft')
  itemsLeft.innerHTML = db.checkHowManyItemsAreLeft()

  list.innerHTML = ''

  array.forEach(todo => {

    if (todo.status !== 'inactive') {
      //li
      let li = document.createElement("li")
      li.classList.add('draggable')
      li.setAttribute('draggable', true)

      //circle
      let circle = document.createElement('i')

      if (todo.status == 'completed') {
        circle.className = 'fa-regular fa-circle-check'
      } else {
        circle.className = 'fa-regular fa-circle'
      }

      //function to change task status
      circle.addEventListener('click', () => {
        db.changeToDoStatus(todo.id)
        ShowToDos()
      })

      //span 
      let span = document.createElement('span')
      span.innerHTML = `${todo.name}`

      // edit span text on click
      span.addEventListener('click', (e) => {
        e.target.classList.add('editable')
        e.target.setAttribute('contentEditable', true)
        
        e.target.focus()

        moveCursorAtTheEnd(e.target)

        // it gets the span parentElement then it adds the class hidden to the close icon 
        e.target.parentElement.querySelector('.close').classList.add('hidden')


        // checks whether the span tag contains the editable classname and if editable icon already exist
        if (e.target.classList.contains('editable') && !li.querySelector('i.editIcon')) {
          // create the editable icon
          let editableIcon = document.createElement('i')
          editableIcon.className = 'editIcon fa-solid fa-pen-to-square'

          //listen to when the user click on the icon
          editableIcon.addEventListener('click', () => {
            // it adds the new text to the selected task
            db.editTaskText(todo.id, e.target.innerHTML)

            //removes the editable class and editable attribute of the span
            e.target.classList.remove('editable')
            e.target.contentEditable = false

            //removes editable icon of list
            li.querySelector('i.editIcon').removeChild

            //removes the class hidden of the close icon
            document.querySelector('.close').classList.remove('hidden')

            ShowToDos()
          })

          li.appendChild(editableIcon)
        }

      })

      if (todo.status == 'completed') {
        span.classList.add('completed')
      }

      //close icon
      let close = document.createElement('img')
      close.src = './assets/images/icon-cross.svg'
      close.classList.add('close')

      close.addEventListener('click', () => {
        db.deleteToDo(todo.id)
        ShowToDos()
      })


      /* appends */
      li.appendChild(circle)
      li.appendChild(span)
      li.appendChild(close)

      list.appendChild(li)

    }

  })

  /* function to enable dragAndDrop after we showed all todo tasks */
  DragAndDrop()
}

/* select active category & filter tasks on onclick */
let options = []

options = document.querySelectorAll("ul li .option");

for (let i = 0; i < options.length; i++) {
  options[i].addEventListener('click', (e) => {

    let current = document.querySelector('.option.active')
    let target = e.target.getAttribute('data-filter').toLowerCase()

    current.classList.remove('active')
    e.target.classList.add('active')

    switch (target) {
      case ('active'):
        ShowToDos(db.filterTasks('notCompleted'), true)
        break;
      case ('completed'):
        ShowToDos(db.filterTasks('completed'), true)
        break;
      case ('all'):
        ShowToDos()
        break;
    }

  })
}

/* Clear Completed to dos */
let ClearCompleted = document.getElementById('clear')

clear.addEventListener('click', () => {
  db.clearCompleted()
  ShowToDos()
});

// function to checks what screen size does the user have and depending on the size it defines the active category
const checkUserScreenSize = () => {
  options = document.querySelectorAll("ul li .option");

  if (window.innerWidth < 600) {
    for (let i = 0; i < options.length; i++) {
      if (i === 3) {
        options[i].classList.add('active')
      } else {
        options[i].classList.remove('active')
      }
    }
    ShowToDos()
  }
  else {
    for (let i = 0; i < options.length; i++) {
      if (i === 0) {
        options[i].classList.add('active')
      } else {
        options[i].classList.remove('active')
      }
    }
    ShowToDos()
  }
}

// it shows all tasks on body load
window.addEventListener('load', () => {
  checkUserScreenSize()
  ShowToDos()

})

// it checks what screen size does the user have
window.addEventListener('resize', () => {
  checkUserScreenSize()
}
)



// Drag & drop function
function DragAndDrop() {
  // get all elements that we can drag
  const draggables = document.querySelectorAll('.draggable')
  // get the list container
  const todoList = document.querySelector('#TodoList')

  // loop through each of our draggables
  draggables.forEach(draggable => {
    //it adds the class 'dragging' as soon as we drag an element
    draggable.addEventListener('dragstart', () => {
      draggable.classList.add('dragging')
    })

    //it removes the class 'dragging' as soon as we drag an element
    draggable.addEventListener('dragend', () => {
      draggable.classList.remove('dragging')
    })
  })

  // it adds a dragover event into our todoList, to check whether we dropped the element or not
  todoList.addEventListener('dragover', (e) => {
    e.preventDefault()
    const draggable = document.querySelector('.dragging')
    const afterElement = getDragAfterElement(todoList, e.clientY)

    if (afterElement === null) {
      todoList.appendChild(draggable)
    } else {
      todoList.insertBefore(draggable, afterElement)
    }

  })
}

// function to get the after element we are about to drop
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect()
    const offset = y - box.top - box.height / 2
    if (offset < 0 && offset > closest.offset) {
      /* if offset is negative we are above */
      return { offset: offset, element: child }
    } else {
      return closest
    }

  }, { offset: Number.NEGATIVE_INFINITY }).element
}

/* function to sets the cursor to the end of the line when span is being edit */
function moveCursorAtTheEnd(contenteditable) {
  let selection = document.getSelection();
  let range = document.createRange();

  if (contenteditable.lastChild.nodeType == 3) {
    range.setStart(contenteditable.lastChild, contenteditable.lastChild.length);
  } else {
    range.setStart(contenteditable, contenteditable.childNodes.length);
  }
  selection.removeAllRanges();
  selection.addRange(range);

}
