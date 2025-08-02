import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  UserPlus, 
  Eye, 
  Download, 
  QrCode, 
  Shield, 
  Zap,
  ArrowRight,
  Search 
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Student ID Card System
                <span className="block text-blue-600">Bano Qabil</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Generate your professional student ID card with integrated QR code verification system
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild 
                size="lg" 
                className="w-full sm:w-auto text-lg px-8 py-6 h-auto bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/id" className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Find Your ID
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto text-lg px-8 py-6 h-auto border-2 hover:bg-gray-50"
              >
                <Link href="/admin/login" className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Admin Portal
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto" />

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="transform hover:scale-105 transition-all duration-300 border-2"
              >
                <CardHeader>
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Follow these simple steps to get your ID card</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {index !== steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 w-full h-0.5 bg-gray-200 transform translate-y-4" />
                )}
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-white rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-600 text-xl font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Get Your Student ID?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Join your fellow students and get your digital ID card today
          </p>
          <Button 
            asChild 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-6 h-auto bg-white text-blue-600 hover:bg-gray-100"
          >
            <Link href="/id" className="flex items-center gap-2">
              Generate ID Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

const features = [
  {
    title: "Quick Generation",
    description: "Get your ID card in minutes with our streamlined process",
    icon: <Zap className="w-6 h-6 text-blue-600" />,
    bgColor: "bg-blue-100"
  },
  {
    title: "Secure System",
    description: "Your information is protected with enterprise-grade security",
    icon: <Shield className="w-6 h-6 text-green-600" />,
    bgColor: "bg-green-100"
  },
  {
    title: "QR Verification",
    description: "Each ID includes a unique QR code for instant verification",
    icon: <QrCode className="w-6 h-6 text-purple-600" />,
    bgColor: "bg-purple-100"
  }
];

const steps = [
  {
    title: "Enter Details",
    description: "Search for your student record using your name or ID"
  },
  {
    title: "Upload Photo",
    description: "Add your recent photograph for the ID card"
  },
  {
    title: "Preview Card",
    description: "Review your ID card design and information"
  },
  {
    title: "Download",
    description: "Get your digital ID card ready for use"
  }
];
