/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  LayoutAnimation,
  Dimensions,
  ListView,
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native';
import Modal from'react-native-modalbox';
import FlipCard from 'react-native-flip-card'

var {height, width} = Dimensions.get('window');
var i;
// Every Character gets a turn to move and a turn to attack.
const empty = "empty";
const occupied = "occupied"

const affliction = "affliction"
const defence = "defence"
const evasion = "evasion"
const evasionAttack = "evasionAttack"

var vegetaIm = {
  attack1: require('../images/vegeta/attack1.png'),
  attack2: require('../images/vegeta/attack2.png'),
  attack3: require('../images/vegeta/attack3.png'),
  attack4: require('../images/vegeta/attack4.png'),
  team: require('../images/vegeta/team.png')
}
var turnInt = 0


var vegeta = {
  name:'Vegeta',
  health:300,
  attack:20,
  defence:10,
  team: vegetaIm.team,
  flip:false,
  attack1:{
    name:'Dodge This!!',
    desc: "Gohan uses his bad ass karate skills to kick your enemy's ass. This causes like serious damage, dude",
    type:affliction,
    image: vegetaIm.attack1,
    stack: 5,
    turns:1

  },
  attack2:{
    name:'Gut Punch',
    desc: "Dude. Gohan like gets mad and does this thing where his defense goes up for 2 turns. it's crazy",
    type:defence,
    image: vegetaIm.attack2,
    stack: 10,
    turns:2

  },
  attack3:{
    name:'Charge Attack',
    desc: "Gohan uses his bad ass karate skills to kick your enemy's ass. This causes like serious damage, dude",
    type: evasionAttack,
    image: vegetaIm.attack3,
    stack: 5,
    turns:2


  }
}


var tiles2 = [
  {type:'defence', occupied:false},
  {type:'offense', occupied:false},
  {type:'evade', occupied:true}
  ]

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var tiles1 = [occupied, occupied, occupied, empty, empty,empty]
export default class battle extends Component {
  constructor(props){
    super(props)
    this.state = {
      vegetaCards: ds.cloneWithRows(tiles2),
      width:0,
      turnInt:0,
      showActions: false,
      selectedCharacter: vegeta,
      currentplayer: ds.cloneWithRows([]),
      character1: this.props.team[0],
      character2: this.props.team[1],
      attackVal: 0,
      character3: this.props.team[2],
      turnArray: [this.props.team[0],this.props.team[1],this.props.team[2], vegeta],
      enemy:vegeta,
      heros: this.props.team,
      team: ds.cloneWithRows(this.props.team),
      
    }
  }
  
  componentDidMount(){
    setTimeout(() => {this.runAnimate()}, 1000);
    this.setState({
      team: ds.cloneWithRows([this.state.character1,this.state.character2,this.state.character3]),
    })
  }


   runAnimate(){
     LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
this.setState({
      width:250,

    });
  }
  // Action are all right here
  updateCard(){}

  updateBoard(){
    this.setState({
    })
  }
  updateHealth(){}

  nextTurn(){

    if (this.state.turnInt < 3){
        this.setState({
          turnInt: this.state.turnInt +1,
          showActions: false,
        })}else{
         
          
        }
        if(this.state.turnInt == 2){
           this.ai()
        }
        
        
    
  }

  ai(){

    setTimeout(() => {

       this.showCurrent(this.state.enemy)
    }, 600)
    setTimeout(() =>{this.attackAll()
    }, 1000)

  }

