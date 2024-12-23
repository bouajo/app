"use client"

import { useState } from 'react'
import Link from "next/link"
import { Plus, FileText, MoreHorizontal, ChevronRight, ChevronDown, Folder, Tag, Check, Edit, Trash, Search } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

interface UserRights {
  view: string[]; // user IDs or roles that can view
  edit: string[]; // user IDs or roles that can edit
}

interface Folder {
  id: string;
  name: string;
  children: Folder[];
  rights: UserRights;
}

interface File {
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string;
  tag: string;
  folders: string[];
  summary: string;
  content: string;
  status: 'not processed' | 'in progress' | 'completed';
  rights: UserRights;
}

const currentUser = {
  id: '1',
  name: 'John Doe',
  role: 'admin'
};

const initialFolders: Folder[] = [
  { 
    id: '1', 
    name: 'Sales', 
    children: [
      { id: '1a', name: 'Q1 Reports', children: [], rights: { view: ['admin', 'sales'], edit: ['admin'] } },
      { id: '1b', name: 'Q2 Reports', children: [], rights: { view: ['admin', 'sales'], edit: ['admin'] } },
    ],
    rights: { view: ['admin', 'sales'], edit: ['admin'] }
  },
  { id: '2', name: 'Suppliers', children: [
    { id: '2a', name: 'Contracts', children: [], rights: { view: ['admin', 'purchasing'], edit: ['admin'] } },
    { id: '2b', name: 'Invoices', children: [], rights: { view: ['admin', 'accounting'], edit: ['admin'] } },
  ], rights: { view: ['admin', 'purchasing'], edit: ['admin'] } },
  { id: '3', name: 'Internal', children: [
    { id: '3a', name: 'HR', children: [], rights: { view: ['admin', 'hr'], edit: ['admin'] } },
    { id: '3b', name: 'Finance', children: [], rights: { view: ['admin', 'finance'], edit: ['admin'] } },
  ], rights: { view: ['admin', 'hr', 'finance'], edit: ['admin'] } },
  { id: '4', name: 'Board Meetings', children: [
    { id: '4a', name: '2023', children: [], rights: { view: ['admin', 'board'], edit: ['admin'] } },
    { id: '4b', name: '2022', children: [], rights: { view: ['admin', 'board'], edit: ['admin'] } },
  ], rights: { view: ['admin', 'board'], edit: ['admin'] } },
]

const initialFiles: File[] = [
  { 
    id: '1',
    name: 'Quarterly Report Q2 2023.pdf', 
    type: 'PDF', 
    size: '2.5 MB', 
    modified: '2023-06-15 14:30',
    tag: 'Financial',
    folders: ['Sales', 'Q2 Reports'],
    summary: 'Comprehensive financial report for Q2 2023 including sales figures and projections.',
    content: 'This report provides a detailed analysis of our financial performance in Q2 2023. Key highlights include a 15% increase in revenue, 22% growth in new customer acquisition, and a 5% reduction in operational costs.',
    status: 'not processed',
    rights: { view: ['admin', 'sales'], edit: ['admin'] }
  },
  { 
    id: '2',
    name: 'Supplier Agreement.docx', 
    type: 'DOCX', 
    size: '1.8 MB', 
    modified: '2023-06-14 09:45',
    tag: 'Legal',
    folders: ['Suppliers', 'Contracts'],
    summary: 'Standard agreement template for new suppliers, including terms and conditions.',
    content: 'This document outlines our standard terms and conditions for supplier agreements. It covers payment terms, delivery expectations, quality standards, and dispute resolution procedures.',
    status: 'completed',
    rights: { view: ['admin', 'purchasing', 'legal'], edit: ['admin', 'legal'] }
  },
  { 
    id: '3',
    name: 'Financial Projections.xlsx', 
    type: 'XLSX', 
    size: '3.2 MB', 
    modified: '2023-06-13 16:20',
    tag: 'Financial',
    folders: ['Internal', 'Finance'],
    summary: 'Detailed financial projections for the next fiscal year, including budget allocations.',
    content: 'This spreadsheet contains our financial projections for the upcoming fiscal year. It includes detailed budget allocations for each department, revenue forecasts, and expense predictions based on historical data and growth projections.',
    status: 'in progress',
    rights: { view: ['admin', 'finance'], edit: ['admin'] }
  },
]

