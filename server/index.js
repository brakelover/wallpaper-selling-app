import express from "express";
import Payos from "@payos/node";

const payos = new Payos(
  "3f715500-8d58-4793-bf2c-871b0fdd64f8",
  "217101fc-2082-4df1-9337-8bea58b15905",
  "cd23a08cc7f798e26da218f108ade636edb7f76aecbf65bc62c8ccac283e055b"
);
const app = express();
app.use(express.static("public"));
app.use(express.json());

const generatedNumbers = new Set();
const getRandomUniqueNumber = () => {
  if (generatedNumbers.size >= 99983) {
    throw new Error("No more unique numbers available in the range.");
  }
  let randomNumber;
  do {
    randomNumber = Math.floor(Math.random() * (99998 - 16 + 1)) + 16;
  } while (generatedNumbers.has(randomNumber));
  generatedNumbers.add(randomNumber);
  return randomNumber;
};

const DOMAIN = "http://localhost:9999";
app.post("/create-payment-link", async (req, res, next) => {
  try {
    const { amount, description, returnUrl, cancelUrl } = req.body;
    const order = {
      amount: amount ? amount : 1000,
      description: description ? description : "buy wallpaper",
      orderCode: getRandomUniqueNumber(),
      returnUrl: returnUrl ? returnUrl : `${DOMAIN}/success.html`,
      cancelUrl: cancelUrl ? cancelUrl : `${DOMAIN}/cancel.html`,
    };
    const paymentLink = await payos.createPaymentLink(order);
    res.status(200).json({ checkoutUrl: paymentLink.checkoutUrl });
    // res.redirect(303, paymentLink.checkoutUrl);
  } catch (err) {
    res.status(500).send("Failed to create payment link.");
    next(err);
  }
});

app.listen(9999, () => {
  console.log("Server started on port 9999");
});

/**
 * import express from "express";
import Payos from "@payos/node";
import { customAlphabet } from "nanoid";

const payos = new Payos(
  "3f715500-8d58-4793-bf2c-871b0fdd64f8",
  "217101fc-2082-4df1-9337-8bea58b15905",
  "cd23a08cc7f798e26da218f108ade636edb7f76aecbf65bc62c8ccac283e055b"
);
const nanoidNumeric = customAlphabet("0123456789", 5);
const app = express();
app.use(express.static("public"));
app.use(express.json());

const DOMAIN = "http://localhost:9999";

app.post("/create-payment-link", async (req, res, next) => {
  try {
    const { amount, description, orderCode, returnUrl, cancelUrl } = req.body;
    let parameters = {
      amount: amount ? amount : 1000,
      description: description ? description : "Payment for wallpaper",
      orderCode: orderCode ? orderCode : 13,
      returnUrl: returnUrl ? returnUrl : `${DOMAIN}/success.html`,
      cancelUrl: cancelUrl ? cancelUrl : `${DOMAIN}/cancel.html`,
    };

    if (!account || !description || !orderCode || !returnUrl || !cancelUrl) {
      parameters = {
        amount: 1000,
        description: "Payment for wallpaper",
        orderCode: 13,
        returnUrl: `${DOMAIN}/success.html`,
        cancelUrl: `${DOMAIN}/cancel.html`,
      };
    }

    const paymentLink = await payos.createPaymentLink(parameters);

    res.status(200).json({ checkoutUrl: paymentLink.checkoutUrl });
  } catch (err) {
    res.status(500).send("Failed to create payment link.");
    next(err);
  }
});

app.listen(9999, () => {
  console.log("Server started on port 9999");
});

 */

/**
 * Run alone and success version
 * import express from "express";
import Payos from "@payos/node";

const payos = new Payos(
  "3f715500-8d58-4793-bf2c-871b0fdd64f8",
  "217101fc-2082-4df1-9337-8bea58b15905",
  "cd23a08cc7f798e26da218f108ade636edb7f76aecbf65bc62c8ccac283e055b"
);
const app = express();
app.use(express.static("public"));
app.use(express.json());

const DOMAIN = "http://localhost:9999";
app.post("/create-payment-link", async (req, res, next) => {
  try {
    const order = {
      amount: 1000,
      description: "test",
      orderCode: 14,
      returnUrl: `${DOMAIN}/success.html`,
      cancelUrl: `${DOMAIN}/cancel.html`,
    };
    const paymentLink = await payos.createPaymentLink(order);
    res.redirect(303, paymentLink.checkoutUrl);
  } catch (err) {
    res.status(500).send("Failed to create payment link.");
    next(err);
  }
});

app.listen(9999, () => {
  console.log("Server started on port 9999");
});
 */
