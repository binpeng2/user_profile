import React, {Component} from 'react';
import {Row, Col,Input,Button} from'antd';
import axios from 'axios';
class Wallet extends Component{

    constructor(props){
            super(props);
            this.state={
                input:null,
              }

    }


    handleClick(){
        let inpText = this.refs.inp.value;
        if(this.props.onSubmit){
            
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
      <div className="walletfetch" >
      <Row type="flex" justify="start">
        <Col span={5} >
      <img src={require('../../assets/images/user-white.png')} alt="user" width="20%"></img>
      </Col>
      <Col span={8} >
      <div className = "input">
      {this.props.languageFile.wallet.walletAddress}:
        <Input ref="inp" style={{width:'40%', height:'12%', marginLeft:"5%",marginBottom:"5%"}} /> 
        <Button style={{width:'15%', height:'30%'}} onClick={this.handleClick.bind(this)}>{this.props.languageFile.wallet.query}</Button>
      </div><br />
      
        </Col>
      </Row>
      <Row type="flex" justify="start">
        <Col span={0} >
      </Col>
      <Col span={8} >
      <div className = "balance">{this.props.languageFile.wallet.walletBalance}： </div>
      
        </Col>
      </Row>
      </div>
    )
  }
}

export default Wallet;