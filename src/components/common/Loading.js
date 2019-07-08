import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image,  Animated, TouchableWithoutFeedback  } from 'react-native';
import { connect } from 'react-redux';

class Loading extends Component {
    state = {
      animation: new Animated.Value(1),
    };
    startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.spring(this.state.animation, {
            toValue: 1.2,
            friction:2,
            tension:1
          }),
          Animated.timing(this.state.animation, {
            toValue: 1,
            duration:300,
          })
        ])).start();
    }

    componentDidMount(){
      this.startAnimation()
    }

    render(){

      const animatedStyles = {
        transform: [
          { scale: this.state.animation }
        ]
      }

      if( this.props.type === 'empty' ){
        return (
          <View style={[styles.container, this.props.style]}>
            {/*}<Image
              style={{height:150,width:120, alignSelf:'center'}}
              source={require('../../assets/robot.png')}
            />*/}
            <Text style={{color:'grey', marginTop:20, fontSize:40, fontWeight:'600', opacity:0.7, alignSelf:'center'}}>Opps!</Text>
            <Text style={{color:'grey', marginTop:30, alignSelf:'center'}}>No Records Found</Text>
          </View>
        )
      }else{
        return (
            <View style={[styles.container, this.props.style]}>
              {/*}<Animated.Image
                style={[styles.logo, animatedStyles]}
                source={require('../../assets/logo.png')}
              />*/}
              <Animated.Text style={[animatedStyles, {color:'grey', marginTop:30, alignSelf:'center'}]}>Loading</Animated.Text>
            </View>
        )
      }

    }

}

const styles = {
    mainLink:{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor:'#fff'
    },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    logo: {
      width: 70,
      height: 80
    }
}

export default Loading;
