import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image,  Animated, TouchableWithoutFeedback  } from 'react-native';
import { Button } from 'react-native-elements'
import { connect } from 'react-redux';
import { COLOR_BLUE, COLOR_GREEN_3, COLOR_TEXT, COLOR_TEXT_GREY } from './Color';
// import { cancelRequestHome } from '../../actions';
import { bindActionCreators } from "redux"
var _ = require('lodash');

class RequireLogin extends Component {
    constructor(props){
      super(props)
    }

    render(){
      return (
        <View style={styles.mainLink}>
          Require login
        </View>
      );

    }

}

const styles = {
    mainLink:{
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent:'space-around',
      backgroundColor:'#fff',
      marginTop:5,
      paddingTop:30,
      paddingLeft:30,
      paddingRight:30,
    },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    logo: {
      width: 120,
      height: 130
    },
    button:{
      alignSelf:'center',
      height: 45,
      borderColor: "transparent",
      borderWidth: 0,
      borderRadius: 5,
      marginTop:10,
      width:250
    },
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
    home: state.home
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    // cancelRequestHome : cancelRequestHome,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RequireLogin);
