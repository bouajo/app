import Link from "next/link"
import { FileText, DollarSign, Clock, Calendar, PlusCircle, GitBranch } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock data for active workflows
const activeWorkflows = [
  { id: 1, name: 'Contract Approval - Acme Corp', currentStep: 'Review', progress: 50 },
  { id: 2, name: 'Invoice Processing - TechGiant', currentStep: 'Approval', progress: 75 },
  { id: 3, name: 'Proposal Review - StartUp Hub', currentStep: 'Draft', progress: 25 },
]

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link href="/documents/upload">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Document
          </Link>
        </Button>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Documents to Sign
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Amount to be Billed
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,231.89</div>
            <p className="text-xs text-muted-foreground">
              +10.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Time Saved
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247 hours</div>
            <p className="text-xs text-muted-foreground">
              +18.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button asChild>
            <Link href="/documents/upload">Upload Document</Link>
          </Button>
          <Button asChild>
            <Link href="/documents/create">Create Document</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/documents">View All Documents</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Important Dates and Last Documents */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Important Dates */}
        <Card>
          <CardHeader>
            <CardTitle>Important Dates</CardTitle>
            <CardDescription>Upcoming events and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Jun 30, 2023</span>
                <span className="ml-2">Quarterly Report Due</span>
              </li>
              <li className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Jul 15, 2023</span>
                <span className="ml-2">Contract Renewal Deadline</span>
              </li>
              <li className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Aug 1, 2023</span>
                <span className="ml-2">New Compliance Regulations Effective</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Last Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
            <CardDescription>Recently processed documents</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Financial Report Q2 2023</TableCell>
                  <TableCell>2023-06-15</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Completed
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Employee Handbook v2</TableCell>
                  <TableCell>2023-06-14</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      Pending Signature
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Project Proposal: AI Integration</TableCell>
                  <TableCell>2023-06-13</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      In Review
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GitBranch className="mr-2 h-5 w-5" />
            Active Workflows
          </CardTitle>
          <CardDescription>Summary of ongoing document workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workflow</TableHead>
                <TableHead>Current Step</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeWorkflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell>{workflow.name}</TableCell>
                  <TableCell>{workflow.currentStep}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${workflow.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{workflow.progress}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

