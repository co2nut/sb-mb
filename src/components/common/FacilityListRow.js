import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image,  Animated, TouchableWithoutFeedback, Easing  } from 'react-native';
import { ListItem  } from 'react-native-elements';
import { connect } from 'react-redux';
import { COLOR_GREEN, COLOR_TEXT, COLOR_TEXT_GREY } from '../common/Color'
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment'

class FacilityListRow extends Component {
  constructor(props){
    super(props)

    this.state={
      moveYAnimation: new Animated.Value(0),
      moveContentYAnimation: new Animated.Value(0),
      opacityContent: new Animated.Value(0),
      rotateButton: new Animated.Value(0),
      opacityBottomBorder: new Animated.Value(1),
      loading:true,
      animated:false
    }

    // this.handleItemClick = this.handleItemClick.bind(this)
  }
    //move out
    moveDownAnimation = () => {
      Animated.sequence([
        Animated.timing(this.state.moveYAnimation, {
          toValue:80,
          duration: 500,
          easing: Easing.elastic(1)
        }),
      ]).start()
    }

    //reset
    moveResetAnimation = () => {
      Animated.sequence([
        Animated.timing(this.state.moveYAnimation, {
          toValue:0,
          duration: 500,
          easing: Easing.elastic(1)
        })
      ]).start()
    }

    moveDownContentAnimation = () => {
      Animated.parallel([
        Animated.timing(this.state.moveContentYAnimation, {
          toValue:100,
          duration: 500,
          easing: Easing.elastic(1)
        }),
        Animated.timing(this.state.opacityContent, {
           toValue: 1,
           duration: 1000,
        }),
        Animated.timing(this.state.rotateButton, {
          toValue: 90,
          duration: 500,
          easing: Easing.elastic(1)
        }),
        Animated.timing(this.state.opacityBottomBorder, {
          toValue: 0,
          duration: 300,
        }),
      ]).start()
    }

    //reset
    resetContentAnimation = () => {
      Animated.parallel([
        Animated.timing(this.state.moveContentYAnimation, {
          toValue:0,
          duration: 500,
          easing: Easing.elastic(1)
        }),
        Animated.timing(this.state.opacityContent, {
           toValue: 0,
           duration: 200,
         }),
        Animated.timing(this.state.rotateButton, {
           toValue: 0,
           duration: 500,
           easing: Easing.elastic(1)
         }),
         Animated.timing(this.state.opacityBottomBorder, {
           toValue: 1,
           duration: 500,
         }),


      ]).start()
    }

    componentDidUpdate(){
      if(this.props.action === 'close'){
        this.resetContentAnimation()
        this.moveResetAnimation()
      }

      if(this.props.activeItemStatus === 'solved' && this.props.action === 'open'){
        if(this.props.keyIndex === this.props.activeKey){
          this.moveDownContentAnimation()
        }

        if(this.props.keyIndex > this.props.activeKey){
          this.moveDownAnimation()
        }
      }
    }


    render(){

      const animatedYStyles = {
        transform: [
          { translateY: this.state.moveYAnimation },
        ]
      }
      const animatedContentYStyles = {
        opacity: this.state.opacityContent,
        transform: [
          { translateY: this.state.moveContentYAnimation },
        ]
      }

      const animatedBorderStyles = {
        opacity: this.state.opacityBottomBorder,
      }

      const rotateInterpolate = this.state.rotateButton.interpolate({
       inputRange: [0, 90],
       outputRange: ["0deg", "90deg"],
     });

      const animatedRotateBtnStyles = {
        transform: [
          { rotate: rotateInterpolate },
        ]
      }

      let colorCode:'';
      switch (this.props.item.status) {
        case 'Reserved':
          colorCode = COLOR_GREEN
          break;
        default:
        colorCode = '#874A2B'
      }


      return (
        <Animated.View  style={[animatedYStyles]} active={false}>
          <ListItem
            title={this.props.item.facilityId.name}
            titleStyle={{fontSize:15, color:COLOR_TEXT}}
            subtitleStyle={{fontSize:13,color:COLOR_TEXT_GREY}}
            subtitle={this.props.item.facilityId.description}
            leftElement={
              <View ref="rowItem" style={{width:55}}>
                <Icon
                  name="tasks"
                  size={30}
                  color={colorCode}
                  style={{alignSelf:'center'}}
                />
                <Text style={{fontSize:10, alignSelf:'center', color:'grey'}}>{this.props.item.status}</Text>
              </View>}

            rightElement={<View>
                <Text style={{color:'grey'}}>{moment(this.props.item.startDateTime).format('YYYY-MM-DD')}</Text>
                <Text style={{alignSelf:'flex-end',color:'grey' }}>{moment(this.props.item.startDateTime).format('HH:mm')}</Text>
              </View>}
          />

          <Animated.View style={[{width:'100%',borderBottomWidth:1,borderBottomColor:'grey'}, animatedBorderStyles]}></Animated.View>

          <Animated.View style={[styles.resolution, animatedContentYStyles]}>
            <Image source={require('../../assets/robot.png')} style={{width:30, height:30}}/>
            <Text style={{fontSize:15, color:'grey',marginLeft:30 }}>{this.props.item.remark}</Text>
          </Animated.View>

        </Animated.View>
      )

    }

}

const styles = {
    resolution:{
      paddingHorizontal:25,
      paddingBottom:15,
      flexDirection:'row',
      width:'100%',
      borderBottomWidth:1,
      borderBottomColor:'grey',
      position:'absolute',
      alignSelf:'center'
    },
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
}

export default FacilityListRow;
