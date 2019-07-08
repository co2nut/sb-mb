import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { Avatar } from 'react-native-elements';
import client from '../feathers'
import { AsyncStorage } from "react-native"
import Icon from 'react-native-vector-icons/EvilIcons';
import Loading from "./common/Loading"
// var FBLoginButton = require('./common/FBLoginButton');
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { updateProfile } from '../actions';
import { bindActionCreators } from "redux"
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import FBSDK, {
  LoginManager,
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager } from 'react-native-fbsdk';
import axios from 'axios';
var _ = require('lodash');
import LinearGradient from 'react-native-linear-gradient'



class Login extends Component {
  // static navigationOptions = ({navigation}) => {
  //   return {
  //     headerTitle:'Login',
  //     headerTransparent:true,
  //     headerBackground: (
  //       <LinearGradient
  //       colors={['#00cdf2', '#b4f4ff']}
  //       style={{ flex: 1,  borderBottomRadius:100 }}
  //       start={{ x: 0, y: 0 }}
  //       end={{ x: 1, y: 0 }}
  //       />
  //     ),
  //     headerTitleStyle: { color: '#000', fontSize:16 },
  //     headerLayoutPreset:'center'
  //   }
  // };

    constructor (props) {
      super(props)
      this.state={
        showRealApp: false,
        userInfo:null,
        token:'',
        fbToken:'',
        logginIn:false,
      }

      this._signIn = this._signIn.bind(this)
      this._fblogin = this._fblogin.bind(this)
    }

    async componentDidMount() {
        this._configureGoogleSignIn();
        if(this.props.profile.userInfo.length>0){
          await this._getCurrentUserGoogle();// check if user logged in via google

          await this._getCurrentUserFb();// check if user logged in via facebook
        }
    }

    _configureGoogleSignIn() {
      GoogleSignin.configure({
        webClientId: '838851860193-chasfglqp1h5e2ui6h1usvtapgskff6g.apps.googleusercontent.com',//ios
        // webClientId: '838851860193-kkakan2a5vfa3sd4nifqghggq4j212tv.apps.googleusercontent.com',//android
        offlineAccess: false,
      });
    }

    _handleGooglelogin(){
      client.authenticate({
        strategy: 'google',
        access_token: this.state.userInfo.accessToken
        // access_token: this.state.userInfo.idToken
      })
      .then( (res)=> {
        return client.authenticate({
          strategy: 'jwt',
          accessToken: res.accessToken
        })
      })
      .then( (res)=> {
        this._storeLoginInfo(_.assign(res))
      })
      .catch( (err)=> {
        console.log('-------google auth error-------', err);
      })
    }

    //google login
    async _getCurrentUserGoogle() {

      try {
          const isSignedIn = await GoogleSignin.isSignedIn();
          if(isSignedIn){
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
          }

          AsyncStorage.removeItem('@authinfo')
          this.props.updateProfile([])

      } catch (error) {
        alert(error)
        console.log('google user not found');
      }
    }

    //facebook logged in
    async _getCurrentUserFb() {
      try {
        this.FBGraphRequest('id, email, picture.type(large), location, first_name, last_name', this.FBLoginCallback);
      } catch (error) {
        console.log('facebook user not found');
      }
    }

    _storeLoginInfo(res){
      let authInfoObj = {
        'id':res.id?res.id:res._id,
        'phoneNo':res.phoneNo,
        'email':res.email,
        'token':res.accessToken,
        'firstName':res.firstName,
        'lastName':res.lastName,
        'avatar':res.avatar,
        'propertyId':res.propertyId,

        'googleId':res.googleId,
        'facebookId':res.facebookId,
      }

      this.props.updateProfile(authInfoObj)

      AsyncStorage.setItem('@authinfo',JSON.stringify(authInfoObj));
      return this.props.navigation.navigate('Profile')
    }

    // _signIn = async () => {
    async _signIn() {
      this.setState({logginIn:true})
      try {
        // await GoogleSignin.hasPlayServices();
        GoogleSignin.hasPlayServices()
        .then((res)=>{
          if(res){
            return GoogleSignin.signIn()
          }
        })
        .then((res)=>{
          this.setState(
            { userInfo:res, error: null },
          ()=>{
            this._handleGooglelogin()
          });
        })
        .catch((err)=>{
          console.log({err});
        })

        // const userInfo = await GoogleSignin.signIn();
        // GoogleSignin.signIn()
        // .then((res)=>{
        //   console.log({res});
        // })
        // .catch((err)=>{
        //   console.log({err});
        // })
        // this.setState(
        //   { userInfo, error: null },
        // ()=>{
        //   this._handleGooglelogin()
        // });
      } catch (error) {
        alert(error)
        this.setState({logginIn:false})
        console.log('========GoogleSignin=========', error);
      }
    };

