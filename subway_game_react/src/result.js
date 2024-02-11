import React, { useState } from "react";
import { io } from "socket.io-client";
import "./main.css";

export default function Result({ setContent, socket }) {
  socket.on("gamerResult", (result) => {
    console.log(result);
    document.getElementById("gameResult").innerHTML = result;
    document.getElementById("Game").disabled = false;
  });

  socket.on("userResult", (user) => {
    document.getElementById("Game").disabled = true;
    const listDiv = document.getElementById("userlistDiv");
    if (listDiv != null) {
      listDiv.remove();
    }

    let list = document.getElementById("userlist");
    let userlist = Object.keys(user);

    let div = document.createElement("div");
    div.id = "userlistDiv";

    for (let i in userlist) {
      let element = document.createElement("li");
      element.className = "list-group-item m-2 rounded";
      element.innerHTML =
        user[userlist[i]]["nickname"] +
        "님의 점수: " +
        user[userlist[i]]["point"];

      div.appendChild(element);
    }
    list.insertAdjacentElement("afterend", div);
  });

  const game = (e) => {
    socket.emit("replayClick");
    setContent("Wait");
  };

  const exit = (e) => {
    setContent("Wait");
    socket.emit("exitRoom");
  };

  return (
    <>
      <div id="gameResult" className="gameResult heartbeat"></div>

      <div>
        <ol className="list-group m-4">
          <p id="userlist">전체 사용자 점수</p>
          <div id="userlistDiv"></div>
        </ol>
      </div>
      <div>
        <button
          className="btn room_btn m-3"
          type="button"
          onClick={game}
          id="Game"
        >
          다시하기
        </button>
        <button
          className="btn room_btn m-3"
          type="button"
          onClick={exit}
          id="Wait"
        >
          대기하기
        </button>
      </div>
    </>
  );
}
