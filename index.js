window.onLoad = function () {
  displayNotes();
}

const noteListDiv = document.querySelector(".note-list");

// let noteID = 1;

function Note(nickname, password, content, id) {
  this.id = id;
  this.nickname = nickname;
  this.password = password;
  this.content = content;
}

// Add eventListeners 
// 저장된 페이퍼 로딩, 버튼 클릭에 대한 이벤트리스너 추가
function eventListeners() {
  document.addEventListener("DOMContentLoaded", displayNotes);
  document.getElementById("add-note-btn").addEventListener("click", addNewNote);

  noteListDiv.addEventListener("click", clickBtn);
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
  div.id = noteItem.id;
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
function clickBtn(e) {

  // 삭제 버튼 클릭
  if (e.target.classList.contains("delete-note-btn")) {
    const delete_btn = e.target;
    const note_item = delete_btn.parentElement;

    // 이미 버튼을 누른 상태라면 모달창 닫기
    if (checkClicked(delete_btn)) {
      deleteModal(delete_btn);
    }

    // 버튼을 누르면 비밀번호 입력 모달창 생성
    else {
      let result = false;
      const div = document.createElement("div");
      div.classList.add("modal");
      div.innerHTML = `
          <div>비밀번호를 입력하세요.</div>
          <input type="text" id="corrpw" name="corrpw" />
          <button type="submit" class="input-pw-btn">확인</button>
          <button type="button" class="delete-note-btn clicked">취소</button>
      `;
      note_item.appendChild(div);
      delete_btn.classList.add("clicked");
      if (result == true) {
        successDelete(e);
      }
    }
  }

  else if (e.target.classList.contains("input-pw-btn")) {
    const pw_input = e.target.previousSibling("#corrpw");
    console.log(pw_input);
    const note_id = e.target.parentElement.id;
    console.log(note_id);
  }
}

function checkClicked(target) {
  if (target.classList.contains("clicked")) return true;
  else return false;
}

// delete를 두 번 누르거나 modal 창의 취소를 누르면 모달창 제거
function deleteModal(delete_btn) {
  if (delete_btn.closest(".modal") != null) {
    delete_btn.parentElement.previousSibling.classList.remove("clicked");
    delete_btn.closest(".modal").remove();
  }
  else {
    delete_btn.nextSibling.remove();
    delete_btn.classList.remove("clicked");
  }
}

function successDelete(e) {
  e.target.parentElement.remove();
  let divID = e.target.parentElement.dataset.id;
  let notes = getDataFromStorage();
  let newNotesList = notes.filter(item => {
    return item.id !== parseInt(divID);
  });
  localStorage.setItem("notes", JSON.stringify(newNotesList));
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
