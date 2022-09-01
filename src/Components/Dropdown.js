import React from "react"
import PropTypes from 'prop-types';

export default class Dropdown extends React.Component
{
  static propTypes = {
    changeHandler: PropTypes.func,
    championArray: PropTypes.array
  }
  constructor(props) {
    super(props);
    this.state = {
      champion: {}
    };

    this.state.champion = this.props.championArray[0]

    this.handleOptionChange = this.handleOptionChange.bind(this)

    this.props.changeHandler(this.state.champion)
  }

  handleOptionChange(e)
  {
    let champ = JSON.parse(e.target.value)
    this.setState({champion: champ})
    this.props.changeHandler(champ)
  }

  render()
  {

    return (
      <div>
        <select id="dropdown" onChange={this.handleOptionChange}>
          {this.props.championArray.map((option) => (
            <option value={JSON.stringify(option)}> {option.name}</option>
          ))}
        </select>
      </div>
    );
  }
}

