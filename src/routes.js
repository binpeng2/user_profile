import React, {Component} from 'react';
import {Switch, Route} from "react-router-dom";
import HomePage from "./views/HomePage/HomePage";
import {GetRequest, PostRequest} from './component/APIRequest/APIRequest';

class Routes extends Component {
  constructor(props){
    super(props);
    this.state={
      checking: true
    }
  }
  componentDidUpdate=()=>{
    if(this.props.account &&
        this.props.account.account &&
        (this.props.account.account.address !== this.state.walletAddress)){
      this.checkCurrentPlayer()
      this.setState({
        walletAddress:this.props.account.account.address
      })
    }
  }

  checkCurrentPlayer = () =>{
    let self = this;
    GetRequest('player?walletAddress='+(this.props.account.account.address))
    .then((res)=>{
      if(res.data.code === "UnresgisterdUser"){
        this.createPlayer();
      }
      else{
        // console.log("Current Player: ", res.data[0] );
        self.setState({
          currentPlayer:res.data[0]
        })
      }
    })
    .catch((err)=>{
      console.log(err);
    });
  }


  createPlayer = () =>{
    let payload={
      "walletAddress": this.props.account.address,
      "referredFrom": window.location.search.length>0 ? parseInt(window.location.search.substring(5,window.location.search.length), 10) : null
    }
    PostRequest('createPlayer', payload)
  .then((res)=>{
    // console.log(res);
    if(res.data.code === "NewPlayerCreated"){
      console.log("NewPlayerCreated");
    }
  })
  .catch((err)=>{
    console.log(err);
  });
}

  render(){

    return(
      <Switch>
        <Route exact path="/" render={()=>(<HomePage lang={this.props.lang}/>)}/>
        <Route render={()=>(<HomePage lang={this.props.lang}/>)}/>
      </Switch>
    )
  }
}

export default Routes;
