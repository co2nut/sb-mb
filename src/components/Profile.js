import React, { Component } from 'react'
import { ImageBackground, ScrollView, View, Text, TouchableOpacity, Image, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import client from '../feathers'
import { AsyncStorage } from "react-native"
import * as t from "tcomb-form-native"
import AwesomeAlert from 'react-native-awesome-alerts'
import Loading from "./common/Loading"
import Logo from "./common/Logo"
import  STYLESHEET  from "./common/FormStyle"
// import { updateProfile } from '../actions'
import { bindActionCreators } from "redux"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { COLOR_ORANGE, COLOR_RED, COLOR_GREEN, COLOR_NOTIFICATION, COLOR_TEXT_GREY_LIGHT, COLOR_TEXT_GREY_LIGHTC, COLOR_TEXT, COLOR_BLUE, COLOR_TEXT_GREY, COLOR_RED_ERR } from './common/Color'
import { FAC_CARD, ACT_TITLE_1, ACT_VAL_1, TITLE_1, USERID, USERNAME, BTN_PRIMARY, BTN_TEXT } from './common/Styles'
import { Avatar, Divider } from 'react-native-elements';
import moment from 'moment';
// import axios from 'axios';
// import Carousel from 'react-native-snap-carousel';
var _ = require('lodash')

const window = Dimensions.get('window')

class Profile extends Component {
    static navigationOptions = ({navigation}) => {
      return {
        header: null,
      }
    };

    constructor (props) {
      super(props)

      this.state={
        value:{},
        showAlert:false,
        leaveScene:false,
        loginUser:null,
        submitting:false
      }
    }

    onFormChange(value){
      this.setState({value:value});
    }

    hideAlert(){
      this.setState({ leaveScene: true })
      // this.props.navigation.navigate('Complaints',{propertyUnit:this.state.propertyUnitId,property:this.state.propertyId})
    }

    render(){
      if(this.state.leaveScene === true || this.state.submitting === true){
        return (<Loading/>);
      }else{
        return (
          <KeyboardAwareScrollView
            scrollEnabled={false}
            keyboardShouldPersistTaps='always'
            contentContainerStyle={styles.container}
            >
              <ImageBackground source={require('../assets/badmintonbg.jpg')} style={{ width:'100%', height:'100%', opacity:0.8, backgroundColor:'#000', justifyContent:'space-around'}} >
                {/*User info*/}
                <View style={{padding:10, flex:1, flexDirection:'row', justifyContent:'space-around'}}>
                  <Avatar
                    size="large"
                    rounded
                    title={this.props.profile.userInfo.username.substring(0,1).toUpperCase()}
                    titleStyle={{color:COLOR_ORANGE, fontWeight:'400', fontSize:45}}
                    containerStyle={{borderWidth: 3, borderColor: COLOR_ORANGE, borderStyle:'solid', alignSelf:'flex-end'}}
                    overlayContainerStyle={{backgroundColor: '#000'}}
                  />
                  <View style={{flex:1, flexDirection:'column', marginLeft:20, justifyContent:'flex-end'}}>
                    <Text style={USERNAME}>{this.props.profile.userInfo.username.toUpperCase()}</Text>
                    {/*}<Text style={USERID}>Member ID : {this.props.profile.userInfo.id.substring(0,8).toUpperCase()}</Text>*/}
                  </View>
                </View>
                <Divider style={{ backgroundColor: COLOR_TEXT_GREY_LIGHT, marginVertical:10 }} />
                {/*User info*/}

                <View style={{flex:0.1, flexDirection:'row'}}>
                    <Text style={{color:'#fff'}}>Email : </Text>
                    <Text style={{color:'#fff'}}>{this.props.profile.userInfo.email}</Text>
                </View>
                <Divider style={{ backgroundColor: COLOR_TEXT_GREY_LIGHT, marginVertical:10 }} />
                <View style={{flex:1, flexDirection:'row'}}>
                    <Text style={{color:'#fff'}}>Join at : </Text>
                    <Text style={{color:'#fff'}}>{moment(this.props.profile.userInfo.phone).format('DD/MM/YYYY HH:mm')}</Text>
                </View>

                <View style={{flex:12}, justifyContent='flex-end'}>
                  <TouchableOpacity style={BTN_PRIMARY} onPress={()=>{
                      client.logout()
                      this.props.navigation.navigate('Login')
                    }}>
                    <Text style={BTN_TEXT}>LOG OUT</Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </KeyboardAwareScrollView>
        )
      }
    }
}

const styles = {
  carousel:{
    alignItems: 'center',
  },
  slide:{
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation:1
  },
  container: {
    flexDirection: 'row',
    // justifyContent:'space-around',
    flex:1,
    paddingTop: 20,
    paddingHorizontal:20,
    backgroundColor: '#000',
  },
  logo:{
    width:120,
    height:130
  },
  buttonText: {
    fontSize: 15,
    color: 'white',
    alignSelf: 'center'
  },
  err:{
    borderColor:COLOR_RED_ERR,
    color:COLOR_RED_ERR
  },
  label:{
    fontWeight:'600',
    fontSize:15,
    marginBottom:10,
    color:COLOR_BLUE
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
    // app: state.app
  }
}

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({
//     updateProfile: updateProfile,
//     }, dispatch);
// }


export default connect(mapStateToProps)(Profile);
