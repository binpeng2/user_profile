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
    if(this.props.record){
	  if (this.props.tabs==="Gem") {
		title = <p className="title-text">{this.props.languageFile.GemRush.gemRushRecord}</p>
		table = (<List
			  size="small"
			  pagination={{
				simple: 1,
				onChange: page => {
					console.log(page);
				},
				pageSize: 10,
			}}
     		 dataSource={this.props.record}
    		  renderItem={(item,index) =>{
      	    return (
           	 <div>
              <Row style={{marginBottom:'0',textAlign:'center'}}>
                <Col xs={8} >
                  <p style={{color: "white"}}> {this.timeConverter(item.timestamp)}</p>
                </Col>
                <Col xs={8} >
                  <p style={{color: "white"}}>{item.depositAmount>=10000 ? item.depositAmount*1.05:item.depositAmount}</p>
                </Col>
                <Col xs={8} >
                  <p style={{color: "white"}}>{item.depositAmount}</p>
                </Col>
              </Row>
            </div>
          )
    		  } }
  		  />)
	  } else {
		title = <div><p style={{color:"white"}}>{this.props.languageFile.GemRush.totalInvest}:&nbsp;{this.props.totalInvest} &nbsp; WICC {this.props.languageFile.GemRush.totalWithdraw}:&nbsp;{this.props.totalWithdraw}&nbsp;WPT</p>
				</div>
		table = (<List
			size="small"
		
			pagination={{
				simple: 1,
				onChange: page => {
					console.log(page);
				},
				pageSize: 10,
			}}
     	    dataSource={this.props.record}
    	    renderItem={(item,index) =>{
      	    return (
           	 <div>
              <Row style={{marginBottom:'0',textAlign:'center'}}>
                <Col xs={12} >
                  <p style={{color: "white"}}> {this.timeConverter(item.timestamp)}</p>
                </Col>
                <Col xs={12} >
                  <p style={{color: "white"}}> {this.props.languageFile.GemRush.withdraw}&nbsp;{item.amount}&nbsp;WPT</p>
                </Col>
              </Row>
            </div>
          )
    		  } }
  		  />)
	  }
  }
  else{
	title = <p></p>;
    table = (<div></div>);
  }

    return(
      <div>
        <div className="title"> 
		{title}
		</div>
        {table}
      </div>
    )
  }
}

export default GemTable  ;