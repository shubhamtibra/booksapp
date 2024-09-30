import React from "react";
import Link from "next/link";
import styles from "./layout.module.css";
//import { ApolloWrapper } from "./apolloWrapper";
import ClientComponentApolloProviderForSSROfficialDocs from "./apolloClientForSSROfficialDocs";

export default function RootLayout({ children }) {
  return (
    
    <ClientComponentApolloProviderForSSROfficialDocs>
  <html lang="en">
      <body className={styles.body}>
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <nav>
              <ul>
                <li>
                  <Link href="/books" className={styles.navLink}>
                    Books
                  </Link>
                </li>
                <li>
                  <Link href="/authors" className={styles.navLink}>
                    Authors
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>
          
            <main className={styles.mainContent}>{children}</main>
          
        </div>
      </body>
    </html>


   
    </ClientComponentApolloProviderForSSROfficialDocs>
    
   
  );
}
