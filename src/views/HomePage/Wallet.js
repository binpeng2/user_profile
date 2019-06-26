import React, {Component} from 'react';
import {Row, Col,Input,Button,message} from'antd';
import axios from 'axios';

import './Wallet.css';

class Wallet extends Component{

    constructor(props){
        super(props);
        this.state={
            walletAddrInput:'',
            wiccBalance:0,
            wptBalance:0

        }
    }

    handleInput=(event)=>{
        this.setState({
            walletAddrInput: event.target.value
        })

    }

    handleSubmit= async () => {
        const data= this.state.walletAddrInput
        if(!data)message.warning("请输入正确钱包地址 \n Please input a valid wallet address!",3)

        let isValid = await this.accountValidate();
        console.log('valid',isValid)
        if(isValid){
            if(this.props.onSubmit){
                this.props.onSubmit({data})
            }
            this.fetchDepositBalance();
        }

        this.setState({
            walletAddrInput:'',
            wiccBalance:0,
            wptBalance:0
        });


    };

    // componentDidMount = () =>{
    //   this.fetchDepositHistory();
    //   }

    accountValidate =() => {
      return new Promise(resolve =>{
        let payload;
        if(this.state.walletAddrInput){
            payload = {
                "address": this.state.walletAddrInput
            }
            axios.post('https://baas.wiccdev.org/v2/api/account/validateaddr',payload)
            .then(res =>{
                if(!res.data.data.ret){
                    // this.setState({
                    //     validated:false
                    // })
                    resolve(false)
                    alert("钱包地址有误!请输入正确钱包地址 \n Wrong wallet address! Please input a valid wallet address!")
                }
                else{
                  resolve(true)
                }

            })
            .catch(err =>{
                console.log(err);
                resolve(false)
            })
        }
      })

    }

    fetchDepositBalance = () =>{
      let payload;
      if(this.state.walletAddrInput){
        payload = {
            "address": this.state.walletAddrInput
        }
        axios.post('https://baas.wiccdev.org/v2/api/account/getaccountinfo',payload)
        .then(res =>{
          let wicc = parseFloat(res.data.data.balance)/100000000
          this.setState({
            wiccBalance:wicc
          },()=>{
            console.log(this.state.wiccBalance)
          })

        })
        let payload2={
          "address": this.state.walletAddrInput,
          "contractregid":"3046693-1"
        }
        axios.post('https://baas.wiccdev.org/v2/api/contract/getcontractaccountinfo',payload2)
        .then(re =>{
          console.log('contract',re);
          let wpt = parseFloat(re.data.data.freevalues)/100000000
          this.setState({
            wptBalance:wpt
          })

        })


      }
    }

    // fetchDepositHistory = () =>{
    //   axios.get('https://backend.crazydogs.live:4001/api/towerdefense/myFullDepositHistory?addr=WjDxYcGuLWUm4tKZ8nz5NpUJJfMyNma9E1')
    //   .then(res =>{
    //     console.log(res.data.data)
    //   })
    //   .catch(err =>{
    //     console.log(err)
    //   })
    // }





  render(){
    return(
      <div className="walletfetch" >
      {/* <Row type="flex" justify="start">
        <Col span={3} > */}
      <img src={require('../../assets/images/user-white.png')} alt="user" width="8%" className="user-image" style={{float:"left",alignItems:'left'}}></img>
      {/* </Col>
      <Col span={15} > */}
      <div className = "wallet-input">
      <span className="address">{this.props.languageFile.wallet.walletAddress}:</span>
        <Input
        value={this.state.walletAddrInput}
        onChange={this.handleInput.bind(this)}
        style={{width:'10%', height:'12%', marginLeft:"3%",marginBottom:"0%"}} />

        <span className = "playButton" onClick={this.handleSubmit.bind(this)}>{this.props.languageFile.wallet.query}</span><br />
      </div><br />
      <div className = "balance">
      <span>{this.props.languageFile.wallet.walletBalance}： </span>
      <span className="wicc">{this.state.wiccBalance} WICC </span>
      <span className="wpt">{this.state.wptBalance} WPT</span></div>

        {/* </Col>
      </Row> */}
      {/* <Row type="flex" justify="start"> */}
        {/* <Col span={5} >
      </Col> */}
      {/* <Col span={8} offset={5} > */}

        {/* </Col>
      </Row> */}
      </div>
    )
  }
}

export default Wallet;
