import Header from "./header";
import Result from "./result";
import Game from "./game";
import Wait from "./wait";
import Footer from "./footer";
import "./layout.css";
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
const socket = io("http://15.164.138.159:3000/", {
  transports: ["websocket"],
});

function App() {
  socket.on("connect", () => {
    socket.emit("user");
  });

  const [content, setContent] = useState("Wait");

  console.log("App: " + content);

  const selectComponent = {
    Wait: <Wait setContent={setContent} socket={socket} />,
    Game: <Game setContent={setContent} socket={socket} />,
    Result: <Result setContent={setContent} socket={socket} />,
  };

  return (
    <>
      <div className="head">
        <Header></Header>
      </div>
      <div className="main">
        {content && <content>{selectComponent[content]}</content>}
      </div>
      <div className="footer">
        <Footer setContent={setContent}></Footer>
      </div>
    </>
  );
}

export default App;
