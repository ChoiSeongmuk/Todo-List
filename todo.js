(function () {
  Date.prototype.yyyymmdd = function () {
    var mm = this.getMonth() + 1;
    var dd = this.getDate();

    return [
      this.getFullYear(),
      (mm > 9 ? "" : "0") + mm,
      (dd > 9 ? "" : "0") + dd
    ].join("");
  };
  Date.prototype.hhmmss = function () {
    var hh = this.getHours();
    var mm = this.getMinutes();
    var ss = this.getSeconds();

    return [
      (hh > 9 ? "" : "0") + hh,
      (mm > 9 ? "" : "0") + mm,
      (ss > 9 ? "" : "0") + ss
    ].join("");
  };
  Date.prototype.yyyymmddhhmmss = function () {
    return parseInt(this.yyyymmdd() + this.hhmmss());
  };

  function getCurrentTimeString() {
    var time = new Date();
    return (
      time.getFullYear() +
      "년" +
      (time.getMonth() + 1) +
      "월" +
      time.getDate() +
      "일" +
      time.getHours() +
      "시" +
      time.getMinutes() +
      "분"
    );
  }
  function getFullToday() {
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    var hours = ("0" + date.getDate()).slice(-2);
    return year + month + day + hours;
  }

  let todoList = [];
  //저장된 값 불러오기

  if (localStorage.getItem("todoList")) {
    //저장된 값이 있을 경우

    try {
      const parsedTodoList = JSON.parse(localStorage.getItem("todoList"));
      todoList = parsedTodoList.map(pTodo => {
        const { content, fullTime, time, id } = pTodo;
        return new Todo(content, fullTime, time, id);
      });
    } catch (e) {
      console.error;
      "에러!" + e;
    }
  }
  function* generateID() {
    const candidates =
      "abcdefghijklmmopqrstvwuxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890";

    const idLength = 20;
    while (true) {
      let id = "";
      for (let l = 0; l < idLength; l++) {
        const randomIndex = parseInt(
          (Math.random() * 1000) % candidates.length
        );
        id += candidates[randomIndex];
      }

      if (todoList.find(todo => todo.id === id)) continue;

      yield id;
    }
  }

  const sortByTimeButton = document.getElementById("sortByTime");
  let isSortedByTimeAscend = false;
  sortByTimeButton.addEventListener(
    "click",
    function () {
      todoList = todoList.sort(function compare(a, b) {
        if (isSortedByTimeAscend) {
          return a.fullTime - b.fullTime;
        } else {
          return b.fullTime - a.fullTime;
        }
      });
      renderTodoList();
      isSortedByTimeAscend = !isSortedByTimeAscend;
    },
    false
  );

  const idGenerator = generateID();

  function Todo(content, fullTime, time, id) {
    this.fullTime = fullTime ?? new Date.yyyymmddhhmmss();
    this.content = content;
    this.time = time ?? getCurrentTimeString();
    this.id = id ?? idGenerator.next().value;
  }

  Todo.prototype.drawInHtml = function () {
    var timeDiv = elt("div", { class: "time" }, this.time);
    var titldDiv = elt("div", { class: "subtitle" }, this.content);

    const todoId = this.id;
    var editbtn = elt("input", {
      type: "button",
      id: "##" + this.id,
      value: "수정"
    });
    editbtn.addEventListener("click", function () {
      const editText = prompt("여기에 입력하세요");
      if (!editbtn) {
        alert("입력하쇼");
        return;
      }

      editTodo(todoId, editText);
    });

    var removebtn = elt("input", {
      type: "button",
      id: "#" + this.id,
      value: "삭제"
    });
    removebtn.addEventListener("click", function () {
      Todo.prototype.remove(todoId);
    });

    var buttonDiv = elt("div", { class: "changeButton" }, editbtn, removebtn);
    var listDiv = elt(
      "div",
      { class: "list", id: this.id },
      timeDiv,
      titldDiv,
      buttonDiv
    );
    var contentDiv = document.getElementById("contentWrap");
    contentDiv.appendChild(listDiv);
  };

  Todo.prototype.remove = function (id) {
    todoList = todoList.filter(function (todo) {
      return todo.id !== id;
    });
    renderTodoList();
  };

  function addTodo() {
    const todoContent = document.getElementById("inputValue").value;
    const fullTimeIs = new Date();
    const stringTime = fullTimeIs.yyyymmddhhmmss();
    if (!todoContent) {
      alert("입력하쇼");
      return;
    }

    todoList.push(new Todo(todoContent, stringTime));
    renderTodoList();
  }

  function editTodo(id, newContent) {
    const todo = todoList.find(function (todo) {
      return id === todo.id;
    });
    if (!todo) {
      alert("잘못된 명령입니다");
      return;
    }

    todo.content = newContent;
    renderTodoList();
  }
  function renderTodoList() {
    document.getElementById("contentWrap").innerHTML = "";
    const stringTodoList = JSON.stringify(todoList);
    localStorage.setItem("todoList", stringTodoList);
    todoList.map(todo => todo.drawInHtml());
  }

  var button = document.getElementById("submitButton");
  button.addEventListener("click", addTodo);

  renderTodoList();
})();
