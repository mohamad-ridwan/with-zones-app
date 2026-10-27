import TransactionForm from "../components/TransactionForm";

export default async function TransactionTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  return (
    <div style={{ padding: "20px" }}>
      <TransactionForm type={type} />
    </div>
  );
}

