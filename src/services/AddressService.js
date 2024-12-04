const Address = require("../models/AddressModel");

const addAddress = async (userId, addressData) => {
  let userAddress = await Address.findOne({ userId });

  if (!userAddress) {
    // Nếu user chưa có địa chỉ, tạo mới
    userAddress = new Address({ userId, addresses: [addressData] });
  } else {
    // Kiểm tra xem địa chỉ có trùng không
    const isDuplicate = userAddress.addresses.some(
      (addr) =>
        addr.name === addressData.name &&
        addr.phone === addressData.phone &&
        addr.address === addressData.address &&
        addr.main === addressData.main
    );

    if (isDuplicate) {
      // Trả về OK nếu trùng lặp nhưng không lưu
      return { status: 200, message: "Duplicate address, not saved." };
    }

    // Thêm địa chỉ mới nếu không trùng
    userAddress.addresses.push(addressData);
  }

  await userAddress.save();
  return { status: 200, message: "Address added successfully." };
};

const getAddressesByUserId = async (userId) => {
  const userAddress = await Address.findOne({ userId });
  if (!userAddress) {
    return [];
  }
  return userAddress.addresses;
};

module.exports = { addAddress, getAddressesByUserId };
