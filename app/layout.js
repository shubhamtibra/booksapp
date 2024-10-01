import Link from "next/link";
import styles from "./styles/layout.module.css";
import { ApolloWrapper } from "./utils/apolloWrapper";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <ApolloWrapper>
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
        </ApolloWrapper>
      </body>
    </html>
  );
}
