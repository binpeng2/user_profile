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
    if(this.props.tabs === "GemRecord"){
      table = (<div>this.state.tabs</div>);
  }
  else{
	console.log(this.state.tabs);
    table = (<div>a</div>);
  }

    return(
      <div>
        <div>
        {table}
        </div>
      </div>
    )
  }
}

export default GemTable  ;