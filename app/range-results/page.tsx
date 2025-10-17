// 'use client'

// import { useChatStore } from '@/store/useExperimentStore'
// import ResponseCard from '@/components/ResponseCard'
// import ComparisonChart from '@/components/ComparisonChart'
// import { useRouter } from 'next/navigation'

// export default function RangeResultsPage() {
//   const { experiments } = useChatStore()
//   const router = useRouter()

//   if (!experiments.length) {
//     return (
//       <main className="flex flex-col items-center justify-center h-screen text-gray-500">
//         <p className="text-center">No range experiments yet.</p>
//         <button
//           onClick={() => router.push('/')}
//           className="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:opacity-90 transition"
//         >
//           ← Back to Console
//         </button>
//       </main>
//     )
//   }

//   return (
//     <main className="min-h-screen bg-gray-50 text-gray-900 px-8 py-10">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">📊 Range Experiment Results</h1>
//         <button
//           onClick={() => router.push('/')}
//           className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:opacity-90 transition"
//         >
//           ← Back to Console
//         </button>
//       </div>

//       <section className="grid md:grid-cols-2 gap-4 mb-10">
//         {experiments.map((exp) => (
//           <ResponseCard key={exp.id} data={exp} />
//         ))}
//       </section>

//       <ComparisonChart data={experiments} />
//     </main>
//   )
// }
