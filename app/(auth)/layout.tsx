import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata={
    title:"Threads",
    description:"A Next.js 14 Meta Threads Clone"
}

export default function RootLayout({children}:{children:React.ReactNode}){

    return (
<ClerkProvider>
    <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>
            {children}
        </body>

    </html>
</ClerkProvider>
    )
}