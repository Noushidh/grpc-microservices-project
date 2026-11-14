import User from "../models/User.js";

const getUser = async (call, callback) => {
  try {
    const { userId } = call.request;

    const user = await User.findById(userId);

    if (!user) {
      return callback({
        code: 5,
        message: "User not found",
      });
    }

    callback(null, {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("GetUser error:", error);

    callback({
      code: 13,
      message: "Internal server error",
    });
  }
};

export default {
  getUser,
};
