import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {Select, Row, Col, Divider, message} from "antd";
import MediaQuery from 'react-responsive';
import SocialMedia from "./SocialMedia";
import "./Header.css";

const Option = Select.Option;
let languageFile = null;
class Header extends Component{
  constructor(props){
    super(props);
    this.state = {
      lang:sessionStorage.getItem('lang') || 'zh_CN'
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

  clickLogin = () =>{
    message.warning(languageFile.notification.waykiMaxRequired);
  }

  getPlayerAddr=(addr)=>{
    if(addr){
      return (addr).substring(0,4) +'...'+(addr).substring(30,34)
    }
    else{
      return ''
    }

  }

  render(){
    return(
          <Row type="flex" justify="space-between" align="middle" className="header">
            <Col span={5}>
              <div className="logoArea">
                <Link to="/">
                  <img src={require('../../assets/images/logo.png')} alt='ill1' width="200px"></img>
                </Link>
              </div>
            </Col>
            <Col span={4}>
              <a href={require('../../assets/whitepaper.pdf')} target="_blank" rel="noopener noreferrer">
                <h2>{languageFile.header.whitepaper}</h2>
              </a>

            </Col>
            <Col span={15} align="right">
              <MediaQuery query="(min-device-width: 801px)">

                <div style={{display:"inline-block", fontSize:"16px"}}>
                  <div style={{marginRight:"20px",display:"inline-block" , color:"white"}}>
                    <SocialMedia/>
                    <Divider type={"vertical"} style={{height:"30px", backgroundColor:"white", margin:"0 20px"}}/>

                    <img src={require('../../assets/images/user-white.png')} style={{marginRight:"10px"}} alt="user" width="25px"></img>
                    {this.props.account===null || !this.props.account.account ?
                      <span className="loginButton"
                        onClick={()=>{this.clickLogin()}}style={{marginRight:'10px'}}><b>{languageFile.header.loginButton}</b></span>
                      :
                      <span><b> {this.getPlayerAddr(this.props.account.account.address)} </b></span>
                    }
                  </div>
                  <div style={{display:"inline-block"}}>
                    <Select defaultValue={this.state.lang} defaultActiveFirstOption={false} onChange={(e) => {this.props.changeLang(e);}} dropdownClassName="languageSelector" style={{marginLeft:'10px'}}>
                        <Option value="en"><img src={require('../../assets/images/usa-flag.png')} alt="user" width="25px" ></img> <b style={{color:"white"}}>English</b></Option>
                        <Option value="zh_CN"><img src={require('../../assets/images/china.png')} alt="user" width="25px" ></img> <b style={{color:"white"}}>简体中文</b></Option>
                    </Select>
                  </div>
                </div>
              </MediaQuery>
              <MediaQuery query="(max-device-width: 800px)">
                <div style={{marginRight:"10px",display:"inline-block"}}>
                  <SocialMedia/>
                </div>
                <div align="right" style={{display:"inline-block",verticalAlign:"bottom",width:"45%", border:"1px solid white", borderRadius:"5px", padding:"5px"}}>
                  {
                    this.props.lang === "en" ?
                      <div onClick={() => {this.props.changeLang("zh_CN")}}>
                        <img src={require('../../assets/images/china.png')} alt="user" width="20px" ></img>
                        <span style={{color:"white", marginLeft:"5px"}}>简体中文</span>
                      </div>
                    :
                      <div onClick={() => {this.props.changeLang("en")}}>
                        <img src={require('../../assets/images/usa-flag.png')} alt="user" width="20px" ></img>
                        <span style={{color:"white", marginLeft:"5px"}}>English</span>
                      </div>
                  }

                    {/*<Dropdown overlay={menu} placement="bottomCenter" overlayStyle={{padding:"10px"}} trigger={['click']}>
                      <img src={require('../../assets/images/menu.png')} alt="menu" width="25px"></img>
                    </Dropdown>*/}
                </div>
              </MediaQuery>
            </Col>
            <Divider style={{backgroundColor:"#E5004F", boxShadow: "2px 2px 10px #E5004F", height:"2px", margin:"5px 0 20px 0"}} type="horizontal"/>
          </Row>
    )
  }
}

export default Header;
