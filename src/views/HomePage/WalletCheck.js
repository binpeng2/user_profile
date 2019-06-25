import React, {Component} from 'react';
import {Row, Col, Tabs} from 'antd';
import {Link} from "react-router-dom";
import './HomePage.css';
import './WalletCheck.css';
import GemComp from "./GemTable/GemComp";
import RollComp from "./RollTable/RollComp";


const { TabPane } = Tabs;

class WalletCheck extends Component{

  render(){
    return(
        <div className="WalletCheck">
          
		    <GemComp languageFile={this.props.languageFile} walletAddr  ={this.props.walletAddr} />
        </div>
    )
  }
}

export default WalletCheck;