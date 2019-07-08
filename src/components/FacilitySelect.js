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
import  STYLESHEET  from "./common/FormStyleL2"
import { confirmFacility } from '../actions'
import { bindActionCreators } from "redux"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { COLOR_ORANGE, COLOR_NOTIFICATION, COLOR_TEXT_GREY_LIGHT, COLOR_TEXT_GREY_LIGHTC, COLOR_TEXT, COLOR_BLUE, COLOR_TEXT_GREY, COLOR_RED_ERR } from './common/Color'
import { BTN_PRIMARY_FLAT, FAC_COURT_ACTIVE, FAC_COURT, FAC_DESC, FAC_TITLE, USERNAME, BTN_PRIMARY, BTN_TEXT } from './common/Styles'
import { Divider } from 'react-native-elements';
import moment from 'moment'
var FormData = require('form-data');
var _ = require('lodash')

let Form = t.form.Form;

const window = Dimensions.get('window')

var InputForm = t.struct({
  // types: Types,
  date: t.Date,
  time: t.Date,
  hours: t.Number,
  contact: t.Number,

});

class FacilitySelect extends Component {
    static navigationOptions = ({navigation}) => {
      return {
        header: null,
      }
    };

    constructor (props) {
      super(props)

      this.state={
        options: this.getFormOptions(),
        InputForm: this.getFormStruct(),
        value:{},
        showAlert:false,
        leaveScene:false,
        loginUser:null,
        submitting:false,

        court:[],
        selectCourt:'',
        selectCourtId:''
      }

      this.onSubmit = this.onSubmit.bind(this)
      this.onFormChange = this.onFormChange.bind(this)
      this.getFormOptions = this.getFormOptions.bind(this);
      this.getFormStruct = this.getFormStruct.bind(this);
      this._handleSelect = this._handleSelect.bind(this);
      this._renderItem = this._renderItem.bind(this);
    }

    _addMinutes(time, minsToAdd) {
      function D(J){ return (J<10? '0':'') + J;};
      var piece = time.split(':');
      var mins = piece[0]*60 + +piece[1] + +minsToAdd;

      return D(mins%(24*60)/60 | 0) + ':' + D(mins%60);
    }

    _getSessionTime(){
      const { noOfSessionPerDay, sessionDuration, sessionStartTimeStr } = this.props.facility.facilitySelect;
      let obj = {}
      let currSessTime =  sessionStartTimeStr
      for(var x=0; x<=noOfSessionPerDay; x++){
        let sessEndTime = this._addMinutes(currSessTime, sessionDuration)
        obj[currSessTime] = currSessTime + ' to ' + sessEndTime
        currSessTime = sessEndTime
      }
      return obj
    }

    getFormStruct(){
      this._getSessionTime();
      const TimeSelect = t.enums(this._getSessionTime());

      return t.struct({
        // types: Types,
        date: t.Date,
        time: t.Date,
        hours: t.Number,
        contact: t.Number,
        // time: TimeSelect,
      });
    }

    _handleSelect(item){
      let court = _.map(this.state.court, function(x) {
        return  _.pick( x, ['no'])
      })

      let index = _.findIndex(this.state.court, { 'no': item.no })
      let a = _.assignIn(_.pick(_.find(this.state.court, { 'no': item.no }), ['no']),  {'active':true} )
      court.splice(index, 1, a)

      this.setState({
        selectCourt:item.no,
        // selectCourtId:item._id,
        court
      })
    }

    _renderItem = ({item})=>{
      if(item.active){
        return(
          <TouchableOpacity style={FAC_COURT_ACTIVE} onPress={()=>this._handleSelect(item)}>
          <Text style={{alignSelf:'center', color:'#fff'}}>{item.no}</Text>
          </TouchableOpacity>
        )
      }
        return(
          <TouchableOpacity style={FAC_COURT} onPress={()=>this._handleSelect(item)}>
          <Text style={{alignSelf:'center', color:'#fff'}}>{item.no}</Text>
          </TouchableOpacity>
        )
    }

