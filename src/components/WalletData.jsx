/* eslint-disable react/prop-types */
import { dollarIcon } from "../assets";

const WalletData = ({ walletData, isNewWallet = false }) => {
  return (
    <>
      {walletData && walletData.length > 0 ? (
        walletData.map((transaction) => {
          // For new wallet, use model_name and user_name directly
          const name = isNewWallet
            ? transaction.user_name || transaction.model_name || "غير معروف"
            : transaction.booking?.doctor?.name || "غير معروف";

          const amount = isNewWallet ? transaction.money : transaction.price;
          const description = isNewWallet
            ? transaction.model_name || "معاملة أخرى"
            : transaction.description || "تم تحويل مبلغ";

          return (
            <div
              key={transaction.id}
              className="my-4 shadow-sm bg-white rounded-lg py-2"
            >
              <div className="m-4 mt-8">
                <div className="flex gap-2 ">
                  <div className="bg-[#D6EEF6] p-4 rounded-full w-16 h-16 flex-shrink-0">
                    <img className="w-12" alt=" dollar Icon" src={dollarIcon} />
                  </div>

                  <div className="flex-col flex space-y-1 flex-1">
                    <h2 className="font-medium text-md">{name}</h2>
                    <p className="text-xl font-semibold">{amount} دينار ليبي</p>
                    <div className="flex justify-between items-center w-full">
                      <p className="text-sm font-normal flex-shrink-0">
                        {description}
                      </p>
                      {isNewWallet && transaction.date && (
                        <p className="text-xs text-gray-500 flex-shrink-0">
                          {transaction.date}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="h-[30vh] flex justify-center items-center">
          <p className="text-center text-gray-600 text-xl">
            لا توجد معاملات للفترة المختارة
          </p>
        </div>
      )}
    </>
  );
};

export default WalletData;
