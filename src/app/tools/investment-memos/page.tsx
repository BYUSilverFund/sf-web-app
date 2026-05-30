import { SquareSvgTl, SquareSvgBr } from "@/components/SquareSvg";
import Link from "next/link";

interface MemoLinkProps {
  href: string;
  text: string;
}

const MemoLink: React.FC<MemoLinkProps> = ({ href, text }) => {
  return (
    <div className="my-2">
      <a
        href={href}
        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
        target="_blank"
        rel="noopener noreferrer"
      >
        {text}
      </a>
    </div>
  );
};

const InvestmentMemos: React.FC = () => {
  return (
    <div className="mx-auto p-6 bg-inherit relative overflow-hidden">
      <div className="relative z-10 mb-6">
        <Link
          href="/tools"
          className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-100"
        >
          ← Back to Student Tools
        </Link>
      </div>
      <SquareSvgTl className="absolute top-0 left-0 w-full h-auto z-0 pointer-events-none" />
      <SquareSvgBr className="absolute bottom-0 left-0 w-full h-auto z-0 pointer-events-none" />

      <h3 className="text-center title mt-4 mb-12">Investment Memos</h3>

      <div className="flex justify-center z-10">
        <div className="max-w-3xl">
          <h5 className="w-full text-lg font-semibold mb-4">
            Background Research & Investment Memos
          </h5>

          <p className="mb-6 text-gray-600">
            Silver Fund Research Archive • Spring 2026
          </p>

          <ul>
            <li>
              <MemoLink
                href="/pdfs/investment-memos-2026/ANET/ANET Report_2026.pdf"
                text="ANET — Arista Networks"
              />
            </li>

            <li>
              <MemoLink
                href="/pdfs/investment-memos-2026/DORM/Dorman Products Investment Report.pdf"
                text="DORM — Dorman Products"
              />
            </li>

            <li>
              <MemoLink
                href="/pdfs/investment-memos-2026/ENSG/Ensign Group (ENSG) - Report.pdf"
                text="ENSG — Ensign Group"
              />
            </li>

            <li>
              <MemoLink
                href="/pdfs/investment-memos-2026/FICO/FICO_Final_Writeup_4.14.2026.pdf"
                text="FICO — Fair Isaac Corporation"
              />
            </li>

            <li>
              <MemoLink
                href="/pdfs/investment-memos-2026/MSFT/MSFT_Report_2026.pdf"
                text="MSFT — Microsoft"
              />
            </li>

            <li>
              <MemoLink
                href="/pdfs/investment-memos-2026/MTN/MTN_WriteUp.pdf"
                text="MTN — Vail Resorts"
              />
            </li>

            <li>
              <MemoLink
                href="/pdfs/investment-memos-2026/PACS/PACS Report_April 17, 2026.pdf"
                text="PACS — PACS Group"
              />
            </li>

            <li>
              <MemoLink
                href="/pdfs/investment-memos-2026/PGY/PGY - Pagaya Final Report 04.17.2026.pdf"
                text="PGY — Pagaya Technologies"
              />
            </li>

            <li>
              <MemoLink
                href="/pdfs/investment-memos-2026/UNH/UNH Investment Report.pdf"
                text="UNH — UnitedHealth Group"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InvestmentMemos;
