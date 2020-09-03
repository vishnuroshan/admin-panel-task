const router = require("express").Router();
const userController = require("../controllers/users");
const { celebrate, Joi, errors } = require("celebrate");

router.post(
  "/list-employees",
  celebrate({
    body: Joi.object().keys({
      range: Joi.object()
        .keys({
          from: Joi.string().required(),
          to: Joi.string().required(),
        })
        .optional(),
      search: Joi.string().optional(),
    }),
  }),
  errors(),
  (request, response) => {
    userController.listEmployees(request.user, request.body).then(
      (list) => {
        response.status(200).json(list);
      },
      (err) => {
        console.log(err);
        response.status(err.status).json(err);
      }
    );
  }
);

router.post(
  "/add-employee",
  celebrate({
    body: Joi.object().keys({
      firstname: Joi.string().required(),
      lastname: Joi.string().optional(),
      email: Joi.string().required(),
      password: Joi.string().optional(),
    }),
  }),
  errors(),
  (request, response) => {
    console.log(request.body, request.user);
    userController.addEmployee(request.body, request.user).then(
      (employee) => {
        response.status(200).json({
          status: 200,
          ...employee,
        });
      },
      (err) => {
        response.status(err.status).json(err);
      }
    );
  }
);

module.exports = router;
