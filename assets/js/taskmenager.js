class Task {
  constructor(taskNumber, description, deadline, status) {
    this.taskNumber = taskNumber;
    this.description = description;
    this.deadline = deadline;
    this.status = status;
  }
}

let userLogedID = null;
let logedUser = null;

const urlTasks = 'http://localhost:3000/tasks';
const urlLogedUser = 'http://localhost:3000/logedUser';

const NUMBER_REQUIRED = 'Por favor insira o número da tarefa';
const NUMBER_INVALID = 'Por favor insira somente números';
const DESCRIPTION_REQUIRED = 'Por favor insira a descrição da tarefa';
const DEADLINE_REQUIRED = 'Por favor insira um prazo para a tarefa';
const DEADLINE_INVALID =
  'Por favor insira um prazo no padrão correto: DD/MM/AAAA';
const STATUS_REQUIRED = 'Por favor insira o status da tarefa';

const RESPONSE_EDIT_SUCESS = 'Tarefa editada com sucesso!';
const RESPONSE_EDIT_FAIL = 'Não foi possível editar a tarefa!';
const RESPONSE_ADD_SUCESS = 'Tarefa adicionada com sucesso!';
const RESPONSE_ADD_FAIL = 'Não foi possível adicionar a tarefa!';

const closeModalButton = document.querySelector('.closeModalButton');
const modalEventButton = document.querySelector('.modalEventButton');
const logoutButton = document.querySelector('#logoutButton');

const registerTaskModal = document.querySelector('.registerTaskModal');
const editTaskModal = document.querySelector('.editTaskModal');

const inputs = document.querySelectorAll('.formInputs');

const inputNumber = document.querySelector('#inputNumber');
const inputDescription = document.querySelector('#inputDescription');
const inputDate = document.querySelector('#inputDate');
const inputTaskStatus = document.querySelector('#taskStatusInput');

const openModalNewTaskButton = document.querySelector(
  '.openModalNewTaskButton'
);

const tableTasksBody = document.querySelector('.tableTasksBody');
const table = document.querySelector('table');

const form = document.querySelector('.form');

const modalTitle = document.querySelector('.modalTitle');
const responseAPI = document.querySelector('.responseAPI');
const smalls = document.querySelectorAll('small');
const divUser = document.querySelector('#divUser');

const getLogedUser = async () => {
  const response = await fetch(urlLogedUser);

  let logedUser = await response.json();

  return logedUser;
};

const deleteLogedUser = async id => {
  await fetch(`${urlLogedUser}/${id}`, {
    method: 'DELETE',
  });
};

const addNewTask = async newTask => {
  const { taskNumber, description, deadline, status } = newTask;

  try {
    await fetch(urlTasks, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskNumber: taskNumber,
        description: description,
        deadline: deadline,
        status: status,
        userID: userLogedID,
      }),
    });
    setSucessColor();
    showResponseAPI(RESPONSE_ADD_SUCESS);
  } catch (error) {
    setFailColor();
    showResponseAPI(RESPONSE_ADD_FAIL);
  }
};

const getTasks = async () => {
  const response = await fetch(urlTasks);

  let tasks = await response.json();

  return tasks;
};

const deleteTask = async id => {
  try {
    await fetch(`${urlTasks}/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.log(error);
  }
};

const updateTask = async (id, updatedTask) => {
  const { taskNumber, description, deadline, status } = updatedTask;
  try {
    await fetch(`${urlTasks}/${id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskNumber: taskNumber,
        description: description,
        deadline: deadline,
        status: status,
      }),
    });
    setSucessColor();
    showResponseAPI(RESPONSE_EDIT_SUCESS);
  } catch (error) {
    setFailColor();
    showResponseAPI(RESPONSE_EDIT_FAIL);
  }
};

const renderTasks = tasks => {
  tableTasksBody.innerHTML = ``;

  tasks.forEach(task => {
    let {
      taskNumber: taskNumber,
      description: description,
      deadline: deadline,
      status: status,
    } = task;
    tableTasksBody.innerHTML += `
    <tr>
      <td>${taskNumber}</td>
      <td>${description}</td>
      <td>${deadline}</td>
      <td value="${status}">${status}</td>
      <td>
        <button type="button" class="openModalEditTaskButton">
          <img src="./assets/images/edit.svg" alt="Edit Task">
        </button>
        <button type="button" class="deleteTaskButton">
            <img src="./assets/images/delete.svg" alt="Delete Task">
        </button>
      </td>
    </tr>
    `;
  });
};

const renderButtonsWithActions = () => {
  const deleteTaskButton = document.querySelectorAll('.deleteTaskButton');
  addActionToDeleteTaskButton(deleteTaskButton);

  const openModalEditTaskButton = document.querySelectorAll(
    '.openModalEditTaskButton'
  );
  addActionToOpenModalEditTaskButton(openModalEditTaskButton);
};

