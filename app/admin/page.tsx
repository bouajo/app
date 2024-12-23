"use client"

import { useState } from 'react'
import { Edit, PenTool, Send, Mail, Truck, FileSignature } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

// Mock function to simulate e-signature process
const signDocument = async (provider: string) => {
  // Simulate API call to e-signature service
  await new Promise(resolve => setTimeout(resolve, 2000))
  toast({
    title: "Document Signed",
    description: `Document successfully signed using ${provider}.`,
  })
}

export default function AdminPage() {
  const [selectedFillSignOption, setSelectedFillSignOption] = useState<string | undefined>()
  const [selectedSendOption, setSelectedSendOption] = useState<string | undefined>()

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">Manage and process your documents efficiently</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Edit className="h-5 w-5" />
              <span>Fill & Sign Document</span>
            </CardTitle>
            <CardDescription>Complete and sign your documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select onValueChange={setSelectedFillSignOption}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fill">Fill Document</SelectItem>
                  <SelectItem value="sign">Sign Document</SelectItem>
                  <SelectItem value="both">Fill and Sign</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full" disabled={!selectedFillSignOption}>
                {selectedFillSignOption === 'fill' && <Edit className="mr-2 h-4 w-4" />}
                {selectedFillSignOption === 'sign' && <PenTool className="mr-2 h-4 w-4" />}
                {selectedFillSignOption === 'both' && (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    <PenTool className="mr-2 h-4 w-4" />
                  </>
                )}
                {selectedFillSignOption ? `Proceed to ${selectedFillSignOption}` : 'Select an action'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Send className="h-5 w-5" />
              <span>Send Document</span>
            </CardTitle>
            <CardDescription>Send your document via email or mail</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select onValueChange={setSelectedSendOption}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sending method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Send via Email</SelectItem>
                  <SelectItem value="mail">Send via Postal Mail</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full" disabled={!selectedSendOption}>
                {selectedSendOption === 'email' && <Mail className="mr-2 h-4 w-4" />}
                {selectedSendOption === 'mail' && <Truck className="mr-2 h-4 w-4" />}
                {selectedSendOption ? `Send via ${selectedSendOption}` : 'Select sending method'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileSignature className="h-5 w-5" />
              <span>E-Signature</span>
            </CardTitle>
            <CardDescription>Sign documents electronically</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full">
                    <FileSignature className="mr-2 h-4 w-4" />
                    Sign Document
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => signDocument('DocuSign')}>
                    Sign with DocuSign
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => signDocument('Adobe Sign')}>
                    Sign with Adobe Sign
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => signDocument('Internal E-Signature')}>
                    Use Internal E-Signature
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

