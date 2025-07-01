import './globals.css'

export const metadata = {
  title: 'API',
  description: 'API de cadastro e login de usuários',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}
