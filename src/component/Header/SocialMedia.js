import React, {Component} from 'react';
import {Tooltip} from 'antd';

class SocialMedia extends Component{

  render(){

    return(
      <div style={{display:"inline-block"}} className="socialMedia">
        <a href="https://t.me/" target="_blank" rel="noopener noreferrer"><img src={require('../../assets/images/telegram-white.png')} alt='telegram' width="25px"></img></a>
        {/*<a href="https://discordapp.com/invite/" target="_blank" rel="noopener noreferrer"><img src={require('../../assets/images/discord-white.png')} alt='twitter' width="25px" style={{marginLeft:"40px"}}></img></a>*/}
        <Tooltip placement="topLeft" title={<img src={require('../../assets/images/wechat-white.png')} alt="user" width="100px"></img>} arrowPointAtCenter>
          <img src={require('../../assets/images/wechat-white.png')} alt='wechat' width="25px" style={{marginLeft:"40px"}}></img>
        </Tooltip>
      </div>
    )
  }
}

export default SocialMedia;
