declare module "qrcode" {
  type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

  const QRCode: {
    create(
      value: string,
      options?: {
        errorCorrectionLevel?: ErrorCorrectionLevel;
      },
    ): {
      modules: {
        size: number;
        data: ArrayLike<boolean>;
      };
    };
  };

  export default QRCode;
}
