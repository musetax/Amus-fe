import { Bell } from "lucide-react";

const TaxBenefitDetail = () => {
  return (
    <div className="block">
      <h2 className="text-cyanBlue text-xl font-medium mb-4">Tax Benefits</h2>
      <div className="block space-y-4">
        <div className="border border-purpuleColor rounded-xl bg-white p-4">
          <div className="flex items-center justify-between gap-10 mb-4">
            <h4 className="text-sm font-normal text-slateColor">
              Just Unlocked
            </h4>
            <button>
              <Bell className="text-[#6A57F6]" />
            </button>
          </div>
          <div className="flex items-center justify-between gap-10 mb-2">
            <h2 className="text-lg text-primaryColor font-medium">
              Child Tax Credit
            </h2>
            <span className="font-semibold text-xl text-primaryColor">
              $2,000
            </span>
          </div>
          <div className="text-sm font-normal text-slateColor">
          You have unlocked $2,000 in tax credits because you have a qualifying child.
          </div>
        </div>
        <div className="bg-[#F9F8F8] rounded-xl p-4">
          <h2 className="text-lg font-medium text-[#9A9A9A] mb-2">
            Mortgage Interest Deduction
          </h2>
          <p className="text-sm font-normal text-[#8A8A8A]">
            Continue chatting to unlock for homeowners with a mortgage
          </p>
        </div>
        <div className="bg-[#F9F8F8] rounded-xl p-4">
          <h2 className="text-lg font-medium text-[#9A9A9A] mb-2">
          Student Loan Interest Deduction
          </h2>
          <p className="text-sm font-normal text-[#8A8A8A]">
          Continue chatting to unlock for students with loans.
          </p>
        </div>
      </div>
    </div>
  );
};
export default TaxBenefitDetail;
