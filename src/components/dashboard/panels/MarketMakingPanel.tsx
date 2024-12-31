import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { LineChart, ArrowUpDown, DollarSign, Activity } from "lucide-react";

interface MarketMakingPanelProps {
  orderBookData?: Array<{
    price: number;
    size: number;
    side: "buy" | "sell";
  }>;
  liquidityMetrics?: {
    totalLiquidity: number;
    spreadPercentage: number;
    depth: number;
  };
  arbitrageOpportunities?: Array<{
    id: string;
    exchange1: string;
    exchange2: string;
    priceDiff: number;
    potential: number;
  }>;
  activeOrders?: Array<{
    id: string;
    type: string;
    price: number;
    size: number;
    status: string;
  }>;
}

const MarketMakingPanel = ({
  orderBookData = [
    { price: 50000, size: 1.5, side: "buy" },
    { price: 50100, size: 2.0, side: "sell" },
    { price: 49900, size: 1.0, side: "buy" },
  ],
  liquidityMetrics = {
    totalLiquidity: 1000000,
    spreadPercentage: 0.15,
    depth: 85,
  },
  arbitrageOpportunities = [
    {
      id: "1",
      exchange1: "Binance",
      exchange2: "Coinbase",
      priceDiff: 25,
      potential: 0.05,
    },
    {
      id: "2",
      exchange1: "Kraken",
      exchange2: "Gemini",
      priceDiff: 15,
      potential: 0.03,
    },
  ],
  activeOrders = [
    {
      id: "1",
      type: "Limit",
      price: 50000,
      size: 1.5,
      status: "Open",
    },
    {
      id: "2",
      type: "Market",
      price: 49950,
      size: 0.5,
      status: "Filled",
    },
  ],
}: MarketMakingPanelProps) => {
  return (
    <div className="w-full h-full min-h-[900px] p-6 bg-background">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Market Making Monitor</h1>

        <Tabs defaultValue="orderbook" className="w-full">
          <TabsList>
            <TabsTrigger value="orderbook">Order Book</TabsTrigger>
            <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
            <TabsTrigger value="arbitrage">Arbitrage</TabsTrigger>
            <TabsTrigger value="orders">Active Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="orderbook">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <LineChart className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Order Book View</h2>
              </div>
              <ScrollArea className="h-[400px] w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Price</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Side</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderBookData.map((order, index) => (
                      <TableRow key={index}>
                        <TableCell>{order.price.toLocaleString()}</TableCell>
                        <TableCell>{order.size}</TableCell>
                        <TableCell
                          className={
                            order.side === "buy"
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {order.side.toUpperCase()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="liquidity">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <ArrowUpDown className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Liquidity Monitoring</h2>
              </div>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Liquidity</span>
                    <span>
                      ${liquidityMetrics.totalLiquidity.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={75} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Spread Percentage</span>
                    <span>{liquidityMetrics.spreadPercentage}%</span>
                  </div>
                  <Progress value={liquidityMetrics.spreadPercentage} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Market Depth</span>
                    <span>{liquidityMetrics.depth}%</span>
                  </div>
                  <Progress value={liquidityMetrics.depth} />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="arbitrage">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5" />
                <h2 className="text-xl font-semibold">
                  Arbitrage Opportunities
                </h2>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exchange Pair</TableHead>
                    <TableHead>Price Difference</TableHead>
                    <TableHead>Potential Return</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {arbitrageOpportunities.map((opp) => (
                    <TableRow key={opp.id}>
                      <TableCell>
                        {opp.exchange1} - {opp.exchange2}
                      </TableCell>
                      <TableCell>${opp.priceDiff}</TableCell>
                      <TableCell>{(opp.potential * 100).toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Active Orders</h2>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.type}</TableCell>
                      <TableCell>${order.price.toLocaleString()}</TableCell>
                      <TableCell>{order.size}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${order.status === "Open" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketMakingPanel;
