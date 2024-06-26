import React from "react";

export default function Header() {
  const header_style = {
    backgroundColor: "#FFFFFF",
    color: "#1790BF",
    border: "10px solid #1790BF",
    position: "relative",
  };
  return (
    <div>
      <div className="mt-4 p-3 fixed-top rounded-pill" style={header_style}>
        <h1>&#128643; 오늘도 평화로운 1호선 &#128643;</h1>
        <h5>1호선 역이름 말하기 게임</h5>
      </div>
    </div>
  );
}
