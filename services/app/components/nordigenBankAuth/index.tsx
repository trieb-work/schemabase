import dynamic from "next/dynamic";
dynamic(
  () => {
    return import("nordigen-bank-ui/package/src/selector");
  },
  { ssr: false },
);

const NordigenBankAuth = () => {
  return <div id="institution-content-wrapper"></div>;
};
export default NordigenBankAuth;
