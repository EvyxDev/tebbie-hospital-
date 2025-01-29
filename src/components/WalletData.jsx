import React from 'react'
import { dollarIcon } from '../assets'

const WalletData = ({walletData}) => {
  return (
    <>
        {walletData && walletData.length > 0 ? (
            walletData.map((booking) => (
              <div
                key={booking.id}
                className="my-4 shadow-sm bg-white rounded-lg py-2"
              >
                <div className="m-4 mt-8">
                  <div className="flex gap-2 ">
                    <div className="bg-[#D6EEF6] p-4 rounded-full w-16 h-16 flex-shrink-0">
                      <img
                        className="w-12"
                        alt=" dollar Icon"
                        src={dollarIcon}
                      />
                    </div>

                    <div className="flex-col flex space-y-2">
                      <h2 className="font-medium text-md">
                        تم تحويل مبلغ {booking.price} دينار ليبي
                      </h2>

                      <p className="text-sm font-normal">{booking.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-[30vh] flex justify-center items-center">
              <p className="text-center text-gray-600 text-xl">
                لا توجد حجوزات للنطاق المحدد
              </p>
            </div>
          )}
    </>
  )
}

export default WalletData
