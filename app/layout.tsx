import './globals.css';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Sidebar from './Components/Sidebar';
import { Providers } from './providers';




export const metadata = {
  title: 'Analytical Dashboard',
  description: '...',
}
 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        <Providers>
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}