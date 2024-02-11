import React, { useState } from "react";
import { io } from "socket.io-client";
import "./main.css";

export default function Game({ setContent, socket }) {
  socket.on("gameEnd", () => {
    setContent("Result");
  });

  socket.on("gamerlist", (gamer) => {
    let gamerlist = Object.keys(gamer);

    if (gamerlist.length < 3) {
      setContent("Result");
    }

    let c = 1;
    for (let i in gamerlist) {
      let element = document.getElementById("gamer" + c);
      element.innerHTML =
        c +
        "번 <br/>" +
        gamer[gamerlist[i]]["nickname"] +
        "<br/> 점수 : " +
        "<p id='" +
        gamerlist[i] +
        "_point'>" +
        gamer[gamerlist[i]]["point"] +
        "점 <p/>" +
        "승/패 : " +
        "<span id='" +
        gamerlist[i] +
        "_win'>" +
        gamer[gamerlist[i]]["win"] +
        "/<span/>" +
        "<span id='" +
        gamerlist[i] +
        "_lose'>" +
        gamer[gamerlist[i]]["lose"] +
        "<span/>";
      c++;
    }

    document.getElementById("name").disabled = true;
    document.getElementById("submit").disabled = true;
  });

  const submit = (e) => {
    let alertPlaceholder = document.getElementById("check");
    let name = document.getElementById("name");

    if (name.value.length < 1) {
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
      alert("역명을 입력하고 완료를 누르세요");
    } else {
      socket.emit("station_submit", name.value);
      name.value = null;
    }
  };

  socket.on("submitcount", (c) => {
    let count = document.getElementById("count");
    count.className = "m-1 rounded-pill gameCount_style";
    count.innerHTML = c;
  });

  socket.on("target", (turn) => {
    let preTurn = turn - 1;
    if (preTurn == 0) {
      preTurn = 3;
    }
    document.getElementById("gameMC").innerHTML = turn + "번 차례입니다";
    document.getElementById("gamer" + turn).className =
      "col m-2 card p-2 pt-4 rounded";
    document.getElementById("gamer" + preTurn).className =
      "col m-2 waitCard p-2 pt-4 rounded";
  });

  socket.on("input", () => {
    document.getElementById("name").disabled = false;
    document.getElementById("submit").disabled = false;
  });
  socket.on("inputLock", () => {
    document.getElementById("name").value = null;
    document.getElementById("name").disabled = true;
    document.getElementById("submit").disabled = true;
  });

  socket.on("station_result", ([result, name]) => {
    if (result == false) {
    } else {
      const station = document.getElementById("stationlist");
      if (station != null) {
        station.remove();
      }

      let stationlist = document.createElement("div");
      stationlist.id = "stationlist";
      stationlist.className = "row row-cols-4";

      for (let i in name) {
        let element = document.createElement("div");
        element.className = "col rounded-pill py-1 px-2 station_style";
        element.innerText = name[i];
        element.id = name[i];

        stationlist.appendChild(element);
      }
      document.getElementById("station").appendChild(stationlist);
    }
  });

  return (
    <>
      <div className="mb-4 gameEx p-3 pt-4 rounded">
        <p id="gameExplain">
          자신의 차례가 되면 1호선의 역명을 입력하세요
          <br />
          응답에 주어지는 시간은 10초입니다
        </p>
      </div>

      <div>
        <p id="gameMC">1번 차례입니다</p>
      </div>
      <div id="count"></div>
      <div className="container text-center">
        <div className="row">
          <div className="col m-2 waitCard p-2 pt-4 rounded" id="gamer1"></div>
          <div className="col m-2 waitCard p-2 pt-4 rounded" id="gamer2"></div>
          <div className="col m-2 waitCard p-2 pt-4 rounded" id="gamer3"></div>
        </div>
      </div>

      <div className="input-group m-2">
        <input
          type="text"
          className="form-control"
          placeholder="역명"
          id="name"
        />
        <button
          className="btn submit_btn"
          type="button"
          id="submit"
          onClick={submit}
        >
          완료
        </button>
      </div>
      <div id="check" className="alert" role="alert"></div>

      <div id="station">
        <div className="row row-cols-4" id="stationlist"></div>
      </div>
    </>
  );
}
