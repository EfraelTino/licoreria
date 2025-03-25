"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircleIcon, CheckCircleIcon, DownloadIcon, SearchIcon } from "lucide-react"

export function ClosingHistoryTwo() {
  const closings = [
    {
      id: 1,
      date: "2023-03-22",
      time: "21:45",
      user: "John Smith",
      role: "Administrator",
      expected: 1245.5,
      counted: 1245.5,
      difference: 0,
      cardSales: 2876.25,
      totalSales: 4121.75,
    },
    {
      id: 2,
      date: "2023-03-21",
      time: "22:10",
      user: "Sarah Johnson",
      role: "Salesperson",
      expected: 1567.25,
      counted: 1560.0,
      difference: -7.25,
      cardSales: 3245.5,
      totalSales: 4812.75,
    },
    {
      id: 3,
      date: "2023-03-20",
      time: "21:30",
      user: "John Smith",
      role: "Administrator",
      expected: 1325.75,
      counted: 1330.0,
      difference: 4.25,
      cardSales: 2567.8,
      totalSales: 3893.55,
    },
    {
      id: 4,
      date: "2023-03-19",
      time: "22:05",
      user: "Sarah Johnson",
      role: "Salesperson",
      expected: 1489.5,
      counted: 1489.5,
      difference: 0,
      cardSales: 2987.25,
      totalSales: 4476.75,
    },
    {
      id: 5,
      date: "2023-03-18",
      time: "21:55",
      user: "Michael Brown",
      role: "Administrator",
      expected: 1678.25,
      counted: 1665.0,
      difference: -13.25,
      cardSales: 3456.5,
      totalSales: 5134.75,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Closing History</CardTitle>
            <CardDescription>View past register closings</CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search closings..." className="pl-9 w-[250px]" />
            </div>
            <Button variant="outline">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="hidden md:table-cell">Role</TableHead>
              <TableHead className="text-right">Expected</TableHead>
              <TableHead className="text-right">Counted</TableHead>
              <TableHead className="text-right">Difference</TableHead>
              <TableHead className="hidden md:table-cell text-right">Total Sales</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {closings.map((closing) => (
              <TableRow key={closing.id}>
                <TableCell>{closing.date}</TableCell>
                <TableCell>{closing.time}</TableCell>
                <TableCell>{closing.user}</TableCell>
                <TableCell className="hidden md:table-cell">{closing.role}</TableCell>
                <TableCell className="text-right">${closing.expected.toFixed(2)}</TableCell>
                <TableCell className="text-right">${closing.counted.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {Math.abs(closing.difference) > 1 ? (
                      <AlertCircleIcon className="h-4 w-4 text-red-500" />
                    ) : (
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    )}
                    <span className={Math.abs(closing.difference) > 1 ? "text-red-500" : "text-green-500"}>
                      ${closing.difference.toFixed(2)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-right">${closing.totalSales.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

