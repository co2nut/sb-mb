import React, { Component } from 'react';
import { Platform, Text, TouchableOpacity, Image, View } from 'react-native';
import { connect } from 'react-redux';
// import { Actions, Scene, Router, Stack, Tabs, renderRightButton } from 'react-native-router-flux';
// import Intro from './components/Intro';
import Login from './components/Login';
import SignUp from './components/SignUp';
// import ProfileUpdate from './components/ProfileUpdate';
import Home from './components/Home';
import Match from './components/Match';
import Calendar from './components/Calendar';
import Profile from './components/Profile';
// import TabIcon from './components/common/TabIcon';
import FacilitySelect from './components/FacilitySelect';
import FacilityConfirm from './components/FacilityConfirm';

import RequireLogin from './components/common/RequireLogin';
import { bindActionCreators } from "redux"
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation"
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLOR_BLUE, COLOR_ORANGE } from './components/common/Color'
// import Icon from 'react-native-vector-icons/FontAwesome'
// import LinearGradient from 'react-native-linear-gradient'

const TabNavigator = createBottomTabNavigator(
    {
      Home: {
        screen: Home
      },
      Match: {
        screen: Match
      },
      Calendar: {
        screen: Calendar
      },
      Profile: {
        screen: Profile
      },
    },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Match') {
          iconName = `ios-add-circle-outline`;
        } else if (routeName === 'Home') {
          iconName = `ios-home`;
        } else if (routeName === 'Calendar') {
          iconName = `ios-calendar`;
        } else if (routeName === 'Profile') {
          iconName = `ios-contact`;
        }

        // if(focused){
        //   return(
        //     <View>
        //       <View style={styles.activeBorder}>
        //       </View>
        //       <View style={styles.activeBorderBg}>
        //         <Ionicons style={styles.activeIcon} name={iconName} size={35} color={tintColor} />
        //       </View>
        //     </View>
        //   )
        // }
        if(focused){
          return(
            <Ionicons style={styles.activeIcon} name={iconName} size={35} color={tintColor} />
          )
        }
        return (
            <Ionicons name={iconName} size={horizontal ? 20 : 25} color={tintColor} />
        )
      },
    }),
    tabBarOptions: {
      showLabel: false,
      tabStyle:{zIndex:1, backgroundColor:"#000"},
      // activeTintColor: COLOR_ORANGE,
      inactiveTintColor: 'gray',
    }
  }
);

// TabNavigator.navigationOptions = ({ navigation }) => {
//   const { routeName } = navigation.state.routes[navigation.state.index];
//
//   // You can do whatever you like here to pick the title based on the route name
//   const headerTitle = routeName;
//
//   return {
//     headerTitle,
//   };
// };

const styles = {
  activeBorder:{
    zIndex:2,
    justifyContent:'center',
    width:50,
    height:Platform.OS==='ios'?50:30,

    ...Platform.select({
      ios:{
        borderRadius:25,
      },
      android:{
        borderTopLeftRadius:60,
        borderTopRightRadius:60,
      }
    }),

    borderWidth:1,
    borderColor:'#d3d3d3',
    backgroundColor:'white',
    marginTop:Platform.OS==='ios'?0:-22,
  },
  activeBorderBg:{
    marginTop:Platform.OS==='ios'?8:-12,
    position:'absolute',
    zIndex:2,
    justifyContent:'center',
    width:50,
    height:Platform.OS==='ios'?50:28,
    backgroundColor:'white'
  },
  activeIcon:{
    marginTop:Platform.OS==='ios'?-15:-5,
    alignSelf:'center',
    color:COLOR_ORANGE
  },
  activeImage:{
    marginTop:Platform.OS==='ios'?-18:-5,
    alignSelf:'center',
    width:35,
    height:35
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  }
}

const AppNavigator = createStackNavigator({
  // Login: {
  //   screen: Login
  // },
  // RequestFormAndroid: {
  //   screen: RequestFormAndroid
  // },
  // Intro: {
  //   screen: Intro
  // },
  Login: {
    screen: Login
  },
  SignUp: {
    screen: SignUp
  },
  FacilitySelect: {
    screen: FacilitySelect
  },
  FacilityConfirm: {
    screen: FacilityConfirm
  },
  MainTab: TabNavigator,
  // ProfileUpdate: {
  //   screen: ProfileUpdate
  // },
  // RequireLogin: {
  //   screen: RequireLogin
  // },
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
 }
);

function mapStateToProps(state) {
  return {
    profile: state.profile,
  }
}

export default connect(mapStateToProps)(createAppContainer(AppNavigator));
