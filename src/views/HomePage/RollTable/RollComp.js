import React, {Component} from 'react';
import './Roll.css';
import { Divider } from 'antd';
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
              <span className="Tabs">{this.props.languageFile.Roll.betRecord}</span>
			  <span className="Note">{this.props.languageFile.Roll.roll}</span>
			</div>
			<div style={{position: relative, top:0, marginTop:0}}>
			<ColoredLine color="white" />     
			</div>
			<div>
            TABLE CONTENT
            </div>
          </div>
		
        </div>

      )

  }

}

export default RollComp;