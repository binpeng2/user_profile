import React, { Component } from 'react';
import Header from "./component/Header/Header.js";
import Footer from "./component/Footer/Footer.js";
import Routes from "./routes";
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lang:"zh_CN",
			account: null,
			wiccBalance:0
		}
	}

		//change language selection and set it to sessionStorage
	changeLang = (value) => {
		this.setState({
			lang: value
		}, ()=>{
			sessionStorage.lang = this.state.lang
		})
	}

	//read language selection from sessionStorage
	getInitialState(){
		var currentLang = sessionStorage.getItem('lang') || 'zh_CN';
		sessionStorage.lang = currentLang;
		// console.log("called getInitailState");
		this.setState({lang: currentLang});
	}


	async componentDidMount() {

		this.getInitialState();
		this.readWiccInstance();
	}

	readWiccInstance = () => {
		if(window.waykiBridge){
			setTimeout(()=>{
				window.waykiBridge.walletPlugin(
					 "getAddressInfo",
					 {},
					 (res) => {
						 this.setState({
			 					account:res.result
			 			 })
					 },
					 (err) => {
						 console.log(err);
						 	setTimeout(()=>{
								this.readWiccInstance();
							}, 100)
					 }
			 	)
			},100)
			// window.WiccWallet.getDefaultAccount().then((account) => {
			// 	this.setState({
			// 		account:account
			// 	})
			// }, (error) => {
			//   // console.log(error);
			// 	setTimeout(()=>{
			// 		this.readWiccInstance();
			// 	}, 100)
			// })
		}
		else{
			setTimeout(()=>{
				this.readWiccInstance();
			}, 100)
		}
	}



  render() {
    return (
      <div className="App">
        <Header changeLang={this.changeLang} lang={this.state.lang} account={this.state.account}/>
        <Routes lang={this.state.lang} account={this.state.account}/>
        <Footer lang={this.state.lang}/>
      </div>
    );
  }
}

export default App;
