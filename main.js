class Task {
  constructor(taskNumber, description, deadline, status) {
    this.taskNumber = taskNumber;
    this.description = description;
    this.deadline = deadline;
    this.status = status;
  }
}

const NUMBER_REQUIRED = 'Por favor insira o número da tarefa'
const NUMBER_INVALID = 'Por favor insira somente números'
const DESCRIPTION_REQUIRED = 'Por favor insira a descrição da tarefa'
const DEADLINE_REQUIRED = 'Por favor insira um prazo para a tarefa'
const DEADLINE_INVALID = 'Por favor insira um prazo no padrão correto: DD/MM/AAAA'
const STATUS_REQUIRED = 'Por favor insira o status da tarefa'

const openModalNewTaskButton = document.querySelector('.openModalNewTaskButton')

const registerTaskModal = document.querySelector('.registerTaskModal')

const editTaskModal = document.querySelector('.editTaskModal')

const modalTitle = document.querySelector('.modalTitle')

const closeModalButton = document.querySelector('.closeModalButton')

const inputs = document.querySelectorAll('.formInputs')

const inputNumber = document.querySelector('#inputNumber')

const inputDescription = document.querySelector('#inputDescription')

const inputDate = document.querySelector('#inputDate')

const inputTaskStatus = document.querySelector('#taskStatusInput')

const modalEventButton = document.querySelector('.modalEventButton')

const tableTasksBody = document.querySelector('.tableTasksBody')

const smalls = document.querySelectorAll('small')

const openModal = (modal) => {
  modal.style.display = "block"
}

const closeModal = (modal) => {
  modal.style.display = "none"
  restartInputs(inputs)
  removeBorderFormInputs(inputs)
  removeTextSmalls(smalls)
}

openModalNewTaskButton.addEventListener('click', () => {
  modalEventButton.value = "newTask"
  modalTitle.innerHTML = 'Adicionar nova tarefa'
  validateEachInput()
  openModal(registerTaskModal)
})

closeModalButton.addEventListener('click', async (event) => {
  event.preventDefault()
  closeModal(registerTaskModal)

  let tasks = await getTasks()
  renderTasks(tasks)

  const deleteTaskButton = document.querySelectorAll('.deleteTaskButton')
  addActionToDeleteTaskButton(deleteTaskButton)

  const openModalEditTaskButton = document.querySelectorAll('.openModalEditTaskButton')
  addActionToOpenModalEditTaskButton(openModalEditTaskButton)
})

const insertTaskDetailsInObject = () => {
  const inputValues = []

  inputs.forEach((input) => {
    inputValues.push(input.value)
  })

  const task = new Task(...inputValues)

  return task
}

const addNewTask = async (newTask) => {
  await fetch("http://localhost:3000/tasks", {
    method: "POST",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "taskNumber": newTask.taskNumber,
      "description": newTask.description,
      "deadline": newTask.deadline,
      "status": newTask.status
    })
  });
}

const getTasks = async () => {
  const apiResponse = await fetch('http://localhost:3000/tasks')

  let tasks = await apiResponse.json()

  return tasks
}

const deleteTask = async (id) => {
  await fetch(`http://localhost:3000/tasks/${id}`, {
    method: 'DELETE',
  })
}

const updateTask = async (id, updatedTask) => {
  await fetch(`http://localhost:3000/tasks/${id}`, {
    method: "PUT",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "taskNumber": updatedTask.taskNumber,
      "description": updatedTask.description,
      "deadline": updatedTask.deadline,
      "status": updatedTask.status
    })
  });
}

const renderTasks = (tasks) => {
  tableTasksBody.innerHTML = ``

  tasks.forEach((task) => {
    tableTasksBody.innerHTML += `
    <tr>
      <td>${task.taskNumber}</td>
      <td>${task.description}</td>
      <td>${task.deadline}</td>
      <td value="${task.status}">${task.status}</td>
      <td>
        <button type="button" class="openModalEditTaskButton">
          <img src="/assets/edit.svg" alt="Edit Task">
        </button>
        <button type="button" class="deleteTaskButton">
            <img src="/assets/delete.svg" alt="Delete Task">
        </button>
      </td>
    </tr>
    `
  })
}

const validateTaskNumber = (input, requiredMsg, invalidMsg) => {
  if (!hasValue(input, requiredMsg)) {
    return false
  }

  const taskNumber = input.value
  const taskNumberRegex = new RegExp('^[0-9]+$')

  if (taskNumberRegex.test(taskNumber)) {
    return true
  }

  return showError(input, invalidMsg)
}

const validateTaskDeadline = (input, requiredMsg, invalidMsg) => {
  if (!hasValue(input, requiredMsg)) {
    return false
  }

  const taskDeadline = input.value
  const taskDeadlineRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/

  if (taskDeadlineRegex.exec(taskDeadline)) {
    return true
  }

  return showError(input, invalidMsg)
}

