//window.onLoad = function() {
//  displayNotes();
//}

const noteListDiv = document.querySelector(".note-list");
const dest = 'http://rolling-server:8000';

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

// add a new note in the list 

function addNewNote() {
  const nickname = document.getElementById("nickname");
  const password = document.getElementById("password");
  const content = document.getElementById("content");

  if (validateInput(nickname, password, content)) {
    console.log(nickname.value, password.value, content.value);
    console.log(dest);
    axios.post(dest, {
      nickname: nickname.value,
      password: password.value,
      content: content.value
    }).then((res) => {
      console.log(res);
      window.location.reload();
    });


    // saving in the local storage 
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
    if (nickname.value === "") {
      nickname.classList.add("warning");
      nickname.placeholder = "Please input a text.";
    }
    if (password.value === "") {
      password.classList.add("warning");
      password.placeholder = "Please input a text.";
    }
    if (content.value === "") {
      content.classList.add("warning");
      content.placeholder = "Please input a text.";
    }
  }
  setTimeout(() => {
    nickname.classList.remove("warning");
    password.classList.remove("warning");
    content.classList.remove("warning");
    nickname.placeholder = "";
    password.placeholder = "";
    content.placeholder = "";

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
  console.log(dest);
  axios.get(dest).then((res) => {
    console.log(res);
    let notes = res.data;
    notes.forEach(item => {
      createNote(item);
    });
  });
}

// btn click functions
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
      const div = document.createElement("div");
      div.classList.add("modal");
      div.innerHTML = `
        <div>비밀번호를 입력하세요.</div>
        <div class="err-msg">　</div>
        <input type="text" class="corrpw" name="corrpw" />
        <button type="submit" class="input-pw-btn">확인</button>
        <button type="button" class="delete-note-btn clicked">취소</button>
      `;
      note_item.appendChild(div);
      delete_btn.classList.add("clicked");
    }
  }

  else if (e.target.classList.contains("input-pw-btn")) {
    const pw_input = e.target.previousElementSibling.value;
    const note_id = e.target.closest(".note-item").id;
    axios.delete(dest, {
      data: {
        id: note_id,
        password: pw_input
      }
    }).then((res) => {
      // 200
      // console.log(res);
      // window.location.reload();
    }).catch((err) => {
      // 401 
      console.log(err);
      
      console.log(err.response.status);
      if (err.response.status == 401) {
        e.target.previousElementSibling.previousElementSibling.innerText = "비밀번호가 틀렸습니다.";
      } else if (err.response.status == 406) {
       // 406
        window.location.reload();
      }
    })
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

// function successDelete(note_id, pw_input) {
//   axios.delete(dest, {
//     data: {
//       id: note_id,
//       password: pw_input
//     }
//   }).then((res) => {
//     console.log(res);
//     window.location.reload();
//   })
// }


// // delete a note 
// function deleteNote(e) {
//   if (e.target.classList.contains("delete-note-btn")) {

//     e.target.parentElement.remove();
//     let divID = e.target.parentElement.dataset.id;
//     let notes = getDataFromStorage();
//     let newNotesList = notes.filter(item => {
//       return item.id !== parseInt(divID);
//     });
//     localStorage.setItem("notes", JSON.stringify(newNotesList));

//     /*
//     const dest = 'http://' + window.location.hostname + ':8080';
//     axios.delete(dest, {
//       data: {
//         id: id.value,
//         password: password.value
//       }
//     }).then((res) => {
//       console.log(res); 
//     })
//     */
//   }
// }
