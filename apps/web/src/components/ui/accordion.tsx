import { Plus } from "lucide-react";

export function Accordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <div className="accordion">
      {items.map((item) => (
        <details key={item.question}>
          <summary>
            {item.question}
            <Plus size={17} aria-hidden="true" />
          </summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
