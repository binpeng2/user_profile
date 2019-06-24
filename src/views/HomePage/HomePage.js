import React, {Component} from 'react';
import './HomePage.css';
import WalletCheck from './WalletCheck'
import GemComp from "./GemTable/GemComp";
import RollComp from "./RollTable/RollComp";
// import RollComp from "./RollTable/RollComp";

let languageFile = null;
class HomePage extends Component{
  constructor(props){
    super(props);
    this.state={
      lang:null
    }
    var currentLang = sessionStorage.getItem('lang') || 'zh_CN';
    languageFile=require('../../assets/languages/'+currentLang+'.json');
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
              {/*<h1>{languageFile.homePage.waykiParadise}</h1>
              <h1>{languageFile.notification.comingSoon}</h1>*/}
            </div>
		<WalletCheck languageFile={languageFile}/>
		<RollComp languageFile={languageFile}/>
        </div>


    )
  }
}

export default HomePage;