const showResponseAPI = response => {
  responseAPI.innerHTML = `${response}`;
  responseAPI.style.display = 'block';
  setInterval(() => {
    response.innerHTML = '';
    responseAPI.style.display = 'none';
  }, 3000);
};

const setSucessColor = () => {
  responseAPI.style.color = '#27AE68';
};

const setFailColor = () => {
  responseAPI.style.color = '#EB5757';
};

const insertTaskDetailsInObject = () => {
  const inputValues = [];

  inputs.forEach(input => {
    inputValues.push(input.value);
  });

  const task = new Task(...inputValues);

  return task;
};

const addTaskDetailsToModalEditTask = task => {
  const taskValues = Object.values(task);
  inputs.forEach((input, index) => {
    input.value = taskValues[index];
  });
};

const validateEachInput = () => {
  inputNumber.addEventListener('blur', () => {
    validateTaskNumber(inputNumber, NUMBER_REQUIRED, NUMBER_INVALID);
    if (isFormFieldsValidWithoutShowMessage()) {
      enableButton(modalEventButton);
    } else {
      disableButton(modalEventButton);
    }
  });

  inputDescription.addEventListener('blur', () => {
    hasValue(inputDescription, DESCRIPTION_REQUIRED);
    if (isFormFieldsValidWithoutShowMessage()) {
      enableButton(modalEventButton);
    } else {
      disableButton(modalEventButton);
    }
  });

  inputDate.addEventListener('blur', () => {
    validateTaskDeadline(inputDate, DEADLINE_REQUIRED, DEADLINE_INVALID);
    if (isFormFieldsValidWithoutShowMessage()) {
      enableButton(modalEventButton);
    } else {
      disableButton(modalEventButton);
    }
  });

  inputTaskStatus.addEventListener('blur', () => {
    hasValue(inputTaskStatus, STATUS_REQUIRED);
    if (isFormFieldsValidWithoutShowMessage()) {
      enableButton(modalEventButton);
    } else {
      disableButton(modalEventButton);
    }
  });
};

const addActionToDeleteTaskButton = deleteTaskButton => {
  deleteTaskButton.forEach((deleteButton, index) => {
    deleteButton.addEventListener('click', async () => {
      tasks = await getTasks();
      idTask = tasks[index].id;
      await deleteTask(idTask);

      tasks = await getTasks();
      const currentUserTasks = tasks.filter(isCurrentUserTasks);
      renderTasks(currentUserTasks);
      renderButtonsWithActions();
    });
  });
};

const addActionToOpenModalEditTaskButton = openModalEditTaskButton => {
  openModalEditTaskButton.forEach((openModalEdit, index) => {
    openModalEdit.addEventListener('click', async () => {
      tasks = await getTasks();
      task = tasks[index];
      idTask = tasks[index].id;
      addTaskDetailsToModalEditTask(task);
      modalEventButton.value = 'editTask';
      modalTitle.innerHTML = 'Editar tarefa';
      openModal(editTaskModal);
      enableButton(modalEventButton);
    });
  });
};

const openModal = modal => {
  modal.style.display = 'block';
  if (modal.id === 'taskEventModal') {
    validateEachInput();
  } else if (modal.id === 'loginPage') {
    validateEachFormLoginInput();
  } else {
    validateEachFormRegisterInput();
  }
};

const closeModal = modal => {
  modal.style.display = 'none';
  if (modal.id === 'loginPage') {
    restartInputs(formRegisterInputs);
    removeBorderFormInputs(formRegisterInputs);
    removeTextSmalls(smalls);
    disableButton(registerButton);
  } else if (modal.id === 'taskEventModal') {
    restartInputs(inputs);
    removeBorderFormInputs(inputs);
    removeTextSmalls(smalls);
    disableButton(modalEventButton);
  }
};

const enableButton = button => {
  button.classList.add('enabledButton');
};

const disableButton = button => {
  button.classList.remove('enabledButton');
};

const removeTextSmalls = smalls => {
  smalls.forEach(small => {
    small.innerHTML = '';
  });
};

const removeBorderFormInputs = inputs => {
  inputs.forEach(input => {
    input.classList.remove('error');
    input.classList.remove('success');
  });
};

const restartInputs = inputs => {
  inputs.forEach(input => {
    input.value = '';
  });
};

const showMessage = (input, message, type) => {
  const msg = input.parentNode.querySelector('small');
  msg.innerText = message;

  if (type) {
    input.classList.remove('error');
    input.classList.add('success');
  } else {
    input.classList.remove('success');
    input.classList.add('error');
    disableButton;
  }

  return type;
};

const showError = (input, message) => {
  return showMessage(input, message, false);
};

const showSuccess = input => {
  return showMessage(input, '', true);
};

