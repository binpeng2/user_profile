import React, {Component} from 'react';
import './Roll.css';
import { Divider, Row, Col } from 'antd';
import { relative } from 'path';

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
	
    this.state={
      tabs:"GemRecord"
    }
  }
  
  

  render(){
    return(

        <div align="middle">


          <div>
            <div className="TabsDiv">
              <span className="Tabs">{this.props.languageFile.Roll.betRecord} {this.props.walletAddr}</span>
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
			<div>
            TABLE CONTENT
            </div>
          </div>
		
        </div>

      )

  }

}

export default RollComp;