import React, {Component} from 'react';
import {List, Row, Col} from 'antd';
import './Gem.css';
// import MediaQuery from 'react-responsive';

class GemTable extends Component {
  constructor(props){
    super(props);
    this.state = {
      
    }
  }

  timeConverter = (unix_timestamp)=>{
	// Create a new JavaScript Date object based on the timestamp
	// multiplied by 1000 so that the argument is in milliseconds, not seconds.
	var date = new Date(unix_timestamp*1000);
	var year = date.getFullYear();
  	var month = date.getMonth();
 	var day = date.getDate();
	// Hours part from the timestamp
	var hours = date.getHours();
	// Minutes part from the timestamp
	var minutes = "0" + date.getMinutes();

	if (month>10){
	var formattedTime = year+' '+ month +day+' '+hours + ':' + minutes.substr(-2);
	} 
	else{
	var formattedTime = year+' '+ ' 0'+month +day+' '+hours + ':' + minutes.substr(-2);
	}
	return formattedTime;
  }



  render(){
	let table = null;
	let title = null;
    if(this.props.record && this.props.walletAddr != ''){
	  if (this.props.tabs==="Gem") {
		title = <p className="title-text">{this.props.languageFile.GemRush.gemRushRecord}</p>
		table = (<List
			  size="small"
			  pagination={this.props.record.length > 10 ? {
				simple: 1,
				onChange: page => {
					console.log(page);
				},
				pageSize: 10,
			} : null}
     		 dataSource={this.props.record}
    		  renderItem={(item,index) =>{
      	    return (
           	 <div>
              <Row style={{marginBottom:'0',textAlign:'center'}}>
                <Col xs={8} >
                  <p className="general-content"> {this.timeConverter(item.timestamp)}</p>
                </Col>
                <Col xs={8} >
                  <p className="general-content">{this.props.languageFile.GemRush.buy}&nbsp;{item.depositAmount>=10000 ? item.depositAmount*1.05:item.depositAmount}&nbsp;{this.props.languageFile.GemRush.gem}</p>
                </Col>
                <Col xs={8} >
                  <p className="general-content">{this.props.languageFile.GemRush.pay}&nbsp;{item.depositAmount}&nbsp;WICC</p>
                </Col>
              </Row>
            </div>
          )
    		  } }
  		  />)
	  } else {
		title = <div><p className="title-text" style={{color:"white", float: "left"}}>{this.props.languageFile.GemRush.totalInvest}:&nbsp;{this.props.totalInvest} &nbsp; WICC</p>
					 <p className="title-text" style={{color:"white", float: "right"}}>{this.props.languageFile.GemRush.totalWithdraw}:&nbsp;{this.props.totalWithdraw}&nbsp;WPT</p>
				</div>
		table = (
		<div>
			<div className="b">
		
		</div>
		<List
			size="small"
		
			pagination={this.props.record.length > 10 ? {
				simple: 1,
				onChange: page => {
					console.log(page);
				},
				pageSize: 10,
			} : null}
     	    dataSource={this.props.record}
    	    renderItem={(item) =>{
      	    return (
           	 <div>
			  <a href={"https://www.waykiscan.com/#/txhash/"+ item.transferHash } target="_blank">
              <Row style={{marginBottom:'0',textAlign:'center'}}>
                <Col xs={5} >
                  <p className="gem-content"> {this.timeConverter(item.timestamp)}</p>
                </Col>
                <Col xs={6} >
                  <p className="gem-content"> {this.props.languageFile.GemRush.withdraw}&nbsp;{item.amount}&nbsp;WPT</p>
                </Col>
				<Col xs={13} >
                  <p className="gem-content"> {item.transferHash} </p>
                </Col>
              </Row>
			  </a>
            </div>
          )
    		  } }
  		  />
		</div>)
	  }
  }
  else{
	  if (this.props.tabs==="Gem") {
		title = <p className="title-text">{this.props.languageFile.GemRush.gemRushRecord}</p>;
	  }
    table = (<div></div>);
  }

    return(
      <div>
        <div className="title"> 
		{title}
		</div>
		<div className="b">
		
		</div>
		<div>
		{table}
		</div>
      </div>
    )
  }
}

export default GemTable  ;