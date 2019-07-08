import React, { Component } from 'react'
import { FlatList, ImageBackground, ScrollView, View, Text, TouchableOpacity, Image, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import client from '../feathers'
import { AsyncStorage } from "react-native"
import * as t from "tcomb-form-native"
import AwesomeAlert from 'react-native-awesome-alerts'
import Loading from "./common/Loading"
import Logo from "./common/Logo"
import  STYLESHEET  from "./common/FormStyle"
import { updateFacility, selectFacility } from '../actions'
import { bindActionCreators } from "redux"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { COLOR_ORANGE, COLOR_RED, COLOR_GREEN, COLOR_NOTIFICATION, COLOR_TEXT_GREY_LIGHT, COLOR_TEXT_GREY_LIGHTC, COLOR_TEXT, COLOR_BLUE, COLOR_TEXT_GREY, COLOR_RED_ERR } from './common/Color'
import { FAC_CARD, ACT_TITLE_1, ACT_VAL_1, TITLE_1, USERID, USERNAME, BTN_PRIMARY, BTN_TEXT } from './common/Styles'
import { Divider, Avatar } from 'react-native-elements';
import moment from 'moment';
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

class Home extends Component {
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

        facilities:[{name:'BADMINTON'}, {name:'FUTSAL'}],
        lastActivityFacility:'-',
        lastActivityCourt:'-',
        lastActivityDate:'-',
        lastActivityTime:'-'
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
      //get facilities
      console.log(this.props.profile.userInfo.accessToken);
      client.authenticate({
        strategy: 'jwt',
        accessToken:this.props.profile.userInfo.accessToken
      })
      .then((res)=>{
        //load into flatlist
        // this.setState({
        //   facilities:res.data
        // })
        //get latest reservation info
        let now = moment().startOf('day');
        return client.service('bookings').find({
          query:{
            // $populate:'facilityId',
            user:this.props.profile.userInfo.id,
            dateitem:{$gte:moment().startOf('day')},
            $limit:1,
            $sort:{
              createdAt:1
            }
          },
        })
      })
      .then((res)=>{
        console.log({res});
        if(res.data[0]){
          let data = res.data[0]
          // let courtInfo =  _.find(data.facilityId.court, { '_id': data.courtId })

          this.setState({
            lastActivityFacility:data.btn<=13?'BADMINTON':'FUTSAL',
            lastActivityCourt:'Court ' + data.btn,
            lastActivityDate:data.bookingdate,
            lastActivityTime:data.bookingtime
          })
        }
      })
      .catch((err)=>{
        this.setState({
          lastActivityFacility:'-',
          lastActivityCourt:'-',
          lastActivityDate:'-',
          lastActivityTime:'-',
        })
        // return this.props.navigation.navigate('Login')
        this.setState({submitting:false})
        console.log({err});
      })

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

        // this.setState({submitting:true})
      }
    }

    onFormChange(value){
      this.setState({value:value});
    }

    hideAlert(){
      this.setState({ leaveScene: true })
      // this.props.navigation.navigate('Complaints',{propertyUnit:this.state.propertyUnitId,property:this.state.propertyId})
    }

  _handleSelect(item){
    this.props.selectFacility(item)
    return this.props.navigation.navigate('FacilitySelect')
  }

  _renderItem = ({item})=>{
    console.log({item});
    return(
      <TouchableOpacity style={FAC_CARD} onPress={()=>this._handleSelect(item)}>
        <Text style={ACT_VAL_1}>{item.name}</Text>
      </TouchableOpacity>
    )
  }

    render(){
      _keyExtractor = (item, index) => index.toString();

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

                {/*upcoming activity*/}
                <View style={{flex:1, flexDirection:'column', justifyContent:'space-around'}}>

                  <Text style={TITLE_1}>Upcoming Activity</Text>

                  <View style={{flex:2, flexDirection:'row', justifyContent:'space-around'}}>
                    {/*Activity*/}
                    <View style={{flex:1, flexDirection:'column', justifyContent:'space-around'}}>
                        <Text style={ACT_TITLE_1}>Activity</Text>
                        <Text style={ACT_VAL_1}>{this.state.lastActivityFacility}</Text>
                        <Text style={ACT_VAL_1}>{this.state.lastActivityCourt}</Text>
                    </View>

                    {/*Date*/}
                    <View style={{flex:1, flexDirection:'column', justifyContent:'space-around',
                      borderRightWidth: 1, borderRightColor: COLOR_TEXT_GREY_LIGHT, borderRightStyle:'solid',
                      borderLeftWidth: 1, borderLeftColor: COLOR_TEXT_GREY_LIGHT, borderLeftStyle:'solid'
                    }}>
                        <Text style={ACT_TITLE_1}>Date</Text>
                        <Text style={ACT_VAL_1}>{this.state.lastActivityDate}</Text>
                    </View>

                    {/*Time*/}
                    <View style={{flex:1, flexDirection:'column', justifyContent:'space-around'}}>
                        <Text style={ACT_TITLE_1}>Time</Text>
                        <Text style={ACT_VAL_1}>{this.state.lastActivityTime}</Text>
                    </View>

                  </View>
                </View>
                {/*upcoming activity*/}

                {/*facilitties*/}
                <View style={{flex:2, flexDirection:'column', justifyContent:'space-around'}}>
                  <FlatList
                    keyExtractor={_keyExtractor}
                    horizontal={true}
                    data={this.state.facilities}
                    renderItem={this._renderItem}
                  />
                </View>
                {/*facilitties*/}

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
    facility: state.facility,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateFacility: updateFacility,
    selectFacility: selectFacility,
    }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Home);
