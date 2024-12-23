"use client"

import { useState } from 'react'
import { Gavel, FileText, PlusCircle, Search, Building } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for demonstration
const contracts = [
  { id: 1, name: "Service Agreement - Acme Corp", type: "Service", status: "Active", expiration: "2023-12-31" },
  { id: 2, name: "NDA - TechGiant Inc", type: "NDA", status: "Pending Review", expiration: "2024-06-30" },
  { id: 3, name: "License Agreement - SoftCo", type: "License", status: "Expired", expiration: "2023-05-31" },
  { id: 4, name: "Supply Agreement - Mega Suppliers", type: "Supply", status: "Active", expiration: "2025-01-15" },
]

const suppliers = [
  { id: 1, name: "Acme Corp", category: "IT Services", status: "Approved" },
  { id: 2, name: "TechGiant Inc", category: "Hardware", status: "Under Review" },
  { id: 3, name: "Mega Suppliers", category: "Office Supplies", status: "Approved" },
  { id: 4, name: "InnovateCo", category: "Software", status: "Pending Approval" },
]

const customers = [
  { id: 1, name: "Acme Corp", industry: "Technology", status: "Active" },
  { id: 2, name: "TechGiant Inc", industry: "Technology", status: "Active" },
  { id: 3, name: "SoftCo", industry: "Software", status: "Inactive" },
  { id: 4, name: "Mega Suppliers", industry: "Retail", status: "Active" },
  { id: 5, name: "InnovateCo", industry: "Technology", status: "Active" },
]

const templates = [
  { id: '1', name: 'Service Agreement Template' },
  { id: '2', name: 'Non-Disclosure Agreement Template' },
  { id: '3', name: 'License Agreement Template' },
  { id: '4', name: 'Supply Agreement Template' },
]

export default function LegalPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [showContractInfo, setShowContractInfo] = useState(false)
  const [newContract, setNewContract] = useState({
    customerName: '',
    contractType: '',
    templateUsed: '',
    involvedPeople: ''
  })

  const filteredContracts = contracts.filter(contract => 
    contract.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === "all" || contract.type.toLowerCase() === filterType.toLowerCase())
  )

  const handleNewContractChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewContract({
      ...newContract,
      [e.target.name]: e.target.value
    })
  }

  const handleNextClick = () => {
    setShowContractInfo(true)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Legal Dashboard</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Draft New Contract
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Draft New Contract</DialogTitle>
              <DialogDescription>
                Enter the details for the new contract.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customerName" className="text-right">
                  Customer Name
                </Label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={newContract.customerName}
                  onChange={handleNewContractChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contractType" className="text-right">
                  Contract Type
                </Label>
                <Select name="contractType" onValueChange={(value) => handleNewContractChange({ target: { name: 'contractType', value } } as any)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select contract type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service">Service Agreement</SelectItem>
                    <SelectItem value="nda">Non-Disclosure Agreement</SelectItem>
                    <SelectItem value="license">License Agreement</SelectItem>
                    <SelectItem value="supply">Supply Agreement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="templateUsed" className="text-right">
                  Template Used
                </Label>
                <Select name="templateUsed" onValueChange={(value) => handleNewContractChange({ target: { name: 'templateUsed', value } } as any)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="involvedPeople" className="text-right">
                  Involved People
                </Label>
                <Input
                  id="involvedPeople"
                  name="involvedPeople"
                  value={newContract.involvedPeople}
                  onChange={handleNewContractChange}
                  className="col-span-3"
                  placeholder="Name <email@example.com>, Name <email@example.com>"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleNextClick}>Next</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={showContractInfo} onOpenChange={setShowContractInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contract Information</DialogTitle>
            <DialogDescription>
              Enter the specific details for the contract.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea placeholder="Enter contract details here..." rows={10} />
          </div>
          <DialogFooter>
            <Button onClick={() => setShowContractInfo(false)}>Save Draft</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Contracts
            </CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contracts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contracts.filter(c => c.status === "Pending Review").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Suppliers
            </CardTitle>
            {/* <Users className="h-4 w-4 text-muted-foreground" /> */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contracts</CardTitle>
          <CardDescription>Manage and review all contracts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="Search contracts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="nda">NDA</SelectItem>
                <SelectItem value="license">License</SelectItem>
                <SelectItem value="supply">Supply</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.name}</TableCell>
                  <TableCell>{contract.type}</TableCell>
                  <TableCell>
                    <Badge variant={contract.status === "Active" ? "success" : contract.status === "Pending Review" ? "warning" : "destructive"}>
                      {contract.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{contract.expiration}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">View</Button>
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

