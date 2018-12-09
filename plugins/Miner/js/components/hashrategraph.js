import React from 'react'
import { unix } from 'moment'
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts'

const HashRateGraph = ({hashrateHistory}) => {

  return(
    <div className="wrap">
      { hashrateHistory.length === 0 && (<div>
          If you don't see any stats, wait at least 10 minutes to see the first data point for your worker
          or try to choose another range</div>
      )}
      { hashrateHistory.length !== 0 && (
        <ResponsiveContainer width="100%" height={230}>
          <AreaChart data={hashrateHistory} margin={{ top: 50 }} >
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(236, 241, 248,1)" />
                <stop offset="95%" stopColor="rgba(255, 255, 255,0)" />
            </linearGradient>
          </defs>
          <Tooltip
              position={{ y: -35 }}
              offset={0}
              content={<CustomTooltip external={hashrateHistory} />}
              wrapperStyle={{ left: 0, right: 0 }}
              cursor={false}
          />
          <Area
              type="monotone"
              dataKey="hashrate"
              stroke="#0846A0"
              strokeWidth="2"
              fillOpacity="1"
              fill="url(#gradient)"
              activeDot={<ActiveDot />}
              dot={false}
          />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

const ActiveDot = (props) => {
  const { cx, cy, payload } = props;
  if (payload && payload.hashrate === "0.00")
    return null;

  return  <circle r="4" cx={cx} cy={cy} fill="#FFFFFF" stroke="#0846A0" strokeWidth="2" />
}

const CustomTooltip = (props) => {
  const { active, payload, external, label } = props
  const { width } = props.viewBox

  let count = external.length
  let oneBarWidth = width/count
  let x = Math.floor(oneBarWidth*label) + Math.round(oneBarWidth/2-1)

  if (active) {
    if (!payload || payload[0].value === '0.00')
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
        <div>{payload[0].payload.hashrate} MH/s</div>
      </div>
    )
  }
  return null;
}

export default HashRateGraph
