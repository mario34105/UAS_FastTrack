var websocket = new WebSocket("ws://" + location.hostname + ":" + location.port + "/chat/")
// var game = new WebSocket("ws://" + location.hostname + ":" + location.port + "/game/")
// game.onmessage = function(msg) {
//     var data = JSON.parse(msg.data)
//     alert("Joined as player " + data.player)
// }
websocket.onmessage = function (msg) { updateChat(msg) }
websocket.onclose = function () { alert("Websocket connection closed") }

id("send").addEventListener("click", function() {
    sendMessage(id("message").value, $('input#chat_to').val())
})

id("message").addEventListener("keypress", function(e) {
    if (e.keyCode == 13) { sendMessage(e.target.value, $('input#chat_to').val()) }
})

function sendMessage(message, to) {
    if (message !== "") {
        //websocket.send(message)
        websocket.send(JSON.stringify({nama: "budi", pesan: message, kepada: to}))
        id("message").value = ""
    }
}

function updateChat(msg) {
    var data = JSON.parse(msg.data)
    currentUser = data.currentUser
    insert("chat", data.userMessage)
    id("userlist").innerHTML = ""
    data.userList.forEach(function (user) {
        let list = "<li style='padding: 2px 0'>" + user + "<button class='chat' style='float: right'>Chat</button></li>";
        if(user == $('input#chat_to').val()) {
            list = "<li style='padding: 2px 0'>" + user + "<button class='chat' disabled style='float: right'>Chat</button></li>"
        }
        insert("userlist", list)
    })
    if($('input#chat_to').val() == 'Group') {
        insert("userlist", "<li style='padding: 2px 0'>Group<button class='chat' disabled style='float: right'>Chat</button></li>")
    } else {
        insert("userlist", "<li style='padding: 2px 0'>Group<button class='chat' style='float: right'>Chat</button></li>")
    }
}


function insert(targetId, message) {
    /*b = document.createElement("b")
    b.innerHTML = message.from + " says:"
    p = document.createElement("p")
    p.innerHTML = message.message
    span = document.createElement("span")
    span.setAttribute("class", "timestamp")
    span.innerHTML = message.timestamp
    article = document.createElement("article")
    article.appendChild(b)
    article.appendChild(p)
    article.appendChild(span)
    id(targetId).insertAdjacentElement("afterbegin", article)*/
    id(targetId).insertAdjacentHTML("afterbegin", message)
}

function id(id) {
    return document.getElementById(id)
}

$(document.body).on('click', 'button.chat', function(e) {
    e.preventDefault();
    let chatTo = $(this).closest('li').clone().children().remove().end().text();
    console.log($(this).closest('li').clone().children().remove().end().text())
    $(this).attr('disabled', true)
    $(this).closest('li').siblings().find('button.chat').attr('disabled', false)
    $('input#chat_to').val(chatTo);
    $('#chat').children('article').not('.' + chatTo).remove();
})