/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 */
define(["N/ui/dialog"], function (dialog) {
  const CC_FEE_ITEM_ID = 9; // Internal ID of the "Credit Card Fee" item
  function fieldChanged(context) {
    if (context.sublistId !== "item" || context.fieldId !== "amount") return;

    const rec = context.currentRecord;
    const line = context.line;

    const itemId = parseInt(
      rec.getSublistValue({ sublistId: "item", fieldId: "item", line }),
    );

    if (itemId !== CC_FEE_ITEM_ID) return;

    log.debug({
      title: "CS CC Fee | Amount Manually Changed on Fee Line",
      details: `Line ${line} — setting manual override`,
    });

    rec.setValue({
      fieldId: "custbody_esp_cc_fee_manual_overri",
      value: true,
      ignoreFieldChange: true,
    });
  }

  function validateDelete(context) {
    const sublistId = context.sublistId;
    const rec = context.currentRecord;
    let proceedToDelete = true;
    if (sublistId !== "item") return true;

    const isCCFeeLine =
      parseInt(
        rec.getCurrentSublistValue({
          sublistId,
          fieldId: "item",
          line: context.line,
        }),
      ) === CC_FEE_ITEM_ID;

    const isManualOverride = rec.getValue({
      fieldId: "custbody_esp_cc_fee_manual_overri",
    });

    if (isCCFeeLine && !isManualOverride) {
      dialog
        .confirm({
          title: "Confirm Deletion",
          message:
            "This line is automatically calculated as a credit card fee. Are you sure you want to delete it?",
        })
        .then((result) => {
          if (!result) {
          } else { // confirm
            rec.setValue({
              fieldId: "custbody_esp_cc_fee_manual_overri",
              value: true,
              ignoreFieldChange: true,
            });

            const ccFeeLineIndexc = rec.findSublistLineWithValue({
              sublistId,
              fieldId: "item",
              value: CC_FEE_ITEM_ID,
            });
           
            rec.removeLine({
              sublistId,
              line: ccFeeLineIndexc,
              ignoreRecalc: true,
            });
          }
        })
        .catch((err) => {
          console.error("Dialog error", err);
        });

        return false // always return false as we do a manual delete if user confirms, if not then it always delete on popup
    }

    return true
  }

  return {
    fieldChanged: fieldChanged,
    validateDelete: validateDelete,
  };
});
