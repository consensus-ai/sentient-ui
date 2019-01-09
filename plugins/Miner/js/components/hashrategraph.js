import React from 'react'
import { unix } from 'moment'
import { AreaChart, Area, Tooltip, ResponsiveContainer, YAxis } from 'recharts'
import Loading from './loading'

const HashRateGraph = ({hashrateHistory, mining}) => {

  return(
    <div className="wrap">
      { mining && hashrateHistory.length === 0 && <Loading /> }
      { hashrateHistory.length > 0 && (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={hashrateHistory} margin={{ top: 60, right: 5 }} >
          <YAxis dataKey="orighashrate" />
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
              dataKey="orighashrate"
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
  const { cx, cy, payload } = props
  if (payload && payload.orighashrate === "0.00")
    return null

  return  <circle r="2" cx={cx} cy={cy} fill="#0846A0" stroke="#0846A0" strokeWidth="1" />
}

const CustomTooltip = (props) => {
  const { active, payload, coordinate } = props
  let { x } = coordinate

  if (active) {
    if (!payload || payload[0].value === '0.00')
      return null
    const style = {
      color: '#0846A0',
      paddingBottom: '57px',
      background: 'transparent',
      transform: `translateX(${x - 61}px)`,
      transition: `transform 400ms ease 0s`,
    }

    return (
      <div className="area-chart-tooltip" style={style}>
        <div>{unix(payload[0].payload.time).format('MMM D YYYY, h:mma')}</div>
        <div>{payload[0].payload.hashrate} {payload[0].payload.unit}</div>
      </div>
    )
  }
  return null
}

export default HashRateGraph