    getFormOptions(){
      function template(locals){
        return (
          <View style={{width:'100%', flexDirection:'column'}}>
            {locals.inputs.date}
            {locals.inputs.time}
            {locals.inputs.hours}
            {locals.inputs.contact}
          </View>
        );
      }

      return ({
        template: template,
        stylesheet: STYLESHEET,
        fields: {
          date: {
            label:'Date',
            error: 'Invalid date',
            mode: 'date',
            config: {
               format: (date) => moment(date).format('DD-MM-YYYY'),
               dialogMode: 'calendar',
               defaultValueText:'DD-MM-YYYY',
            },
            minimumDate: moment(new Date()).toDate(),
            maximumDate: moment(new Date()).add(7,'days').toDate(),
          },
          time: {
            label:'Time',
            error: 'Invalid time',
            mode: 'time',
            config: {
               format: (time) => moment(time).format('HH:mm'),
               defaultValueText:'00:00',
            },
            minuteInterval:10,
          },
          hours: {
            label:'Hour',
            nullOption: {value: '', text: 'Select Hour'},
          },
          contact: {
            label:'Contact',
            nullOption: {value: '', text: 'Contact'},
          },
        }
      })
    }

    componentWillMount(){
        if(this.props.facility.facilitySelect.name === 'BADMINTON'){
          this.setState({court:[
            {no:1},
            {no:2},
            {no:3},
            {no:4},
            {no:5},
            {no:6},
            {no:7},
            {no:8},
            {no:9},
            {no:10},
            {no:11},
            {no:12},
            {no:13},
          ]})
        }else{
          this.setState({court:[
            {no:14},
            {no:15},
          ]})
        }
    }

    onSubmit() {
      console.log(this.props.profile);
      var value = this.refs.form.getValue();

      if (value) {
        let dateitem = moment( (moment(value.date).format('YYYY-MM-DD')  + ' ' + moment(value.time).format('HH:mm')), 'YYYY-MM-DD HH:mm')
        this.props.confirmFacility({
          btn         : this.state.selectCourt,
          fullname    : this.props.profile.userInfo.username,
          user        : this.props.profile.userInfo._id,
          dateitem,
          dateitem2   :  dateitem.add(value.hours, 'hours'),
          bookingdate : moment(value.date).format('DD/MM/YYYY'),
          bookingtime : moment(value.time).format('HH:mm'),
          hours       :value.hours,
          contact     :value.contact,
        })
        return this.props.navigation.navigate('FacilityConfirm')
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
      _keyExtractor = (item, index) => index.toString();
      if(this.state.leaveScene === true || this.state.submitting === true){
        return (<Loading/>);
      }else{
        return (
          <KeyboardAwareScrollView
            scrollEnabled={true}
            keyboardShouldPersistTaps='always'
            contentContainerStyle={styles.container}
            >
              <ImageBackground source={require('../assets/badmintonbg.jpg')} style={{ width:'100%', height:'100%', opacity:0.8, backgroundColor:'#000', justifyContent:'space-around'}} >
                <View style={{padding:10, flex:2, flexDirection:'row', justifyContent:'space-around'}}>
                  <View style={{flex:1, flexDirection:'column', marginLeft:20, justifyContent:'flex-end'}}>
                    <Text style={FAC_TITLE}>{this.props.facility.facilitySelect.name}</Text>
                    <Text style={FAC_DESC}>Create your preferable slot or create a New Match!</Text>
                  </View>
                </View>

                <Divider style={{ backgroundColor: COLOR_TEXT_GREY_LIGHT, margin:10  }} />

                <View style={{padding:8, flex:3, flexDirection:'column', justifyContent:'space-around'}}>
                  <Form
                    ref="form"
                    type={this.state.InputForm}
                    options={this.state.options}
                    value={this.state.value}
                    onChange={this.onFormChange}
                  />
                  <Text style={styles.label}>Court</Text>
                  <FlatList
                    extraData={this.state}
                    keyExtractor={_keyExtractor}
                    horizontal={true}
                    data={this.state.court}
                    renderItem={this._renderItem}
                  />
                </View>

                <View>
                  <TouchableOpacity style={BTN_PRIMARY_FLAT} onPress={this.onSubmit}>
                    <Text style={BTN_TEXT}>BOOK A SESSION</Text>
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
    color:'white'
  }
}

function mapStateToProps(state) {
  return {
    facility: state.facility,
    profile: state.profile,
    // app: state.app
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    confirmFacility: confirmFacility,
    }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(FacilitySelect);
