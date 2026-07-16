const validateRegistration = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const errors = [];

  if (!firstName || firstName.trim().length === 0) {
    errors.push("First name is required");
  }

  if (!lastName || lastName.trim().length === 0) {
    errors.push("Last name is required");
  }

  if (!email || !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
    errors.push("Please provide a valid email");
  }

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if (errors.length > 0) {
    res.status(400);
    throw new Error(errors.join(", "));
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  next();
};

export { validateRegistration, validateLogin };
