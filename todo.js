(function () {
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

  let todoList = [];
  //저장된 값 불러오기

  if (localStorage.getItem("todoList")) {
    //저장된 값이 있을 경우

    try {
      const parsedTodoList = JSON.parse(localStorage.getItem("todoList"));
      todoList = parsedTodoList.map(pTodo => {
        const { content, time, id } = pTodo;
        return new Todo(content, time, id);
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

  const idGenerator = generateID();
  function Todo(content, time, id) {
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
    if (!todoContent) {
      alert("입력하쇼");
      return;
    }

    todoList.push(new Todo(todoContent));
    renderTodoList();
    var topNav = document.getElementById("topNav");
    var lineUpByTime = elt("input", { type: "Button", value: "정렬" });
    var lineUpBtnDiv = elt("div", { id: "order" }, lineUpByTime);
    topNav.appendChild(lineUpBtnDiv);
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
