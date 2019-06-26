import React, {Component} from 'react';
import '../GemTable/Gem.css';
import { Divider, Row, Col, List } from 'antd';
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
class RollComp extends Component {
  constructor(props){
	super(props);

	this.state = {
		BetRecord: null,
	  }
  }

  componentDidMount = () =>{
    this.fetchDepositHistory();
  }

  fetchDepositHistory = () =>{
	axios.get('https://backend.crazydogs.live:4001/api/luckynumber/myBetsHistory?addr='+this.props.walletAddr)
    .then(res =>{
		// console.log(res);
		this.setState({BetRecord:res.data.data});
		// console.log(this.state.BetRecord);
    })
    .catch(err =>{
      console.log(err)
	})
  }

  render(){
	let table = null;
	let date = null;
	var x = window.matchMedia("(max-width: 800px)")

	if (this.state.BetRecord && this.props.walletAddr) {
		table = <List
			size="small"
			pagination={this.state.BetRecord.length > 10 ? {
				pageSize: 10,
			} : null}
     	    dataSource={this.state.BetRecord}
    	    renderItem={(item) =>{
      	    return (
           	 <div>
              <Row style={{marginBottom:'0',textAlign:'center'}}>
                <Col xs={5} >
				  {
					x.matches ?                   <p className="general-content"> {item.timestamp.slice(5,7)+item.timestamp.slice(8,10)+" "+item.timestamp.slice(11,16)}</p>
					:
                             <p className="general-content"> {item.timestamp.slice(5,7)+item.timestamp.slice(8,10)+" "+item.timestamp.slice(11,16)}</p>

				  }
				</Col>
                <Col xs={5} >
                  <p className="general-content"> {item.isUnder}</p>
                </Col>
				<Col xs={4} >
                  <p className="general-content"> {item.luckyNumber}</p>
                </Col>
				<Col xs={5} >
                  <p className="general-content"> {item.betValue}</p>
                </Col>
				<Col xs={5} >
                  <p className="general-content"> {item.payout}</p>
                </Col>
              </Row>
            </div>
         	)
    		  } }
  			  />
	} else {
		table = <div></div>
	}
    return(
        <div align="middle">
			{this.fetchDepositHistory()}

          <div>
            <div className="TabsDiv">
            <span className="Tabs">{this.props.languageFile.Roll.betRecord} </span>
			  <span className="Note">{this.props.languageFile.Roll.roll}</span>

			</div>
			<div style={{position: relative, top:0, marginTop:0}}>
			<ColoredLine color="white" />
			</div>
			<Row style={{marginBottom:'0',textAlign:'center'}}>
                <Col xs={5} >
                  <p className="title-text">{this.props.languageFile.Roll.betTime}</p>
                </Col>
                <Col xs={5} >
                  <p className="title-text">{this.props.languageFile.Roll.myPredict}</p>
                </Col>
                <Col xs={4} >
                  <p className="title-text">{this.props.languageFile.Roll.luckyNum}</p>
                </Col>
				<Col xs={5} >
                  <p className="title-text">{this.props.languageFile.Roll.betAmount}</p>
                </Col>
				<Col xs={5} >
                  <p className="title-text">{this.props.languageFile.Roll.rewardAmount}</p>
                </Col>
            </Row>
			<div className ="betTableContect">
		    {table}
            </div>
          </div>

        </div>

      )

  }

}

export default RollComp;
