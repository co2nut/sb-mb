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
import { updateProfile } from '../actions'
import { bindActionCreators } from "redux"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { COLOR_NOTIFICATION, COLOR_TEXT_GREY_LIGHT, COLOR_TEXT_GREY_LIGHTC, COLOR_TEXT, COLOR_BLUE, COLOR_TEXT_GREY, COLOR_RED_ERR } from './common/Color'
import { BTN_PRIMARY, BTN_TEXT } from './common/Styles'
import { Divider } from 'react-native-elements';
import publicIP from 'react-native-public-ip';
// import axios from 'axios';
// import Carousel from 'react-native-snap-carousel';
var FormData = require('form-data');
var _ = require('lodash')

let Form = t.form.Form;

const window = Dimensions.get('window')

var InputForm = t.struct({
  // types: Types,
  username: t.String,
  password: t.String,

});

class Login extends Component {
    static navigationOptions = ({navigation}) => {
      return {
        header: null,
      }
    };

    constructor (props) {
      super(props)

      this.state={
        options: this.getFormOptions(),
        InputForm: InputForm,
        value:{},
        showAlert:false,
        leaveScene:false,
        loginUser:null,
        submitting:false,
        publicIp:''
      }

      this.onSubmit = this.onSubmit.bind(this)
      this.onFormChange = this.onFormChange.bind(this)
      this.getFormOptions = this.getFormOptions.bind(this);
    }

    getFormOptions(){
      function template(locals){
        return (
          <View style={{width:'100%', flexDirection:'column'}}>
          <Divider style={{ backgroundColor: COLOR_TEXT_GREY_LIGHT }} />
          {locals.inputs.username}
          <Divider style={{ backgroundColor: COLOR_TEXT_GREY_LIGHT }} />
          {locals.inputs.password}
          <Divider style={{ backgroundColor: COLOR_TEXT_GREY_LIGHT }} />
          </View>
        );
      }

      return ({
        template: template,
        stylesheet: STYLESHEET,
        auto:'placeholders',
        fields: {
          username: {
            placeholderTextColor:COLOR_TEXT_GREY_LIGHT,
            error: 'Invalid Username',
            autoCorrect: false,
          },
          password: {
            placeholderTextColor:COLOR_TEXT_GREY_LIGHT,
            error: 'Invalid Password',
            autoCorrect: false,
            secureTextEntry:true
          },
        }
      })
    }

    componentWillMount(){
      publicIP()
      .then(ip => {
        console.log({ip});
        this.setState({publicIp:ip})
        // '47.122.71.234'
      })
      .catch(error => {
        console.log({error});
        // 'Unable to get IP address.'
      });

      // AsyncStorage.getItem('@authinfo')
      // .then( (res)=>{
      //   if(!res){
      //     this.setState({loading:false})
      //     return Promise.reject();
      //   }else{
      //     console.log(JSON.parse(res));
      //     this.props.updateProfile(JSON.parse(res));
      //     return this.props.navigation.navigate('Home')
      //   }
      // })
      // .catch((err)=>{
      //   console.log(err);
      // })
    }

    onSubmit() {
      // perform login
      this.setState({submitting:true})
      var value = this.refs.form.getValue();
      if (value) {
        client.authenticate({
          strategy:'local',
          username:value.username,
          password:value.password,
        })
        .then((res)=>{
           console.log('success', {res});
           this.props.updateProfile(res);
           let authInfoObj = {
             'id':res.id,
             'username':res.username,
             'phone':res.phone,
             'email':res.email,
             'accessToken':res.accessToken,
           }

           AsyncStorage.setItem('@authinfo',JSON.stringify(authInfoObj));
           this.setState({
             submitting:false,
             value:{}
           })
           return this.props.navigation.navigate('Home')
        })
        .catch((err)=>{
          this.setState({submitting:false})
          alert('Invalid USER or PASSWORD');
        })

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
                {/* Alert */}
                <AwesomeAlert
                  show={this.state.showAlert}
                  showProgress={false}
                  title="Complaint Successfuly Submitted!"
                  message="Management will follow up"
                  closeOnTouchOutside={true}
                  closeOnHardwareBackPress={false}
                  showConfirmButton={true}
                  confirmText="Continue"
                  confirmButtonColor="#41b9e4"
                  onConfirmPressed={() => {this.hideAlert()}}
                  alertContainerStyle={{zIndex:9,marginLeft:20}}
                  titleStyle={{fontWeight:'bold', textAlign:'center'}}
                  messageStyle={{textAlign:'center'}}
                />
                {/* Alert */}

                <Logo />
                <Form
                  ref="form"
                  type={this.state.InputForm}
                  options={this.state.options}
                  value={this.state.value}
                  onChange={this.onFormChange}
                />

                <View>
                  <TouchableOpacity style={BTN_PRIMARY} onPress={this.onSubmit}>
                    <Text style={BTN_TEXT}>LOGIN</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={BTN_PRIMARY} onPress={()=>{this.props.navigation.navigate('SignUp')}}>
                    <Text style={BTN_TEXT}>SIGN UP</Text>
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
    justifyContent:'space-around',
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
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateProfile: updateProfile,
    }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Login);
