import { Router } from "express";
import { createCRA, getCRA } from "../helpers/cras";
import { StatusCodes } from "../utils/status-codes";
import { Groups, Roles, checkGroup } from "../middlewares/check-group";
import { handleError } from "../utils";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello Cras!");
});
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { populate } = req.query;
    const options = {};
    if (typeof populate === "string") {
      options["populate"] = populate;
    }
    if (typeof count === "string") {
      options["count"] = count;
    }
    const result = await getCRA(id, {
      ...options,
    });
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});
router.post("/", checkGroup(Groups.CONSULTANTS), async (req, res) => {
  try {
    const { user, body } = req;
    const history = [
      {
        action: "created",
        meta: {
          at: new Date(),
          by: {
            _id: user.uid,
            role: Roles.CONSULTANT,
          },
        },
      },
    ];
    const result = await createCRA({
      ...body,
      consultant: user.uid,
      history,
    });
    res.status(StatusCodes.CREATED).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});
router.put("/:id", (req, res) => {
  res.send("Got a PUT request at :id");
});
router.delete("/:id", (req, res) => {
  res.send("Got a DELETE request at /user");
});

export default router;
