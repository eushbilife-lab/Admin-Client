import { memo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartPoint } from "services/dashboard.service";

function AnalyticsOverview({ data }: { data: ChartPoint[] }) {
  return (
    <section className="panel-card analytics-card">
      <div className="analytics-card__head">
        <div>
          <p className="panel-card__title">Foods this week</p>
          <p className="panel-card__subtitle">What landed in the catalog over the last seven days</p>
        </div>
      </div>
      <div className="analytics-card__chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="leafFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9FC53A" stopOpacity={0.42} />
                <stop offset="95%" stopColor="#9FC53A" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#ECF3D8" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: "#515151", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: "#515151", fontSize: 12 }} axisLine={false} tickLine={false} width={28} />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #E8E8E8",
                background: "#FEFEFE",
                fontSize: 13,
                fontFamily: '"Poppins", sans-serif',
              }}
            />
            <Area type="monotone" dataKey="value" stroke="#9FC53A" strokeWidth={2.25} fill="url(#leafFill)" name="Foods" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default memo(AnalyticsOverview);
