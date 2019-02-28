import React from 'react'

class IntensityRange extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount () {
        this.props.actions.getIntensity()
    }

    changeIntensity (event) {
        const { actions } = this.props
        actions.changeIntensity(event.target.value)
    }

    render () {

        const { intensity, mining } = this.props
        return(
            <div className={`intensity ${mining ? "disabled" : ""}`}>
                <div className="label">Intensity</div>
                <div className="range-slider">
                    <input
                        type='range'
                        onChange={(e) => { this.changeIntensity(e) } }
                        min='1'
                        max='28'
                        value={intensity}
                        disabled={mining}
                        step="1"
                    />
                </div>
                <div className="value">{intensity}</div>
            </div>
        )
    }
}

export default IntensityRange
