window.onload = function () {

    for(var name in listControl) {
        listControl[name]();
    }
}

var listControl = Object.create(null);

listControl.generate = function() {

    var button = document.getElementById("submitButton");
    var contentDiv = document.getElementById("contentWrap");
    var listNumber = 0;
    var editNumber = 0;
    button.addEventListener("click", submitClicked, false);
    
    function submitClicked(e){
        //추가
        var time = new Date();
        

        listNumber += 1;
        editNumber += 1;
        var text = document.getElementById("inputValue").value;
        var timeDiv = elt("div",{class: "time"},time.getFullYear() + "년" + (time.getMonth() + 1) + "월" +time.getDate() + "일" + time.getHours() + "시" + time.getMinutes() + "분");
        var subtitle = elt("p",null,text);
        var titldDiv = elt("div",{class: "subtitle"},subtitle);
        var editbtn = elt("input", {type: "button", id:"##"+editNumber,value: "수정"});
        var removebtn = elt("input", {type: "button",id: "#"+listNumber ,value: "삭제"});
        var buttonDiv = elt("div", {class:"changeButton"},editbtn,removebtn);
        var listDiv = elt("div",{class: "list", id:listNumber},timeDiv,titldDiv,buttonDiv);

        contentDiv.appendChild(listDiv);
        
        var promise = new Promise(function(submitClicked, reject){
            submitClicked()
        });
        //수정
        promise.then(function() {

            listControl.remove = function remove() {
                var eachBtn = document.getElementById(removebtn.id);
                eachBtn.addEventListener("click",function(){
                    listDiv.remove();
                },false);
            }();

            listControl.edit = function() {
                var editBtn = document.getElementById(editbtn.id);
                editBtn.addEventListener("click",function(){
                    var editText = prompt("입력하세요");
                    var newSubTitle = elt("p",null,editText);
                    subtitle.parentNode.replaceChild(newSubTitle, subtitle);
                },false);
            }();

        });

        

    }
    
};


