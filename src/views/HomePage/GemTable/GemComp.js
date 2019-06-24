import React, {Component} from 'react';
import './Gem.css';
import GemTable from './GemTable.js';
import { Divider } from 'antd';
import { relative } from 'path';
import {GetRequest} from "../../../component/APIRequest/APIRequest";
import axios from 'axios';



const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
			height: 1,
			marginTop: 0
        }}
    />
);

class GemComp extends Component {
  constructor(props){
	super(props);
	
    this.state={
	  tabs:"Gem",
	  record: null,
	  GemRecord:null,
      InvestRecord:null,
    }
  }

  componentDidMount = () =>{
    this.fetchDepositHistory("GemRecord");
  }

  fetchDepositHistory = (listName) =>{
	if (listName === "GemRecord") {
    axios.get('https://backend.crazydogs.live:4001/api/luckynumber/globalBetsHistory')
    .then(res =>{
      this.setState({GemRecord:res.data.data})
    })
    .catch(err =>{
      console.log(err)
	})
}
  }

  changeHistoryList = (listName) =>{
    this.setState({
      record:this.state[listName]
    },()=>{
      this.fetchDepositHistory(listName);
    })
  }

  render(){
    return(
		
        <div align="middle">
          <div>
            <div className="TabsDiv">
              <span className={this.state.tabs === "Gem" ? "TabsHighlighted" : "Tabs"} onClick={()=>{this.setState({tabs:"Gem"},()=>{this.changeHistoryList("GemRecord")})}}>{this.props.languageFile.GemRush.gemFlow}</span>
			  &nbsp;
              <span className={this.state.tabs === "Invest" ? "TabsHighlighted" : "Tabs"} onClick={()=>{this.setState({tabs:"Invest"},()=>{this.changeHistoryList("InvestRecord")})}}>{this.props.languageFile.GemRush.investmentRecord}</span>
			  <span className="Note">{this.props.languageFile.GemRush.gemRush}</span>
			</div>
			<div style={{position: relative, top:0, marginTop:0}}>
			<ColoredLine color="white" />     
			</div>
			<div>
            <GemTable languageFile={this.props.languageFile} tabs={this.state.tabs} record={this.state[this.state.tabs+"Record"]}/>
            </div>
          </div>
		
        </div>

      )

  }

}

export default GemComp;