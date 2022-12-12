class Task {
  constructor(taskNumber, description, deadline, status) {
    this.taskNumber = taskNumber;
    this.description = description;
    this.deadline = deadline;
    this.status = status;
  }
}

class User {
  constructor(name, nickname, password) {
    this.name = name;
    this.nickname = nickname;
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

const NAME_REQUIRED = 'Por favor insira seu nome';
const NICKNAME_REQUIRED = 'Por favor insira seu usuário';
const PASSWORD_REQUIRED = 'Por favor insira sua senha';
const PASSWORDCONFIRMATION_REQUIRED = 'Por favor confirme sua senha';
const PASSWORDCONFIRMATION_INVALID = 'As senhas devem ser iguais';

const CREDENTIALS_REQUIRED = 'Esse campo não pode ficar vazio';

const RESPONSE_EDIT_SUCESS = 'Tarefa editada com sucesso!';
const RESPONSE_EDIT_FAIL = 'Não foi possível editar a tarefa!';
const RESPONSE_ADD_SUCESS = 'Tarefa adicionada com sucesso!';
const RESPONSE_ADD_FAIL = 'Não foi possível adicionar a tarefa!';

const urlTasks = 'http://localhost:3000/tasks';
const urlUsers = 'http://localhost:3000/users';

const openModalNewTaskButton = document.querySelector(
  '.openModalNewTaskButton'
);
const closeModalButton = document.querySelector('.closeModalButton');
const modalEventButton = document.querySelector('.modalEventButton');
const registerUserButton = document.querySelector('.registerUserButton');
const registerButton = document.querySelector('.registerButton');
const loginUserButton = document.querySelector('.loginUserButton');
const closeRegisterUserModalButton = document.querySelector(
  '.closeRegisterUserModalButton'
);

const registerTaskModal = document.querySelector('.registerTaskModal');
const editTaskModal = document.querySelector('.editTaskModal');
const loginPage = document.querySelector('.loginPage');
const registerPage = document.querySelector('.registerPage');

const inputs = document.querySelectorAll('.formInputs');
const formRegisterInputs = document.querySelectorAll('.formRegisterInputs');
const formLoginInputs = document.querySelectorAll('.formLoginInputs');

const modalTitle = document.querySelector('.modalTitle');
const responseAPI = document.querySelector('.responseAPI');
const loginMessage = document.querySelector('#loginMessage');

const inputNumber = document.querySelector('#inputNumber');
const inputDescription = document.querySelector('#inputDescription');
const inputDate = document.querySelector('#inputDate');
const inputTaskStatus = document.querySelector('#taskStatusInput');
const inputName = document.querySelector('#inputName');
const inputNickname = document.querySelector('#inputNickname');
const inputPasswordUserRegister = document.querySelector(
  '#inputPasswordUserRegister'
);
const inputPasswordUserConfirmRegister = document.querySelector(
  '#inputPasswordUserConfirmRegister'
);

const tableTasksBody = document.querySelector('.tableTasksBody');

const form = document.querySelector('.form');

const table = document.querySelector('table');

const smalls = document.querySelectorAll('small');

// const darkModeToggle = document.querySelector('#darkmode-toggle');

const addNewUser = async newUser => {
  const { name, nickname, password } = newUser;

  await fetch(urlUsers, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      nickname: nickname,
      password: password,
    }),
  });
};

