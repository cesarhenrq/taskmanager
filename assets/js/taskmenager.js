class Task {
  constructor(taskNumber, description, deadline, status) {
    this.taskNumber = taskNumber;
    this.description = description;
    this.deadline = deadline;
    this.status = status;
  }
}

let idTask, logedUser, tasks, currentUserTasks, task;
let userLogedID = localStorage.getItem('userID');

let currentPage = 1;
let stateTableTask = 'all';

const spinner = `
  <div class="spinner-border" role="status">
    <span class="visually-hidden">
      Loading...
    </span>
  </div>`;

let urlTasks = `https://json-server.herokuapp.com/tasks`;
let urlTasksLogedUser = `https://json-server.herokuapp.com/tasks?userID=${userLogedID}`;
let urlTasksPagenated = `https://json-server.herokuapp.com/tasks?_sort=taskNumber&_order=asc&userID=${userLogedID}&_page=${currentPage}&_limit=10`;
const urlLogedUser = 'https://json-server.herokuapp.com/logedUser';

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
const findTasksInput = document.querySelector('#findTasksInput');

const openModalNewTaskButton = document.querySelector(
  '.openModalNewTaskButton'
);
const getAllTasksButton = document.querySelector('#getAllTasksButton');
const getCompletedTasksButton = document.querySelector(
  '#getCompletedTasksButton'
);
const getInProgressTasksButton = document.querySelector(
  '#getInProgressTasksButton'
);
const getStoppedTasksButton = document.querySelector('#getStoppedTasksButton');
const getLatedTasksButton = document.querySelector('#getLatedTasksButton');
const nextPageButton = document.querySelector('.nextPageButton');
const previousPageButton = document.querySelector('.previousPageButton');

const tableTasksBody = document.querySelector('.tableTasksBody');
const table = document.querySelector('table');

const form = document.querySelector('.form');

const modalTitle = document.querySelector('.modalTitle');
const responseAPI = document.querySelector('.responseAPI');
const smalls = document.querySelectorAll('small');
const divUser = document.querySelector('#divUser');

const getLogedUser = async () => {
  const response = await fetch(`${urlLogedUser}/${userID}`);

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
        taskNumber: Number(taskNumber),
        description: description,
        deadline: deadline,
        status: status,
        userID: userLogedID,
      }),
    });
    setSucessColor();
    showResponseAPI(RESPONSE_ADD_SUCESS);
    await getTasksByState(urlTasksPagenated);
    renderTasks(tasks);
  } catch (error) {
    setFailColor();
    showResponseAPI(RESPONSE_ADD_FAIL);
  }
};

const getTasks = async url => {
  const response = await fetch(url);

  const gettedTasks = await response.json();

  return gettedTasks;
};

const getCompletedTasks = async url => {
  const response = await fetch(url + '&status=Concluído');

  const gettedCompletedTasks = await response.json();

  return gettedCompletedTasks;
};

const getInProgressTasks = async url => {
  const response = await fetch(url + '&status=Em andamento');

  const gettedInProgressTasks = await response.json();

  return gettedInProgressTasks;
};

const getStoppedTasks = async url => {
  const response = await fetch(url + '&status=Parado');

  const gettedStoppedTasks = await response.json();

  return gettedStoppedTasks;
};

const getLatedTasks = async url => {
  const response = await fetch(url);

  const gettedLatedTasks = await response.json();

  const today = new Date();

  latedTasks = gettedLatedTasks.filter(task => {
    let deadline = new Date(task.deadline);
    return deadline < today;
  });

  return latedTasks;
};

const searchTasks = async (url, searchedTask) => {
  const response = await fetch(url + `&description_like=${searchedTask}`);

  const searchedTasks = await response.json();

  return searchedTasks;
};

const deleteTask = async id => {
  try {
    await fetch(`${urlTasks}/${id}`, {
      method: 'DELETE',
    });
    await getTasksByState(urlTasksPagenated);
    if (tasks.length === 0) {
      previousPage();
      controlPreviousButton();
      controlNextButton();
    } else {
      renderTasks(tasks);
    }
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
        taskNumber: Number(taskNumber),
        description: description,
        deadline: deadline,
        status: status,
        userID: userLogedID,
      }),
    });
    setSucessColor();
    showResponseAPI(RESPONSE_EDIT_SUCESS);
    await getTasksByState(urlTasksPagenated);
    renderTasks(tasks);
  } catch (error) {
    setFailColor();
    showResponseAPI(RESPONSE_EDIT_FAIL);
  }
};

const loadingTasks = () => {
  tableTasksBody.innerHTML = `
  <tr>
      <td>
        ${spinner}
      </td>
      <td>
        ${spinner}
      </td>
      <td>
        ${spinner}
      </td>
      <td>
        ${spinner}
      </td>
      <td>
        ${spinner}
      </td>
  </tr>
`;
};

