import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "./page.module.css";
import NordigenBankAuth from "@/components/nordigenBankAuth";

const inter = Inter({ subsets: ["latin"] });

const config = {
  // Redirect URL that is being used when modal is being closed.
  redirectUrl: "https://www.example.com",
  // Text that will be displayed on the left side under the logo. Text is limited to 100 characters, and rest will be truncated.
  text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean mavdvd",
  // Logo URL that will be shown below the modal form.
  logoUrl: "https://cdn.nordigen.com/ais/Nordigen_Logo_Black.svg",
  // Will display country list with corresponding institutions. When `countryFilter` is set to `false`, only list of institutions will be shown.
  countryFilter: false,
  // style configs
  styles: {
    // Primary
    // Link to google font
    fontFamily: "https://fonts.googleapis.com/css2?family=Roboto&display=swap",
    fontSize: "15",
    backgroundColor: "#F2F2F2",
    textColor: "#222",
    headingColor: "#222",
    linkColor: "#8d9090",
    // Modal
    modalTextColor: "#1B2021",
    modalBackgroundColor: "#fff",
    // Button
    buttonColor: "#3A53EE",
    buttonTextColor: "#fff",
  },
};

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Get started by editing&nbsp;
          <code className={styles.code}>app/page.tsx</code>
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className={styles.center}>
        <NordigenBankAuth />
        {/* <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
        <div className={styles.thirteen}>
          <Image src="/thirteen.svg" alt="13" width={40} height={31} priority />
        </div> */}
      </div>

      <div className={styles.grid}>
        <a
          href="https://beta.nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={inter.className}>
            Docs <span>-&gt;</span>
          </h2>
          <p className={inter.className}>
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={inter.className}>
            Templates <span>-&gt;</span>
          </h2>
          <p className={inter.className}>Explore the Next.js 13 playground.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={inter.className}>
            Deploy <span>-&gt;</span>
          </h2>
          <p className={inter.className}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  );
}