export default function DocumentsPage() {
  const [folders, setFolders] = useState<Folder[]>(initialFolders)
  const [files, setFiles] = useState<File[]>(initialFiles)
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [newFolderName, setNewFolderName] = useState("")
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null)
  const [isAddingFolder, setIsAddingFolder] = useState(false)
  const [movingFile, setMovingFile] = useState<File | null>(null)
  const [selectedFolder, setSelectedFolder] = useState<string[]>([])

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    )
  }

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on:`, selectedFiles)
    toast({
      title: "Bulk Action",
      description: `${action} performed on ${selectedFiles.length} files.`,
    })
    setSelectedFiles([])
  }

  const addFolder = () => {
    if (newFolderName.trim() === "") return
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      children: [],
      rights: { view: [currentUser.id], edit: [currentUser.id] }
    }
    setFolders([...folders, newFolder])
    setNewFolderName("")
    setIsAddingFolder(false)
    toast({
      title: "Folder Added",
      description: `New folder "${newFolderName}" has been created.`,
    })
  }

  const updateFolder = () => {
    if (!editingFolder || editingFolder.name.trim() === "") return
    setFolders(folders.map(folder => 
      folder.id === editingFolder.id ? editingFolder : folder
    ))
    setEditingFolder(null)
    toast({
      title: "Folder Updated",
      description: `Folder "${editingFolder.name}" has been updated.`,
    })
  }

  const deleteFolder = (folderId: string) => {
    setFolders(folders.filter(folder => folder.id !== folderId))
    toast({
      title: "Folder Deleted",
      description: "The selected folder has been deleted.",
    })
  }

  const runAnalysis = (fileId: string) => {
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === fileId 
          ? { ...file, status: 'in progress' as const } 
          : file
      )
    )
    toast({
      title: "Analysis Started",
      description: "Document analysis has been initiated. Results will be available shortly.",
    })
    // Simulate analysis completion after 3 seconds
    setTimeout(() => {
      setFiles(prevFiles => 
        prevFiles.map(file => 
          file.id === fileId 
            ? { ...file, status: 'completed' as const } 
            : file
        )
      )
      toast({
        title: "Analysis Completed",
        description: "Document analysis has been completed.",
      })
    }, 3000)
  }

  const moveFile = (file: File, newFolders: string[]) => {
    setFiles(files.map(f => 
      f.id === file.id ? { ...f, folders: newFolders } : f
    ))
    setMovingFile(null)
    setSelectedFolder([])
    toast({
      title: "File Moved",
      description: `"${file.name}" has been moved to ${newFolders.join(', ')}.`,
    })
  }

  const hasUserRights = (rights: UserRights, action: 'view' | 'edit'): boolean => {
    return rights[action].includes(currentUser.id) || rights[action].includes(currentUser.role);
  }

  const renderFolder = (folder: Folder) => {
    if (!hasUserRights(folder.rights, 'view')) return null;

    const isExpanded = expandedFolders.includes(folder.id)
    const folderFiles = files.filter(file => file.folders.includes(folder.name) && hasUserRights(file.rights, 'view'))
    return (
      <div key={folder.id} className="mb-1">
        <div className="flex items-center justify-between">
          <button
            className="flex items-center w-full text-left py-1 px-2 hover:bg-gray-100 rounded"
            onClick={() => toggleFolder(folder.id)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 mr-1" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-1" />
            )}
            <Folder className="h-4 w-4 mr-2" />
            {folder.name}
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {hasUserRights(folder.rights, 'edit') && (
                <DropdownMenuItem onClick={() => setEditingFolder(folder)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="flex w-full items-center px-2 py-1.5 text-sm text-red-600 hover:bg-red-100">
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        folder and all its contents.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteFolder(folder.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {isExpanded && (
          <div className="ml-4 mt-1">
            {folderFiles.map(file => (
              <Link href={`/documents/${file.id}`} key={file.id}>
                <div className="flex items-center py-1 px-2 hover:bg-gray-100 rounded">
                  <FileText className="h-4 w-4 mr-2" />
                  {file.name}
                </div>
              </Link>
            ))}
            {folder.children.map(child => renderFolder(child))}
          </div>
        )}
      </div>
    )
  }

  const flattenFolders = (folders: Folder[]): string[] => {
    return folders.reduce((acc, folder) => {
      return [...acc, folder.name, ...flattenFolders(folder.children)]
    }, [] as string[])
  }

  const allFolders = flattenFolders(folders)

  const getStatusBadge = (status: File['status']) => {
    switch (status) {
      case 'not processed':
        return <Badge variant="secondary">Not Processed</Badge>
      case 'in progress':
        return <Badge variant="warning">In Progress</Badge>
      case 'completed':
        return <Badge variant="success">Completed</Badge>
    }
  }

  return (
    <div className="h-screen overflow-hidden">
      <div className="flex h-full">
        {/* Folder Directory */}
        <div className="w-1/5 border-r p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Folders</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingFolder(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> New
            </Button>
          </div>
          <div className="space-y-1">
            {folders.map(renderFolder)}
          </div>
          {isAddingFolder && (
            <div className="mt-4 space-y-2">
              <Input
                placeholder="New folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingFolder(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={addFolder}>
                  Add Folder
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* File List */}
        <div className="flex-1 p-8 overflow-y-auto h-full">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <Button asChild>
              <Link href="/documents/upload">
                <Plus className="mr-2 h-4 w-4" /> Upload Document
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <Input
              placeholder="Search documents..."
              className="max-w-sm"
            />
          </div>
          {selectedFiles.length > 0 && (
            <div className="mb-4 flex items-center gap-2">
              <span>{selectedFiles.length} files selected</span>
              <Button onClick={() => handleBulkAction('download')} variant="outline" size="sm">Download</Button>
              <Button onClick={() => handleBulkAction('delete')} variant="outline" size="sm">Delete</Button>
              <Button onClick={() => setSelectedFiles([])} variant="outline" size="sm">Clear Selection</Button>
            </div>
          )}
          <div className="rounded-lg border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30px]">
                    <Checkbox
                      checked={selectedFiles.length === files.length}
                      onCheckedChange={(checked) => {
                        setSelectedFiles(checked ? files.map(f => f.id) : [])
                      }}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="w-[300px]">Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead>Tag</TableHead>
                  <TableHead>Folders</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[200px]">Summary</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.filter(file => hasUserRights(file.rights, 'view')).map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedFiles.includes(file.id)}
                        onCheckedChange={() => toggleFileSelection(file.id)}
                        aria-label={`Select ${file.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link href={`/documents/${file.id}`} className="flex items-center hover:underline">
                        <FileText className="mr-2 h-4 w-4" />
                        {file.name}
                      </Link>
                    </TableCell>
                    <TableCell>{file.type}</TableCell>
                    <TableCell>{file.size}</TableCell>
                    <TableCell>{file.modified}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        <Tag className="mr-1 h-3 w-3" />
                        {file.tag}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMovingFile(file)}
                      >
                        {file.folders.join(', ')}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(file.status)}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">View Summary</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>{file.name}</DialogTitle>
                            <DialogDescription>
                              Document Summary and Key Information
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Type:</span>
                              <span className="col-span-3">{file.type}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Size:</span>
                              <span className="col-span-3">{file.size}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Modified:</span>
                              <span className="col-span-3">{file.modified}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Tag:</span>
                              <span className="col-span-3">{file.tag}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Folders:</span>
                              <span className="col-span-3">{file.folders.join(', ')}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Status:</span>
                              <span className="col-span-3">{file.status}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Summary:</span>
                              <span className="col-span-3">{file.summary}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Content:</span>
                              <span className="col-span-3">{file.content}</span>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View</DropdownMenuItem>
                          <DropdownMenuItem>Download</DropdownMenuItem>
                          {hasUserRights(file.rights, 'edit') && <DropdownMenuItem>Rename</DropdownMenuItem>}
                          {hasUserRights(file.rights, 'edit') && <DropdownMenuItem onClick={() => runAnalysis(file.id)}>Run Analysis</DropdownMenuItem>}
                          <DropdownMenuSeparator />
                          {hasUserRights(file.rights, 'edit') && <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Edit Folder Dialog */}
      <Dialog open={!!editingFolder} onOpenChange={() => setEditingFolder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={editingFolder?.name || ""}
              onChange={(e) => setEditingFolder(prev => prev ? {...prev, name: e.target.value} : null)}
              placeholder="Folder name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingFolder(null)}>Cancel</Button>
            <Button onClick={updateFolder}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move File Dialog */}
      <Dialog open={!!movingFile} onOpenChange={() => { setMovingFile(null); setSelectedFolder([]); }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Move File</DialogTitle>
            <DialogDescription>
              Select the folders where you want to move "{movingFile?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Command>
              <CommandInput placeholder="Search folders..." />
              <CommandList>
                <CommandEmpty>No folders found.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-72">
                    {allFolders.map((folder) => (
                      <CommandItem
                        key={folder}
                        onSelect={() => {
                          setSelectedFolder(prev => 
                            prev.includes(folder) 
                              ? prev.filter(f => f !== folder)
                              : [...prev, folder]
                          )
                        }}
                      >
                        <Checkbox
                          checked={selectedFolder.includes(folder)}
                          className="mr-2"
                        />
                        {folder}
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setMovingFile(null); setSelectedFolder([]); }}>Cancel</Button>
            <Button onClick={() => movingFile && moveFile(movingFile, selectedFolder)}>Move File</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

