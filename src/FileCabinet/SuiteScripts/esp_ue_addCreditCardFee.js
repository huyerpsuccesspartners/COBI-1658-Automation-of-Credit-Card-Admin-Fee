/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 *
 * Script:      UE_Invoice_CreditCardFee.js
 * Description: On beforeSubmit of an Invoice, calculates 3.5% of the subtotal
 *              and adds (or updates) a "Credit Card Fee" line item on the item sublist.
 *              The Credit Card Fee item is referenced by its internal ID (55).
 *
 * Deployment:  Apply to record type: Invoice (transaction where type = CustInvc)
 */

define(["N/log", "N/search"], (log, search) => {
  const CC_FEE_ITEM_ID = 9; // Internal ID of the "Credit Card Fee" item
  const CC_FEE_RATE = 0.035; // 3.5%
  const ITEM_SUBLIST = "item";
  const CREDIT_CARD_PAYMENT_METHOD_IDS = [2]; // Replace with actual internal ID of credit card payment method

  /**
   * beforeSubmit entry point
   * @param {Object} context
   */
  const beforeSubmit = (context) => {
    // Only run on CREATE, EDIT, or COPY — not DELETE
    const allowedTypes = [
      context.UserEventType.CREATE,
      context.UserEventType.EDIT,
      context.UserEventType.COPY,
    ];

    log.debug({ title: "CC Fee | Context Type", details: context.type });
    if (!allowedTypes.includes(context.type)) return;

    const rec = context.newRecord;

    const ccFeeOverride = rec.getValue({ fieldId: "custbody_esp_cc_fee_manual_overri" });
    if (ccFeeOverride) {
      log.debug({
        title: "CC Fee | Manual Override",
        details: "Manual override is enabled. Skipping fee calculation.",
      });
      return
    }

    const createdFrom = rec.getValue({ fieldId: "createdfrom" });
    log.debug({ title: "CC Fee | Created From", details: createdFrom });
    if (!createdFrom) return; // Skip if created from another transaction

    const fieldLookup = search.lookupFields({
      type: search.Type.SALES_ORDER,
      id: createdFrom,
      columns: "paymentmethod",
    });

    log.debug({
      title: "CC Fee | Payment Method Lookup",
      details: fieldLookup,
    });

    if (
      !fieldLookup ||
      !fieldLookup.paymentmethod ||
      !CREDIT_CARD_PAYMENT_METHOD_IDS.includes(
        parseInt(fieldLookup.paymentmethod[0].value),
      )
    ) {
      log.debug({
        title: "CC Fee | Payment Method Check",
        details: "Payment method is not credit card. Skipping fee calculation.",
      });
      removeCreditCardFeeLine(rec); // Ensure fee line is removed if payment method changes away from credit card
      return; // Skip if payment method is not credit card
    }

    // ── 1. Get the subtotal ──────────────────────────────────────────────
    const subtotal = parseFloat(rec.getValue({ fieldId: "subtotal" })) || 0;
    log.debug({ title: "CC Fee | Subtotal", details: subtotal });

    // ── 2. Calculate the fee ─────────────────────────────────────────────
    const feeAmount = parseFloat((subtotal * CC_FEE_RATE).toFixed(2));
    log.debug({ title: "CC Fee | Calculated Fee (3.5%)", details: feeAmount });

    // ── 3. Add/update or remove the fee line ─────────────────────────────
    if (feeAmount > 0) {
      addOrUpdateCreditCardFeeLine(rec, feeAmount);
    } else {
      removeCreditCardFeeLine(rec);
    }
  };

  function addOrUpdateCreditCardFeeLine(rec, feeAmount) {
    const lineNumber = rec.findSublistLineWithValue({
      sublistId: "item",
      fieldId: "item",
      value: CC_FEE_ITEM_ID,
    });

    // ── 4a. Update existing line ─────────────────────────────────────────
    if (lineNumber >= 0) {
      rec.setSublistValue({
        sublistId: ITEM_SUBLIST,
        fieldId: "amount",
        line: lineNumber,
        value: feeAmount,
      });
      log.audit({
        title: "CC Fee | Updated",
        details: `Line ${lineNumber} updated to $${feeAmount}`,
      });

      // ── 4b. Insert a new line at the end ─────────────────────────────────
    } else {
      const newLine = rec.getLineCount({ sublistId: ITEM_SUBLIST }); // append at end

      rec.insertLine({
        sublistId: ITEM_SUBLIST,
        line: newLine,
      });

      rec.setSublistValue({
        sublistId: ITEM_SUBLIST,
        fieldId: "item",
        line: newLine,
        value: CC_FEE_ITEM_ID,
      });

      rec.setSublistValue({
        sublistId: ITEM_SUBLIST,
        fieldId: "quantity",
        line: newLine,
        value: 1,
      });

      // custom price level
      rec.setSublistValue({
        sublistId: ITEM_SUBLIST,
        fieldId: "price",
        line: newLine,
        value: -1,
      });

      rec.setSublistValue({
        sublistId: ITEM_SUBLIST,
        fieldId: "amount",
        line: newLine,
        value: feeAmount,
      });

      log.audit({
        title: "CC Fee | Added",
        details: `New line added at index ${newLine} with amount $${feeAmount}`,
      });
    }
  }

  function removeCreditCardFeeLine(rec) {
    const lineNumber = rec.findSublistLineWithValue({
      sublistId: "item",
      fieldId: "item",
      value: CC_FEE_ITEM_ID,
    });

    if (lineNumber >= 0) {
      rec.removeLine({
        sublistId: "item",
        line: lineNumber,
      });
    }
  }

  return { beforeSubmit };
});
