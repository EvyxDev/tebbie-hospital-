import NewWallet from "../components/NewWallet";
import PermissionWrapper from "../components/PermissionWrapper";

const Walett = () => {
  return (
    <PermissionWrapper
      permissionName="get-wallet-total"
      fallbackMessage="ليس لديك صلاحية لعرض المحفظة الجديدة"
    >
      <NewWallet />
    </PermissionWrapper>
  );
};

export default Walett;
