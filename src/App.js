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
      attacker: {champ: {}, level: 10, attack: 0},

    };

    this.state.attacker.champ = this.state.championArray[0]
    this.handleAttackerChange = this.handleAttackerChange.bind(this)
    this.handleADChange = this.handleADChange.bind(this)
  }

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

    newAttacker.attack = e.target.value

    this.setState({attacker: newAttacker})
  }

  render()
  {

    let TriSpellbladeDamage = getTriSpellbladeDamage(this.state.attacker);
    let DSSpellbladeDamage = getDSSpellbladeDamage(this.state.attacker);

    return (

      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          
          <Dropdown championArray={this.state.championArray} id="attacker" changeHandler={this.handleAttackerChange}/>
          current AD: <input type="number" id='currentAD' onChange={this.handleADChange}/>

          <p>calculations assume level 10 and max stacks of threefold</p>

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


function getTriSpellbladeDamage(attacker)
{
  let baseAD = attacker.champ.stats.attackdamage + (attacker.champ.stats.attackdamageperlevel * attacker.level)
  return baseAD * 2.4
}

function getDSSpellbladeDamage(attacker)
{
  return attacker.attack
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
