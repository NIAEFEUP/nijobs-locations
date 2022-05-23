import { validationResult } from "express-validator";

export const useExpressValidators = (validators) => async (req, res, next) => {
    await Promise.all(validators.map((validator) => validator.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    return next(new Error("Error in validation"));
};

export const defaultErrorHandler = (err, req, res, _) => {
    console.error(err);

    return res.status(500).json(err);
};
