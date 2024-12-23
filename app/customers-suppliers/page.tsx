"use client"

import { useState } from 'react'
import { Plus, Search, Edit, Trash, Building, Users } from 'lucide-react'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface EconomicModel {
  id: string;
  name: string;
  description: string;
  formula: string;
}

interface Entity {
  id: string;
  name: string;
  type: 'customer' | 'supplier';
  contacts: Contact[];
  economicModels: EconomicModel[];
  address: string;
  notes: string;
  status: 'Active' | 'Inactive';
  industry?: string;
  category?: string;
}

const initialEntities: Entity[] = [
  {
    id: '1',
    name: 'Acme Corp',
    type: 'customer',
    contacts: [
      { id: '1', name: 'John Doe', email: 'john@acme.com', phone: '123-456-7890' },
    ],
    economicModels: [
      { id: '1', name: 'Standard Pricing', description: 'Regular pricing model', formula: 'base_price * quantity' },
    ],
    address: '123 Main St, Anytown, USA',
    notes: 'Key account, priority support',
    status: 'Active',
    industry: 'Technology',
  },
  {
    id: '2',
    name: 'TechGiant Inc',
    type: 'customer',
    contacts: [
      { id: '1', name: 'Jane Smith', email: 'jane@techgiant.com', phone: '987-654-3210' },
    ],
    economicModels: [
      { id: '1', name: 'Enterprise Pricing', description: 'Volume-based pricing for large enterprises', formula: 'base_price * quantity * (1 - volume_discount)' },
    ],
    address: '456 Tech Blvd, Innovation City, USA',
    notes: 'Enterprise client, custom solutions',
    status: 'Active',
    industry: 'Technology',
  },
  {
    id: '3',
    name: 'Supplier Inc',
    type: 'supplier',
    contacts: [
      { id: '1', name: 'Bob Johnson', email: 'bob@supplier.com', phone: '555-123-4567' },
    ],
    economicModels: [
      { id: '1', name: 'Bulk Discount', description: 'Volume-based pricing', formula: 'base_price * quantity * (1 - discount_rate)' },
    ],
    address: '789 Supply Rd, Warehouse City, USA',
    notes: 'Reliable supplier for office equipment',
    status: 'Active',
    category: 'Office Supplies',
  },
  {
    id: '4',
    name: 'Mega Suppliers',
    type: 'supplier',
    contacts: [
      { id: '1', name: 'Alice Brown', email: 'alice@megasuppliers.com', phone: '888-555-1234' },
    ],
    economicModels: [
      { id: '1', name: 'Tiered Pricing', description: 'Pricing based on purchase tiers', formula: 'base_price * quantity - tier_discount' },
    ],
    address: '101 Mega Lane, Supplyton, USA',
    notes: 'Wide range of products, competitive pricing',
    status: 'Active',
    category: 'Various',
  },
]

export default function CustomersSuppliers() {
  const [entities, setEntities] = useState<Entity[]>(initialEntities)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredEntities = entities.filter(entity =>
    entity.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const customers = filteredEntities.filter(entity => entity.type === 'customer')
  const suppliers = filteredEntities.filter(entity => entity.type === 'supplier')

  const handleAddEntity = (newEntity: Entity) => {
    setEntities([...entities, { ...newEntity, id: Date.now().toString() }])
    setIsDialogOpen(false)
  }

  const handleUpdateEntity = (updatedEntity: Entity) => {
    setEntities(entities.map(entity => entity.id === updatedEntity.id ? updatedEntity : entity))
    setIsDialogOpen(false)
  }

  const handleDeleteEntity = (id: string) => {
    setEntities(entities.filter(entity => entity.id !== id))
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customers & Suppliers</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedEntity(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedEntity ? 'Edit' : 'Add'} Customer/Supplier</DialogTitle>
              <DialogDescription>
                Enter the details for the customer or supplier.
              </DialogDescription>
            </DialogHeader>
            <EntityForm
              entity={selectedEntity}
              onSave={(entity) => selectedEntity ? handleUpdateEntity(entity) : handleAddEntity(entity)}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search customers and suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customers</CardTitle>
              <CardDescription>Manage your customer relationships and economic models</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Primary Contact</TableHead>
                    <TableHead>Economic Models</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.industry}</TableCell>
                      <TableCell>
                        <Badge variant={customer.status === "Active" ? "success" : "secondary"}>
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{customer.contacts[0]?.name || 'N/A'}</TableCell>
                      <TableCell>{customer.economicModels.map(model => model.name).join(', ')}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedEntity(customer)
                            setIsDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEntity(customer.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <CardTitle>Suppliers</CardTitle>
              <CardDescription>Manage your supplier relationships and economic models</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Primary Contact</TableHead>
                    <TableHead>Economic Models</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>{supplier.category}</TableCell>
                      <TableCell>
                        <Badge variant={supplier.status === "Active" ? "success" : "secondary"}>
                          {supplier.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{supplier.contacts[0]?.name || 'N/A'}</TableCell>
                      <TableCell>{supplier.economicModels.map(model => model.name).join(', ')}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedEntity(supplier)
                            setIsDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEntity(supplier.id)}
                        >
                          <Trash className="h-4 w-4" />
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
    </div>
  )
}

interface EntityFormProps {
  entity: Entity | null
  onSave: (entity: Entity) => void
  onCancel: () => void
}

function EntityForm({ entity, onSave, onCancel }: EntityFormProps) {
  const [formData, setFormData] = useState<Entity>(
    entity || {
      id: '',
      name: '',
      type: 'customer',
      contacts: [],
      economicModels: [],
      address: '',
      notes: '',
      status: 'Active',
      industry: '',
      category: '',
    }
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSave = () => {
    onSave(formData)
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="type" className="text-right">
            Type
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleSelectChange('type', value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="supplier">Supplier</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {formData.type === 'customer' && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="industry" className="text-right">
              Industry
            </Label>
            <Input
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
        )}
        {formData.type === 'supplier' && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
        )}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">
            Status
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="address" className="text-right">
            Address
          </Label>
          <Textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="notes" className="text-right">
            Notes
          </Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  )
}

