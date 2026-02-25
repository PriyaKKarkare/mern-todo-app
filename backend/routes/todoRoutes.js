const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const { body, validationResult } = require("express-validator");

// CREATE

// router.post("/add", async (req, res) => {
// 	try {
// 		console.log("BODY:", req.body);
// 		const todo = new Todo({ title: req.body });
// 		const saved = await todo.save();
// 		res.status(201).json(saved);
// 	} catch (error) {
// 		console.log("ERROR:", error.message);
// 		res.status(400).json({ success: "false", message: error.message });
// 	}

// 	res.json(saved);
// });

router.post("/add",
	[body("title")
		.notEmpty().
		withMessage("Title is Required").
		isLength({ min: 4 })
		.withMessage("Tile must be 4 charachter or more must ")],

	async (req, res, next) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
				});
			}
			const todo = await Todo.create({ title: req.body.title });
			res.status(201).json(todo);

		} catch (error) {
			next(error);
		}
	});

// READ
router.get("/", async (req, res) => {
	const todos = await Todo.find();
	res.json(todos);
});

// UPDATE
// router.put("/update/:id", async (req, res, next) => {
// 	const updated = await Todo.findByIdAndUpdate(
// 		req.params.id,
// 		{ title: req.body.title },
// 		{ new: true }
// 	);
// 	res.json(updated);
// });

router.put("/update/:id", async (req, res, next) => {
	try {
		const updated = await Todo.findByIdAndUpdate(
			req.params.id,
			{ title: req.body.title },
			{ new: true, runValidators: true }
		);
		res.json(updated);
	} catch (error) {
		next(error);
	}
});


// DELETE
router.delete("/delete/:id", async (req, res) => {
	await Todo.findByIdAndDelete(req.params.id);
	res.json({ message: "Deleted Successfully" });
});

module.exports = router;