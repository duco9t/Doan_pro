const AddressService = require("../services/AddressService");

class AddressController {
  static async createAddress(req, res) {
    const { name, phone, email, address, userId } = req.body;
    console.log(name, phone, email, address, userId);

    if (!name || !phone || !email || !address) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    try {
      const newAddress = await AddressService.addAddress(userId, {
        name,
        phone,
        email,
        address
      });

      return res
        .status(201)
        .json({ message: "Address added successfully", data: newAddress });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  static async getAddresses(req, res) {
    const { userId } = req.params;
    console.log(userId);
    try {
      const addresses = await AddressService.getAddressesByUserId(userId);
      return res.status(200).json({ data: addresses });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }
}

module.exports = AddressController;
