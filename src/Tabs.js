import React from "react";
import "./tabs.css";
export default class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tabList: [], selectedTab: "" };
    this.leftsidePane = this.leftsidePane.bind(this);
    this.rightsidePane = this.rightsidePane.bind(this);
    this.tabClass = this.tabClass.bind(this);
    this.showTab = this.showTab.bind(this);
  }
  tabClass(id) {
    let cls = [];
    for (let i = 0; i < this.state.tabList.length; i++) {
      if (this.state.tabList[i].id === id + "") {
        if (this.state.tabList[i].active) {
          cls.push("active");
        }
      }
    }
    return cls.join(" ");
  }
  showTab(e) {
    let tab = this.state.tabList.filter((t) => t.id === e);
    if (tab.length) {
      this.setState({ selectedTab: e });
      // const elementsIndex = this.state.tabList.findIndex(element => element.id === e+'' )
      let newArray = [...this.state.tabList];
      for (let i = 0; i < newArray.length; i++) {
        console.log(newArray[i].id, e);
        if (newArray[i].id !== e) {
          newArray[i] = { ...newArray[i], active: false };
        } else {
          newArray[i] = { ...newArray[i], active: true };
        }
      }
      this.setState({ tabList: newArray });
      this.props.selectedTabChange(e);
    }
  }
  leftsidePane() {
    if (this.props.align === "left") {
      return (
        <div className="left">
          <div className="cells left">
            <ul className={`verttabs ${this.props.align}`}>
              {this.state.tabList.map((t) => {
                return (
                  <li
                    className={this.tabClass(t.id)}
                    key={t.id}
                    onClick={(e) => {
                      this.showTab(t.id);
                      e.stopPropagation();
                    }}
                  >
                    <h4 className="title">{t.title}</h4>
                    <span className="righheadicon">&gt;</span>
                    <br />
                    <span className="subtitle">{t.subtitle}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="cells center">{this.props.children}</div>
        </div>
      );
    } else {
      return "";
    }
  }
  rightsidePane() {
    if (this.props.align === "right") {
      return (
        <div className="right">
          <div className="cells center">{this.props.children}</div>
          <div className="cells right">
            <ul>
              {this.state.tabList.map((t) => {
                return <li key={t.id}>{t.title}</li>;
              })}
            </ul>
          </div>
        </div>
      );
    } else {
      return "";
    }
  }
  componentDidMount() {
    let tabdata = [];
    let tabName = [];
    console.log(this.props.children);
    for (let i = 0; i < this.props.children.length; i++) {
      let data = this.props.children[i].props;
      tabdata.push({
        id: data.id,
        title: data.title,
        subtitle: data.subtitle,
        active: false
      });
      tabName.push(data.id);
    }
    this.setState({ tabList: tabdata });
    console.log(tabdata);
    setTimeout(() => {
      if (
        this.state.selectedTab !== "" &&
        tabName.includes(this.state.selectedTab)
      ) {
        this.showTab(this.state.selectedTab);
      } else if (this.props.preselect.length > 0) {
        this.showTab(this.props.selectedTab);
      } else {
        this.showTab(this.state.tabList[0].id);
      }
    }, 50);
  }
  render() {
    return (
      <div className="tabWrapper">
        <this.leftsidePane />
        <this.rightsidePane />
      </div>
    );
  }
}
