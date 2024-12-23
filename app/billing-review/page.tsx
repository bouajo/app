"use client"

import { useState } from 'react'
import { CalendarIcon, CheckCircle2, XCircle, DollarSign, SettingsIcon } from 'lucide-react'
import { format } from 'date-fns'

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Mock data for demonstration
const billingItems = [
  { id: 1, customer: "Acme Corp", description: "Web Development Services", contractedAmount: 5000, status: "pending", validated: false },
  { id: 2, customer: "TechGiant Inc", description: "Server Maintenance", contractedAmount: 1000, status: "pending", validated: false },
  { id: 3, customer: "MegaSoft Ltd", description: "SEO Optimization", contractedAmount: 2000, status: "pending", validated: false },
  { id: 4, customer: "InnovateCo", description: "Content Creation", contractedAmount: 1500, status: "pending", validated: false },
  { id: 5, customer: "StartUp Hub", description: "UI/UX Design", contractedAmount: 3000, status: "pending", validated: false },
]

interface BillingSettings {
  emailNotification: {
    enabled: boolean;
    recipients: string;
    frequency: 'weekly' | 'monthly';
  };
  economicModel: {
    type: 'standard' | 'enterprise' | 'custom';
    customFormula?: string;
  };
  billingCycle: {
    endOfMonth: boolean;
    specificDate: number | null;
  };
  pricingModel: 'fixed' | 'tiered' | 'usage-based';
}

const standardPricingOptions = [
  { id: 'fixed', label: 'Fixed Pricing', description: 'Set price for a specific service or product' },
  { id: 'tiered', label: 'Tiered Pricing', description: 'Different prices based on usage or quantity levels' },
  { id: 'usage-based', label: 'Usage-Based Pricing', description: 'Price based on actual usage of the service' },
]