const renderTasks = tasks => {
  let tableTasksContent = ``;

  tasks.forEach(task => {
    let {
      taskNumber: taskNumber,
      description: description,
      deadline: deadline,
      status: status,
    } = task;

    deadline = formatDate(deadline);

    tableTasksContent += `
    <tr>
      <td>${taskNumber}</td>
      <td>${description}</td>
      <td>${deadline}</td>
      <td value="${status}">${status}</td>
      <td>
        <button type="button" class="openModalEditTaskButtons">
          <img src="./assets/images/edit.svg" alt="Edit Task">
        </button>
        <button type="button" class="deleteTaskButtons">
            <img src="./assets/images/delete.svg" alt="Delete Task">
        </button>
      </td>
    </tr>
    `;
  });

  tableTasksBody.innerHTML = tableTasksContent;
  const deleteTaskButtons = document.querySelectorAll('.deleteTaskButtons');
  addDeleteTaskButtonAction(deleteTaskButtons);
  const openModalEditTaskButtons = document.querySelectorAll(
    '.openModalEditTaskButtons'
  );
  addOpenModalEditTaskButtonAction(openModalEditTaskButtons);
};

const formatDate = date => {
  date = new Date(date);

  const day = date.getDate() + 1;
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const fullDate = `${day}/${month}/${year}`;

  return fullDate;
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

const validateInput = (input, msg_required) => {
  input.addEventListener('blur', () => {
    hasValue(input, msg_required);
    toggleButton();
  });
};

const toggleButton = () => {
  if (isFormFieldsValidWithoutShowMessage()) {
    enableButton(modalEventButton);
  } else {
    disableButton(modalEventButton);
  }
};

const validateEachInput = () => {
  inputNumber.addEventListener('blur', () => {
    validateTaskNumber(inputNumber, NUMBER_REQUIRED, NUMBER_INVALID);
    toggleButton();
  });

  validateInput(inputDescription, DESCRIPTION_REQUIRED);
  validateInput(inputDate, DEADLINE_REQUIRED);
  validateInput(inputTaskStatus, STATUS_REQUIRED);
};

const addDeleteTaskButtonAction = buttons => {
  buttons.forEach((button, index) => {
    button.addEventListener('click', async () => {
      await getTasksByState(urlTasksPagenated);
      idTask = tasks[index].id;
      await deleteTask(idTask);
    });
  });
};

const addOpenModalEditTaskButtonAction = buttons => {
  buttons.forEach((button, index) => {
    button.addEventListener('click', async () => {
      await getTasksByState(urlTasksPagenated);
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
  showModal(modal);
  toggleAnimation(modal);
  validateEachInput();
};

const toggleAnimation = element => {
  element.classList.toggle('animation');
};

const hideModal = modal => {
  modal.style.display = 'none';
};

const showModal = modal => {
  modal.style.display = 'block';
};

const closeModal = modal => {
  hideModal(modal);
  toggleAnimation(modal);
  restartInputs(inputs);
  removeBorderFormInputs(inputs);
  removeTextSmalls(smalls);
  disableButton(modalEventButton);
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
  const taskDeadlineValid = hasValue(inputDate, DEADLINE_REQUIRED);
  const taskStatusValid = hasValue(inputTaskStatus, STATUS_REQUIRED);

  const validateFormFields =
    numberTaskValid && descriptionValid && taskDeadlineValid && taskStatusValid;

  return validateFormFields;
};

const isFormFieldsValidWithoutShowMessage = () => {
  const numberTaskValid = validateTaskNumberWithoutShowMessage(inputNumber);
  const descriptionValid = hasValueWithoutShowMessage(inputDescription);
  const taskDeadlineValid = hasValueWithoutShowMessage(inputDate);
  const taskStatusValid = hasValueWithoutShowMessage(inputTaskStatus);

  const validateFormFields =
    numberTaskValid && descriptionValid && taskDeadlineValid && taskStatusValid;

  return validateFormFields;
};

window.addEventListener('load', async () => {
  if (await isLoged()) {
    logedUser = await getLogedUser();
    divUser.innerHTML += `${logedUser.name}`;
    urlTasksLogedUser = `https://json-server.herokuapp.com/tasks?userID=${userLogedID}`;
    urlTasksPagenated = `https://json-server.herokuapp.com/tasks?_sort=taskNumber&_order=asc&userID=${userLogedID}&_page=${currentPage}&_limit=10`;
    loadingTasks();
    tasks = await getTasks(urlTasksPagenated);
    renderTasks(tasks);
    controlPreviousButton();
    controlNextButton();
  } else {
    window.alert('Você deve estar logado para continuar nesta página.');
    window.location.href = './index.html';
  }
});

window.addEventListener('click', async event => {
  if (event.target === registerTaskModal || event.target === closeModalButton) {
    event.preventDefault();
    closeModal(registerTaskModal);
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
    } else if (modalEventButton.value === 'editTask') {
      const editedTask = insertTaskDetailsInObject();
      await updateTask(idTask, editedTask);
    }
    controlPreviousButton();
    controlNextButton();
  }
});

logoutButton.addEventListener('click', async () => {
  await deleteLogedUser(logedUser.id);
  localStorage.clear();
  window.location.href = './index.html';
});

window.addEventListener('beforeunload', async () => {
  await deleteLogedUser(logedUser.id);
  localStorage.clear();
});

getCompletedTasksButton.addEventListener('click', async () => {
  currentPage = 1;
  stateTableTask = 'completed';
  urlTasksPagenated = `https://json-server.herokuapp.com/tasks?_sort=taskNumber&_order=asc&userID=${userLogedID}&_page=${currentPage}&_limit=10`;
  loadingTasks();
  tasks = await getCompletedTasks(urlTasksPagenated);
  renderTasks(tasks);
  controlPreviousButton();
  controlNextButton();
});

getInProgressTasksButton.addEventListener('click', async () => {
  currentPage = 1;
  stateTableTask = 'inprogress';
  urlTasksPagenated = `https://json-server.herokuapp.com/tasks?_sort=taskNumber&_order=asc&userID=${userLogedID}&_page=${currentPage}&_limit=10`;
  loadingTasks();
  tasks = await getInProgressTasks(urlTasksPagenated);
  renderTasks(tasks);
  controlPreviousButton();
  controlNextButton();
});

getStoppedTasksButton.addEventListener('click', async () => {
  currentPage = 1;
  stateTableTask = 'stopped';
  urlTasksPagenated = `https://json-server.herokuapp.com/tasks?_sort=taskNumber&_order=asc&userID=${userLogedID}&_page=${currentPage}&_limit=10`;
  loadingTasks();
  tasks = await getStoppedTasks(urlTasksPagenated);
  renderTasks(tasks);
  controlPreviousButton();
  controlNextButton();
});

getAllTasksButton.addEventListener('click', async () => {
  currentPage = 1;
  stateTableTask = 'all';
  urlTasksPagenated = `https://json-server.herokuapp.com/tasks?_sort=taskNumber&_order=asc&userID=${userLogedID}&_page=${currentPage}&_limit=10`;
  loadingTasks();
  tasks = await getTasks(urlTasksPagenated);
  renderTasks(tasks);
  controlPreviousButton();
  controlNextButton();
});

getLatedTasksButton.addEventListener('click', async () => {
  currentPage = 1;
  stateTableTask = 'lated';
  urlTasksPagenated = `https://json-server.herokuapp.com/tasks?_sort=taskNumber&_order=asc&userID=${userLogedID}&_page=${currentPage}&_limit=10`;
  loadingTasks();
  tasks = await getLatedTasks(urlTasksPagenated);
  renderTasks(tasks);
  controlPreviousButton();
  controlNextButton();
});

findTasksInput.addEventListener('keyup', async () => {
  currentPage = 1;
  stateTableTask = 'search';
  urlTasksPagenated = `https://json-server.herokuapp.com/tasks?_sort=taskNumber&_order=asc&userID=${userLogedID}&_page=${currentPage}&_limit=10`;
  loadingTasks();
  tasks = await searchTasks(urlTasksPagenated, findTasksInput.value);
  renderTasks(tasks);
  controlPreviousButton();
  controlNextButton();
});

const previousPage = async () => {
  currentPage--;
  urlTasksPagenated = `https://json-server.herokuapp.com/tasks?_sort=taskNumber&_order=asc&userID=${userLogedID}&_page=${currentPage}&_limit=10`;
  await getTasksByState(urlTasksPagenated);
  renderTasks(tasks);
};

const nextPage = async () => {
  currentPage++;
  urlTasksPagenated = `https://json-server.herokuapp.com/tasks?_sort=taskNumber&_order=asc&userID=${userLogedID}&_page=${currentPage}&_limit=10`;
  await getTasksByState(urlTasksPagenated);
  renderTasks(tasks);
};

previousPageButton.addEventListener('click', () => {
  previousPage();
  controlPreviousButton();
  controlNextButton();
});

nextPageButton.addEventListener('click', () => {
  nextPage();
  controlNextButton();
  controlPreviousButton();
});

const getTasksByState = async url => {
  if (stateTableTask === 'all') {
    tasks = await getTasks(url);
  } else if (stateTableTask === 'completed') {
    tasks = await getCompletedTasks(url);
  } else if (stateTableTask === 'inprogress') {
    tasks = await getInProgressTasks(url);
  } else if (stateTableTask === 'stopped') {
    tasks = await getStoppedTasks(url);
  } else if (stateTableTask === 'lated') {
    tasks = await getLatedTasks(url);
  } else if (stateTableTask === 'search') {
    tasks = await searchTasks(url, findTasksInput.value);
  }
};

const controlPreviousButton = () => {
  if (currentPage === 1) {
    hideButton(previousPageButton);
  } else {
    showButton(previousPageButton);
  }
};

const controlNextButton = async () => {
  await getTasksByState(urlTasksLogedUser);
  const isFinalPage = tasks.length - (currentPage - 1) * 10 <= 10;
  if (isFinalPage) {
    hideButton(nextPageButton);
  } else {
    showButton(nextPageButton);
  }
};

const hideButton = button => {
  button.style.display = 'none';
};

const showButton = button => {
  button.style.display = 'block';
};

const isLoged = async () => {
  const users = await getLogedUser();

  if (users.length !== 0) {
    return true;
  }

  return false;
};
