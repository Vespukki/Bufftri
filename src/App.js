import logo from './triforce.webp';
import './App.css';
import React from 'react';
import Dropdown from './Components/Dropdown';
import championFile from "./12.16.1/data/en_US/champion.json"
import axios from 'axios';

const API_KEY = "RGAPI-cb5bc134-b5a2-41d6-a886-39ea64d26ed1"

class App extends React.Component
{
 

  constructor(props) {
    super(props);
    this.state = {

      championArray: getChampions(),
      attacker: {champ: {}, level: 1, ad: 0},
      defender: {champ: {}, level: 1, maxHp: 0},
    }


    this.state.attacker.champ = this.state.championArray[0]
    this.state.defender.champ = this.state.championArray[0]

    this.handleAttackerChange = this.handleAttackerChange.bind(this)
    this.handleADChange = this.handleADChange.bind(this)
    this.handleAttackerLevelChange = this.handleAttackerLevelChange.bind(this)
    this.handleDefenderChange = this.handleDefenderChange.bind(this)
    this.handleDefenderLevelChange = this.handleDefenderLevelChange.bind(this)
    this.handleHPChange = this.handleHPChange.bind(this)
  }

  //#region Attacker Handlers
  //called by dropdown
  handleAttackerChange(newChamp)
  {
    let newAttacker = this.state.attacker

    newAttacker.champ = newChamp

    this.setState({attacker: newAttacker})
  }

  //called by attack input
  handleADChange(e)
  {
    let newAttacker = this.state.attacker

    newAttacker.ad = e.target.value

    this.setState({attacker: newAttacker})
  }

  //called by level input
  handleAttackerLevelChange(e)
  {
    let newAttacker = this.state.attacker

    newAttacker.level = e.target.value

    this.setState({attacker: newAttacker})
  }

  //#endregion
 
  //#region Defender Handlers
  //called by dropdown
  handleDefenderChange(newChamp)
  {
    let newDefender = this.state.defender

    newDefender.champ = newChamp

    this.setState({defender: newDefender})
  }

  //called by hp input
  handleHPChange(e)
  {
    let newDefender = this.state.defender

    newDefender.maxHp = e.target.value

    this.setState({defender: newDefender})
  }

  //called by level input
  handleDefenderLevelChange(e)
  {
    let newDefender = this.state.defender

    newDefender.level = e.target.value

    this.setState({defender: newDefender})
  }

  //#endregion

  searchForChampionMastery()
  {
    var summonerID = "";
    
    axios.get("https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/vespukki?api_key=" + API_KEY).then(function(response) {
      summonerID = response.data.id;
      var APICallString = "https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" + summonerID + "/by-champion/" + 114 + "?api_key=" + API_KEY;
      axios.get(APICallString).then(function(response) {
        alert(response.data.championPoints)
      })
    });
  }

  //currently sucks, dont use this just copy/paste it whereever you need it
  getSummonerId()
  {
    let stringToReturn = "ID_ERROR"
    
    axios.get("https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/vespukki?api_key=" + API_KEY).then(function(response) {
      //alert(response.data.id);
      stringToReturn = response.data.id;
      return stringToReturn;
    }).catch(function(error){
      return error
    });

    return("SHOULDN'T HAVE MADE IT TO HERE")

    
  }

  searchTotalGamesPlayedOnChampion(name)
  {
    axios.get("https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + name + "?api_key=" + API_KEY).then(function(response) {
        
      
      let id = response.data.puuid;
      //alert(id)
      
      let APICallString = "https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/" + id + "/ids/?api_key=" + API_KEY;
      axios.get(APICallString).then(function(response) {
        alert(response.data)
      }).catch(function(error) {
        alert(error);
      })  
    })

    
  }

   
  render()
  {
    this.searchTotalGamesPlayedOnChampion("Vespukki");
    let TriSpellbladeDamage = getTriSpellbladeDamage(this.state.attacker, this.state.defender);
    let DSSpellbladeDamage = getDSSpellbladeDamage(this.state.attacker, this.state.defender);

    return (

      <div className="App">
        <header className="App-header">

          
          <img src={logo} className="App-logo" alt="logo" />
          
          Attacker: <header className='Attacker-header'>
            <Dropdown championArray={this.state.championArray} id="attacker" changeHandler={this.handleAttackerChange}/>
            Current AD: <input type="number" id='currentAD' onChange={this.handleADChange}/>
            Current Level: <input type="number" id='currentLevel' onChange={this.handleAttackerLevelChange}/>
          </header>

          Defender: <header className='Defender-header'>
            <Dropdown championArray={this.state.championArray} id="defender" changeHandler={this.handleDefenderChange}/>
            Max HP: <input type="number" id='defenderMaxHP' onChange={this.handleHPChange}/>
            Current Level: <input type="number" id='currentDefenderLevel' onChange={this.handleDefenderLevelChange}/>

          </header>
          <p>calculations assume zero stacks of threefold</p>

          <div className='App-row'>

            <div className='App-column'>
            <p>Triforce Spell blade damage: {TriSpellbladeDamage}</p>

            </div>

            <div className='App-column'>
            <p>Sunderer Spell blade damage: {DSSpellbladeDamage}</p>

            </div>

          </div>

          </header>
      </div>
    );
  }

  componentDidMount()
  {
    this.handleAttackerChange(this.state.championArray[0])
  }
}

function getBaseAD(unit)
{
  return unit.champ.stats.attackdamage + (unit.champ.stats.attackdamageperlevel * unit.level)
}

function getTriSpellbladeDamage(attacker, defender)
{
  return getBaseAD(attacker) * 2
}

function getDSSpellbladeDamage(attacker, defender)
{
  return Math.max(Math.round((1.25 * getBaseAD(attacker)) + ( .06 * defender.maxHp)), getBaseAD(attacker) * 1.5)
}

function getChampions()
{
  var champObject = JSON.parse(JSON.stringify(championFile)).data
  var champArray = []

  Object.keys(champObject).forEach(champ => {
    champArray.push(champObject[champ])
  });
  champArray.sort((a,b) => a.name.localeCompare(b.name))

  return champArray
}

export default App;
