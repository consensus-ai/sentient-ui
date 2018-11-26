import PropTypes from 'prop-types'
import React from 'react'


class PoolDropdown extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
        }
    }

    componentDidMount () {
        this.props.actions.getMiningType()
    }

    changeType (type) {
        this.props.actions.changeMiningType(type)
        this.setState({ open: false })
    }

    toggleList () {
        if (this.props.mining) return
        this.setState(prevState => ({
            open: !prevState.open
        }))
    }

    render () {
        const { walletUnlocked, miningType, mining } = this.props
        const { open } = this.state

        let selectedOption = 'Local Daemon'
        if (miningType == 'pool') {
            selectedOption = 'Pool Server'
        }

        return(
            <div className={`dropdown ${open ? "open" : ""} ${walletUnlocked && !mining ? "" : "disabled"}`}>
                <span className={walletUnlocked ? "" : "disabled"} onClick={() => this.toggleList()}>
                    {selectedOption} <i className="fa fa-angle-down"></i>
                </span>
                {walletUnlocked && !mining &&
                    <ul>
                        <li onClick={() => this.changeType('pool')}>Pool Server</li>
                        <li onClick={() => this.changeType('local')}>Local Daemon</li>
                    </ul>
                }
            </div>
        )
    }
}

PoolDropdown.propTypes = {
    miningType: PropTypes.string.isRequired,
    mining: PropTypes.bool.isRequired,
}

export default PoolDropdown
