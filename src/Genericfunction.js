// import "../styles/grids.css";
import React from "react";
// import "./tabs.css";
// import "../styles/input.css";
export function Grid(props) {
  return (
    <div className={`section group ${props.additionalclass}`}>
      {props.children}
    </div>
  );
}
export function GridCol(props) {
  return (
    <div
      className={`col span_${props.col ? props.col : 1}_of_${props.total} ${
        props.extraclass
      }`}
    >
      {props.children}
    </div>
  );
}
export function TabPane(props) {
  return (
    <div
      className={`tab-content vertical ${
        props.selected !== props.id ? "hidetab" : ""
      }`}
    >
      {props.children}
    </div>
  );
}
export function InputEle(props) {
  return (
    <input
      type={props.type}
      className="inputbox"
      placeholder={props.placeholder}
    />
  );
}
export function Button(props) {
  return (
    <button className={`btn ${props.type} btn${props.size}`}>
      {props.title}
    </button>
  );
}
