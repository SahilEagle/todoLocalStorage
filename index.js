document.addEventListener('DOMContentLoaded', () => {

    // chaning of date in headline
    let date = new Date();
    document.getElementById("head-date").innerHTML = date.toLocaleDateString();

    const form = document.getElementById('todo-form');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    const todoItemsList = document.getElementById('todo-items');
    const noTasksMessage = document.getElementById('no-tasks-message');
    
    const editForm = document.getElementById('edit-form');
    const editTitle = document.getElementById('edit-title');
    const editDescription = document.getElementById('edit-description');
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));

    let currentEditIndex = -1;

    const renderTodos = () => {
        todoItemsList.innerHTML = '';
        if (todos.length === 0) {
            noTasksMessage.style.display = 'block';
        } else {
            noTasksMessage.style.display = 'none';
            todos.forEach((todo, index) => {
                const todoItem = document.createElement('div');
                todoItem.classList.add('row', 'align-items-center', 'mb-2');

                const checkboxDiv = document.createElement('div');
                checkboxDiv.classList.add('col-auto');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = todo.completed; // Set checkbox state based on the completed status
                checkbox.addEventListener('change', () => {
                    todo.completed = checkbox.checked;
                    localStorage.setItem('todos', JSON.stringify(todos));
                    renderTodos();
                });
                checkboxDiv.appendChild(checkbox);

                const textDiv = document.createElement('div');
                textDiv.classList.add('col');
                const li = document.createElement('li');
                li.classList.add('list-group-item');
                if (todo.completed) {
                    li.classList.add('text-line-through');
                }
                li.textContent = `${todo.title} : ${todo.description}`;
                textDiv.appendChild(li);

                const buttonDiv = document.createElement('div');
                buttonDiv.classList.add('col-auto', 'ms-auto');

                const editButton = document.createElement('button');
                editButton.classList.add('btn', 'btn-secondary', 'btn-sm', 'me-2');
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => {
                    currentEditIndex = index;
                    editTitle.value = todo.title;
                    editDescription.value = todo.description;
                    editModal.show();
                });

                const deleteButton = document.createElement('button');
                deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => {
                    todos.splice(index, 1);
                    localStorage.setItem('todos', JSON.stringify(todos));
                    renderTodos();
                });

                buttonDiv.appendChild(editButton);
                buttonDiv.appendChild(deleteButton);

                todoItem.appendChild(checkboxDiv);
                todoItem.appendChild(textDiv);
                todoItem.appendChild(buttonDiv);

                todoItemsList.appendChild(todoItem);
            });
        }
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;

        const todo = {
            title,
            description,
            completed: false
        };

        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();

        form.reset();
    });

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedTitle = editTitle.value;
        const updatedDescription = editDescription.value;

        if (currentEditIndex > -1) {
            todos[currentEditIndex].title = updatedTitle;
            todos[currentEditIndex].description = updatedDescription;
            localStorage.setItem('todos', JSON.stringify(todos));
            renderTodos();
            editModal.hide();
        }
    });

    renderTodos();
});
