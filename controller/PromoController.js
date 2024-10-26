const PromoCode = require("../model/PromoModel");

const CreatePromo = async (req, res) => {
    try {
      const promoCode = new PromoCode(req.body);
      await promoCode.save();
      res.status(201).json({ message: "Promo code created", promo: promoCode });
    } catch (error) {
      res.status(400).json({ error: "Error creating promo code", errors: error.errors });
    }
  };

const getAllPromo = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find();
    res.status(200).json(promoCodes);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching promo codes.", error: err });
  }
};

const updatePromo = async (req, res) => {
    const { code, discountValue, discountType, minPurchase } = req.body;
  
    try {
      const updatedPromoCode = await PromoCode.findByIdAndUpdate(
        req.params.id,
        { code, discountValue, discountType, minPurchase },
        { new: true }
      );
      res.status(200).json(updatedPromoCode);
    } catch (err) {
      res.status(500).json({ message: "Error updating promo code.", error: err });
    }
  };
  

const DeletePromo = async (req, res) => {
  try {
    await PromoCode.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "Promo code deleted." });
  } catch (err) {
    res.status(500).json({ message: "Error deleting promo code.", error: err });
  }
};

const ApplyPromo =  async (req, res) => {
    const { code, cartPrice } = req.body;
    try {
      const promo = await PromoCode.findOne({ code });
      if (!promo) return res.status(404).json({ message: "Promo code not found" });
  
      if (cartPrice < promo.minPurchase) {
        return res.status(400).json({ message: "Cart price is below the minimum required" });
      }
  
      const discount = promo.discountType === "percentage"
        ? (cartPrice * promo.discountValue) / 100
        : promo.discountValue;
  
      res.json({ discount, finalPrice: cartPrice - discount });
    } catch (error) {
      res.status(500).json({ message: "Error applying promo code" });
    }
  }

module.exports = { CreatePromo, getAllPromo, updatePromo, DeletePromo , ApplyPromo};
