window.onload = (function () {
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
      " 년 " +
      (time.getMonth() + 1) +
      " 월" +
      time.getDate() +
      " 일"
    );
  }

  let todoList = [];
  //저장된 값 불러오기

  if (localStorage.getItem("todoList")) {
    //저장된 값이 있을 경우

    try {
      const parsedTodoList = JSON.parse(localStorage.getItem("todoList"));
      todoList = parsedTodoList.map(pTodo => {
        const { content, fullTime, time, id, isChecked } = pTodo;
        return new Todo(content, fullTime, time, id, isChecked);
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

  function Todo(content, fullTime, time, id, isChecked) {
    this.fullTime = fullTime ?? new Date.yyyymmddhhmmss();
    this.content = content;
    this.time = time ?? getCurrentTimeString();
    this.id = id ?? idGenerator.next().value;
    this.isChecked = isChecked ?? false;
  }
  Todo.prototype.drawInHtml = function () {
    var titldDiv = elt(
      "div",
      { class: "subtitle", id: "*" + this.id },
      this.content
    );
    var beforeCheck = elt("input", {
      class: "beforeCheck",
      id: "%" + this.id,
      type: "button"
    });

    if (!this.isChecked) {
      beforeCheck.style.background = "url(./icons/noneCheck.png)";
      beforeCheck.style.backgroundSize = "24px";
      titldDiv.style.color = "#495057";
      titldDiv.style.textDecoration = "none";
    } else {
      beforeCheck.style.background = "url(./icons/checked.png)";
      beforeCheck.style.backgroundSize = "24px";
      titldDiv.style.color = "gray";
      titldDiv.style.textDecoration = "line-through";
    }

    beforeCheck.addEventListener(
      "click",
      function () {
        this.isChecked = !this.isChecked;
        renderNav();
        renderTodoList();
      }.bind(this),
      false
    );
    var contentLine = elt(
      "div",
      { class: "contentLine" },
      beforeCheck,
      titldDiv
    );
    const todoId = this.id;
    var editbtn = elt("input", {
      type: "button",
      id: "##" + this.id,
      class: "editBtn"
    });

    editbtn.addEventListener("click", function () {
      const editText = prompt("여기에 입력하세요");
      if (!editText) {
        alert("입력하쇼");
        return;
      }

      editTodo(todoId, editText);
    });

    var removebtn = elt("input", {
      type: "button",
      id: "#" + this.id,
      class: "removeButton"
    });
    removebtn.addEventListener("click", function () {
      Todo.prototype.remove(todoId);
    });

    var buttonDiv = elt(
      "div",
      { class: "changeButton", id: "$" + this.id },
      editbtn,
      removebtn
    );
    var listDiv = elt("div", { class: "list", id: this.id }, contentLine);
    var contentDiv = document.getElementById("contentWrap");
    contentDiv.appendChild(listDiv);
    listDiv.addEventListener(
      "mouseover",
      function () {
        contentLine.appendChild(buttonDiv);
        document.getElementById("$" + this.id).style.visibility = "visible";
      },
      false
    );
    listDiv.addEventListener(
      "mouseleave",
      function () {
        document.getElementById("$" + this.id).style.visibility = "hidden";
      },
      false
    );
  };

  Todo.prototype.remove = function (id) {
    todoList = todoList.filter(function (todo) {
      return todo.id !== id;
    });
    renderTodoList();
  };

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
  function renderNav() {
    var today = new Date();
    var week = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일"
    ];
    now.innerHTML = getCurrentTimeString();
    day.innerHTML = week[today.getDay()];

    const leftTodoCount = todoList.reduce(function (acc, todo) {
      console.log(todo, todo.isChecked);
      if (!todo.isChecked) return acc + 1;
      else return acc;
    }, 0);
    console.log("leftCount", leftTodoCount);
    tasksLeft.innerHTML = "할일 " + leftTodoCount + "개 남음";
  }
  function renderTodoList() {
    document.getElementById("contentWrap").innerHTML = "";
    const stringTodoList = JSON.stringify(todoList);
    localStorage.setItem("todoList", stringTodoList);
    todoList.map(todo => todo.drawInHtml());
    console.log(todoList);
    renderNav();
  }

  let isClicked = new Object(null);
  isClicked.bool = false;
  const extendBtn = document.getElementById("extendBtn");
  const form = document.getElementById("Form");

  //extend 버튼

  extendBtn.addEventListener("click", click, false);
  function click() {
    const boxing = elt("div", { class: "input-box", id: "inputBox" });
    Elements.inputBox = boxing;
    if (isClicked.bool) {
      extendBtn.style.transform = "rotate(0deg)";
      Elements.boxOutput.style.transform = " 0 100% 0 rotateX(45deg)";
      Elements.boxOutput.style.display = "none";
    } else if (!isClicked.bool) {
      extendBtn.style.transform = "rotate(215deg)";
      extendBtn.style.transition = "0.125s all ease-in";
      if (!Elements.boxOutput) {
        Elements.inputBox.style.display = "block";
      } else {
        Elements.boxOutput.style.display = "block";
      }
    }
    isClicked.bool = !isClicked.bool;
  }
  extendBtn.addEventListener(
    "click",
    function () {
      promise();
    },
    { once: true }
  );

  // 생성
  function generateInput() {
    const inputValue = elt("input", {
      id: "inputValue",
      type: "text",
      placeholder: "해야할 일을 입력하세요.",
      maxlength: "40"
    });
    const submit = elt("input", {
      type: "submit",
      value: "확인",
      id: "submitButton"
    });
    const sortByTime = elt("input", {
      id: "sortByTime",
      type: "button",
      value: "시간순"
    });
    const sortByContent = elt("input", {
      id: "sortByContent",
      type: "button",
      value: "내용순"
    });

    const sort = elt("div", { class: "sort" }, sortByTime, sortByContent);
    const inputDiv = elt(
      "div",
      { class: "inputWrap" },
      inputValue,
      submit,
      sort
    );
    form.insertBefore(Elements.inputBox, extendBtn);
    Elements.inputBox.appendChild(inputDiv);
    new Elements(sortByContent, sortByTime);
  }
  function sortByContent() {
    let isSortedByContentAscend = false;

    this.sortByContent.addEventListener("click", function () {
      todoList = todoList.sort(function (a, b) {
        if (isSortedByContentAscend) {
          if (a.content < b.content) {
            return -1;
          } else if (a.content > b.content) {
            return 1;
          }
        } else {
          if (a.content > b.content) {
            return -1;
          } else if (a.content < b.content) {
            now;
            return 1;
          }
        }
        return 0;
      }, false);
      isSortedByContentAscend = !isSortedByContentAscend;
      renderTodoList();
    });
  }
  function sortByTime() {
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
  }
  function Elements(content, time, box) {
    this.sortByContentBtn = content;
    this.sortByTimeBtn = time;
    this.inputBox = box;
  }

  function promise() {
    const promise = new Promise(resolve => {
      generateInput();
      resolve();
    });

    promise.then(value => {
      sortByContent();
      sortByTime();
      var button = document.getElementById("submitButton");
      button.addEventListener("click", addTodo);
    });
    function addTodo() {
      const todoContent = document.getElementById("inputValue").value;
      const fullTimeIs = new Date();
      const stringTime = fullTimeIs.yyyymmddhhmmss();

      if (!todoContent) {
        alert("입력하쇼");
        return;
      }
      todoList.push(new Todo(todoContent, stringTime));
      document.getElementById("inputValue").value = null;

      renderTodoList();
      renderNav();
    }
    Elements.boxOutput = Elements.inputBox;
  }
  renderTodoList();
})();
