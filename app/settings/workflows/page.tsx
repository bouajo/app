"use client"

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Plus, Trash2, Save } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface WorkflowStep {
  id: string
  name: string
}

interface Workflow {
  id: string
  name: string
  documentType: string
  steps: WorkflowStep[]
}

const initialWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Contract Approval',
    documentType: 'Contract',
    steps: [
      { id: 'step1', name: 'Draft' },
      { id: 'step2', name: 'Review' },
      { id: 'step3', name: 'Approval' },
      { id: 'step4', name: 'Signed' },
    ],
  },
]

export default function WorkflowSettingsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows)
  const [newWorkflowName, setNewWorkflowName] = useState('')
  const [newWorkflowType, setNewWorkflowType] = useState('')
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null)
  const [newStepName, setNewStepName] = useState('')

  const handleAddWorkflow = () => {
    if (newWorkflowName && newWorkflowType) {
      const newWorkflow: Workflow = {
        id: Date.now().toString(),
        name: newWorkflowName,
        documentType: newWorkflowType,
        steps: [],
      }
      setWorkflows([...workflows, newWorkflow])
      setNewWorkflowName('')
      setNewWorkflowType('')
      toast({
        title: "Workflow Added",
        description: `New workflow "${newWorkflowName}" has been created.`,
      })
    }
  }

  const handleEditWorkflow = (workflow: Workflow) => {
    setEditingWorkflow(workflow)
  }

  const handleAddStep = () => {
    if (editingWorkflow && newStepName) {
      const newStep: WorkflowStep = {
        id: Date.now().toString(),
        name: newStepName,
      }
      setEditingWorkflow({
        ...editingWorkflow,
        steps: [...editingWorkflow.steps, newStep],
      })
      setNewStepName('')
    }
  }

  const handleRemoveStep = (stepId: string) => {
    if (editingWorkflow) {
      setEditingWorkflow({
        ...editingWorkflow,
        steps: editingWorkflow.steps.filter(step => step.id !== stepId),
      })
    }
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !editingWorkflow) return

    const steps = Array.from(editingWorkflow.steps)
    const [reorderedStep] = steps.splice(result.source.index, 1)
    steps.splice(result.destination.index, 0, reorderedStep)

    setEditingWorkflow({
      ...editingWorkflow,
      steps: steps,
    })
  }

  const handleSaveWorkflow = () => {
    if (editingWorkflow) {
      setWorkflows(workflows.map(w => w.id === editingWorkflow.id ? editingWorkflow : w))
      setEditingWorkflow(null)
      toast({
        title: "Workflow Saved",
        description: `Workflow "${editingWorkflow.name}" has been updated.`,
      })
    }
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <h1 className="text-3xl font-bold tracking-tight">Workflow Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Add New Workflow</CardTitle>
          <CardDescription>Create a new workflow for document processing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="workflow-name">Workflow Name</Label>
              <Input
                id="workflow-name"
                value={newWorkflowName}
                onChange={(e) => setNewWorkflowName(e.target.value)}
                placeholder="Enter workflow name"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="document-type">Document Type</Label>
              <Select value={newWorkflowType} onValueChange={setNewWorkflowType}>
                <SelectTrigger id="document-type">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Invoice">Invoice</SelectItem>
                  <SelectItem value="Proposal">Proposal</SelectItem>
                  <SelectItem value="Report">Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="mt-4" onClick={handleAddWorkflow}>
            <Plus className="mr-2 h-4 w-4" /> Add Workflow
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Workflows</CardTitle>
          <CardDescription>Manage and edit your existing workflows</CardDescription>
        </CardHeader>
        <CardContent>
          {workflows.map(workflow => (
            <div key={workflow.id} className="mb-4 p-4 border rounded">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{workflow.name}</h3>
                <Button variant="outline" onClick={() => handleEditWorkflow(workflow)}>Edit</Button>
              </div>
              <p>Document Type: {workflow.documentType}</p>
              <p>Steps: {workflow.steps.map(step => step.name).join(' → ')}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {editingWorkflow && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Workflow: {editingWorkflow.name}</CardTitle>
            <CardDescription>Drag and drop to reorder steps</CardDescription>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="steps">
                {(provided) => (
                  <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {editingWorkflow.steps.map((step, index) => (
                      <Draggable key={step.id} draggableId={step.id} index={index}>
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex items-center justify-between p-2 bg-gray-100 rounded"
                          >
                            <span>{step.name}</span>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveStep(step.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
            <div className="mt-4 flex space-x-2">
              <Input
                value={newStepName}
                onChange={(e) => setNewStepName(e.target.value)}
                placeholder="New step name"
              />
              <Button onClick={handleAddStep}>Add Step</Button>
            </div>
            <Button className="mt-4" onClick={handleSaveWorkflow}>
              <Save className="mr-2 h-4 w-4" /> Save Workflow
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

