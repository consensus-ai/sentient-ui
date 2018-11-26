import React from 'react'
import { unix } from 'moment'

import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Brush, Legend,
    ReferenceArea, ReferenceLine, ReferenceDot, ResponsiveContainer,
    LabelList, Label } from 'recharts';

const Chart = ({chartData, graphRef}) => {
    const CustomTooltip = (props) => {
        const { active, payload, external, label } = props;

        if (active) {
          const style = {
            padding: 6,
            backgroundColor: '#fff',
          };

          return (

            <div className="area-chart-tooltip" style={style}>
              <div>{unix(payload[0].payload.time).format('MMM D YYYY, h:mma')}</div>
              <div>{payload[0].payload.hashrate} MH/s</div>
            </div>
          )
        }
        return null;
    }

    return(
        <div className="wrap">
            <ResponsiveContainer width="100%" height={graphRef ? graphRef.clientHeight - 100 : 250}>
                <AreaChart data={chartData} margin={{ top: 20, bottom: 5 }} >
                <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="rgba(236, 241, 248,1)" />
                        <stop offset="95%" stopColor="rgba(255, 255, 255,1)" />
                    </linearGradient>
                </defs>
                <Tooltip
                    cursor={{ stroke: '#0846A0', strokeWidth: 2 }}
                    position={{ y: 0 }}
                    content={<CustomTooltip external={chartData} />}
                />
                <Area
                    type="monotone"
                    dataKey="hashrate"
                    stroke="#0846A0"
                    strokeWidth="2"
                    fillOpacity="1"
                    fill="url(#gradient)"
                    activeDot={{ stroke: '#0846A0', strokeWidth: 2, r: 5, fill: '#FFFFFF' }}
                    dot={false}
                />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default Chart