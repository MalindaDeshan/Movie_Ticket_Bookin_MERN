import { clerkClient } from "@clerk/express";

export const projectAdmin = async (req, res, next) => {
  try {
    const auth = req.auth();

    console.log("Auth object:", auth);

    if (!auth || !auth.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await clerkClient.users.getUser(auth.userId);
    console.log("User privateMetadata:", user.privateMetadata);

    if (!user.privateMetadata || user.privateMetadata.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    next();
  } catch (err) {
    console.error("Error in projectAdmin:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};
