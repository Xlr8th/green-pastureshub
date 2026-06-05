import "./globals.css";
import { Cormorant_Garamond, Crimson_Pro } from 'next/font/google';
import AOSWrapper from "./AOSWrapper";
import ClientLayout from "./LayoutClient";
import "bootstrap-icons/font/bootstrap-icons.css";
import HashScroller from "../components/HashScroller";

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant'
});

const crimson = Crimson_Pro({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-crimson'
});


export const metadata = {
  title: "Green Pasture",
  description: "Where faith meets everyday living",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${crimson.variable}`}>
      <body>        
        <ClientLayout>
          <AOSWrapper>
            <HashScroller />
            {children}  
          </AOSWrapper>  
        </ClientLayout>
       
      </body>
    </html>
  );
}