const hasValue = (input, message) => {
  if (input.value.trim() === '') {
    return showError(input, message);
  }
  return showSuccess(input);
};

const hasValueWithoutShowMessage = input => {
  if (input.value.trim() === '') {
    return false;
  }
  return true;
};

const validateTaskDeadlineRegex = input => {
  const taskDeadline = input.value;
  const taskDeadlineRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  return taskDeadlineRegex.exec(taskDeadline);
};

const validateTaskDeadline = (input, requiredMsg, invalidMsg) => {
  if (!hasValue(input, requiredMsg)) {
    return false;
  }

  if (validateTaskDeadlineRegex(input)) {
    return true;
  }

  return showError(input, invalidMsg);
};

const validateTaskDeadlineWithoutShowMessage = input => {
  if (!hasValueWithoutShowMessage(input)) {
    return false;
  }

  if (validateTaskDeadlineRegex(input)) {
    return true;
  }

  return false;
};

const validateTaskNumberRegex = input => {
  const taskNumber = input.value;
  const taskNumberRegex = new RegExp('^[0-9]+$');

  return taskNumberRegex.test(taskNumber);
};

const validateTaskNumber = (input, requiredMsg, invalidMsg) => {
  if (!hasValue(input, requiredMsg)) {
    return false;
  }

  if (validateTaskNumberRegex(input)) {
    return true;
  }

  return showError(input, invalidMsg);
};

const validateTaskNumberWithoutShowMessage = input => {
  if (!hasValueWithoutShowMessage(input)) {
    return false;
  }

  if (validateTaskNumberRegex(input)) {
    return true;
  }

  return false;
};

const isFormFieldsValid = () => {
  const numberTaskValid = validateTaskNumber(
    inputNumber,
    NUMBER_REQUIRED,
    NUMBER_INVALID
  );
  const descriptionValid = hasValue(inputDescription, DESCRIPTION_REQUIRED);
  const taskDeadlineValid = validateTaskDeadline(
    inputDate,
    DEADLINE_REQUIRED,
    DEADLINE_INVALID
  );
  const taskStatusValid = hasValue(inputTaskStatus, STATUS_REQUIRED);

  const validateFormFields =
    numberTaskValid && descriptionValid && taskDeadlineValid && taskStatusValid;

  return validateFormFields;
};

const isFormFieldsValidWithoutShowMessage = () => {
  const numberTaskValid = validateTaskNumberWithoutShowMessage(inputNumber);
  const descriptionValid = hasValueWithoutShowMessage(inputDescription);
  const taskDeadlineValid = validateTaskDeadlineWithoutShowMessage(inputDate);
  const taskStatusValid = hasValueWithoutShowMessage(inputTaskStatus);

  const validateFormFields =
    numberTaskValid && descriptionValid && taskDeadlineValid && taskStatusValid;

  return validateFormFields;
};

const isCurrentUserTasks = task => task.userID === userLogedID;

window.addEventListener('load', async () => {
  logedUser = await getLogedUser();
  userLogedID = logedUser[0].userID;
  divUser.innerHTML += `${logedUser[0].name}`;
  const tasks = await getTasks();
  const currentUserTasks = tasks.filter(isCurrentUserTasks);
  renderTasks(currentUserTasks);
  renderButtonsWithActions();
});

window.addEventListener('click', async event => {
  if (event.target === registerTaskModal || event.target === closeModalButton) {
    event.preventDefault();
    closeModal(registerTaskModal);

    const tasks = await getTasks();
    const currentUserTasks = tasks.filter(isCurrentUserTasks);
    renderTasks(currentUserTasks);
    renderButtonsWithActions();
  }
});

openModalNewTaskButton.addEventListener('click', () => {
  modalEventButton.value = 'newTask';
  modalTitle.innerHTML = 'Adicionar nova tarefa';
  openModal(registerTaskModal);
});

modalEventButton.addEventListener('click', async () => {
  if (isFormFieldsValid()) {
    if (modalEventButton.value === 'newTask') {
      disableButton(modalEventButton);
      const newTask = insertTaskDetailsInObject();
      await addNewTask(newTask);
      removeBorderFormInputs(inputs);
      restartInputs(inputs);
      const tasks = await getTasks();
      const currentUserTasks = tasks.filter(isCurrentUserTasks);
      renderTasks(currentUserTasks);
    } else if (modalEventButton.value === 'editTask') {
      const editedTask = insertTaskDetailsInObject();
      await updateTask(idTask, editedTask);
      removeBorderFormInputs(inputs);
      const tasks = await getTasks();
      const currentUserTasks = tasks.filter(isCurrentUserTasks);
      renderTasks(currentUserTasks);
    }
  }
});

logoutButton.addEventListener('click', async () => {
  deleteLogedUser(logedUser[0].id);
  window.location.href = './index.html';
});