const getUsers = async () => {
  const response = await fetch(urlUsers);

  const users = await response.json();

  return users;
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

const renderButtonsWithActions = () => {
  const deleteTaskButton = document.querySelectorAll('.deleteTaskButton');
  addActionToDeleteTaskButton(deleteTaskButton);

  const openModalEditTaskButton = document.querySelectorAll(
    '.openModalEditTaskButton'
  );
  addActionToOpenModalEditTaskButton(openModalEditTaskButton);
};

const openModal = modal => {
  modal.style.display = 'block';
  validateEachInput();
  validateEachFormRegisterInput();
  validateEachFormLoginInput();
};

const closeModal = modal => {
  modal.style.display = 'none';
  if (modal.id === 'loginPage') {
    restartInputs(formRegisterInputs);
    removeBorderFormInputs(formRegisterInputs);
    removeTextSmalls(smalls);
    disableButton(registerButton);
  } else {
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

const insertUserDetailsInObject = () => {
  const inputValues = [];

  for (let index = 0; index < formRegisterInputs.length - 1; index++) {
    inputValues.push(formRegisterInputs[index].value);
  }

  const user = new User(...inputValues);

  return user;
};

const checkUserIsRegistered = (users, input) => {
  const nickname = input.value;
  const usersNickname = users.map(user => {
    return user.nickname;
  });

  const isRegistered = usersNickname.some(userNickname => {
    return nickname === userNickname;
  });

  return isRegistered;
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
      enableButton(modalEventButton);
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

const isRegisterFormFieldsValid = () => {
  const nameRegisterValid = hasValue(inputName, NAME_REQUIRED);
  const nicknameRegisterValid = hasValue(inputNickname, NICKNAME_REQUIRED);
  const passwordRegisterValid = hasValue(
    inputPasswordUserRegister,
    PASSWORD_REQUIRED
  );
  const passwordConfirmationRegisterValid = validadePasswordConfirmation(
    inputPasswordUserConfirmRegister,
    PASSWORDCONFIRMATION_REQUIRED,
    PASSWORDCONFIRMATION_INVALID
  );

  const validateFormFields =
    nameRegisterValid &&
    nicknameRegisterValid &&
    passwordRegisterValid &&
    passwordConfirmationRegisterValid;

  return validateFormFields;
};

const isRegisterFormFieldsValidWithoutShowMessage = () => {
  const nameRegisterValid = hasValueWithoutShowMessage(inputName);
  const nicknameRegisterValid = hasValueWithoutShowMessage(inputNickname);
  const passwordRegisterValid = hasValueWithoutShowMessage(
    inputPasswordUserRegister
  );
  const passwordConfirmationRegisterValid =
    validadePasswordConfirmationWithoutShowMessage(
      inputPasswordUserConfirmRegister
    );

  const validateFormFields =
    nameRegisterValid &&
    nicknameRegisterValid &&
    passwordRegisterValid &&
    passwordConfirmationRegisterValid;

  return validateFormFields;
};

const isLoginFormFieldsValidWithoutShowMessage = () => {
  const loginInputsValid = [];
  formLoginInputs.forEach((loginInput, index) => {
    loginInputsValid[index] = hasValueWithoutShowMessage(loginInput);
  });

  const inputValid = element => element === false;

  isLoginFormFieldsValid = loginInputsValid.some(inputValid);

  console.log(isLoginFormFieldsValid);

  return isLoginFormFieldsValid;
};

const validateEachFormRegisterInput = () => {
  inputName.addEventListener('blur', () => {
    hasValue(inputName, NAME_REQUIRED);
    if (isRegisterFormFieldsValidWithoutShowMessage()) {
      enableButton(registerButton);
    } else {
      disableButton(registerButton);
    }
  });

  inputNickname.addEventListener('blur', () => {
    hasValue(inputNickname, NICKNAME_REQUIRED);
    if (isRegisterFormFieldsValidWithoutShowMessage()) {
      enableButton(registerButton);
    } else {
      disableButton(registerButton);
    }
  });

  inputPasswordUserRegister.addEventListener('blur', () => {
    hasValue(inputPasswordUserRegister, PASSWORD_REQUIRED);
    if (isRegisterFormFieldsValidWithoutShowMessage()) {
      enableButton(registerButton);
    } else {
      disableButton(registerButton);
    }
  });

  inputPasswordUserConfirmRegister.addEventListener('blur', () => {
    validadePasswordConfirmation(
      inputPasswordUserConfirmRegister,
      PASSWORDCONFIRMATION_REQUIRED,
      PASSWORDCONFIRMATION_INVALID
    );
    if (isRegisterFormFieldsValidWithoutShowMessage()) {
      enableButton(registerButton);
    } else {
      disableButton(registerButton);
    }
  });
};

const validateEachFormLoginInput = () => {
  formLoginInputs.forEach(loginInput => {
    loginInput.addEventListener('blur', () => {
      hasValue(loginInput, CREDENTIALS_REQUIRED);
      if (!isLoginFormFieldsValidWithoutShowMessage()) {
        enableButton(loginUserButton);
      } else {
        disableButton(loginUserButton);
      }
    });
  });
};

const validadePasswordConfirmation = (input, requiredMsg, invalidMsg) => {
  if (!hasValue(input, requiredMsg)) {
    return false;
  }

  const password = inputPasswordUserRegister.value;
  const passwordConfirmation = inputPasswordUserConfirmRegister.value;

  if (password === passwordConfirmation) {
    return true;
  }

  return showError(input, invalidMsg);
};

const validadePasswordConfirmationWithoutShowMessage = input => {
  if (!hasValueWithoutShowMessage(input)) {
    return false;
  }

  const password = inputPasswordUserRegister.value;
  const passwordConfirmation = inputPasswordUserConfirmRegister.value;

  if (password === passwordConfirmation) {
    return true;
  }

  return false;
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

window.addEventListener('load', async () => {
  const tasks = await getTasks();
  renderTasks(tasks);
  renderButtonsWithActions();
});

loginPage.addEventListener('load', validateEachFormLoginInput());

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

registerUserButton.addEventListener('click', () => {
  closeModal(loginPage);
  openModal(registerPage);
});

registerButton.addEventListener('click', async () => {
  if (isRegisterFormFieldsValid()) {
    const newUser = insertUserDetailsInObject();
    const users = await getUsers();
    const isRegistered = checkUserIsRegistered(users, inputNickname);

    if (isRegistered) {
      loginMessage.textContent = 'Usuário já registrado!';
      setInterval(() => {
        loginMessage.textContent = '';
      }, 3000);
    } else {
      await addNewUser(newUser);
    }

    closeModal(registerPage);
    openModal(loginPage);
  }
});

closeRegisterUserModalButton.addEventListener('click', () => {
  closeModal(registerPage);
  openModal(loginPage);
});

loginUserButton.addEventListener('click', async () => {
  users = await getUsers();
  console.log(users);
});
