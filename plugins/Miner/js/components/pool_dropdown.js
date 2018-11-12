import React, { PureComponent } from 'react'

class PoolDropdown extends PureComponent {
    constructor(props) {
      super(props)
      this.state = {
        listOpen: false,
        list: [
          {
            id: 0,
            title: 'Local Daemon',
            selected: true
          },
          {
            id: 1,
            title: 'Pool',
            selected: false
          }
        ]
      }
    }
    toggleList() {
      this.setState(prevState => ({
        listOpen: !prevState.listOpen
      }))
    }
    toggleSelect(id) {
      this.setState(prevState => ({
        list: prevState.list.map((e) => {
          e.id == id ? e.selected = true : e.selected = false
          return e
         })
      }))
    }
    render () {
      const {list, listOpen} = this.state
      const selected = list.filter(e => e.selected === true)[0].title
      return (
        <div className="dropdown" onClick={() => this.toggleList()}>
            <span>{selected} <i className="fa fa-angle-down"></i></span>
            {listOpen && <ul>
              {list.map((item) => (
                <li key={item.id} onClick={() => this.toggleSelect(item.id)}>{item.title}</li>
              ))}
            </ul>}
        </div>
      )
    }
}

export default PoolDropdown