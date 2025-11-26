const Joi = require("joi");
const { User } = require("../models");

/**
 * Validation middleware factory
 */
const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const data = req[source];

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        error: "Validation error",
        message: "Request validation failed",
        details: errors,
      });
    }

    // Replace the original data with validated data
    req[source] = value;
    next();
  };
};

/**
 * Authentication validation schemas
 */
const authSchemas = {
  // User registration
  register: Joi.object({
    email: Joi.string().email().required().max(255).messages({
      "string.email": "Please provide a valid email address",
      "string.max": "Email must not exceed 255 characters",
      "any.required": "Email is required",
    }),

    password: Joi.string()
      .min(8)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]"
        )
      )
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        "any.required": "Password is required",
      }),

    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match",
        "any.required": "Password confirmation is required",
      }),

    role: Joi.string()
      .valid("donor", "medical_staff", "admin_staff", "milk_bank_manager")
      .default("donor")
      .messages({
        "any.only":
          "Role must be one of: donor, medical_staff, admin_staff, milk_bank_manager",
      }),

    phone: Joi.string()
      .pattern(
        /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/
      )
      .optional()
      .allow("")
      .messages({
        "string.pattern.base":
          "Please provide a valid phone number (e.g., +1234567890, 0123456789)",
      }),

    fullName: Joi.string().min(2).max(255).required().messages({
      "string.min": "Full name must be at least 2 characters long",
      "string.max": "Full name must not exceed 255 characters",
      "any.required": "Full name is required",
    }),

    dateOfBirth: Joi.date().max("now").optional().messages({
      "date.max": "Date of birth cannot be in the future",
    }),
  }),

  // User login
  login: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),

    password: Joi.string().required().messages({
      "any.required": "Password is required",
    }),
  }),

  // Refresh token
  refreshToken: Joi.object({
    refreshToken: Joi.string().required().messages({
      "any.required": "Refresh token is required",
    }),
  }),

  // Change password
  changePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      "any.required": "Current password is required",
    }),

    newPassword: Joi.string()
      .min(8)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]"
        )
      )
      .required()
      .messages({
        "string.min": "New password must be at least 8 characters long",
        "string.pattern.base":
          "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        "any.required": "New password is required",
      }),

    confirmNewPassword: Joi.string()
      .valid(Joi.ref("newPassword"))
      .required()
      .messages({
        "any.only": "New passwords do not match",
        "any.required": "New password confirmation is required",
      }),
  }),

  // Forgot password
  forgotPassword: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
  }),

  // Reset password
  resetPassword: Joi.object({
    token: Joi.string().required().messages({
      "any.required": "Reset token is required",
    }),

    password: Joi.string()
      .min(8)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]"
        )
      )
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        "any.required": "Password is required",
      }),

    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match",
        "any.required": "Password confirmation is required",
      }),
  }),
};

/**
 * Common validation schemas
 */
const commonSchemas = {
  // UUID validation
  uuid: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "string.guid": "Invalid UUID format",
    "any.required": "ID is required",
  }),

  // Pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
      "number.base": "Page must be a number",
      "number.integer": "Page must be an integer",
      "number.min": "Page must be at least 1",
    }),

    limit: Joi.number().integer().min(1).max(100).default(20).messages({
      "number.base": "Limit must be a number",
      "number.integer": "Limit must be an integer",
      "number.min": "Limit must be at least 1",
      "number.max": "Limit must not exceed 100",
    }),

    sortBy: Joi.string().optional().messages({
      "string.base": "Sort by must be a string",
    }),

    sortOrder: Joi.string().valid("asc", "desc").default("desc").messages({
      "any.only": "Sort order must be either asc or desc",
    }),
  }),
};

/**
 * Custom validation for email and phone uniqueness (BR058-01)
 */
const checkUniqueEmailPhone = async (req, res, next) => {
  try {
    const { email, phone } = req.body;

    // Check email uniqueness
    if (email) {
      const existingEmailUser = await User.findOne({
        where: { email: email.toLowerCase() },
      });

      if (existingEmailUser) {
        return res.status(400).json({
          error: "Validation failed",
          message: "Email address is already registered",
          field: "email",
        });
      }
    }

    // Check phone uniqueness if provided
    if (phone) {
      const existingPhoneUser = await User.findOne({
        where: { phone },
      });

      if (existingPhoneUser) {
        return res.status(400).json({
          error: "Validation failed",
          message: "Phone number is already registered",
          field: "phone",
        });
      }
    }

    next();
  } catch (error) {
    console.error("Uniqueness check error:", error);
    res.status(500).json({
      error: "Validation failed",
      message: "Unable to validate uniqueness",
    });
  }
};

/**
 * Age validation for donors (BR001-1)
 */
const validateDonorAge = (req, res, next) => {
  try {
    const { dateOfBirth, role } = req.body;

    // Only apply to donor registrations
    if (role === "donor" && dateOfBirth) {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 18) {
        return res.status(400).json({
          error: "Registration failed",
          message: "Donor must be at least 18 years old",
          field: "dateOfBirth",
        });
      }
    }

    next();
  } catch (error) {
    console.error("Age validation error:", error);
    res.status(500).json({
      error: "Validation failed",
      message: "Unable to validate age",
    });
  }
};
const validationMiddleware = {
  // Auth routes
  validateRegister: [
    validate(authSchemas.register),
    checkUniqueEmailPhone,
    validateDonorAge,
  ],
  validateLogin: validate(authSchemas.login),
  validateRefreshToken: validate(authSchemas.refreshToken),
  validateChangePassword: validate(authSchemas.changePassword),
  validateForgotPassword: validate(authSchemas.forgotPassword),
  validateResetPassword: validate(authSchemas.resetPassword),

  // Common validations
  validateUUID: (paramName = "id") =>
    validate(Joi.object({ [paramName]: commonSchemas.uuid }), "params"),
  validatePagination: validate(commonSchemas.pagination, "query"),

  // Custom validation
  validateCustom: (schema, source = "body") => validate(schema, source),
};

module.exports = {
  validate,
  authSchemas,
  commonSchemas,
  validationMiddleware,
  checkUniqueEmailPhone,
  validateDonorAge,
};
