const router = require("express").Router();
const authController = require("../controllers/auth");
const { celebrate, errors, Joi } = require("celebrate");

// sign-up available only for admin users
router.post(
  "/sign-up",
  celebrate({
    body: Joi.object().keys({
      firstname: Joi.string().required(),
      lastname: Joi.string().optional(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      // .pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/, { name: 'passwordRule' })
    }),
  }),
  errors(),
  (request, response) => {
    authController.create({ isAdmin: true, ...request.body }).then(
      (result) => {
        response.status(200).json(result);
      },
      (err) => {
        response.status(err.status).json(err);
      }
    );
  }
);

router.post(
  "/sign-in",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  errors(),
  (request, response) => {
    authController.login(request.body).then(
      (result) => {
        response.status(result.status).json(result);
      },
      (err) => {
        response.status(err.status).json(err);
      }
    );
  }
);

module.exports = router;
