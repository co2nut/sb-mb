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
import { COLOR_NOTIFICATION, COLOR_TEXT_GREY_LIGHT, COLOR_TEXT_GREY_LIGHTC, COLOR_TEXT, COLOR_BLUE, COLOR_TEXT_GREY, COLOR_RED_ERR } from './common/Color'
import { BTN_PRIMARY, BTN_TEXT } from './common/Styles'
import { Divider } from 'react-native-elements';
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
  phone: t.String,

});

class Match extends Component {
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
        submitting:false
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
          {locals.inputs.phone}
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
          phone: {
            placeholderTextColor:COLOR_TEXT_GREY_LIGHT,
            error: 'Invalid Phone',
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
    }

    onSubmit() {
      // perform login
      var value = this.refs.form.getValue();
      if (value) {
        client.service('users').create({
          username:value.username,
          password:value.password,
          phone:value.phone
        })
        .then((res)=>{
           console.log('success', {res});
           // this.props.loginSuccessful(res);
           // this.props.history.push('/dashboard');
           return this.props.navigation.navigate('Login')
        })
        .catch((err)=>{
          console.log({err});
          // alert('Invalid USER or PASSWORD');
        })

        // let formData = new FormData();
        // formData.append('username',value.username)
        // formData.append('password',value.Password)

        this.setState({submitting:true})
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
                <View><Text>Match</Text></View>
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
    // profile: state.profile,
    // app: state.app
  }
}

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({
//     updateProfile: updateProfile,
//     }, dispatch);
// }


export default connect(mapStateToProps)(Match);