  attackAll(){
    var attackVal = 50;
    this.setState({
      character1:{...this.state.character1, health:this.state.character1.health-attackVal}
    })
    this.flip(this.state.character1,attackVal);
    this.setState({
      character2:{...this.state.character2, health:this.state.character2.health-attackVal}
    })
    this.flip(this.state.character2,attackVal);
    this.setState({
      character3:{...this.state.character3, health:this.state.character3.health-attackVal}
    })
    this.flip(this.state.character3,attackVal);
  this.showCurrent(this.state.turnArray[this.state.turnInt])
    this.setState({
      showActions:false,
      turnInt:0
    })
    
  }
  gameOver(x){
    this.navigator.push({
      id: 'gameOver',
      winner: x
    })
  }



// We get turn character from turnArray
  turn(x, char){
    var attackVal = char.attack * x.stack;
    attackVal = attackVal - (this.state.enemy.defence - 3)
    if(x.type == affliction){
      this.setState({
              enemy: {...this.state.enemy, health: this.state.enemy.health - attackVal}
            })

          this.flip(this.state.enemy,attackVal);
    }
    if(x.type == defence){
      attackVal = Math.ceil(Math.random() * 100)
      this.setState({
              enemy: {...this.state.enemy, health: this.state.enemy.health - attackVal}
            })
          this.flip(this.state.enemy,attackVal);
      
    }
    if(x.type == evasion){
  
    }
    if(x.type == evasionAttack){

    }
    this.nextTurn()
    if(this.state.enemy.health <= 0){
      this.gameOver()
    }

  }
  dead(char){

  }

  queueModal(x){
    this.setState({
      selectedCharacter:x
    })
    this.refs.modal.open();
  }

  flip(player, val){
    // I dont know a simplier way to do this. sorry guys
    if(player == this.state.enemy){

        this.setState({
          enemy: {...player, flip:true, health:player.health - val},
          attackVal:val,
          vegetaCards: ds.cloneWithRows(tiles2)
        })
        setTimeout(() => {this.setState({
              enemy: {...player, flip:false},
              attackVal:val,
              vegetaCards: ds.cloneWithRows(tiles2)
            })}, 800)}

        else if(player == this.state.character1){
    
        this.setState({
          character1: {...player, flip:true, health:player.health - val},
          attackVal:val,
          team: ds.cloneWithRows([this.state.character1,this.state.character2,this.state.character3]),

        })
        setTimeout(() => {this.setState({
              character1: {...player, flip:false},
              team: ds.cloneWithRows([this.state.character1,this.state.character2,this.state.character3]),

            })}, 800)

        }else if(player == this.state.character2){
    
        this.setState({
          character2: {...player, flip:true, health:player.health - val},
          attackVal:val,
          team: ds.cloneWithRows([this.state.character1,this.state.character2,this.state.character3]),

        })
        setTimeout(() => {this.setState({
              character2: {...player, flip:false},
              team: ds.cloneWithRows([this.state.character1,this.state.character2,this.state.character3]),

            })}, 800)

        }else if(player == this.state.character3){
    
        this.setState({
          character3: {...player, flip:true, health:player.health - val},
          attackVal:val,
          team: ds.cloneWithRows([this.state.character1,this.state.character2,this.state.character3]),

        })
        setTimeout(() => {this.setState({
              character3: {...player, flip:false},
            })}, 800)

        
        setTimeout(() => {this.setState({
                          team: ds.cloneWithRows([this.state.character1,this.state.character2,this.state.character3]),

            })}, 1300)

        }
  }

  move(char, location){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
    if(tiles1[location] != occupied){
      this.setState({
        char: {...this.state.char,
        tile: location

      }})
      this.updateBoard()
      this.nextTurn()
    }
  }

  showCurrent(x){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
    this.setState({
      currentplayer: ds.cloneWithRows([x.attack1,x.attack2,x.attack3]),
    })
    this.setState({
      showActions:true
    })
  }

