import Link from "next/link";
import "./globals.css";
import { ApolloWrapper } from "./utils/apolloWrapper";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark-background text-dark-foreground">
        <ApolloWrapper>
          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] min-h-screen">
            <aside className="bg-dark-primary md:shadow-lg w-full">
              <nav>
                <ul>
                  <li>
                    <Link
                      href="/books"
                      className="text-dark-foreground hover:text-dark-accent transition-colors duration-200 border border-dark-background flex p-4 rounded hover:bg-dark-secondary hover:scale-105 transform"
                    >
                      Books
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/authors"
                      className="text-dark-foreground hover:text-dark-accent transition-colors duration-200 border border-dark-background flex p-4 rounded hover:bg-dark-secondary hover:scale-105 transform"
                    >
                      Authors
                    </Link>
                  </li>
                </ul>
              </nav>
            </aside>

            <main className="p-8 animate-fade-in">{children}</main>
          </div>
        </ApolloWrapper>
      </body>
    </html>
  );
}
