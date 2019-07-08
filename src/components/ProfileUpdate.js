import React, { Component } from 'react';
import { View, Text, TouchableHighlight, Image } from 'react-native';
import { connect } from 'react-redux';
import { Avatar } from 'react-native-elements';
import client from '../feathers'
import { AsyncStorage } from "react-native"
import Icon from 'react-native-vector-icons/EvilIcons';
import * as t from "tcomb-form-native";
import AwesomeAlert from 'react-native-awesome-alerts';
var _ = require('lodash');
import Loading from "./common/Loading"
import MaskedInputTemplate from "./inputTemplate/MaskedInputTemplate"
import { updateProfile } from '../actions';
import { bindActionCreators } from "redux"

let Form = t.form.Form;

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);
stylesheet.textbox.normal.width = 280;
stylesheet.textbox.error.width = 280;

var EmailValidate = t.refinement(t.String, email => {
  const reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/; //or any other regexp
  return reg.test(email);
});

var ProfileUpdateForm = t.struct({
  firstName: t.String,
  lastName: t.String,
  phoneNo: t.String
});

var options = {
  stylesheet: stylesheet,
  fields: {
    firstName: {
      error: 'Invalid First Name',
      autoCorrect: false,
      autoCapitalize:'none'
    },
    lastName: {
      error: 'Invalid Last Name',
      autoCorrect: false,
      autoCapitalize:'none'
    },
    phoneNo: {
      keyboardType:'numeric',
      error: 'Please, provide correct phone number',
      placeholder: 'Phone No (60) 12-222-2222',
      template: MaskedInputTemplate
    },
  },
  auto: 'placeholders'
}

class ProfileUpdate extends Component {
    constructor (props) {
      super(props)

      this.onUpdate = this.onUpdate.bind(this)
      this.onFormChange = this.onFormChange.bind(this)

      this.state={
        options: options,
        ProfileUpdateForm: ProfileUpdateForm,
        value:{},
        showAlert:false,
        leaveScene:false,
        loginUser:{}
      }

    }//end of constructor

    componentWillMount(){
      AsyncStorage.getItem('@authinfo')
      .then( (res)=>{
        this.setState({
          loginUser:JSON.parse(res)
        })
      })
      .then( (res)=>{
        this.setState({
          value:{
            firstName : this.state.loginUser.firstName,
            lastName : this.state.loginUser.lastName,
            phoneNo : this.state.loginUser.phoneNo
          }
        })
      })
      .catch( (err)=>{
        console.log(err);
      })
    }

    onUpdate() {
      var value = this.refs.form.getValue();
      if (value) {
        client.service('users').patch(this.state.loginUser.id,{
           firstName:value.firstName,
           lastName:value.lastName,
           phoneNo:value.phoneNo
         })
         .then( (res)=>{
             this.setState({
               loginUser:{...this.state.loginUser,
                 firstName : this.state.value.firstName,
                 lastName : this.state.value.lastName,
                 phoneNo : this.state.value.phoneNo
               }
             })

         })
         .then( (res)=> {
           this.props.updateProfile(this.state.loginUser)
           AsyncStorage.removeItem('@authinfo')
           AsyncStorage.setItem('@authinfo',JSON.stringify(this.state.loginUser))
           this.setState({showAlert: true});
         })
         .catch( (err)=>{
           console.log(err);
         })
      }
    }

    onFormChange(value){
      this.setState({value:value});
      if( !(value.password && value.confirmPassword) ){
        return;
      }

      if( value.password == value.confirmPassword ){
        this.setState({options: t.update(this.state.options, {
          fields: {
            confirmPassword: {
              hasError: { $set: false },
            }
          }
        })})
      }

      if( value.password !== value.confirmPassword ){
        this.setState({options: t.update(this.state.options, {
          fields: {
            confirmPassword: {
              hasError: { $set: true },
              error: { $set: 'Password must match' }
            }
          }
        })})
      }
    }

    hideAlert(){
      this.setState({ leaveScene: true })
      setTimeout(()=>{
        // Actions.profile()
        this.props.navigation.navigate("Profile")
      }, 500);
    }

    render(){
      if(this.state.leaveScene === true){
        return (<Loading/>);
      }else{
        return (
          <View style={styles.container}>
            <AwesomeAlert
              show={this.state.showAlert}
              showProgress={false}
              title="Update Successful!"
              message="Your information has been updated"
              closeOnTouchOutside={true}
              closeOnHardwareBackPress={false}
              showConfirmButton={true}
              confirmText="Continue"
              confirmButtonColor="#41b9e4"
              onConfirmPressed={() => {this.hideAlert()}}
              alertContainerStyle={{zIndex:9,marginTop:-100}}
              titleStyle={{fontWeight:'bold', textAlign:'center'}}
              messageStyle={{textAlign:'center'}}
            />
            <View style={styles.avatarContainer}>
              <Image
                style={styles.logo}
                source={require('../assets/logo.png')}
              />
            </View>
            <Form
              ref="form"
              type={this.state.ProfileUpdateForm}
              options={this.state.options}
              value={this.state.value}
              onChange={this.onFormChange}
            />
            <TouchableHighlight style={styles.btnProfileUpdate} onPress={this.onUpdate}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableHighlight>
          </View>
        )
      }
    }
}

const styles = {
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
    backgroundColor: '#ffffff',
  },
  logo:{
    width:120,
    height:130
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginBottom:10,
    marginTop:-100
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  btnProfileUpdate: {
    height:45,
    backgroundColor: '#41b9e4',
    borderColor: '#41b9e4',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
}


function mapStateToProps(state) {
  return {
    profile: state.profile
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateProfile: updateProfile,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileUpdate);
