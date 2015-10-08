import React from 'react';

import ChromeStorage from '../../modules/chromestorage';


class Dropdown extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            value: this.props.value
        };

        this.handleChange = this.handleChange.bind(this);

        this.Storage = new ChromeStorage();
    }

    handleChange (e) {
        let key   = this.props.optkey,
            value = e.target.value;

        this.Storage.set(key, value);

        this.setState({ value: value });
    }

    render () {
        return (
            <label>
                <abbr>
                    <span>{this.props.label}:</span>
                    <select value={this.state.value} onChange={this.handleChange}>
                        {this.props.options.map((item, index) => {
                            return <option key={index} value={index.toString()}>{item}</option>;
                        })}
                    </select>
                    <div>
                        <strong>{this.props.label}</strong>
                        <p>{this.props.tooltip}</p>
                    </div>
                </abbr>
            </label>
        );
    }
}

export default Dropdown;