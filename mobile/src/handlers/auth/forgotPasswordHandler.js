const forgotPasswordHandler = ({
  forgotPassword,
  navigation,
  email,
  setEmailError,
  setMessage,
  setModalVisible,
}) => {
  const handleForgotPassword = async () => {
    setEmailError("");
    setMessage("");

    const result = await forgotPassword(email.trim());

    if (!result.success) {
      const errors = result.errors || {};

      setEmailError(errors.email || "");

      if (Object.keys(errors).length === 0) {
        setMessage(result.message);
        setModalVisible(true);
      }

      return;
    }

    setMessage(result.message);
    setModalVisible(true);
  };

  return {
    handleForgotPassword,
  };
};

export default forgotPasswordHandler;
