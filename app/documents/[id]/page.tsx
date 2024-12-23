"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, ArrowLeft, Download, Trash, Tag, Brain, GitBranch, History, Users } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock function to fetch file data
const fetchFileData = async (id: string) => {
  // In a real application, this would be an API call
  return {
    id,
    name: 'Quarterly Report Q2 2023.pdf',
    type: 'PDF',
    size: '2.5 MB',
    modified: '2023-06-15 14:30',
    tag: 'Financial',
    folders: ['Sales', 'Q2 Reports'],
    summary: 'Comprehensive financial report for Q2 2023 including sales figures and projections.',
    content: 'This report provides a detailed analysis of our financial performance in Q2 2023. Key highlights include a 15% increase in revenue, 22% growth in new customer acquisition, and a 5% reduction in operational costs.'
  }
}

// Mock function to simulate AI analysis
const generateAIAnalysis = async (content: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  return {
    keyClauses: [
      { type: 'Revenue', summary: '15% increase in Q2 2023' },
      { type: 'Customer Acquisition', summary: '22% growth in new customers' },
      { type: 'Operational Costs', summary: '5% reduction achieved' }
    ],
    riskRating: 'Low',
    obligations: ['Maintain growth trajectory', 'Monitor customer retention']
  }
}

// Mock function to fetch version history
const fetchVersionHistory = async (id: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  return [
    { id: 'v3', version: 3, date: '2023-06-15 14:30', author: 'John Doe' },
    { id: 'v2', version: 2, date: '2023-06-14 11:45', author: 'Jane Smith' },
    { id: 'v1', version: 1, date: '2023-06-13 09:20', author: 'John Doe' },
  ]
}

// Mock function to restore a version
const restoreVersion = async (documentId: string, versionId: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  toast({
    title: "Version Restored",
    description: `Document restored to version ${versionId}.`,
  })
}

// Mock function to get active users
const getActiveUsers = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return [
    { id: 'user1', name: 'John Doe', avatar: '/placeholder-user.jpg' },
    { id: 'user2', name: 'Jane Smith', avatar: '/placeholder-user.jpg' },
  ]
}

export default function DocumentPreviewPage({ params }: { params: { id: string } }) {
  const [file, setFile] = useState<any>(null)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [versionHistory, setVersionHistory] = useState<any[]>([])
  const [activeUsers, setActiveUsers] = useState<any[]>([])
  const router = useRouter()
  const [workflowStatus, setWorkflowStatus] = useState({
    currentStep: 'Review',
    workflow: 'Contract Approval',
    progress: 50,
  })

  useEffect(() => {
    fetchFileData(params.id).then(setFile)
    fetchVersionHistory(params.id).then(setVersionHistory)
    getActiveUsers().then(setActiveUsers)

    // Simulate WebSocket connection for live updates
    const interval = setInterval(() => {
      getActiveUsers().then(setActiveUsers)
    }, 5000)

    return () => clearInterval(interval)
  }, [params.id])

  const handleGenerateAnalysis = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    const intervalId = setInterval(() => {
      setAnalysisProgress(prev => Math.min(prev + 10, 90))
    }, 200)

    try {
      const analysis = await generateAIAnalysis(file.content)
      setAiAnalysis(analysis)
      setAnalysisProgress(100)
      toast({
        title: "Analysis Complete",
        description: "AI has finished analyzing the document.",
      })
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "An error occurred during the analysis.",
        variant: "destructive",
      })
    } finally {
      clearInterval(intervalId)
      setIsAnalyzing(false)
    }
  }

  const handleRestoreVersion = async (versionId: string) => {
    await restoreVersion(params.id, versionId)
    // In a real application, you would refetch the file data here
    fetchFileData(params.id).then(setFile)
  }

  if (!file) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen">
      {/* Left side - File Preview */}
      <div className="w-2/3 p-4 border-r">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Documents
        </Button>
        <div className="bg-gray-100 rounded-lg h-[calc(100%-60px)] flex items-center justify-center">
          <FileText className="h-24 w-24 text-gray-400" />
          {/* In a real application, you would render the actual file preview here */}
        </div>
      </div>

      {/* Right side - File Information */}
      <div className="w-1/3 p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">{file.name}</h1>
        <div className="flex items-center space-x-2 mb-4">
          {activeUsers.map(user => (
            <Avatar key={user.id} className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
          ))}
          <span className="text-sm text-muted-foreground">{activeUsers.length} active user(s)</span>
        </div>
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>File Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="font-medium">Type:</dt>
                    <dd>{file.type}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Size:</dt>
                    <dd>{file.size}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Modified:</dt>
                    <dd>{file.modified}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Tag:</dt>
                    <dd>
                      <Badge variant="secondary" className="flex items-center">
                        <Tag className="mr-1 h-3 w-3" />
                        {file.tag}
                      </Badge>
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Folders:</dt>
                    <dd>{file.folders.join(', ')}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{file.summary}</p>
              </CardContent>
            </Card>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Content Preview</CardTitle>
                <CardDescription>First 200 characters</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{file.content.slice(0, 200)}...</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!aiAnalysis && !isAnalyzing && (
                  <Button onClick={handleGenerateAnalysis}>
                    Generate Analysis
                  </Button>
                )}
                {isAnalyzing && (
                  <div className="space-y-2">
                    <Progress value={analysisProgress} className="w-full" />
                    <p className="text-sm text-muted-foreground">Analyzing document...</p>
                  </div>
                )}
                {aiAnalysis && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Key Clauses:</h4>
                      <ul className="list-disc pl-5">
                        {aiAnalysis.keyClauses.map((clause: any, index: number) => (
                          <li key={index}>
                            <span className="font-medium">{clause.type}:</span> {clause.summary}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Risk Rating:</h4>
                      <Badge variant={aiAnalysis.riskRating.toLowerCase() === 'low' ? 'success' : 'destructive'}>
                        {aiAnalysis.riskRating}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Obligations:</h4>
                      <ul className="list-disc pl-5">
                        {aiAnalysis.obligations.map((obligation: string, index: number) => (
                          <li key={index}>{obligation}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="workflow">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GitBranch className="mr-2 h-5 w-5" />
                  Workflow Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Current Step:</span>
                    <Badge>{workflowStatus.currentStep}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Workflow:</span>
                    <span>{workflowStatus.workflow}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{workflowStatus.progress}%</span>
                    </div>
                    <Progress value={workflowStatus.progress} className="w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="mr-2 h-5 w-5" />
                  Version History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Version</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {versionHistory.map((version) => (
                      <TableRow key={version.id}>
                        <TableCell>{version.version}</TableCell>
                        <TableCell>{version.date}</TableCell>
                        <TableCell>{version.author}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestoreVersion(version.id)}
                          >
                            Restore
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="flex space-x-2 mt-4">
          <Button className="flex-1">
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
          <Button variant="destructive" className="flex-1">
            <Trash className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

