import "@/styles/globals.css";
import { UserProvider } from "../context/index.js";

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}
