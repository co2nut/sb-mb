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
import { BTN_PRIMARY_FLAT, FAC_TITLE, FAC_DESC, ACT_TITLE_2, ACT_VAL_2, BTN_TEXT } from './common/Styles'
import { Divider } from 'react-native-elements';
import moment from 'moment';
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

class FacilityConfirm extends Component {
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

        fromTime:'00:00',
        toTime:'00:00'
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
      let confirmBooking = this.props.facility.facilityConfirm
      console.log({confirmBooking});
      this.setState({
        fromTime:confirmBooking.dateitem.format('HH:mm'),
        toTime:confirmBooking.dateitem2.add(confirmBooking.hours, 'hours').format('HH:mm'),
      },
    ()=>{
      console.log(this.state);
    })
    }

    onSubmit() {
      // perform reservation
      let confirmInfo = this.props.facility.facilityConfirm
      this.setState({submitting:true})
      client.service('bookings').create({
        fullname:confirmInfo.fullname,
        btn:confirmInfo.btn,
        dateitem:confirmInfo.dateitem,
        dateitem2:confirmInfo.dateitem.add(confirmInfo.hours, 'hours'),
        bookingdate:confirmInfo.bookingdate,
        bookingtime:confirmInfo.bookingtime,
        hours:confirmInfo.hours,
        user:confirmInfo.user,
        contact:confirmInfo.contact,
      })
      .then((res)=>{
         console.log('success', {res});
         return this.props.navigation.navigate('Home')
      })
      .catch((err)=>{
        console.log({err});
        this.setState({submitting:false})
        alert(err);
      })
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
                <View style={{padding:10, flex:1, flexDirection:'row', justifyContent:'space-around'}}>
                  <View style={{flex:1, flexDirection:'column', justifyContent:'space-around'}}>
                    <Text style={[FAC_TITLE, {alignSelf:'center'}]}>{this.props.facility.facilitySelect.name}</Text>
                    <Text style={[FAC_DESC, {alignSelf:'center'}]}>Sixbase Sports Arena</Text>
                  </View>
                </View>

                <View style={{padding:3, flex:2, flexDirection:'column'}}>
                  <Divider style={{ backgroundColor: COLOR_TEXT_GREY_LIGHT, margin:10  }} />
                  <View style={{flexDirection:'row',justifyContent:'space-around' }}>
                    <Text style={ACT_TITLE_2}>Date</Text>
                    <Text style={ACT_VAL_2}>{this.props.facility.facilityConfirm.bookingdate}</Text>
                  </View>
                  <Divider style={{ backgroundColor: COLOR_TEXT_GREY_LIGHT, margin:10  }} />
                  <View style={{flexDirection:'row',justifyContent:'space-around' }}>
                    <Text style={ACT_TITLE_2}>Time</Text>
                    <Text style={ACT_VAL_2}>{this.state.fromTime} to {this.state.toTime}</Text>
                  </View>
                  <Divider style={{ backgroundColor: COLOR_TEXT_GREY_LIGHT, margin:10  }} />
                  <View style={{flexDirection:'row',justifyContent:'space-around' }}>
                    <Text style={ACT_TITLE_2}>Court</Text>
                    <Text style={ACT_VAL_2}>{this.props.facility.facilityConfirm.btn}</Text>
                  </View>
                  <Divider style={{ backgroundColor: COLOR_TEXT_GREY_LIGHT, margin:10  }} />
                  <View style={{flexDirection:'row',justifyContent:'space-around' }}>
                    <Text style={ACT_TITLE_2}>Contact</Text>
                    <Text style={ACT_VAL_2}>{this.props.facility.facilityConfirm.contact}</Text>
                  </View>
                  <Divider style={{ backgroundColor: COLOR_TEXT_GREY_LIGHT, margin:10  }} />
                </View>

                <View>
                  <TouchableOpacity style={BTN_PRIMARY_FLAT} onPress={this.onSubmit}>
                    <Text style={BTN_TEXT}>CONFIRM RESERVATION</Text>
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
    facility: state.facility,
    // app: state.app
  }
}

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({
//     updateProfile: updateProfile,
//     }, dispatch);
// }


export default connect(mapStateToProps)(FacilityConfirm);
