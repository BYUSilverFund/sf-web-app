import { SquareSvgTl, SquareSvgBr } from "@/components/SquareSvg";

interface ToolLinkProps {
  href: string;
  text: string;
  newTab?: boolean;
}
const ToolLink: React.FC<ToolLinkProps> = ({ href, text, newTab }) => {
  return (
    <div className="my-2">
      <a
        href={href}
        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
        target={newTab ? "_blank" : ""}
        rel={newTab ? "noopener noreferrer" : ""}
      >
        {text}
      </a>
    </div>
  );
};

const Tools: React.FC = () => {
  return (
    <div className="mx-auto p-6 bg-inherit relative overflow-hidden">
      <SquareSvgTl className="absolute top-0 left-0 w-full h-auto z-0 pointer-events-none" />
      <SquareSvgBr className="absolute bottom-0 left-0 w-full h-auto z-0 pointer-events-none" />
      <h3 className="text-center title mt-4 mb-20">Student Tools</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-24 gap-y-12 max-w-6xl mx-auto z-10">
        <div className="w-72">
          <div>
            <h5 className="w-full text-lg font-semibold">Data</h5>
            <ul>
              <li>
                <ToolLink
                  href="https://guides.lib.byu.edu/bloomberg"
                  text="Bloomberg Terminal"
                  newTab
                />
              </li>
              <li>
                <ToolLink
                  href="https://guides.lib.byu.edu/bloomberg/Certification"
                  text="Bloomberg Certification"
                  newTab
                />
              </li>
              <li>
                <ToolLink
                  href="https://resourceaccess.lib.byu.edu/resources/capital-iq/"
                  text="Capital IQ"
                  newTab
                />
              </li>
              <li>
                <ToolLink
                  href="https://www.capitaliq.com/ciqdotnet/downloads/downloads.aspx"
                  text="Capital IQ Excel Plugin"
                  newTab
                />
              </li>
            </ul>
          </div>
        </div>
        <div className="w-72">
          <div>
            <h5 className="w-full text-lg font-semibold">
              Background Research & News
            </h5>
            <ul>
              <li>
                <ToolLink
                  href="https://guides.lib.byu.com/pq-business"
                  text="ProQuest One Business"
                  newTab
                />
              </li>
              <li>
                <ToolLink
                  href="https://dbs.lib.byu.edu/factiva"
                  text="Factiva"
                  newTab
                />
              </li>
              <li>
                <ToolLink
                  href="/tools/investment-memos"
                  text="Investment Memos"
                />
              </li>
            </ul>
          </div>
        </div>
        <div className="w-72">
          <div>
            <h5 className="w-full text-lg font-semibold">Industry Ratios</h5>
            <ul>
              <li>
                <ToolLink
                  href="https://guides.lib.byu.com/bizminer"
                  text="BizMiner"
                  newTab
                />
              </li>
              <li>
                <ToolLink
                  href="https://dbs.lib.byu.edu/rma"
                  text="RMA eStatement Studies"
                  newTab
                />
              </li>
              <li>
                <ToolLink
                  href="https://guides.lib.byu.com/kbr"
                  text="Mergent Key Business Ratios"
                  newTab
                />
              </li>
            </ul>
          </div>
        </div>
        <div className="w-72">
          <div>
            <h5 className="w-full text-lg font-semibold">Analyst Reports</h5>
            <ul>
              <li>
                <ToolLink
                  href="https://dbs.lib.byu.edu/morningstar"
                  text="Morningstar"
                  newTab
                />
              </li>
              <li>
                <ToolLink
                  href="https://dbs.lib.byu.edu/pq-jp-morgan"
                  text="J.P. Morgan Research Reports"
                  newTab
                />
              </li>
            </ul>
          </div>
        </div>
        <div className="w-72">
          <div>
            <h5 className="w-full text-lg font-semibold">Database Help</h5>
            <ul>
              <li>
                <ToolLink
                  href="https://guides.lib.byu.com/company/troubleshooting"
                  text="Database Troubleshooting Guide"
                  newTab
                />
              </li>
              <li>
                <ToolLink
                  href="https://byu.sharepoint.com/sites/silverfund-wiki"
                  text="Silver Fund Class Wiki"
                  newTab
                />
              </li>
            </ul>
          </div>
        </div>
        <div className="w-72">
          <div>
            <h5 className="w-full text-lg font-semibold">Silver Fund Tools</h5>
            <ul>
              <li>
                <ToolLink
                  href="/covariance-matrix"
                  text="Covariance Matrix Downloader"
                />
              </li>
              <li>
                <ToolLink
                  href="/alpha-beta-guide"
                  text="Alpha & Beta Calculation Guide"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <br />
    </div>
  );
};

export default Tools;