const isFormFieldsValid = () => {
  const numberTaskValid = validateTaskNumber(inputNumber, NUMBER_REQUIRED, NUMBER_INVALID)
  const descriptionValid = hasValue(inputDescription, DESCRIPTION_REQUIRED)
  const taskDeadlineValid = validateTaskDeadline(inputDate, DEADLINE_REQUIRED, DEADLINE_INVALID)
  const taskStatusValid = hasValue(inputTaskStatus, STATUS_REQUIRED)

  const validateFormFields = numberTaskValid && descriptionValid && taskDeadlineValid && taskStatusValid

  return validateFormFields
}

modalEventButton.addEventListener('click', async () => {

  if (isFormFieldsValid()) {
    if (modalEventButton.value === "newTask") {
      const newTask = insertTaskDetailsInObject()
      await addNewTask(newTask)
      removeBorderFormInputs(inputs)
      restartInputs(inputs)

    } else if (modalEventButton.value === "editTask") {
      const editedTask = insertTaskDetailsInObject()
      await updateTask(idTask, editedTask)
      removeBorderFormInputs(inputs)
    }
  }
  disableButton()
})

window.addEventListener('load', async () => {
  const tasks = await getTasks()
  renderTasks(tasks)

  const deleteTaskButton = document.querySelectorAll('.deleteTaskButton')
  addActionToDeleteTaskButton(deleteTaskButton)

  const openModalEditTaskButton = document.querySelectorAll('.openModalEditTaskButton')
  addActionToOpenModalEditTaskButton(openModalEditTaskButton)
})

const addActionToDeleteTaskButton = (deleteTaskButton) => {
  deleteTaskButton.forEach((deleteButton, index) => {
    deleteButton.addEventListener('click', async () => {
      tasks = await getTasks()
      idTask = tasks[index].id
      await deleteTask(idTask)

      tasks = await getTasks()
      renderTasks(tasks)
      const deleteTaskButton = document.querySelectorAll('.deleteTaskButton')
      addActionToDeleteTaskButton(deleteTaskButton)

      const openModalEditTaskButton = document.querySelectorAll('.openModalEditTaskButton')
      addActionToOpenModalEditTaskButton(openModalEditTaskButton)
    })
  })
}

const addActionToOpenModalEditTaskButton = (openModalEditTaskButton) => {
  openModalEditTaskButton.forEach((openModalEdit, index) => {
    openModalEdit.addEventListener('click', async () => {
      validateEachInput()
      tasks = await getTasks()
      task = tasks[index]
      idTask = tasks[index].id
      addTaskDetailsToModalEditTask(task)
      modalEventButton.value = "editTask"
      modalTitle.innerHTML = 'Editar tarefa'
      openModal(editTaskModal)
    })
  })
}

const addTaskDetailsToModalEditTask = (task) => {
  const taskValues = Object.values(task)
  inputs.forEach((input, index) => {
    input.value = taskValues[index]
  })
}

const restartInputs = (inputs) => {
  inputs.forEach((input) => {
    input.value = ''
  })
}

const showMessage = (input, message, type) => {
  const msg = input.parentNode.querySelector('small')
  msg.innerText = message
  if (type === true) {
    input.classList.remove("error")
    input.classList.add("success")
  } else {
    input.classList.remove("success")
    input.classList.add("error")
  }
  //input.className = `${input.className} ${type ? 'success' : 'error'}`
  return type
}

const showError = (input, message) => {
  return showMessage(input, message, false)
}

const showSuccess = (input) => {
  return showMessage(input, '', true)
}

const hasValue = (input, message) => {
  if (input.value.trim() === '') {
    return showError(input, message)
  }
  return showSuccess(input)
}

const removeBorderFormInputs = (inputs) => {
  inputs.forEach((input) => {
    input.classList.remove("error")
    input.classList.remove("success")
  })
}

const validateEachInput = () => {
  inputNumber.addEventListener('blur', () => {
    validateTaskNumber(inputNumber, NUMBER_REQUIRED, NUMBER_INVALID)
  })
  
  inputDescription.addEventListener('blur', () => {
    hasValue(inputDescription, DESCRIPTION_REQUIRED)
  })
  
  inputDate.addEventListener('blur', () => {
    validateTaskDeadline(inputDate, DEADLINE_REQUIRED, DEADLINE_INVALID)
  })
  
  inputTaskStatus.addEventListener('blur', () => {
    hasValue(inputTaskStatus, STATUS_REQUIRED)
  })
  
  //const validateFormFields = numberTaskValid && descriptionValid && taskDeadlineValid && taskStatusValid
  
  // if (validateFormFields) enableButton()
}

const enableButton = () => {
  modalEventButton.classList.add("enabledButton")
}

const disableButton = () => {
  modalEventButton.classList.remove("enabledButton")
}

const removeTextSmalls = (smalls) => {
  smalls.forEach((small) => {
    small.innerHTML = ''
  })
}
