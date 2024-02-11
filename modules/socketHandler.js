const { Server } = require("socket.io");
const { json } = require("stream/consumers");

const socketHandler = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://port-0-subway-game-17xco2nlsh8my76.sel5.cloudtype.app",
      methods: ["GET", "POST"],
    },
  });

  let user = {};
  let gamer = {};
  const station = [
    "탕정",
    "신창",
    "대방",
    "회기",
    "신길",
    "봉명",
    "녹천",
    "쌍용",
    "온양온천",
    "노량진",
    "영등포",
    "외대앞",
    "신이문",
    "석계",
    "광운대",
    "월계",
    "창동",
    "신도림",
    "용산",
    "배방",
    "구로",
    "가산디지털단지",
    "금천구청",
    "석수",
    "안양",
    "명학",
    "군포",
    "성균관대",
    "화서",
    "수원",
    "독산",
    "세류",
    "오산대",
    "오산",
    "진위",
    "송탄",
    "남영",
    "금정",
    "서정리",
    "평택",
    "성환",
    "직산",
    "천안",
    "광명",
    "오류동",
    "역곡",
    "부천",
    "송내",
    "부평",
    "동암",
    "동인천",
    "인천",
    "소사",
    "간석",
    "관악",
    "주안",
    "구일",
    "부개",
    "도원",
    "온수",
    "중동",
    "도화",
    "아산",
    "당정",
    "방학",
    "도봉",
    "망월사",
    "회룡",
    "의정부",
    "의왕",
    "병점",
    "두정",
    "서동탄",
    "제물포",
    "양주",
    "덕계",
    "덕정",
    "지행",
    "동두천중앙",
    "동두천",
    "세마",
    "평택지제",
    "개봉",
    "백운",
    "도봉산",
    "소요산",
    "가능",
    "녹양",
    "보산",
    "서울역",
    "시청",
    "종각",
    "종로3가",
    "종로5가",
    "동대문",
    "신설동",
    "제기동",
    "청량리",
    "동묘앞",
  ];
  let station_game = [];
  let turn = 0;
  let submitCount;
  let submitTimeout;
  let target;
  let replay = 0;

  io.on("connect", (socket) => {
    const req = socket.request;
    const socket_id = socket.id;
    console.log("connection!");
    console.log("socket ID : ", socket_id);
    user[socket.id] = {
      nickname: "관전자",
      point: 0,
      win: 0,
      lose: 0,
    };

    socket.on("user", () => {
      socket.emit("gamerReady", gamer);
    });

    socket.on("join", (name) => {
      user[socket.id].nickname = name;
      if (Object.keys(gamer).length < 3) {
        gamer[socket.id] = user[socket.id];
        io.emit("gamerReady", gamer);

        if (Object.keys(gamer).length == 3) {
          let readycount = 5;

          let ready = setInterval(() => {
            io.emit("ready", readycount);
            readycount--;
          }, 1000);

          setTimeout(() => {
            clearInterval(ready);
            io.emit("gamestart", gamer);
            turn = 0;
            station_game = [];
            game();
          }, 5500);
        }
      } else {
        socket.emit("waitgame");
      }
    });

    socket.on("disconnect", () => {
      delete user[socket.id];
      delete gamer[socket.id];

      console.log("연결 종료: ", socket.id);
      gameResult();

      io.emit("gamerReady", gamer);
      turn = 0;
      clearInterval(submitCount);
      clearTimeout(submitTimeout);
      station_game = [];
      io.emit("gameEnd");
    });

    const game = () => {
      target = Object.keys(gamer);
      let count = 10;
      let preTarget = (turn % 3) - 1;
      if (turn % 3 == 0) {
        preTarget = 2;
      }
      setTimeout(() => {
        io.emit("gamerlist", gamer);
        io.emit("target", (turn % 3) + 1);
        io.to(target[turn % 3]).emit("input");
        io.to(target[preTarget]).emit("inputLock");
      }, 300);

      submitCount = setInterval(() => {
        io.emit("submitcount", count);

        count--;
      }, 1000);

      submitTimeout = setTimeout(() => {
        io.emit("submitcount", "시간초과");
        clearInterval(submitCount);
        for (let i in target) {
          gamer[target[i]].point += 1;
          gamer[target[i]].win += 1;
        }
        gamer[target[turn % 3]].point += -1;
        gamer[target[turn % 3]].win += -1;
        gamer[target[turn % 3]].lose += 1;
        turn++;
        game();
      }, 10000);

      if (turn >= 21) {
        clearInterval(submitCount);
        clearTimeout(submitTimeout);
        io.emit("gameEnd");
        gameResult();
      }
    };

    socket.on("station_submit", (name) => {
      let result = false;
      clearInterval(submitCount);
      clearTimeout(submitTimeout);

      for (let i in station) {
        if (station[i] == name) {
          result = true;
        } else if (i == station.length - 1 && station[i] != name) {
          io.emit("submitcount", "오답");
        }
      }

      for (let j in station_game) {
        if (station_game[j] == name) {
          result = false;
          io.emit("submitcount", "중복");
        }
      }

      if (result == true) {
        io.emit("submitcount", "통과");
        station_game.push(name);
      } else {
        for (let i in target) {
          gamer[target[i]].point += 1;
          gamer[target[i]].win += 1;
        }
        gamer[socket.id].point += -1;
        gamer[socket.id].win += -1;
        gamer[socket.id].lose += 1;
      }

      io.emit("station_result", [result, station_game]);
      turn++;
      game();
    });

    const gameResult = () => {
      let gamerResult = [];

      let t = Object.keys(gamer);
      let temp = [];
      let max;

      for (let i in t) {
        temp[i] = gamer[t[i]].win - gamer[t[i]].lose;
        gamer[t[i]].win = 0;
        gamer[t[i]].lose = 0;
      }

      if (temp[0] >= temp[1] && temp[0] >= temp[2]) {
        max = temp[0];
      } else if (temp[1] >= temp[0] && temp[1] >= temp[2]) {
        max = temp[1];
      } else {
        max = temp[2];
      }

      for (let j in t) {
        if (max == temp[j]) {
          gamerResult[j] = "WIN";
        } else {
          gamerResult[j] = "LOSE";
        }

        user[t[j]].point = gamer[t[j]].point;
      }

      setTimeout(() => {
        io.emit("userResult", user);
      }, 500);
      setTimeout(() => {
        io.to(t[0]).emit("gamerResult", gamerResult[0]);
        io.to(t[1]).emit("gamerResult", gamerResult[1]);
        io.to(t[2]).emit("gamerResult", gamerResult[2]);
      }, 1000);
      replay = 0;
    };

    socket.on("replayClick", () => {
      io.to(socket.id).emit("gamerReady", gamer);
      replay += 1;
      socket.emit("waitMSG");
      if (replay == 3) {
        replayStart();
      }
    });

    const replayStart = () => {
      if (Object.keys(gamer).length == 3) {
        let readycount = 5;

        let replayready = setInterval(() => {
          io.emit("ready", readycount);
          readycount--;
        }, 1000);

        setTimeout(() => {
          clearInterval(replayready);
          io.emit("gamestart", gamer);
          turn = 0;
          station_game = [];
          game();
        }, 5500);
      }
    };

    socket.on("exitRoom", () => {
      delete gamer[socket.id];
      io.emit("gamerReady", gamer);
      for (let i in Object.keys(gamer)) {
        io.to(Object.keys(gamer)[i]).emit("waitGamerMSG");
      }
    });
  });
};
module.exports = socketHandler;
