let todos = [];
let nextId = 1; // Simple counter for unique IDs

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Get references to DOM elements we'll use frequently
const inputField = document.getElementById('inp');
const searchField = document.getElementById('srh-inp');
const addButton = document.getElementById('btn');
const todoList = document.getElementById('ul');

// Function to render all todos (or filtered todos based on search)
function renderTodos(todosToRender = todos) {
    // Clear the current list
    todoList.innerHTML = '';

    // Loop through each todo and create HTML elements
    todosToRender.forEach((todo, i) => {
        // Create container div for each todo item
        const todoItem = document.createElement('li');


        // Create text span (will be editable when clicked)
        const todoText = document.createElement('h3');
        todoText.textContent = todo.text;
        todoText.onclick = () => editTodo(todo.id, todoText);

        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteTodo(todo.id);

        // create checkbox
        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.checked = todo.completed;
        checkBox.addEventListener('change', ()=> {
            todo.completed = checkBox.checked;
            saveTodos()
            renderTodos()
        })


        // Add elements to the todo item container
        todoItem.appendChild(checkBox)
        todoItem.appendChild(todoText);
        todoItem.appendChild(deleteBtn);

        // Add the complete todo item to the list
        todoList.appendChild(todoItem);
    });
}

// Function to add a new todo
function addTodo() {
    const text = inputField.value.trim(); // Get input text and remove extra spaces

    // Only add if there's actual text
    if (text) {
        // Create new todo object
        const newTodo = {
            id: nextId++,
            // Assign unique ID and increment counter
            text: text,
            completed: false
        };

        // Add to our todos array
        todos.push(newTodo);

        // Clear the input field
        inputField.value = '';

        // Re-render the list to show the new todo
        renderTodos();
        saveTodos()
    }
}

//toggle
function toggle(id) {}

// Function to delete a todo by ID
function deleteTodo(id) {
    // Filter out the todo with matching ID (removes it from array)
    todos = todos.filter(todo => todo.id !== id);

    // Re-render to show updated list
    renderTodos();
    saveTodos()
}

// Function to edit a todo inline
function editTodo(id, textElement) {
    // Get current text
    const currentText = textElement.textContent;

    // Create input field for editing
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = currentText;

    // Replace the text span with input field
    textElement.parentNode.replaceChild(editInput, textElement);

    // Focus on the input and select all text
    editInput.focus();
    editInput.select();

    // Function to save the edit
    function saveEdit() {
        const newText = editInput.value.trim();

        if (newText) {
            // Find the todo and update its text
            const todo = todos.find(t => t.id === id);
            if (todo) {
                todo.text = newText;
            }
        }

        // Re-render the entire list (this replaces input with span again)
        renderTodos();
        saveTodos()
    }



    // Save on Enter key or when input loses focus
    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveEdit();
        }
    });

    editInput.addEventListener('blur',
        saveEdit);

    saveTodos()
}

// Function to search/filter todos
function searchTodos() {
    const searchTerm = searchField.value.toLowerCase().trim();

    if (searchTerm === '') {
        // If search is empty, show all todos
        renderTodos();
    } else {
        // Filter todos that contain the search term
        const filteredTodos = todos.filter(todo =>
            todo.text.toLowerCase().includes(searchTerm)
        );

        // Render only the filtered results
        renderTodos(filteredTodos);
    }
}

function loadTodos() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
        id = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1: 0;
    }
    renderTodos();;
}

// Event listeners
addButton.addEventListener('click', addTodo);

// Allow adding todo by pressing Enter in the input field
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Search as user types
searchField.addEventListener('input', searchTodos);

// Initial render (empty list)
renderTodos();
loadTodos();