  attack(x){
    return(<TouchableOpacity onPress={() => this.turn(x,this.state.turnArray[this.state.turnInt])} style={{backgroundColor:'rgba(0,0,0,0.5)', alignItems:'center', width:200, height:200, padding:10, margin:10}}>
      <Image source={x.image} resizeMode = "contain" style={{height:150, width:150}} />
      <Text style={{color:'#fff',textAlign:'center' }}>{x.name.toUpperCase()}</Text>
      </TouchableOpacity>)
  }
  attackAI(x){
    return(<View onPress={() => this.turn(x,this.state.turnArray[3])} style={{backgroundColor:'rgba(0,0,0,0.5)', alignItems:'center', width:200, height:200, padding:10, margin:10}}>
      <Image source={x.image} resizeMode = "contain" style={{height:150, width:150}} />
      <Text style={{color:'#fff',textAlign:'center' }}>{x.name.toUpperCase()}</Text>
      </View>)
  }
  centerView(){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
    if(this.state.turnInt != 3){
        if(!this.state.showActions){
            return(
              <View style={{flex:1, justifyContent:'center'}}>
              <TouchableOpacity onPress = {() => this.showCurrent(this.state.turnArray[this.state.turnInt])} style={{borderLeftWidth:5, borderColor:'#fff', backgroundColor:'#444', justifyContent:'center', margin:10, height:60, width:this.state.width}}>
              <Text style={{color:'#fff', fontSize:25, fontWeight:'800', padding:10}}>{this.state.turnArray[this.state.turnInt].name}'s Turn</Text>
              </TouchableOpacity>
               <TouchableOpacity onPress={() =>this.nextTurn()} style={{borderLeftWidth:5, borderColor:'#444', backgroundColor:'#fff', justifyContent:'center', margin:10, height:60, width:this.state.width}}>
              <Text style={{color:'#444', fontSize:25, fontWeight:'800', padding:10}}>Skip Turn</Text>
              </TouchableOpacity>
              </View>)}else{
              return(
                <View style={{flex:1, justifyContent:'center'}}>
                <ListView 
          horizontal = {true}
          style={{height:200, width:width}}
          contentContainerStyle = {{justifyContent:'center'}}
          dataSource = {this.state.currentplayer}
          renderRow={(rowData) => this.attack(rowData)}
          /></View>)}}else{
                if(!this.state.showActions){
            return(
              <View style={{flex:1, justifyContent:'center'}}>
              <View onPress = {() => this.showCurrent(this.state.turnArray[this.state.turnInt])} style={{borderLeftWidth:5, borderColor:'#fff', backgroundColor:'#444', justifyContent:'center', margin:10, height:60, width:this.state.width}}>
              <Text style={{color:'#fff', fontSize:25, fontWeight:'800', padding:10}}>{this.state.turnArray[this.state.turnInt].name}'s Turn</Text>
              </View>
               <View onPress={() =>this.nextTurn()} style={{borderLeftWidth:5, borderColor:'#444', backgroundColor:'#fff', justifyContent:'center', margin:10, height:60, width:this.state.width}}>
              <Text style={{color:'#444', fontSize:25, fontWeight:'800', padding:10}}>Skip Turn</Text>
              </View>
              </View>)}else{
              return(
                <View style={{flex:1, justifyContent:'center'}}>
                <ListView 
          horizontal = {true}
          style={{height:200, width:width}}
          contentContainerStyle = {{justifyContent:'center'}}
          dataSource = {this.state.currentplayer}
          renderRow={(rowData) => this.attackAI(rowData)}
          /></View>)}
              }
        }
  

