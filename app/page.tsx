import Link from "next/link"
import { FileText, Zap, PenTool, Library } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-foreground text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Intelligent Document Management System</h1>
          <p className="text-xl mb-8">Streamline your workflow with AI-powered document processing</p>
          <Button size="lg" asChild className="bg-white text-primary hover:bg-gray-100">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>AI-Powered Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Extract insights from your documents using advanced AI algorithms</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <PenTool className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Document Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Create professional documents with intelligent templates</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Library className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Template Library</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Access a wide range of customizable document templates</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Secure Storage</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Store and manage your documents with enterprise-grade security</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Document Workflow?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied users and experience the power of our DMS</p>
          <Button size="lg" asChild>
            <Link href="/dashboard">Start Free Trial</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-200 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 Document Management System. All rights reserved.</p>
          <div className="mt-2">
            <Link href="/contact" className="text-primary hover:underline">Contact Us</Link>
            <span className="mx-2">|</span>
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

