const noteListDiv = document.querySelector(".note-list");

// let noteID = 1;

function Note(nickname, password, content) {
  this.nickname = nickname;
  this.password = password;
  this.content = content;
}

// Add eventListeners 
// 저장된 페이퍼 로딩, 버튼 클릭에 대한 이벤트리스너 추가
function eventListeners() {
  document.addEventListener("DOMContentLoaded", displayNotes);
  document.getElementById("add-note-btn").addEventListener("click", addNewNote);

  noteListDiv.addEventListener("click", deleteNote);
}

eventListeners();


// get item from storage 
// 저장된 페이퍼들을 불러오는 함수
function getDataFromStorage() {
  return localStorage.getItem("notes") ? JSON.parse(localStorage.getItem("notes")) : [];
}



// add a new note in the list 

function addNewNote() {
  const nickname = document.getElementById("nickname");
  const password = document.getElementById("password");
  const content = document.getElementById("content");

  if (validateInput(nickname, password, content)) {
    let notes = getDataFromStorage();

    let noteItem = new Note(nickname.value, password.value, content.value);
    notes.push(noteItem);
    createNote(noteItem);

    console.log(nickname.value, password.value, content.value);
    const dest = 'http://' + window.location.hostname + ':8080';
    console.log(dest);
    axios.post(dest, {
      nickname: nickname.value,
      password: password.value,
      content: content.value
    }).then((res) => {
      console.log(res);
    });
    // saving in the local storage 

    localStorage.setItem("notes", JSON.stringify(notes));
    nickname.value = "";
    password.value = "";
    content.value = "";

  }
}


//  input validation 

function validateInput(nickname, password, content) {
  if (nickname.value !== "" && password.value !== "" && content.value !== "") {
    return true;
  } else {
    if (nickname.value === "") nickname.classList.add("warning");
    if (password.value === "") password.classList.add("warning");
    if (content.value === "") content.classList.add("warning");
  }
  setTimeout(() => {
    nickname.classList.remove("warning");
    password.classList.remove("warning");
    content.classList.remove("warning");

  }, 1600);
}


// create a new note div

function createNote(noteItem) {
  const div = document.createElement("div");
  div.classList.add("note-item");
  div.innerHTML = `
        <h3>${noteItem.nickname}</h3>
        <p>${noteItem.content}</p>
        <button type = "button" class = "btn delete-note-btn">
        <span><i class = "fas fa-trash"></i></span>
        Delete
        </buttton>
  `;
  noteListDiv.appendChild(div);
}


// display all the notes from the local storage

function displayNotes() {
  const dest = 'http://' + window.location.hostname + ':8080';

  console.log(dest);
  axios.get(dest).then((res) => {
    console.log(res);
    let notes = res.data;
    notes.forEach(item => {
      createNote(item);
    });
  })
}


// delete a note 
function deleteNote(e) {
  if (e.target.classList.contains("delete-note-btn")) {

    e.target.parentElement.remove();
    let divID = e.target.parentElement.dataset.id;
    let notes = getDataFromStorage();
    let newNotesList = notes.filter(item => {
      return item.id !== parseInt(divID);
    });
    localStorage.setItem("notes", JSON.stringify(newNotesList));

    /*
    const dest = 'http://' + window.location.hostname + ':8080';
    axios.delete(dest, {
      data: {
        id: id.value,
        password: password.value
      }
    }).then((res) => {
      console.log(res); 
    })
    */
  }
}


// delete all notes 
function deleteAllNotes() {
  localStorage.removeItem("notes");
  let noteList = document.querySelectorAll(".note-item");
  if (noteList.length > 0) {
    noteList.forEach(item => {
      noteListDiv.removeChild(item);
    });
  }
  noteID = 1 //resetting noteID to 1
}
