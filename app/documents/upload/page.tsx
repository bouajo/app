"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, FileText, Folder, X } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

// Mock function to simulate AI classification
const classifyDocument = async (file: File) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    suggestedCategory: ['Financial Report', 'Contract', 'Invoice', 'Proposal', 'Other'][Math.floor(Math.random() * 5)],
    confidence: Math.random() * 0.5 + 0.5 // Random confidence between 0.5 and 1
  }
}

interface FileWithPath extends File {
  path?: string;
}

export default function UploadPage() {
  const [files, setFiles] = useState<FileWithPath[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [classifications, setClassifications] = useState<{ [key: string]: { suggestedCategory: string, confidence: number } }>({})
  const [selectedCategories, setSelectedCategories] = useState<{ [key: string]: string }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files) as FileWithPath[]
      setFiles(prevFiles => [...prevFiles, ...newFiles])
    }
  }

  const handleFolderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files) as FileWithPath[]
      newFiles.forEach(file => {
        file.path = (file as any).webkitRelativePath
      })
      setFiles(prevFiles => [...prevFiles, ...newFiles])
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
    setClassifications(prevClassifications => {
      const newClassifications = { ...prevClassifications }
      delete newClassifications[index]
      return newClassifications
    })
    setSelectedCategories(prevCategories => {
      const newCategories = { ...prevCategories }
      delete newCategories[index]
      return newCategories
    })
  }

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault()
    if (files.length === 0) return

    setUploading(true)
    setUploadProgress(0)

    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(uploadInterval)
          return 90
        }
        return prev + 10
      })
    }, 500)

    try {
      const classificationResults = await Promise.all(files.map(classifyDocument))
      const newClassifications: { [key: string]: { suggestedCategory: string, confidence: number } } = {}
      const newSelectedCategories: { [key: string]: string } = {}

      classificationResults.forEach((result, index) => {
        newClassifications[index] = result
        newSelectedCategories[index] = result.suggestedCategory
      })

      setClassifications(newClassifications)
      setSelectedCategories(newSelectedCategories)
      setUploadProgress(100)
      toast({
        title: "Classification Complete",
        description: `${files.length} file(s) classified successfully.`,
      })
    } catch (error) {
      console.error("Error classifying documents:", error)
      toast({
        title: "Classification Failed",
        description: "An error occurred while classifying the documents.",
        variant: "destructive",
      })
    } finally {
      clearInterval(uploadInterval)
      setUploading(false)
    }
  }

  const handleConfirmUpload = () => {
    // Here you would typically send the files and selected categories to your backend
    console.log("Uploading files:", files.map(f => f.name))
    console.log("Selected categories:", selectedCategories)
    toast({
      title: "Upload Successful",
      description: `${files.length} file(s) uploaded successfully.`,
    })
    router.push("/documents")
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <h1 className="text-3xl font-bold tracking-tight">Upload Documents</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upload new documents</CardTitle>
          <CardDescription>Choose files or folders to upload to your document library</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  ref={fileInputRef}
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Select Files
                </Button>
              </div>
              <div className="flex-1">
                <Input
                  ref={folderInputRef}
                  id="folder"
                  type="file"
                  onChange={handleFolderChange}
                  webkitdirectory="true"
                  multiple
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => folderInputRef.current?.click()}
                >
                  <Folder className="mr-2 h-4 w-4" />
                  Select Folder
                </Button>
              </div>
            </div>
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="font-semibold">Selected Files:</h3>
                <ul className="max-h-40 overflow-y-auto">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between py-1">
                      <span className="truncate">{file.path || file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {!uploading && Object.keys(classifications).length === 0 && (
              <Button type="submit" disabled={files.length === 0}>
                <Upload className="mr-2 h-4 w-4" />
                Classify Documents
              </Button>
            )}
          </form>
          {uploading && (
            <div className="mt-4 space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-muted-foreground">Classifying documents...</p>
            </div>
          )}
          {Object.keys(classifications).length > 0 && (
            <div className="mt-4 space-y-4">
              <h3 className="font-semibold">AI Classification Results:</h3>
              {files.map((file, index) => (
                <div key={index} className="space-y-2">
                  <p className="font-medium">{file.path || file.name}</p>
                  <p>Suggested Category: {classifications[index].suggestedCategory}</p>
                  <p>Confidence: {(classifications[index].confidence * 100).toFixed(2)}%</p>
                  <div className="space-y-2">
                    <Label htmlFor={`category-${index}`}>Confirm or change category:</Label>
                    <Select
                      value={selectedCategories[index]}
                      onValueChange={(value) => setSelectedCategories(prev => ({ ...prev, [index]: value }))}
                    >
                      <SelectTrigger id={`category-${index}`}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Financial Report">Financial Report</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Invoice">Invoice</SelectItem>
                        <SelectItem value="Proposal">Proposal</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              <Button onClick={handleConfirmUpload}>
                <FileText className="mr-2 h-4 w-4" />
                Confirm and Save All
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

