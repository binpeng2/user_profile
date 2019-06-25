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
	  totalWithdraw: 0,
	  totalInvest: 0,
    }
  }

  componentDidUpdate = () => {
  if  (this.props.walletAddr != '') {
	this.fetchDepositHistory("GemRecord");
  }
  }

  sum = (data) =>{
	  var sum = 0;
	  var i = 0;
	  for (i=0;i<data.length; i++) {
		sum += data[i].depositAmount;
	  }
	  return sum;
  }

  fetchDepositHistory = (listName) =>{

	axios.get('https://backend.crazydogs.live:4001/api/towerdefense/myFullDepositHistory?addr='+this.props.walletAddr)
    .then(res =>{
		console.log('full despoit',res);
      this.setState({GemRecord:res.data.data});
      let sum = 0;
      for (let i=0;i<res.data.data.length; i++) {
        sum += parseFloat(res.data.data[i].depositAmount);
      }
    
      this.setState({totalInvest: sum});
      
    })
    .catch(err =>{
      console.log(err)
	})

	axios.get('https://backend.crazydogs.live:4001/api/towerdefense/myFullWithdrawHistory?addr='+this.props.walletAddr)
    .then(res =>{
	// console.log('full withdraw',res);
	this.setState({InvestRecord: res.data.data});
	// let sum = 0;
  // var i = 0;
  
	// for (i=0;i<res.data.data.length; i++) {
	// 	sum += parseFloat(res.data.data[i].depositAmount);
  // }

	// this.setState({totalInvest: sum});
    })
    .catch(err =>{
      console.log(err)
	})

	axios.get('https://backend.crazydogs.live:4001/api/towerdefense/myTotalWithdraw?addr='+this.props.walletAddr)
	.then(res =>{
	// console.log(res);
	this.setState({totalWithdraw: Math.round(res.data.data)});
    })
    .catch(err =>{
     console.log(err)
	})
} 

  changeHistoryList = (listName) =>{
    this.setState({
      record:this.state[listName]
    },()=>{
	  if (this.props.walletAddr != '') {
	  this.fetchDepositHistory(listName);
	  }
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
            <GemTable walletAddr={this.props.walletAddr} totalInvest={this.state.totalInvest} totalWithdraw={this.state.totalWithdraw} languageFile={this.props.languageFile} tabs={this.state.tabs} record={this.state[this.state.tabs+"Record"]}/>
            </div>
          </div>
		
        </div>

      )

  }

}

export default GemComp;