import Link from "next/link";
import { ApolloWrapper } from "./apolloWrapper";
import styles from "./layout.module.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ApolloWrapper>
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
      </ApolloWrapper>
    </html>
  );
}
