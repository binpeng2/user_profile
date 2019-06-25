import React, {Component} from 'react';
import './HomePage.css';
import WalletCheck from './WalletCheck'
import GemComp from "./GemTable/GemComp";

import Wallet from './Wallet.js';

import RollComp from "./RollTable/RollComp";

// import RollComp from "./RollTable/RollComp";

let languageFile = null;
class HomePage extends Component{
  constructor(props){
    super(props);
    this.state={
      lang:null,
      walletAddr:''
    }
    var currentLang = sessionStorage.getItem('lang') || 'zh_CN';
    languageFile=require('../../assets/languages/'+currentLang+'.json');
  }
  handleInputValue(input){

    this.setState({
        walletAddr : input.data
    }, ()=>{
      console.log('homepage', this.state.walletAddr);
    })
    
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.lang !== prevProps.lang) {
      languageFile=require('../../assets/languages/' + this.props.lang + '.json');
      this.setState({
        lang:this.props.lang,
      });
    }
  }
  render(){
    return(
        <div className="homePage" >
            <div className="BackgroundSlogen">
            <Wallet languageFile={languageFile} onSubmit= {this.handleInputValue.bind(this)} />
            </div>

		<WalletCheck languageFile={languageFile} walletAddr = {this.state.walletAddr}/>
		<RollComp languageFile={languageFile} />
        </div>

    )
  }
}

export default HomePage;
