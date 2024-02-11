import React, { useState } from "react";
import { io } from "socket.io-client";
import "./main.css";

export default function Wait({ setContent, socket }) {
  socket.on("gamerReady", (gamer) => {
    const listDiv = document.getElementById("listDiv");
    if (listDiv != null) {
      listDiv.remove();
    }

    let list = document.getElementById("gamerlist");
    let gamerlist = Object.keys(gamer);
    //console.log(gamerlist);

    let div = document.createElement("div");
    div.id = "listDiv";

    for (let i in gamerlist) {
      let element = document.createElement("li");
      element.className = "list-group-item m-2 rounded";
      element.innerHTML = gamer[gamerlist[i]]["nickname"];

      div.appendChild(element);
    }
    list.insertAdjacentElement("afterend", div);
  });

  const ready = (e) => {
    let alertPlaceholder = document.getElementById("check");
    let nickname = document.getElementById("nickname");

    if (nickname.value.length < 1) {
      let alert = (message) => {
        let wrapper = document.createElement("div");
        wrapper.innerHTML = [
          `<div class="alert alert-danger alert-dismissible" role="alert">`,
          `   <div>${message}</div>`,
          '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
          "</div>",
        ].join("");

        alertPlaceholder.append(wrapper);
      };
      alert("이름을 입력하고 Ready 버튼을 누르세요");
    } else {
      socket.emit("join", nickname.value);
      document.getElementById("waitMSG").innerText =
        "다른 게임 참가자를 기다리고 있습니다";
    }
  };

  socket.on("waitgame", (status) => {
    let alertPlaceholder = document.getElementById("check");
    let alert = (message) => {
      let wrapper = document.createElement("div");
      wrapper.innerHTML = [
        `<div class="alert alert-danger alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        "</div>",
      ].join("");

      alertPlaceholder.append(wrapper);
    };

    alert("참가자가 가득 찼습니다! 게임을 관전합니다");
  });

  socket.on("ready", (readycount) => {
    document.getElementById("waitMSG").innerText =
      "먼저 Ready한 클라이언트들 간 게임이 진행됩니다";

    let count = document.getElementById("count");
    count.className = "m-5 p-2 rounded-pill count_style";
    count.innerHTML = readycount + "초 후 게임 시작합니다";
  });
  socket.on("gamestart", (gamer) => {
    setContent("Game");
  });

  socket.on("waitMSG", () => {
    document.getElementById("waitMSG").innerText =
      "상대방의 선택을 기다리는 중";
  });

  socket.on("waitGamerMSG", () => {
    document.getElementById("waitMSG").innerText = "참가자를 기다리는 중";
  });
  return (
    <>
      <div>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="이름"
            id="nickname"
          />
          <button
            className="btn room_btn"
            type="button"
            onClick={ready}
            id="ready"
          >
            Ready
          </button>
        </div>
        <div id="check" className="alert" role="alert"></div>
      </div>
      <div>
        <ol className="list-group m-4">
          <p id="gamerlist">참가자 리스트</p>
          <div id="listDiv"></div>
        </ol>
      </div>
      <div id="waitMSG" className="waitMSG">
        게임 참가자를 기다리고 있습니다
      </div>
      <div id="count"></div>
    </>
  );
}
