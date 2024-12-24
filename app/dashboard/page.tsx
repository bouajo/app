import { Suspense } from "react"
import { FileText, DollarSign, Clock, Calendar, PlusCircle, GitBranch } from 'lucide-react'
import { createClient } from "@/lib/supabase/server"

import { Button } from "@/components/ui/button"
import { LinkButton } from "@/components/ui/link-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Async component to fetch and display recent documents
async function RecentDocuments() {
  const supabase = createClient()
  
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents?.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell>{doc.title}</TableCell>
            <TableCell>{new Date(doc.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                ${doc.status === 'completed' ? 'bg-green-100 text-green-800' : 
                  doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-blue-100 text-blue-800'}`}>
                {doc.status}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// Async component to fetch and display active workflows
async function ActiveWorkflows() {
  const supabase = createClient()
  
  const { data: workflows } = await supabase
    .from('workflows')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Workflow</TableHead>
          <TableHead>Current Step</TableHead>
          <TableHead>Progress</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workflows?.map((workflow) => (
          <TableRow key={workflow.id}>
            <TableCell>{workflow.name}</TableCell>
            <TableCell>{workflow.current_step}</TableCell>
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
  )
}

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <LinkButton href="/documents/upload" iconName="PlusCircle">
          New Document
        </LinkButton>
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
          <LinkButton href="/documents/upload">
            Upload Document
          </LinkButton>
          <LinkButton href="/documents/create">
            Create Document
          </LinkButton>
          <LinkButton href="/documents" variant="outline">
            View All Documents
          </LinkButton>
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

        {/* Recent Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
            <CardDescription>Recently processed documents</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading documents...</div>}>
              <RecentDocuments />
            </Suspense>
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
          <Suspense fallback={<div>Loading workflows...</div>}>
            <ActiveWorkflows />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

