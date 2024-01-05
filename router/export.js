import { Router } from "express";
import { exportPDF } from "../helpers/export/pdf/cra/index.js";
import { getCRA } from "../helpers/cras.js";
import { handleError } from "../utils/index.js";
import { StatusCodes } from "../utils/status-codes.js";
import fs from "fs";

const router = Router();
router.get("/cras/:id/pdf", async (req, res) => {
  try {
    const { id } = req.params;
    const options = {
      populate: "consultant,project",
    };
    const cra = await getCRA(id, {
      ...options,
    });
    const result = await exportPDF(cra);
    res.contentType("application/pdf");
    res
      .status(StatusCodes.OK)
      .download(result, { dotfiles: "deny" }, function (){
        fs.unlink(result, function () {
          // console.info("File was deleted")
        });
      });
  } catch (error) {
    handleError({ res, error });
  }
});
export default router;
