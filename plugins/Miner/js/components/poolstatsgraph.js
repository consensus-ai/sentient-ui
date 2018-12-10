import React from 'react'
import { Tooltip, ResponsiveContainer, Bar, BarChart, Cell, YAxis } from 'recharts';
import { unix } from 'moment'

import EmptyHistory from './emptyhistory'

const PoolStatsGraph = ({poolHistory}) => {

  const mouseEnter = (index) => {
    document.querySelectorAll(`.bar-${index}`).forEach(e => e.classList.add('active'))
  }

  const mouseLeave = (index) => {
    document.querySelectorAll(`.bar-${index}`).forEach(e => e.classList.remove('active'))
  }

  return(
    <div className="wrap">
      { poolHistory.length === 0 && <EmptyHistory /> }
      { poolHistory.length !== 0 && (
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={poolHistory} margin={{ top: 50 }}>
            <YAxis dataKey="baraccepted" />
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
  const { active, payload, external, label } = props;
  const { width } = props.viewBox

  let count = external.length
  let oneBarWidth = width/count
  let x = Math.floor(oneBarWidth*label) + Math.round(oneBarWidth/2-1)

  if (active) {
    if (!payload || !payload.length)
      return null;
    const style = {
      color: '#0846A0',
      paddingBottom: '57px',
      background: 'transparent',
      transform: `translateX(${x}px)`,
      transition: `transform 400ms ease 0s`,
    }

    return (
      <div className="area-chart-tooltip" style={style}>
          <div>{unix(payload[0].payload.time).format('MMM D YYYY, h:mma')}</div>
          <div>{payload[0].payload.baraccepted}
            <span className='grey'> / </span>
            <span className="red">{payload[0].payload.barrejected}</span>
          </div>
          <div>{payload[0].payload.accepted} %
            <span className='grey'> / </span>
            <span className="red">{payload[0].payload.rejected} %</span>
          </div>
      </div>
    )
  }
  return null;
}

export default PoolStatsGraph
