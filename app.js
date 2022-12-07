class Task {
  constructor(taskNumber, description, deadline, status,) {
    this.taskNumber = taskNumber;
    this.description = description;
    this.deadline = deadline;
    this.status = status;
  }
}

class User {
  constructor(name, userName, password) {
    this.name = name;
    this.userName = userName;
    this.password = password;
  }
}

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

const url = 'http://localhost:3000/tasks';

const openModalNewTaskButton = document.querySelector(
  '.openModalNewTaskButton'
);

const registerTaskModal = document.querySelector('.registerTaskModal');

const editTaskModal = document.querySelector('.editTaskModal');

const modalTitle = document.querySelector('.modalTitle');

const closeModalButton = document.querySelector('.closeModalButton');

const inputs = document.querySelectorAll('.formInputs');

const inputNumber = document.querySelector('#inputNumber');

const inputDescription = document.querySelector('#inputDescription');

const inputDate = document.querySelector('#inputDate');

const inputTaskStatus = document.querySelector('#taskStatusInput');

const modalEventButton = document.querySelector('.modalEventButton');

const tableTasksBody = document.querySelector('.tableTasksBody');

const form = document.querySelector('.form');

const table = document.querySelector('table');

const smalls = document.querySelectorAll('small');

const darkModeToggle = document.querySelector('#darkmode-toggle');

const responseAPI = document.querySelector('.responseAPI');

const registerUserButton = document.querySelector('.registerUserButton');

const formRegisterInputs = document.querySelectorAll('.formRegisterInputs');

const registerButton = document.querySelector('.registerButton');

const loginPage = document.querySelector('.loginPage');

const registerPage = document.querySelector('.registerPage');

registerUserButton.addEventListener('click', () => {
  loginPage.style.display = 'none';
  registerPage.style.display = 'block';
});

registerButton.addEventListener('click', () => {
  insertUserDetailsInObject()
});

const checkUserIsRegistered = () 

const insertUserDetailsInObject = () => {
  const inputValues = [];

  for (let index = 0; index < formRegisterInputs.length - 1; index++) {
    inputValues.push(formRegisterInputs[index].value);
  }

  const user = new User(...inputValues);

  return user;
};

const addNewTask = async newTask => {
  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskNumber: newTask.taskNumber,
        description: newTask.description,
        deadline: newTask.deadline,
        status: newTask.status,
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
  const apiResponse = await fetch(url);

  let tasks = await apiResponse.json();

  return tasks;
};

const deleteTask = async id => {
  try {
    await fetch(`${url}/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.log(error);
  }
};

const updateTask = async (id, updatedTask) => {
  try {
    await fetch(`${url}/${id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskNumber: updatedTask.taskNumber,
        description: updatedTask.description,
        deadline: updatedTask.deadline,
        status: updatedTask.status,
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
    `;
  });
};

const openModal = modal => {
  modal.style.display = 'block';
  validateEachInput();
};

const closeModal = modal => {
  modal.style.display = 'none';
  restartInputs(inputs);
  removeBorderFormInputs(inputs);
  removeTextSmalls(smalls);
  disableButton();
};

const enableButton = () => {
  modalEventButton.classList.add('enabledButton');
};

const disableButton = () => {
  modalEventButton.classList.remove('enabledButton');
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

const restartInputs = inputs => {
  inputs.forEach(input => {
    input.value = '';
  });
};

const addActionToDeleteTaskButton = deleteTaskButton => {
  deleteTaskButton.forEach((deleteButton, index) => {
    deleteButton.addEventListener('click', async () => {
      tasks = await getTasks();
      idTask = tasks[index].id;
      await deleteTask(idTask);

      tasks = await getTasks();
      renderTasks(tasks);
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
      enableButton();
    });
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
  //input.className = `${input.className} ${type ? 'success' : 'error'}`
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

const validateEachInput = () => {
  inputNumber.addEventListener('blur', () => {
    validateTaskNumber(inputNumber, NUMBER_REQUIRED, NUMBER_INVALID);
    if (isFormFieldsValidWithoutShowMessage()) {
      enableButton();
    } else {
      disableButton();
    }
  });

  inputDescription.addEventListener('blur', () => {
    hasValue(inputDescription, DESCRIPTION_REQUIRED);
    if (isFormFieldsValidWithoutShowMessage()) {
      enableButton();
    } else {
      disableButton();
    }
  });

  inputDate.addEventListener('blur', () => {
    validateTaskDeadline(inputDate, DEADLINE_REQUIRED, DEADLINE_INVALID);
    if (isFormFieldsValidWithoutShowMessage()) {
      enableButton();
    } else {
      disableButton();
    }
  });

  inputTaskStatus.addEventListener('blur', () => {
    hasValue(inputTaskStatus, STATUS_REQUIRED);
    if (isFormFieldsValidWithoutShowMessage()) {
      enableButton();
    } else {
      disableButton();
    }
  });
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

window.addEventListener('click', async event => {
  if (event.target === registerTaskModal || event.target === closeModalButton) {
    event.preventDefault();
    closeModal(registerTaskModal);

    let tasks = await getTasks();
    renderTasks(tasks);

    renderButtonsWithActions();
  }
});

const renderButtonsWithActions = () => {
  const deleteTaskButton = document.querySelectorAll('.deleteTaskButton');
  addActionToDeleteTaskButton(deleteTaskButton);

  const openModalEditTaskButton = document.querySelectorAll(
    '.openModalEditTaskButton'
  );
  addActionToOpenModalEditTaskButton(openModalEditTaskButton);
};

window.addEventListener('load', async () => {
  const tasks = await getTasks();
  renderTasks(tasks);
  renderButtonsWithActions();
});

openModalNewTaskButton.addEventListener('click', () => {
  modalEventButton.value = 'newTask';
  modalTitle.innerHTML = 'Adicionar nova tarefa';
  openModal(registerTaskModal);
});

modalEventButton.addEventListener('click', async () => {
  if (isFormFieldsValid()) {
    if (modalEventButton.value === 'newTask') {
      disableButton();
      const newTask = insertTaskDetailsInObject();
      await addNewTask(newTask);
      removeBorderFormInputs(inputs);
      restartInputs(inputs);
      const tasks = await getTasks();
      renderTasks(tasks);
    } else if (modalEventButton.value === 'editTask') {
      const editedTask = insertTaskDetailsInObject();
      await updateTask(idTask, editedTask);
      removeBorderFormInputs(inputs);
      const tasks = await getTasks();
      renderTasks(tasks);
    }
  }
});

/*darkModeToggle.addEventListener('click', () => {
  if (!darkModeToggle.checked) {
    document.body.classList.remove('backgroundDarkMode')
    openModalNewTaskButton.classList.remove('backgroundDarkMode')
    table.classList.remove('backgroundDarkMode')
    const trs = document.querySelectorAll('tr')
    trs.forEach((tr) => {
      tr.classList.remove('darkmodetr')
    })
    form.classList.remove('backgroundDarkMode')
    inputs.forEach((input) => {
      input.classList.remove('backgroundDarkMode')
    })
    modalEventButton.classList.remove('backgroundDarkMode')

  } else {
    document.body.classList.add('backgroundDarkMode')
    openModalNewTaskButton.classList.add('backgroundDarkMode')
    table.classList.add('backgroundDarkMode')
    const trs = document.querySelectorAll('tr')
    trs.forEach((tr) => {
      tr.classList.add('darkmodetr')
    })
    form.classList.add('backgroundDarkMode')
    inputs.forEach((input) => {
      input.classList.add('backgroundDarkMode')
    })
    modalEventButton.classList.add('backgroundDarkMode')
  }
})*/

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
