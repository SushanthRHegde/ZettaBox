import React from 'react';
import { Calculator, Key, Ruler, QrCode, FileUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const tools = [
  {
    title: 'Currency Converter',
    description: 'Convert between different currencies with real-time exchange rates',
    icon: Calculator,
    href: '/utility/currency-converter',
    color: 'text-green-500',
  },
  {
    title: 'Unit Converter',
    description: 'Convert between different units of length, weight, temperature, and more',
    icon: Ruler,
    href: '/utility/unit-converter',
    color: 'text-blue-500',
  },
  {
    title: 'Password Generator',
    description: 'Generate secure and customizable passwords',
    icon: Key,
    href: '/utility/password-generator',
    color: 'text-purple-500',
  },
  {
    title: 'QR Code',
    description: 'Generate QR codes for links, text, or contact info, and scan QR codes',
    icon: QrCode,
    href: '/utility/qr-code',
    color: 'text-orange-500',
  },
  {
    title: 'PDF Tools',
    description: 'Merge multiple PDFs into one file or split a PDF into individual pages',
    icon: FileUp,
    href: '/utility/pdf-tools',
    color: 'text-red-500',
  },
];

const UtilityPage = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Header Section */}
      <header className="space-y-3 sm:space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold">Utility Tools</h1>
        <p className="text-lg sm:text-xl text-muted-foreground">
          A collection of useful utility tools to help with everyday tasks
        </p>
      </header>

      {/* Tools Grid */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              to={tool.href}
              className="group relative rounded-lg border p-6 hover:border-primary transition-all duration-200 hover:shadow-md bg-card"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-card ${tool.color} bg-opacity-10`}>
                    <tool.icon className={`h-6 w-6 ${tool.color} transition-transform group-hover:scale-110`} />
                  </div>
                  <h3 className="font-semibold text-lg">{tool.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="mt-8">
        <div className="rounded-lg border p-6 bg-card/50">
          <h2 className="text-xl font-semibold mb-2">More Tools Coming Soon</h2>
          <p className="text-muted-foreground">
            We're working on adding more utility tools to help you be more productive.
            Stay tuned for updates!
          </p>
        </div>
      </section>
    </div>
  );
};

export default UtilityPage;