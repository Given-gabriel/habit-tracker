import { body, validationResult } from "express-validator";

export const signupValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("valid email required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters")
    .matches(/[0-9]/)
    .withMessage("Password must contain atleast one number")
    .matches(/[A-Z]/)
    .withMessage("Password must contain atleast one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain atleast one lowercase letter")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain atleast one special character"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
