const router = require("express").Router();
const userController = require("../controllers/users");
const { celebrate, Joi, errors } = require("celebrate");

router.get("/:id", (request, response) => {
  // request.params.id;
  userController.get(request.params.id).then(
    (details) => response.status(200).json({ status: 200, details }),
    (err) => response.status(err.status).json(err)
  );
});

router.get("/list-employees", (request, response) => {
  userController.listEmployees(request.user).then(
    (posts) => {
      response.status(200).json({ status: 200, posts });
    },
    (err) => {
      response.status(err.status).json(err);
    }
  );
});

router.post(
  "/add-employee",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
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
          ...employee
        });
      },
      (err) => {
        response.status(err.status).json(err);
      }
    );
  }
);

module.exports = router;