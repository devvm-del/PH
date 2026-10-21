const verifyOtpHandler = ({
  verifyOtp,
  navigation,
  email,
  otp,
  setOtp,
  setResetToken,
  setOtpError,
  setMessage,
  setModalVisible,
  inputRefs,
}) => {
  // Handle OTP input
  const handleChange = (text, index) => {
    // Only allow numbers
    if (!/^\d*$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    setOtpError("");
    setMessage("");

    const otpValue = otp.join("");

    if (!email) {
      setOtpError("Email information is missing. Please request a new code.");
      return;
    }

    if (!otpValue.trim()) {
      setOtpError("OTP is required");
      return;
    }

    if (!/^\d{6}$/.test(otpValue.trim())) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    try {
      const result = await verifyOtp(email, otpValue.trim());

      if (!result.success) {
        setMessage(result.message);
        setModalVisible(true);
        return;
      }

      if (!result.resetToken) {
        setMessage(
          "Unable to continue. Please request a new verification code.",
        );
        setModalVisible(true);
        return;
      }

      setResetToken(result.resetToken);
      setMessage(result.message);
      setModalVisible(true);
    } catch (error) {
      console.error("Verify OTP error:", error);

      setMessage(error.message || "Unable to verify OTP");
    }
  };

  return {
    handleChange,
    handleKeyPress,
    handleVerifyOtp,
  };
};

export default verifyOtpHandler;
