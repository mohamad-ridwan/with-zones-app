import Link from "next/link";

export default function TransactionPage() {
  return (
    <div>
      <h1>Transaction Page</h1>

      <Link href={"/transaction/credit"}>CREDIT ACCOUNT</Link>
      <br />
      <Link href={"/transaction/debit"}>DEBIT ACCOUNT</Link>
    </div>
  );
}
