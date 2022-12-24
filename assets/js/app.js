class User {
  constructor(name, nickname, password) {
    this.name = name;
    this.nickname = nickname;
    this.password = password;
  }
}

const NAME_REQUIRED = 'Por favor insira seu nome';
const NICKNAME_REQUIRED = 'Por favor insira seu usuário';
const PASSWORD_REQUIRED = 'Por favor insira sua senha';
const PASSWORDCONFIRMATION_REQUIRED = 'Por favor confirme sua senha';
const PASSWORDCONFIRMATION_INVALID = 'As senhas devem ser iguais';

const CREDENTIALS_REQUIRED = 'Esse campo não pode ficar vazio';

const urlUsers = 'http://localhost:3000/users';
const urlLogedUser = 'http://localhost:3000/logedUser';

const registerUserButton = document.querySelector('.registerUserButton');
const registerButton = document.querySelector('.registerButton');
const loginUserButton = document.querySelector('.loginUserButton');
const closeRegisterUserModalButton = document.querySelector(
  '.closeRegisterUserModalButton'
);

const loginPage = document.querySelector('.loginPage');
const registerPage = document.querySelector('.registerPage');

const formRegisterInputs = document.querySelectorAll('.formRegisterInputs');
const formLoginInputs = document.querySelectorAll('.formLoginInputs');

const registerMessage = document.querySelector('#registerMessage');
const loginMessage = document.querySelector('#loginMessage');

const inputName = document.querySelector('#inputName');
const inputNickname = document.querySelector('#inputNickname');
const inputPasswordUserRegister = document.querySelector(
  '#inputPasswordUserRegister'
);
const inputPasswordUserConfirmRegister = document.querySelector(
  '#inputPasswordUserConfirmRegister'
);

const inputNicknameLogin = document.querySelector('#inputNicknameLogin');
const inputPasswordLogin = document.querySelector('#inputPasswordLogin');

const smalls = document.querySelectorAll('small');

// const darkModeToggle = document.querySelector('#darkmode-toggle');

const addLogedUser = async newLogedUser => {
  const { name, nickname, password, id } = newLogedUser;

  await fetch(urlLogedUser, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      nickname: nickname,
      password: password,
      userID: id,
    }),
  });
};

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

const showModal = (modal) => {
  modal.style.display = 'block';
}

const hideModal = (modal) => {
  modal.style.display = 'none';
}

const openModal = modal => {
  showModal(modal)
  if (modal.id === 'loginPage') {
    restartInputs(formLoginInputs);
    removeBorderFormInputs(formLoginInputs);
    validateEachFormLoginInput();
  } else {
    validateEachFormRegisterInput();
  }
};

const closeModal = modal => {
  hideModal(modal)
  restartInputs(formRegisterInputs);
  removeBorderFormInputs(formRegisterInputs);
  removeTextSmalls(smalls);
  disableButton(registerButton);
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

const checkPasswordIsCorrect = (users, inputPassword, inputNickname) => {
  const nickname = inputNickname.value;
  const password = inputPassword.value;
  const currentUser = users.filter(user => {
    return user.nickname === nickname;
  });
  const currentUserPassword = currentUser[0].password;

  return password === currentUserPassword;
};

const getLogedUser = (users, input) => {
  const nickname = input.value;
  const currentUser = users.filter(user => {
    return user.nickname === nickname;
  });
  return currentUser;
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

  return isLoginFormFieldsValid;
};

const validateEachFormRegisterInput = () => {
  inputName.addEventListener('blur', () => {
    hasValue(inputName, NAME_REQUIRED);
    const isValid = isRegisterFormFieldsValidWithoutShowMessage()
    if (isValid) {
      enableButton(registerButton);
    } else {
      disableButton(registerButton);
    }
  });

  inputNickname.addEventListener('blur', () => {
    hasValue(inputNickname, NICKNAME_REQUIRED);
    if (isValid) {
      enableButton(registerButton);
    } else {
      disableButton(registerButton);
    }
  });

  inputPasswordUserRegister.addEventListener('blur', () => {
    hasValue(inputPasswordUserRegister, PASSWORD_REQUIRED);
    if (isValid) {
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
    if (isValid) {
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
      const isValid = isLoginFormFieldsValidWithoutShowMessage()
      if (!isValid) {
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

loginPage.addEventListener('load', validateEachFormLoginInput());

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
      registerMessage.style.color = 'red';
      registerMessage.textContent = 'Usuário já registrado!';
      setInterval(() => {
        registerMessage.textContent = '';
      }, 3000);
    } else {
      await addNewUser(newUser);
      restartInputs(formRegisterInputs);
      removeBorderFormInputs(formRegisterInputs);
      removeTextSmalls(smalls);
      disableButton(registerButton);
      registerMessage.style.color = 'green';
      registerMessage.textContent = 'Usuário registrado com sucesso!';
      setInterval(() => {
        registerMessage.textContent = '';
      }, 3000);
    }
  }
});

closeRegisterUserModalButton.addEventListener('click', () => {
  closeModal(registerPage);
  openModal(loginPage);
});

loginUserButton.addEventListener('click', async () => {
  const users = await getUsers();
  const isUserRegistered = checkUserIsRegistered(users, inputNicknameLogin)
  if (isUserRegistered) {
    const isPasswordCorrect = checkPasswordIsCorrect(
      users,
      inputPasswordLogin,
      inputNicknameLogin
    );
    if (isPasswordCorrect) {
      const logedUser = getLogedUser(users, inputNicknameLogin);
      await addLogedUser(logedUser[0]);
      window.location.href = './taskmenager.html';
    } else {
      loginMessage.textContent = 'Senha incorreta!';
      setInterval(() => {
        loginMessage.textContent = '';
      }, 3000);
    }
  } else {
    loginMessage.textContent = 'Usuário não encontrado!';
    setInterval(() => {
      loginMessage.textContent = '';
    }, 3000);
  }
});