  selectedCharacter(){
    return(<ScrollView contentContainerStyle={{flex:1, alignItems:'center'}}>
      <View style={{alignItems:'center', flexDirection:'row'}}>
      <View>
      <Text style= {{backgroundColor:'rgba(30,132,22,0.7)', padding:5, margin:5, color:'#fff'}}>Health:{this.state.selectedCharacter.health}</Text>
      <Text style= {{backgroundColor:'rgba(52,66,152,0.7)', padding:5, margin:5, color:'#fff'}}>Defence:{this.state.selectedCharacter.defence}</Text>
      <Text style= {{backgroundColor:'rgba(152,52,52,0.7)', padding:5, margin:5, color:'#fff'}}>Attack:{this.state.selectedCharacter.attack}</Text>
      <Text style= {{backgroundColor:'rgba(130,52,152,0.7)', padding:5, margin:5, color:'#fff'}}>Evasion:{this.state.selectedCharacter.evasion}</Text>
      </View>
      <View style={{alignItems:'center'}}>
      <Image source={this.state.selectedCharacter.team} resizeMode="contain" style={{height:250, margin:10, width:250}} />
      <Text style={{fontSize:20, fontWeight:'200'}}>{this.state.selectedCharacter.name.toUpperCase()}</Text>
      </View>
      </View>
      <View>
      <View style={{height:100, margin:10, flexDirection:'row'}}>
      <Image source={this.state.selectedCharacter.attack1.image} resizeMode='contain' style={{height:150, width:150 ,margin:5}} />
        <View style={{width:400, justifyContent:'center'}}>
        <Text style={{fontSize:18, fontWeight:'600'}}>{this.state.selectedCharacter.attack1.name}</Text>
        <Text style={{fontSize:17}}>{this.state.selectedCharacter.attack1.desc}</Text>
        <Text style={{fontSize:10, borderRadius:15, color:'#fff', width:120, textAlign:'center', backgroundColor:'rgba(130,52,152,0.7)', padding:5}}>{this.state.selectedCharacter.attack1.type.toUpperCase()}</Text></View>
      </View>
      <View style={{height:100, margin:10, flexDirection:'row'}}>
      <Image source={this.state.selectedCharacter.attack2.image} resizeMode='contain' style={{height:150, width:150 ,margin:5}} />
        <View style={{width:400, justifyContent:'center'}}>
        <Text style={{fontSize:18, fontWeight:'600'}}>{this.state.selectedCharacter.attack2.name}</Text>
        <Text style={{fontSize:17}}>{this.state.selectedCharacter.attack2.desc}</Text>
                <Text style={{fontSize:10, borderRadius:15, color:'#fff', width:120, textAlign:'center', backgroundColor:'rgba(52,66,152,0.7)', padding:5}}>{this.state.selectedCharacter.attack2.type.toUpperCase()}</Text></View>

      </View>
      <View style={{height:100, margin:10, flexDirection:'row'}}>
      <Image source={this.state.selectedCharacter.attack3.image} resizeMode='contain' style={{height:150, width:150 ,margin:5}} />
        <View style={{width:400, justifyContent:'center'}}>
        <Text style={{fontSize:18, fontWeight:'600'}}>{this.state.selectedCharacter.attack3.name}</Text>
        <Text style={{fontSize:17}}>{this.state.selectedCharacter.attack3.desc}</Text>
                <Text style={{fontSize:10, borderRadius:15, color:'#fff', width:120, textAlign:'center', backgroundColor:'rgba(152,52,52,0.7)', padding:5}}>{this.state.selectedCharacter.attack3.type.toUpperCase()}</Text></View>
      </View>
      </View>
      </ScrollView>)
  }

  cardSet(x){
    if(x.type == null){
        return(
          <TouchableOpacity onPress ={() => this.queueModal(x)}>
          <FlipCard
          ref = {x.ref}
          flip = {x.flip} 
          style={{ width:width/3 - 20, margin:10, borderWidth:0}}
          clickable={false}
          >
      {/* Face Side */}
      <Image source={require('../images/cardBack.png')} resizeMode="stretch" style={{borderRadius:8, flex:1, width:null, height:null, alignItems:'center', justifyContent:'center'}}>
        <Image source={x.image} resizeMode="contain" style={{height:150, width:150}} />
      </Image>
      {/* Back Side */}
      <Image source={require('../images/cardFlip.jpg')} resizeMode="stretch" style={{borderRadius:8, flex:1, width:null, height:null, alignItems:'center', justifyContent:'center'}}>
        <Text style={{fontSize:38, color:'#a61f1f', fontWeight:'700'}}>-{this.state.attackVal}</Text>
      </Image>
    </FlipCard>
    </ TouchableOpacity>
    )}else if(x.occupied){
        return(
          <TouchableOpacity >
          <FlipCard 
          flip = {this.state.enemy.flip} 
          style={{ width:width/3 - 20, margin:10, borderWidth:0}}
          clickable={false}
          >
      {/* Face Side */}
      <Image source={require('../images/cardBack.png')} resizeMode="stretch" style={{borderRadius:8, flex:1, width:null, height:null, alignItems:'center', justifyContent:'center'}}>
        <Image source={vegeta.team} resizeMode="contain" style={{height:210, width:210}} />
      </Image>
      {/* Back Side */}
      <Image source={require('../images/cardFlip.jpg')} resizeMode="stretch" style={{borderRadius:8, flex:1, width:null, height:null, alignItems:'center', justifyContent:'center'}}>
        <Text style={{fontSize:38, color:'#a61f1f', fontWeight:'700'}}>-{this.state.attackVal}</Text>
      </Image>
    </FlipCard>
    </ TouchableOpacity>
    )}else{
        return(
          <TouchableOpacity >
          <FlipCard 
          ref = {x.ref} 
          style={{ width:width/3 - 20, margin:10, borderWidth:0}}
          clickable={false}
          >
      {/* Face Side */}
      <Image source={require('../images/cardBack.png')} resizeMode="stretch" style={{borderRadius:8, flex:1, width:null, height:null, alignItems:'center', justifyContent:'center'}}>
      </Image>
      {/* Back Side */}
      <Image source={require('../images/cardFlip.jpg')} resizeMode="stretch" style={{borderRadius:8, flex:1, width:null, height:null, alignItems:'center', justifyContent:'center'}}>
        <Text style={{fontSize:28}}>The Back</Text>
      </Image>
    </FlipCard>
    </ TouchableOpacity>
    )}
  }

