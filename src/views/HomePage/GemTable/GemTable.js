import React, {Component} from 'react';
import {List, Row, Col} from 'antd';
// import MediaQuery from 'react-responsive';

class GemTable extends Component {
  constructor(props){
	super(props);
	this.state = {
		
	}
  }


  render(){
	let table = null;
	let title = null;
    if(this.props.record){
	  title = <p style={{color:"white"}}>{this.props.languageFile.GemRush.gemRushRecord}</p>
      table = (<List
      size="small"
      dataSource={this.props.record}
      renderItem={(item,index) =>{
          return (
            <div>
              <Row style={{marginBottom:'0',textAlign:'center'}}>
                <Col xs={8} >
                  <p style={{color: "white"}}> {item.playerAddress}</p>
                </Col>
                <Col xs={8} >
                  <p style={{color: "white"}}>{item.isUnder}</p>
                </Col>
                <Col xs={8} >
                  <p style={{color: "white"}}>{item.luckyNumber}</p>
                </Col>
              </Row>
            </div>
          )
      } }
    />)
  }
  else{
	title = <p></p>;
    table = (<div></div>);
  }

    return(
      <div>
        <div> 
		{title}
        {table}
        </div>
      </div>
    )
  }
}

export default GemTable  ;