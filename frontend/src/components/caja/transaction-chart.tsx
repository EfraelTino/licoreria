import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartLegend, ChartTooltip } from "../ui/chart"

const data = [
  { time: "9AM", cash: 120, card: 150, total: 270 },
  { time: "10AM", cash: 180, card: 230, total: 410 },
  { time: "11AM", cash: 250, card: 300, total: 550 },
  { time: "12PM", cash: 310, card: 410, total: 720 },
  { time: "1PM", cash: 390, card: 520, total: 910 },
  { time: "2PM", cash: 490, card: 650, total: 1140 },
  { time: "3PM", cash: 580, card: 780, total: 1360 },
]

export function TransactionChart() {
  return (
    <div className="h-[300px]">
      <ChartLegend className="justify-center mb-4">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-[2px] bg-[#0ea5e9]" />
          <span>Cash</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-[2px] bg-[#8b5cf6]" />
          <span>Card</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-[2px] bg-[#10b981]" />
          <span>Total</span>
        </div>
      </ChartLegend>
      <ChartContainer 
        config={{
          cash: { color: "#0ea5e9" },
          card: { color: "#8b5cf6" },
          total: { color: "#10b981" }
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="time" className="text-xs text-muted-foreground" tickLine={false} axisLine={false} />
            <YAxis
              className="text-xs text-muted-foreground"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background/80 backdrop-blur-sm px-2.5 py-1.5 text-xs shadow-xl">
                      {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div 
                            className="h-2.5 w-2.5 rounded-[2px]" 
                            style={{ 
                              backgroundColor: index === 0 ? "#0ea5e9" : index === 1 ? "#8b5cf6" : "#10b981" 
                            }}
                          />
                          <span className="text-muted-foreground">
                            {index === 0 ? "Cash" : index === 1 ? "Card" : "Total"}
                          </span>
                          <span className="font-mono font-medium tabular-nums text-foreground ml-auto">
                            ${entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                }
                return null
              }}
            />
            <Area type="monotone" dataKey="cash" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} strokeWidth={2} />
            <Area type="monotone" dataKey="card" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} />
            <Area type="monotone" dataKey="total" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}

