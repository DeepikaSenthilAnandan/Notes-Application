const titleInput = document.getElementById("titleInput");
const contentInput = document.getElementById("contentInput");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

const searchInput = document.getElementById("searchInput");

const notesContainer = document.getElementById("notesContainer");
const emptyMessage = document.getElementById("emptyMessage");
const noteCount = document.getElementById("noteCount");

const themeBtn = document.getElementById("themeBtn");

// Load notes from localStorage
let notes = JSON.parse(localStorage.getItem("notes")) || [];

let editingId = null;


// Save notes to localStorage
function saveToStorage() {
    localStorage.setItem("notes", JSON.stringify(notes));
}


// Generate unique ID
function generateId() {
    return Date.now();
}


// Format date
function formatDate(date) {
    return new Date(date).toLocaleString();
}


// Display notes
function displayNotes(notesToDisplay = notes) {

    notesContainer.innerHTML = "";

    // Sort pinned notes first
    const sortedNotes = [...notesToDisplay].sort((a, b) => {

        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;

        return b.createdAt - a.createdAt;
    });


    if (sortedNotes.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

        sortedNotes.forEach(note => {

            const noteCard = document.createElement("div");

            noteCard.className =
                `note-card ${note.pinned ? "pinned" : ""}`;

            noteCard.innerHTML = `

                <h3 class="note-title">
                    ${escapeHTML(note.title)}
                </h3>

                <p class="note-content">
                    ${escapeHTML(note.content)}
                </p>

                <p class="note-date">
                    ${formatDate(note.updatedAt || note.createdAt)}
                </p>

                <div class="note-actions">

                    <button
                        class="pin-btn"
                        onclick="togglePin(${note.id})"
                    >
                        ${note.pinned ? "📌 Unpin" : "📍 Pin"}
                    </button>

                    <button
                        class="edit-btn"
                        onclick="editNote(${note.id})"
                    >
                        ✏️ Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteNote(${note.id})"
                    >
                        🗑️ Delete
                    </button>

                </div>
            `;

            notesContainer.appendChild(noteCard);
        });
    }

    updateNoteCount();
}


// Prevent HTML injection
function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// Add / Update note
saveBtn.addEventListener("click", function () {

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();


    if (title === "" || content === "") {

        alert("Please enter both title and note content.");

        return;
    }


    // Update existing note
    if (editingId !== null) {

        const note = notes.find(
            note => note.id === editingId
        );

        if (note) {

            note.title = title;
            note.content = content;
            note.updatedAt = Date.now();
        }

        editingId = null;

        saveBtn.textContent = "➕ Add Note";
        cancelBtn.classList.add("hidden");

    }

    // Create new note
    else {

        const newNote = {

            id: generateId(),

            title: title,

            content: content,

            createdAt: Date.now(),

            updatedAt: Date.now(),

            pinned: false
        };

        notes.push(newNote);
    }


    saveToStorage();

    clearForm();

    displayNotes();
});


// Edit note
function editNote(id) {

    const note = notes.find(
        note => note.id === id
    );

    if (!note) return;


    titleInput.value = note.title;

    contentInput.value = note.content;

    editingId = id;

    saveBtn.textContent = "💾 Update Note";

    cancelBtn.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// Delete note
function deleteNote(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this note?");


    if (!confirmDelete) return;


    notes = notes.filter(
        note => note.id !== id
    );

    saveToStorage();

    displayNotes();
}


// Pin / Unpin
function togglePin(id) {

    const note = notes.find(
        note => note.id === id
    );

    if (!note) return;


    note.pinned = !note.pinned;

    saveToStorage();

    displayNotes();
}


// Cancel editing
cancelBtn.addEventListener("click", function () {

    editingId = null;

    clearForm();

    saveBtn.textContent = "➕ Add Note";

    cancelBtn.classList.add("hidden");
});


// Clear form
function clearForm() {

    titleInput.value = "";

    contentInput.value = "";
}


// Search notes
searchInput.addEventListener("input", function () {

    const searchText =
        searchInput.value.toLowerCase().trim();


    const filteredNotes = notes.filter(note => {

        return (
            note.title.toLowerCase().includes(searchText) ||
            note.content.toLowerCase().includes(searchText)
        );
    });


    displayNotes(filteredNotes);
});


// Update note count
function updateNoteCount() {

    const count = notes.length;

    noteCount.textContent =
        `${count} ${count === 1 ? "note" : "notes"}`;
}


// Dark mode
themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark");

    const isDark =
        document.body.classList.contains("dark");


    themeBtn.textContent =
        isDark ? "☀️" : "🌙";


    localStorage.setItem(
        "darkMode",
        isDark
    );
});


// Load dark mode
function loadTheme() {

    const darkMode =
        localStorage.getItem("darkMode") === "true";


    if (darkMode) {

        document.body.classList.add("dark");

        themeBtn.textContent = "☀️";
    }
}


// Load application
loadTheme();

displayNotes();