export default function BillingReviewPage() {
  const [date, setDate] = useState<Date>()
  const [reviewedItems, setReviewedItems] = useState<number[]>([])
  const [validatedItems, setValidatedItems] = useState<number[]>([])
  const [billingSettings, setBillingSettings] = useState<BillingSettings>({
    emailNotification: {
      enabled: true,
      recipients: 'finance@company.com, manager@company.com',
      frequency: 'monthly',
    },
    economicModel: {
      type: 'standard',
    },
    billingCycle: {
      endOfMonth: true,
      specificDate: null,
    },
    pricingModel: 'fixed',
  })

  const toggleReviewStatus = (id: number) => {
    setReviewedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
    setValidatedItems(prev => prev.filter(item => item !== id))
  }

  const validateItem = (id: number) => {
    setValidatedItems(prev => [...prev, id])
  }

  const getTotalAmount = () => {
    return billingItems.reduce((sum, item) => sum + item.contractedAmount, 0)
  }

  const getReviewedAmount = () => {
    return billingItems
      .filter(item => reviewedItems.includes(item.id))
      .reduce((sum, item) => sum + item.contractedAmount, 0)
  }

  const updateBillingSettings = (
    section: keyof BillingSettings,
    field: string,
    value: any
  ) => {
    setBillingSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Billing Review</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "MMMM yyyy") : <span>Pick a month</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Billable Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getTotalAmount().toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviewed Amount</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getReviewedAmount().toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Reviewed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewedItems.length} / {billingItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Review Status</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {validatedItems.length === billingItems.length ? (
                <Badge className="bg-green-500">Completed</Badge>
              ) : (
                <Badge className="bg-yellow-500">In Progress</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing Items</CardTitle>
          <CardDescription>Review and validate billing items for the selected month</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Reviewed</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Contracted Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={reviewedItems.includes(item.id)}
                      onCheckedChange={() => toggleReviewStatus(item.id)}
                    />
                  </TableCell>
                  <TableCell>{item.customer}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>${item.contractedAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    {validatedItems.includes(item.id) ? (
                      <Badge className="bg-green-500">Validated</Badge>
                    ) : reviewedItems.includes(item.id) ? (
                      <Badge className="bg-blue-500">Reviewed</Badge>
                    ) : (
                      <Badge className="bg-yellow-500">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {validatedItems.includes(item.id) ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toggleReviewStatus(item.id)}
                      >
                        Undo
                      </Button>
                    ) : reviewedItems.includes(item.id) ? (
                      <Button 
                        size="sm" 
                        onClick={() => validateItem(item.id)}
                      >
                        Validate
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        disabled
                      >
                        Review First
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <SettingsIcon className="mr-2 h-5 w-5" />
            Billing Settings
          </CardTitle>
          <CardDescription>Configure billing rules and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="email-notifications">
              <AccordionTrigger>Email Notifications</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={billingSettings.emailNotification.enabled}
                      onCheckedChange={(checked) =>
                        updateBillingSettings('emailNotification', 'enabled', checked)
                      }
                    />
                    <Label htmlFor="email-notifications">Enable email notifications</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-recipients">Recipients</Label>
                    <Input
                      id="email-recipients"
                      value={billingSettings.emailNotification.recipients}
                      onChange={(e) =>
                        updateBillingSettings('emailNotification', 'recipients', e.target.value)
                      }
                      placeholder="Enter email addresses separated by commas"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-frequency">Frequency</Label>
                    <Select
                      value={billingSettings.emailNotification.frequency}
                      onValueChange={(value) =>
                        updateBillingSettings('emailNotification', 'frequency', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="economic-model">
              <AccordionTrigger>Economic Model</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Economic Model Type</Label>
                    <RadioGroup
                      value={billingSettings.economicModel.type}
                      onValueChange={(value) =>
                        updateBillingSettings('economicModel', 'type', value)
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard">Standard</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="enterprise" id="enterprise" />
                        <Label htmlFor="enterprise">Enterprise</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom" id="custom" />
                        <Label htmlFor="custom">Custom</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {billingSettings.economicModel.type === 'custom' && (
                    <div className="space-y-2">
                      <Label htmlFor="economic-formula">Custom Billing Formula</Label>
                      <Textarea
                        id="economic-formula"
                        value={billingSettings.economicModel.customFormula || ''}
                        onChange={(e) =>
                          updateBillingSettings('economicModel', 'customFormula', e.target.value)
                        }
                        placeholder="Enter the custom billing formula (e.g., base_price + (units * unit_price) - discount)"
                      />
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="pricing-model">
              <AccordionTrigger>Pricing Model</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <Label>Select Pricing Model</Label>
                <RadioGroup
                  value={billingSettings.pricingModel}
                  onValueChange={(value) =>
                    updateBillingSettings('pricingModel', value)
                  }
                >
                  {standardPricingOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
                <div className="mt-2 text-sm text-muted-foreground">
                  {standardPricingOptions.find(option => option.id === billingSettings.pricingModel)?.description}
                </div>
              </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="billing-cycle">
              <AccordionTrigger>Billing Cycle</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={billingSettings.billingCycle.endOfMonth}
                      onCheckedChange={(checked) =>
                        updateBillingSettings('billingCycle', 'endOfMonth', checked)
                      }
                    />
                    <Label htmlFor="end-of-month">Bill at the end of the month</Label>
                  </div>
                  {!billingSettings.billingCycle.endOfMonth && (
                    <div className="space-y-2">
                      <Label htmlFor="specific-date">Specific billing date</Label>
                      <Input
                        id="specific-date"
                        type="number"
                        min={1}
                        max={31}
                        value={billingSettings.billingCycle.specificDate || ''}
                        onChange={(e) =>
                          updateBillingSettings('billingCycle', 'specificDate', parseInt(e.target.value) || null)
                        }
                        placeholder="Enter a day of the month (1-31)"
                      />
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          size="lg" 
          disabled={validatedItems.length !== billingItems.length}
        >
          Submit for Billing
        </Button>
      </div>
    </div>
  )
}

