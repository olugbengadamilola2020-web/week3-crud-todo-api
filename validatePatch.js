const Joi = require("joi");

const validatePatchTodo = (req, res, next) => {
const id = req.params.id;
const data = req.body;
const schema = Joi.object({
    task: Joi.string().min(3).max(100),
    completed: Joi.boolean(),
});

const { error } = schema.validate(data);
if (error) return res.status(400).json({ error: error.details[0].message });
next();
};

module.exports = validatePatchTodo;