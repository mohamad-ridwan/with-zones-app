import Providers from "../providers";

export const metadata = {
  title: "Next.js - Transaction Zone",
  description: "Next.js example for Transaction Zone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

