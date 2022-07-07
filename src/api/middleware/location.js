import { query } from "express-validator";

import { useExpressValidators } from "./errorHandler.js";
import ValidationReasons from "./validationReasons.js";

import { LocationConstants } from "../../model/Location.js";

export const search = useExpressValidators([
    query("searchTerm", ValidationReasons.DEFAULT)
        .exists().withMessage(ValidationReasons.REQUIRED).bail()
        .isString().withMessage(ValidationReasons.STRING).bail()
        .isLength({ min: LocationConstants.searchTerm.minLength })
        .withMessage(ValidationReasons.TOO_SHORT(LocationConstants.searchTerm.minLength)).bail(),

]);
