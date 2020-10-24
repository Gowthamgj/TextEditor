import React from "react";
import "./styles.css";
import Tabs from "./Tabs";
import { TabPane } from "./Genericfunction";
import data from "./meta/input.json";
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputData: data,
      outpuData: "",
      selectedTab: 1,
      selectedFont: 8
    };
    this.findClass = this.findClass.bind(this);
    this.formatDoc = this.formatDoc.bind(this);
    this.exportJson = this.exportJson.bind(this);
    this.formatStyle = this.formatStyle.bind(this);
  }
  formatDoc(attname, attval, parentId) {
    let sel, range, selectedText;
    if (window.getSelection) {
      sel = window.getSelection();
      selectedText = sel.toString();
      if (sel.rangeCount && selectedText.length >= 1) {
        range = sel.getRangeAt(0);
        range.deleteContents();
        let newElement = document.createElement("span");
        let textnode = document.createTextNode(selectedText);
        newElement.appendChild(textnode);
        newElement.style[attname] = attval;
        console.log(range.startContainer.nodeName.toUpperCase());
        if (range.startContainer.nodeName.toUpperCase() === "P") {
          console.log("if");
          range.insertNode(newElement);
        } else {
          console.log(range);
          if (range.startOffset === 0) {
            range.startContainer.parentNode.insertAdjacentElement(
              "beforebegin",
              newElement
            );
          } else {
            // range.setStartAfter(referenceNode);
            range.insertNode(newElement);
          }
          // range.insertNode(newElement);
          console.log("else");
        }
      } else {
        console.log("indhs else");
        let newElement = document.createElement("span");
        newElement.style[attname] = attval;
        document.getElementById("p" + parentId).appendChild(newElement);
        newElement.focus();
      }
    } else {
      console.log("else");
    }
    // document.execCommand(cmd, false, val);
  }
  formatStyle(styledata) {
    let eachStyledef = styledata.split(";");
    let styleobj = {};
    let basicStyle = ["bold", "italic", "underline"];
    eachStyledef.forEach((f) => {
      if (f) {
        let stylevalue = f.split(":")[1].trim();
        let stylename = f.split(":")[0].trim();
        if (basicStyle.includes(stylevalue)) {
          styleobj[stylevalue] = true;
        }
        if (stylevalue === "line-through") {
          styleobj["strike"] = true;
        }
        if (stylename === "color") {
          styleobj["color"] = stylevalue;
        }
        if (stylename === "font-size") {
          styleobj["fontsize"] = stylevalue;
        }
      }
    });
    return styleobj;
  }
  exportJson() {
    let exportitem = { book: [] };
    this.state.inputData.book.forEach((book) => {
      let obj = {};
      obj.sno = book.sno;
      obj.chaptertitle = book.chaptertitle;
      obj.paras = [];
      document.getElementById("chapter" + book.sno).childNodes.forEach((pa) => {
        let paraobj = { type: "para" };
        paraobj.content = [];
        pa.childNodes.forEach((con) => {
          con.childNodes.forEach((subchild) => {
            let contobj = { type: "content" };
            if (subchild.nodeValue !== "" || subchild.innerText !== "") {
              contobj.text =
                subchild.nodeName === "#text"
                  ? subchild.nodeValue
                  : subchild.innerText;
              let styleobj;
              console.log(contobj.text, subchild.style);
              if (typeof subchild.style !== "undefined") {
                let s1 = this.formatStyle(subchild.style.cssText);
                let s2 = this.formatStyle(subchild.parentNode.style.cssText);
                styleobj = {
                  ...s1,
                  ...s2
                };
              } else {
                styleobj = this.formatStyle(subchild.parentNode.style.cssText);
              }
              if (Object.keys(styleobj).length) {
                contobj.format = styleobj;
              }
              paraobj.content.push(contobj);
            }
          });
        });
        let parastyleobj = this.formatStyle(pa.style.cssText);
        if (Object.keys(parastyleobj).length) {
          paraobj.format = parastyleobj;
        }
        obj.paras.push(paraobj);
      });
      exportitem.book.push(obj);
    });
    // setTimeout(() => {
    this.setState({ outpuData: exportitem });
    // }, 5000);
    console.log(exportitem);
  }
  findClass(obj) {
    let styleobj = {};
    if (obj !== undefined) {
      if (obj.hasOwnProperty("bold")) {
        styleobj["fontWeight"] = obj.bold ? "bold" : "Normal";
      }
      if (obj.hasOwnProperty("italic")) {
        styleobj["fontStyle"] = obj.italic ? "italic" : "Normal";
      }
      if (obj.hasOwnProperty("underline")) {
        styleobj["textDecoration"] = obj.underline ? "underline" : "None";
      }
      if (obj.hasOwnProperty("strike")) {
        styleobj["textDecoration"] = obj.strike ? "line-through" : "None";
      }
      if (obj.hasOwnProperty("color")) {
        styleobj["color"] = obj.color ? obj.color : "black";
      }
      if (obj.hasOwnProperty("fontsize")) {
        styleobj["fontSize"] = obj.fontsize;
      }
      if (obj.hasOwnProperty("afterspace")) {
        styleobj["afterSpace"] = obj.afterspace;
      }
    }
    return styleobj;
  }
  componentDidMount() {
    document
      .getElementById("chapter" + this.state.selectedTab)
      .addEventListener(
        "keypress",
        function (ev) {
          if (ev.keyCode === "13")
            document.execCommand("formatBlock", false, "p");
        },
        false
      );
  }
  render() {
    let fontsizelist = [];
    for (let i = 8; i <= 72; i++) {
      fontsizelist.push(i);
    }
    return (
      <div className="App">
        <div className="inputarea">
          <h3>Input Json</h3>
          {JSON.stringify(data)}
        </div>
        <div className="ouputarea">
          <h3>Output Json </h3>
          <button
            onClick={() => {
              this.exportJson();
            }}
          >
            Export
          </button>
          <br />
          {this.state.outpuData !== "" ? (
            <span className="outdata">
              {JSON.stringify(this.state.outpuData)}
            </span>
          ) : (
            ""
          )}
        </div>

        <Tabs
          align="left"
          selectedTabChange={(e) => {
            // this.setState({ selectedTab: e + "" });
            this.setState({ selectedTab: e, selectedFont: 8 });
          }}
          preselect={this.state.selectedTab}
        >
          {this.state.inputData["book"].map((i) => {
            return (
              <TabPane
                id={i.sno}
                title={i.chaptertitle}
                subtitle=""
                selected={this.state.selectedTab}
              >
                <button
                  onClick={() => {
                    this.formatDoc("fontWeight", "bold");
                  }}
                >
                  B
                </button>
                <button
                  onClick={() => {
                    this.formatDoc("fontStyle", "italic", i.sno);
                  }}
                >
                  I
                </button>
                <button
                  onClick={() => {
                    this.formatDoc("text-decoration", "underline", i.sno);
                  }}
                >
                  U
                </button>
                <button
                  onClick={() => {
                    this.formatDoc("text-decoration", "line-through", i.sno);
                  }}
                >
                  S
                </button>
                <select
                  value={this.state.selectedFont}
                  onChange={(e) => {
                    this.setState({ selectedFont: e.target.value });
                    this.formatDoc("fontSize", e.target.value + "px", i.sno);
                  }}
                >
                  {fontsizelist.map((fs) => {
                    return <option value={fs}>{fs}</option>;
                  })}
                </select>
                <input
                  type="color"
                  onChange={(e) => {
                    this.formatDoc("color", e.target.value, i.sno);
                  }}
                />
                <div
                  className="editor"
                  id={"chapter" + i.sno}
                  key={i.sno}
                  contentEditable
                >
                  {i.paras.map((para) => {
                    return (
                      <p id={"p" + i.sno} style={this.findClass(para.format)}>
                        {para.content.map((cont, idx) => {
                          return (
                            <span key={idx} style={this.findClass(cont.format)}>
                              {cont.text}
                            </span>
                          );
                        })}
                      </p>
                    );
                  })}
                </div>
              </TabPane>
            );
          })}
        </Tabs>
      </div>
    );
  }
}
