import React from 'react';

import OptionsComponent from './optionscomponent';
import Chrome from '../../modules/chrome';


class Range extends OptionsComponent {
    constructor (props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange (e) {
        let key   = this.props.optkey,
            value = e.target.value;

        Chrome.setSetting(key, value);

        this.setState({ value: value });
    }

    render () {
        return (
            <label>
                <p>{this.props.label}:</p>
                <input type='range' min='0' max='100' step='1' value={this.state.value}
                    onChange={this.handleChange} />
                <span>({this.state.value}%)</span>
            </label>
        );
    }
}

export default Range;
