import { Card } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold mb-6">About</h1>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">About This Project</h2>
        <p className="mb-4">
          This is a demonstration project showcasing the integration of Next.js with TypeScript, RippleUI components
          from Tailwind CSS, and AJAX requests using the JavaScript fetch API.
        </p>
        <p>
          The application demonstrates how to create responsive UI components with RippleUI and how to fetch and submit
          data using the fetch API in a Next.js application.
        </p>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-3">Technologies Used</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Next.js 14</li>
            <li>TypeScript</li>
            <li>Tailwind CSS</li>
            <li>RippleUI Components</li>
            <li>Fetch API</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-3">Features</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Responsive design with RippleUI</li>
            <li>Data fetching with fetch API</li>
            <li>Form submission with POST requests</li>
            <li>Loading states and error handling</li>
            <li>TypeScript type safety</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
