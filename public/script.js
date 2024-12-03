const addUserForm = document.getElementById('add-user-form');
const addUserBtn = document.getElementById('add-user-btn');
const usersList = document.getElementById('users-list');
const updateUserForm = document.getElementById('update-user-form');
const updateUserBtn = document.getElementById('update-user-btn');
const deleteUserForm = document.getElementById('delete-user-form');
const deleteUserBtn = document.getElementById('delete-user-btn');

addUserBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  fetch('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
  })
    .then((response) => response.json())
    .then((user) => {
      const listItem = document.createElement('tr');
      listItem.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
      `;
      usersList.appendChild(listItem);
    })
    .catch((error) => console.error(error));
});

updateUserBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const id = document.getElementById('id').value;
  const updateName = document.getElementById('update-name').value;
  const updateEmail = document.getElementById('update-email').value;

  // Actualiza el usuario con los valores del formulario de actualizar
  fetch(`/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: updateName, email: updateEmail }),
  })
    .then((response) => response.json())
    .then((user) => {
      console.log(user);
      // Actualiza la tabla con los datos actualizados
      fetch(`/users/${id}`)
        .then((response) => response.json())
        .then((updatedUser) => {
          const listItem = document.querySelector(`tr[data-id="${id}"]`);
          listItem.innerHTML = `
            <td>${updatedUser.id}</td>
            <td>${updatedUser.name}</td>
            <td>${updatedUser.email}</td>
          `;
        })
        .catch((error) => console.error(error));
    })
    .catch((error) => console.error(error));
});

deleteUserBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const id = document.getElementById('delete-id').value;
  fetch(`/users/${id}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((message) => {
      console.log(message);
      const listItem = document.querySelector(`tr[data-id="${id}"]`);
      listItem.remove();
    })
    .catch((error) => console.error(error));
});

fetch('/users')
  .then((response) => response.json())
  .then((users) => {
    users.forEach((user) => {
      const listItem = document.createElement('tr');
      listItem.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
      `;
      listItem.setAttribute('data-id', user.id);
      usersList.appendChild(listItem);
    });
  })
  .catch((error) => console.error(error));

