import React from "react"
import PropTypes from 'prop-types';

export default class Dropdown extends React.Component
{
  static propTypes = {
    //changes app state current champion
    changeHandler: PropTypes.func,

    championArray: PropTypes.array
  }
  constructor(props) {
    super(props);
    this.state = {
      //currently selected champ
    };

    this.handleOptionChange = this.handleOptionChange.bind(this)
  }


  handleOptionChange(e)
  {
    let champ = JSON.parse(e.target.value)
    this.props.changeHandler(champ)
  }

  render()
  {
    return (
      <div>
        <select id="dropdown" onChange={this.handleOptionChange}>
          {
            //creates an option for every champion in the array
            this.props.championArray.map((option) => (
              <option value={JSON.stringify(option)}> {option.name}</option>
          ))}
        </select>
      </div>
    );
  }
}