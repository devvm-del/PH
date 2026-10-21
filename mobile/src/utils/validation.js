const validateRegisterForm = ({
  fullName,
  email,
  password,
  confirmPassword,
  checked,
}) => {
  const errors = {};

  if (!fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
    errors.email = "Please enter a valid email.";
  }

  if (!password) {
    errors.password = "Password is required.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirm password is required.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!checked) {
    errors.termsCondition = "Please agree to the Terms and Conditions.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default validateRegisterForm;
