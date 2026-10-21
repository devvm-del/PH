const resetPasswordHandler = ({
  resetPassword,
  navigation,
  resetToken,
  password,
  confirmPassword,
  setPasswordError,
  setConfirmPasswordError,
  setMessage,
  setModalVisible,
}) => {
  const handleResetPassword = async () => {
    setPasswordError("");
    setConfirmPasswordError("");
    setMessage("");

    if (!resetToken) {
      setMessage(
        "Your password reset session is invalid or expired. Please request a new code.",
      );
      setModalVisible(true);
      return;
    }

    try {
      const result = await resetPassword(resetToken, password, confirmPassword);

      if (!result.success) {
        const errors = result.errors || {};

        if (errors.password) {
          setPasswordError(errors.password);
        }

        if (errors.confirmPassword) {
          setConfirmPasswordError(errors.confirmPassword);
        }

        if (Object.keys(errors).length === 0) {
          setMessage(result.message || "Unable to reset password");

          setModalVisible(true);
        }

        return;
      }

      setMessage(result.message);
      setModalVisible(true);
    } catch (error) {
      console.error("Reset password error:", error);

      setMessage(error.message || "Unable to reset password");

      setModalVisible(true);
    }
  };

  return {
    handleResetPassword,
  };
};

export default resetPasswordHandler;
