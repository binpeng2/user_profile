import React, {Component} from 'react';
import './Gem.css';
import GemTable from './GemTable.js';
import { Divider } from 'antd';
import { relative } from 'path';
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
      tabs:"GemRecord"
    }
  }

  componentDidMount = () =>{
    this.fetchDepositHistory();
  }

  fetchDepositHistory = () =>{
    axios.get('https://backend.crazydogs.live:4001/api/luckynumber/globalBetsHistory')
    .then(res =>{
      console.log(res.data.data)
    })
    .catch(err =>{
      console.log(err)
    })
  }
  

  render(){
    return(

        <div align="middle">
          <div>
            <div className="TabsDiv">
              <span className={this.state.tabs === "GemRecord" ? "TabsHighlighted" : "Tabs"} onClick={()=>{this.setState({tabs:"GemRecord"})}}>{this.props.languageFile.GemRush.gemFlow}</span>
			  &nbsp;
              <span className={this.state.tabs === "InvestRecord" ? "TabsHighlighted" : "Tabs"} onClick={()=>{this.setState({tabs:"InvestRecord"})}}>{this.props.languageFile.GemRush.investmentRecord}</span>
			  <span className="Note">{this.props.languageFile.GemRush.gemRush}</span>
			</div>
			<div style={{position: relative, top:0, marginTop:0}}>
			<ColoredLine color="white" />     
			</div>
			<div>
            <GemTable tabs={this.state.tabs}/>
            </div>
          </div>
		
        </div>

      )

  }

}

export default GemComp;