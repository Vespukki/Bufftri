import logo from './triforce.webp';
import './App.css';
import React from 'react';
import Dropdown from './Components/Dropdown';
import championFile from "./12.16.1/data/en_US/champion.json"
import axios from 'axios';

const API_KEY = "RGAPI-cb5bc134-b5a2-41d6-a886-39ea64d26ed1"
var enteredSummonerName = "";

class App extends React.Component
{

  constructor(props) {
    super(props);
    this.state = {

      championArray: getChampions(),
      attacker: {champ: {}, level: 1},
      defender: {champ: {}, maxHp: 0},
      totalTimes: {sunderer: 0, tri: 0}

    }


    this.state.attacker.champ = this.state.championArray[0]
    this.state.defender.champ = this.state.championArray[0]

    this.handleAttackerChange = this.handleAttackerChange.bind(this)
    this.handleAttackerLevelChange = this.handleAttackerLevelChange.bind(this)
    this.handleDefenderChange = this.handleDefenderChange.bind(this)
    this.handleHPChange = this.handleHPChange.bind(this)
    this.handleNameEnter= this.handleNameEnter.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)

  }

  //#region Attacker Handlers
  //called by dropdown
  handleAttackerChange(newChamp)
  {
    let newAttacker = this.state.attacker

    newAttacker.champ = newChamp

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


  //#endregion

  handleNameChange(e)
  {
    enteredSummonerName = e.target.value;
  }

  handleNameEnter(e)
  {
    this.setState({totalTimes: {sunderer: 0, tri: 0}})
    this.searchTotalItemsBuilt(enteredSummonerName)
  }

 //this.searchTotalItemsBuilt(enteredSummonerName, totalTimes), alert("handleNameEnter error")

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

  searchSummonerByName(name)
  {
    return axios.get("https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + name + "?api_key=" + API_KEY)
    
    // .then(response => {
    //   callback(response.data.puuid)
    // })
  }

  searchMatchHistoryByPuuid(id)
  {
    let APICallString = "https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/" + id + "/ids/?api_key=" + API_KEY + "&start=0&count=15";
    return axios.get(APICallString)
  }

  searchMatchByMatchId(id)
  {
    return axios.get("https://americas.api.riotgames.com/lol/match/v5/matches/" + id + "?api_key=" + API_KEY)
  }

  async searchTotalItemsBuilt(name)
  {
    this.searchSummonerByName(name).then(summoner => {
      this.searchMatchHistoryByPuuid(summoner.data.puuid).then(matchHistory => {
        for(let matchIndex = 0; matchIndex < matchHistory.data.length; matchIndex++)
        {
          this.searchMatchByMatchId(matchHistory.data[matchIndex]).then(match => {
            for(let participantIndex = 0; participantIndex < match.data.info.participants.length; participantIndex++)
            {
              for(let itemIndex = 0; itemIndex < 6; itemIndex++)
              {
                if(match.data.info.participants[participantIndex]["item" + itemIndex] === 6632) //sunderer
                {
                  let newTotalTimes = this.state.totalTimes

                  newTotalTimes.sunderer++

                  this.setState({totalTimes: newTotalTimes})
                }
                else if(match.data.info.participants[participantIndex]["item" + itemIndex] === 3078)
                {
                  let newTotalTimes = this.state.totalTimes

                  newTotalTimes.tri++

                  this.setState({totalTimes: newTotalTimes})
                }
              }
            }
          }).catch(error => {
            alert("error with searchMatchByMatchId: \n" + error)
          })
        }

      }).catch( error => {
        alert("error with searchMatchHistoryByPuuid: \n" + error)
      })
    }).catch( error => {
      alert("error with searchSummonerByName: \n" + error)
    })
  }

   
  render()
  {
    
    let TriSpellbladeDamage = getTriSpellbladeDamage(this.state.attacker, this.state.defender);
    let DSSpellbladeDamage = getDSSpellbladeDamage(this.state.attacker, this.state.defender);

    return (

      <div className="App">
        <header className="App-header">

          
          <img src={logo} className="App-logo" alt="logo" />
          
          Enter summoner name to see how many times sunderer and triforce have been built in your last 15 games: <header className='Name-header'>
          <input type="text" id='summonerName' onChange={this.handleNameChange}/>
          <button onClick={this.handleNameEnter}>Enter</button>
          <p className='totalTimesText'>Total Sunderers built: {this.state.totalTimes.sunderer}</p>
          <p className='totalTimesText'>Total Triforces built: {this.state.totalTimes.tri}</p>


          </header>

          Attacker: <header className='Attacker-header'>
            <Dropdown championArray={this.state.championArray} id="attacker" changeHandler={this.handleAttackerChange}/>
            Current Level: <input type="number" id='currentLevel' onChange={this.handleAttackerLevelChange}/>
          </header>

          Defender: <header className='Defender-header'>
            <Dropdown championArray={this.state.championArray} id="defender" changeHandler={this.handleDefenderChange}/>
            Max HP: <input type="number" id='defenderMaxHP' onChange={this.handleHPChange}/>

          </header>
          <p>calculations assume max stacks of threefold</p>

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
  return getBaseAD(attacker) * 2.4
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
