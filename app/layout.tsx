import './globals.css'

export const metadata = {
  title: 'LLM Console',
  description: 'Experiment with LLM parameters visually',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex justify-center items-center min-h-screen bg-gray-950 text-gray-100">
        {children}
      </body>
    </html>
  )
}
