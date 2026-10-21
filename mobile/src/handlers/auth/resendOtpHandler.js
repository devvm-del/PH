const resendOtpHandler = ({
  resendOtp,
  email,
  setOtp,
  setMessage,
  setModalVisible,
}) => {
  const handleResendOtp = async () => {
    setMessage("");

    try {
      const result = await resendOtp(email.trim());

      if (!result.success) {
        setMessage(result.message);
        setModalVisible(true);
        return;
      }

      setOtp(["", "", "", "", "", ""]);

      setMessage(result.message);
      setModalVisible(true);
    } catch (error) {
      setMessage(error.message);
      setModalVisible(true);
    }
  };

  return {
    handleResendOtp,
  };
};

export default resendOtpHandler;
