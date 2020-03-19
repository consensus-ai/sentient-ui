import React from 'react'
import { Tooltip, ResponsiveContainer, Bar, BarChart, Cell, YAxis } from 'recharts';
import { unix } from 'moment'

import Loading from './loading'

const PoolStatsGraph = ({poolHistory, mining}) => {

  const mouseEnter = (index) => {
    document.querySelectorAll(`.bar-${index}`).forEach(e => e.classList.add('active'))
  }

  const mouseLeave = (index) => {
    document.querySelectorAll(`.bar-${index}`).forEach(e => e.classList.remove('active'))
  }

  return(
    <div className="wrap">
      { mining && poolHistory.length === 0 && <Loading /> }
      { poolHistory.length > 0 && (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={poolHistory} margin={{ top: 60, right: 5 }}>
            <YAxis dataKey="barsubmitted" />
            <Tooltip
              position={{ y: -35 }}
              offset={0}
              content={<CustomTooltip external={poolHistory} />}
              wrapperStyle={{ left: 0, right: 0 }}
            />
            <Bar stackId="0" dataKey="baraccepted">
              {
                poolHistory.map((entry, index) => {
                  return <Cell
                    key={`accepted-${index}`}
                    className={`bar-${index}`}
                    fill='#0846A0'
                    onMouseEnter={() => mouseEnter(index)}
                    onMouseLeave={() => mouseLeave(index)}
                  />
                })
              }
            </Bar>
            <Bar  stackId="0" dataKey="barrejected">
              {
                poolHistory.map((entry, index) => {
                  return <Cell
                    key={`rejected-${index}`}
                    fill='#CC4555'
                    className={`bar-${index}`}
                    onMouseEnter={() => mouseEnter(index)}
                    onMouseLeave={() => mouseLeave(index)}
                  />
                })
              }
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

const CustomTooltip = (props) => {
  const { active, payload, coordinate } = props
  let { x } = coordinate

  if (active) {
    if (!payload || !payload.length)
      return null
    const style = {
      color: '#0846A0',
      paddingBottom: '57px',
      background: 'transparent',
      transform: `translateX(${x - 62}px)`,
      transition: `transform 400ms ease 0s`,
    }

    return (
        <div className="area-chart-tooltip" style={style}>
          <div>{unix(payload[0].payload.time).format('MMM D YYYY, h:mma')}</div>
          <div>
            <span className="blue">{payload[0].payload.baraccepted}</span>
            <i>/</i>
            <span className="red">{payload[0].payload.barrejected}</span>
          </div>
          <div>
            <span className="blue">{payload[0].payload.accepted} %</span>
            <i>/</i>
            <span className="red">{payload[0].payload.rejected} %</span>
          </div>
        </div>
    )
  }
  return null
}

export default PoolStatsGraph
