import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import React from 'react'


class PoolDropdown extends React.Component {

    componentDidMount () {
        this.props.actions.getMiningType()
    }

    changeType (type) {
        document.querySelector('.dropdown ul').classList.toggle('opened')
        this.props.actions.changeMiningType(type)
    }

    toggleList () {
        if (this.props.actions.walletUnlocked) return
        document.querySelector('.dropdown ul').classList.toggle('opened')
    }

    render () {
        const { walletUnlocked, miningType } = this.props

        let selectedOption = 'Local Daemon'
        if (miningType == 'pool') {
            selectedOption = 'Pool Server'
        }

        return(
            <div className="dropdown">
                <span onClick={() => this.toggleList()} className={walletUnlocked ? "" : "disabled"}>
                    {selectedOption} <i className="fa fa-angle-down"></i>
                </span>
                <ul>
                    <li onClick={() => this.changeType('pool')}>Pool Server</li>
                    <li onClick={() => this.changeType('local')}>Local Daemon</li>
                </ul>
            </div>
        )
    }
}

// const PoolDropdown = ({walletUnlocked, miningType, actions}) => {

//     let selectedOption = 'Local Daemon'
//     if (miningType == 'pool') {
//         selectedOption = 'Pool Server'
//     }
//     console.log(Object.keys(miningType))

//     return(
//         <div className="dropdown" disabled={!walletUnlocked}>
//             <span>{selectedOption} <i className="fa fa-angle-down"></i></span>
//             <ul>
//                 <li onClick={() => actions.changeMiningType('local')}>Local Daemon</li>
//                 <li onClick={() => actions.changeMiningType('pool')}>Pool Server</li>
//             </ul>
//         </div>
//     )
// }


// class PoolDropdown extends PureComponent {
//     constructor(props) {
//       super(props)
//       this.state = {
//         listOpen: false,
//         list: [
//           {
//             type: 'local',
//             title: 'Local Daemon'
//           },
//           {
//             type: 'pool',
//             title: 'Pool Server'
//           }
//         ]
//       }
//       this.state.disabled = this.props.disabled
//     }
//     toggleList() {
//       if (this.state.disabled) return
//       this.setState(prevState => ({
//         listOpen: !prevState.listOpen
//       }))
//     }
//     toggleSelect(type) {
//       this.setState(prevState => ({
//         list: prevState.list.map((e) => {
//           e.type == type ? e.selected = true : e.selected = false
//           return e
//          })
//       }))
//       setMiningType(type)
//     }
//     render () {
//       const {list, listOpen} = this.state
//       const selected = list.filter(e => e.type === this.state.miningType)[0].title
//       return (
//         <div className="dropdown" onClick={() => this.toggleList()} disabled={this.state.disabled}>
//             <span>{selected} <i className="fa fa-angle-down"></i></span>
//             {listOpen && <ul>
//               {list.map((item) => (
//                 <li key={item.type} onClick={() => this.toggleSelect(item.type)}>{item.title}</li>
//               ))}
//             </ul>}
//         </div>
//       )
//     }
// }

PoolDropdown.propTypes = {
    miningType: PropTypes.string.isRequired,
}

export default PoolDropdown