    async _handleFblogin() {
        client.authenticate({
          strategy: 'facebook',
          access_token: this.state.userInfo.idToken
        })
        .then( (res)=> {
          this._storeLoginInfo(_.assign(res))
        })
        .catch( (err)=> {
          console.log('-------fb auth error-------', err);
          this.props.navigation.navigate('Profile')
        })
    }

    async _fblogin() {
      // await LoginManager.logOut()
      this.setState({logginIn:true})
      LoginManager.logInWithReadPermissions(['public_profile', 'email'])
      .then( (result) =>{
          if(result.grantedPermissions){
            this.FBGraphRequest('id, email, picture.type(large), location, first_name, last_name', this.FBLoginCallback);
          }
          // if (result.isCancelled) {
          // } else {
          // }
        })
      .catch( (error) =>{
          this.setState({logginIn:false})
          console.log('LoginManager', error);
        })
    }

    async FBGraphRequest(fields, callback) {
      const accessData = await AccessToken.getCurrentAccessToken();
      if(accessData){
        this.setState({
            fbToken:accessData.accessToken
          })
        const infoRequest = new GraphRequest('/me', {
          accessToken: accessData.accessToken,
          parameters: {
            fields: {
              string: fields
            }
          }
        }, callback.bind(this));
        // Execute the graph request created above
        new GraphRequestManager().addRequest(infoRequest).start();
      }else{
        console.log('facebook user not found');
      }
      // Create a graph request asking for user information
    }

    async FBLoginCallback(error, result) {
      if (error) {
        this.setState({
          showLoadingModal: false,
        });
      } else {
        let userInfo = []
          userInfo.idToken = this.state.fbToken
          userInfo.email = result.email
          userInfo.facebookId = result.id
          userInfo.avatar = result.picture.data.url
          userInfo.firstName = result.first_name
          userInfo.lastName = result.last_name
        this.setState({ userInfo, error: null },
        ()=>{
            this._handleFblogin()
          })
      }
    }

    render(){
      if(this.state.showRealApp === true || this.state.logginIn === true){
        return (<Loading/>);
      }else{
        return (
          <KeyboardAwareScrollView>
          <View style={styles.container}>
              <View style={styles.avatarContainer}>
                <Image
                  style={styles.logo}
                  source={require('../assets/logo.png')}
                />
              </View>
              <View style={{flexDirection:'column'}}>

                <TouchableOpacity style={[styles.icon,{borderColor: '#4267b2', marginRight:10}]} onPress={()=>this._fblogin()} >
                  <View style={{flexDirection:'row', marginLeft:20}}>
                    <Icon
                      name="sc-facebook"
                      size={30}
                      color="#4267b2"
                      style={{ alignSelf:'center' }}
                    />
                    <Text style={{alignSelf:'center', color:'dimgrey', marginLeft:30}}>Log In with Facebook</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.icon,{borderColor: '#4267b2'}]} onPress={()=>this._signIn()} >
                  <View style={{flexDirection:'row', marginLeft:20}}>
                    <Icon
                      name="sc-google-plus"
                      size={30}
                      color="#4267b2"
                      style={{ alignSelf:'center'}}
                    />
                    <Text style={{alignSelf:'center', color:'dimgrey', marginLeft:30}}>Log In with Google</Text>
                  </View>
                </TouchableOpacity>

              </View>

          </View>
          </KeyboardAwareScrollView>
        )
      }
    }

}

const styles = {
  logo:{
    width:120,
    height:130
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginBottom:10,
  },
  container: {
    justifyContent: 'center',
    marginTop: 0,
    paddingHorizontal: 50,
    paddingVertical: 100,
    backgroundColor: '#ffffff',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    width: 180,
    backgroundColor: '#41b9e4',
    borderColor: '#41b9e4',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    // alignSelf: 'stretch',
    justifyContent: 'center'
  },
  btnSignUp: {
    width:120,
    height: 36,
    backgroundColor: '#2b3791',
    borderColor: '#2b3791',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  icon: {
    height: 46,
    width:'100%',
    alignSelf:'stretch',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',

    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    // elevation: 2,
    // width:40
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