  render() {
    return (
      <Image source={require('../images/namek.jpg')} style={styles.container} >
      <View style={{flex:1, justifyContent:'space-around', flexDirection:'row'}}>
      <View style={{width:140,}}>
      <Text style={{color:'#fff', width:140, height:35, fontWeight:'800', margin:3, textAlign:'center', fontSize:30}}>{this.state.enemy.name}</Text>
      <Text style={{color:"#fff", margin:1, fontSize:25, textAlign:'center'}}>{this.state.enemy.health}/{vegeta.health}</Text>
      </View>
      </View>
      <ListView 
      horizontal = {true}
      style={{flex:2}}
      dataSource = {this.state.vegetaCards}
      renderRow={(rowData) => this.cardSet(rowData)}
      />
      <View style= {{flex:4}}>
      {this.centerView()}
      </View>
      <ListView 
      horizontal = {true}
      style={{flex:2}}
      dataSource = {this.state.team}
      renderRow={(rowData) => this.cardSet(rowData)}
      />
      <View style={{flex:1, justifyContent:'space-around', flexDirection:'row'}}>
      <View style={{width:100,}}>
      <Text style={{color:'#fff', width:100, height:30, fontWeight:'800', margin:3, textAlign:'center', fontSize:30}}>{this.state.heros[0].name}</Text>
      <Text style={{color:"#fff", margin:3, fontSize:25, textAlign:'center'}}>{this.state.character1.health}/{this.state.heros[0].health}</Text>
      </View>
      <View style={{width:100,}}>
      <Text style={{color:'#fff', width:100, height:30, fontWeight:'800', margin:3, textAlign:'center', fontSize:30}}>{this.state.heros[1].name}</Text>
      <Text style={{color:"#fff", margin:3, fontSize:25, textAlign:'center'}}>{this.state.character2.health}/{this.state.heros[1].health}</Text>
      </View>
      <View style={{width:100,}}>
      <Text style={{color:'#fff', width:100, height:30, fontWeight:'800', margin:3, textAlign:'center', fontSize:30}}>{this.state.heros[2].name}</Text>
      <Text style={{color:"#fff", margin:3, fontSize:25, textAlign:'center'}}>{this.state.character3.health}/{this.state.heros[2].health}</Text>
      </View>
      </View>
      <Modal style={{height:800, backgroundColor:"rgba(255,255,255,0.8)", width:width-100}} position={"bottom"} ref={"modal"} swipeArea={20}>
          {this.selectedCharacter()}
        </Modal>
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height:null,
    paddingTop:20,
    width:null,
    justifyContent:'space-between'
}}
);

