import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
// //import { Actions } from 'react-native-router-flux';
import AppIntroSlider from 'react-native-app-intro-slider';
import Icon from 'react-native-vector-icons/Ionicons';
import client from '../feathers'
import { AsyncStorage } from "react-native"
import Loading from "./common/Loading"
import { StackActions, NavigationActions } from 'react-navigation';
import { COLOR_BLUE, COLOR_BLUE_1, COLOR_BLUE_2, COLOR_RED, COLOR_TEXT_GREY_LIGHTB, COLOR_TEXT_GREY_LIGHT } from './common/Color'

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'MainTab' })],
});

class Home extends Component {
    static navigationOptions = {
      header: null,
    };

    constructor(props){
      super(props)
      this.state = {
        showRealApp: false
      }
    }

    _onDone = () => {
      // User finished the introduction. Show real app through
      // navigation or simply by controlling state

      //add timeout before change state to provide smooth navigation
      // setTimeout(()=>{
      //   this.setState({ showRealApp: true })
        // Actions.main({type: 'reset'})
        // this.props.navigation.navigate("News")
        // this.props.navigation.navigate("News")
        this.props.navigation.dispatch(resetAction);
      // }, 20500, 'funky');

    }

    _renderNextButton = () => {
      return (
        <View style={styles.buttonCircle}>
          <Icon
          name="md-arrow-round-forward"
          size={24}
          color="rgba(255, 255, 255, .9)"
          style={{ backgroundColor: 'transparent' }}/>
        </View>
      );
    }

    _renderDoneButton = () => {
      return (
        <View style={styles.buttonCircle}>
          <Icon
            name="md-checkmark"
            size={24}
            color="rgba(255, 255, 255, .9)"
            style={{ backgroundColor: 'transparent' }}/>
        </View>
      );
    }

    componentWillMount(){
      AsyncStorage.getItem('@authinfo')
      .then((res)=>{
         return client.authenticate({
           strategy: 'jwt',
           accessToken: JSON.parse(res).token
         })
      })
      .then( (res)=> {
        // Actions.main({type: 'reset'})
        // this.props.navigation.navigate("MainTab")
        this.props.navigation.dispatch(resetAction);
      })
      .catch( (err)=> {
        this.setState({
          showRealApp:true
        })
        AsyncStorage.removeItem('@authinfo')
        // Actions.main({type: 'reset'})
        // this.props.navigation.navigate("MainTab")
      })
    }

    render(){
      if(this.state.showRealApp === false){
        return (<Loading/>);
      }else{
        return(
          <AppIntroSlider
            renderDoneButton={this._renderDoneButton}
            renderNextButton={this._renderNextButton}
            slides={slides}
            onDone={this._onDone}
          />
        );
      }
    }

}

const styles = {
  image: {
    width: 320,
    height: 320,
  },
  buttonCircle: {
   width: 40,
   height: 40,
   backgroundColor: 'rgba(0, 0, 0, .2)',
   borderRadius: 20,
   justifyContent: 'center',
   alignItems: 'center',
 }
};

const slides = [
  {
    key: 'info_1',
    title: '',
    text: 'Welcome to Utipay',
    // textStyle: {
    //   'color':'grey',
    //   'fontWeight':'800',
    //   'fontSize':20,
    //   'color':'#29a7e1',
    //   'fontFamily':'Avenir'
    // },
    textStyle: {
      'fontWeight':'800',
      'color':'grey'
    },
    image: require('../assets/animate/utipay-intro-logo.gif'),
    imageStyle: {width:150,height:150},
    // backgroundColor: '#fff',
    backgroundColor: '#fff',
  },
  {
    key: 'info_2',
    title: '',
    text: 'Hello! I\'m BILU\nyour truly condo helper',
    textStyle: {
      'fontWeight':'800',
      'color':'grey'
    },
    image: require('../assets/animate/utipay-robot.gif'),
    imageStyle: {width:150,height:150},
    // backgroundColor: '#febe29',
    backgroundColor: '#fff',
  },
  {
    key: 'info_3',
    title: '',
    text: 'Manage your property \nmonthly bills',
    textStyle: {
      'fontWeight':'bold',
      'color':'grey'
    },
    image: require('../assets/animate/utipay-doc.gif'),
    imageStyle: {width:150,height:150},
    // backgroundColor: '#c3ddea',
    backgroundColor: '#fff',
  },
  {
    key: 'info_4',
    title: '',
    text: 'Various reservation features\nare available',
    textStyle: {
      'fontWeight':'bold',
      'color':'grey'
    },
    image: require('../assets/animate/utipay-e-pass.gif'),
    imageStyle: {width:150,height:150},
    // backgroundColor: '#004964',
    backgroundColor: '#fff',
  },
  {
    key: 'info_5',
    title: '',
    text: 'Communication between \nmanagement and owner \nmade easy',
    textStyle: {
      'fontWeight':'bold',
      'color':'grey'
    },
    image: require('../assets/animate/utipay-chat.gif'),
    imageStyle: {width:150,height:150},
    backgroundColor: '#fff',
  }
];

export default Home;
