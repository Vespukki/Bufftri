import logo from './triforce.webp';
import './App.css';
import React from 'react';
import Dropdown from './Components/Dropdown';
import championFile from "./12.16.1/data/en_US/champion.json"

class App extends React.Component
{
 
  constructor(props) {
    super(props);
    this.state = {

      championArray: getChampions(),
      attacker: {},

    };

    this.state.attacker = this.state.championArray[0]

    this.handleAttackerChange = this.handleAttackerChange.bind(this)
  }

  //called by dropdown
  handleAttackerChange(champ)
  {
    this.setState({attacker: champ})
  }

  componentDidUpdate(old)
  {
    // alert(this.state.attacker.stats.attackdamage)
    //TriSpellbladeDamage = getTriSpellbladeDamage(this.state.attacker)
  }


  render()
  {
    var TriSpellbladeDamage = getTriSpellbladeDamage(this.state.attacker);
    var DSSpellbladeDamage = getDSSpellbladeDamage(this.state.attacker);

    return (

      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          
          
          <Dropdown championArray={this.state.championArray} id="attacker" changeHandler={this.handleAttackerChange}/>
          

          <p>calculations assume level 10</p>
          <p>{TriSpellbladeDamage}</p>
          <p>{DSSpellbladeDamage}</p>
          </header>
      </div>
  
  
    );
  
  }

  
}


function getTriSpellbladeDamage(attacker)
{
  var level = 10
  var baseAD = attacker.stats.attackdamage + (attacker.stats.attackdamageperlevel * level)

  return baseAD * 2
}

function getDSSpellbladeDamage()
{
  return 100
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
