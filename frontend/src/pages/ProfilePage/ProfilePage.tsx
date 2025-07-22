import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { toast } from "react-toastify";
import {
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
} from "../../redux/slices/userApiSlice";

import Sidebar from "../../components/Sidebar/Sidebar";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaGlobe,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaEdit,
  FaSave,
  FaTimes,
  FaBars,
} from "react-icons/fa";

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  const { data: currentUserData, isLoading } = useGetCurrentUserQuery();
  const [updateUser, { isLoading: isUpdating }] =
    useUpdateCurrentUserMutation();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    website: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    x: "",
    youtube: "",
  });

  useEffect(() => {
    if (currentUserData?.user) {
      const user = currentUserData.user;
      setFormData({
        username: user.username || "",
        email: user.email || "",
        password: "",
        first_name: user.firstName || "",
        last_name: user.lastName || "",
        website: user.socialLinks?.website || "",
        facebook: user.socialLinks?.facebook || "",
        instagram: user.socialLinks?.instagram || "",
        linkedin: user.socialLinks?.linkedin || "",
        x: user.socialLinks?.x || "",
        youtube: user.socialLinks?.youtube || "",
      });
    }
  }, [currentUserData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updateData: any = {};

      if (formData.username.trim())
        updateData.username = formData.username.trim();
      if (formData.email.trim()) updateData.email = formData.email.trim();
      if (formData.password.trim())
        updateData.password = formData.password.trim();
      if (formData.first_name.trim())
        updateData.first_name = formData.first_name.trim();
      if (formData.last_name.trim())
        updateData.last_name = formData.last_name.trim();
      if (formData.website.trim()) updateData.website = formData.website.trim();
      if (formData.facebook.trim())
        updateData.facebook = formData.facebook.trim();
      if (formData.instagram.trim())
        updateData.instagram = formData.instagram.trim();
      if (formData.linkedin.trim())
        updateData.linkedin = formData.linkedin.trim();
      if (formData.x.trim()) updateData.x = formData.x.trim();
      if (formData.youtube.trim()) updateData.youtube = formData.youtube.trim();

      await updateUser(updateData).unwrap();
      toast.success("Profile updated successfully!");
      setIsEditing(false);

      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);

    if (currentUserData?.user) {
      const user = currentUserData.user;
      setFormData({
        username: user.username || "",
        email: user.email || "",
        password: "",
        first_name: user.firstName || "",
        last_name: user.lastName || "",
        website: user.socialLinks?.website || "",
        facebook: user.socialLinks?.facebook || "",
        instagram: user.socialLinks?.instagram || "",
        linkedin: user.socialLinks?.linkedin || "",
        x: user.socialLinks?.x || "",
        youtube: user.socialLinks?.youtube || "",
      });
    }
  };

  const getDisplayName = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user?.firstName) {
      return user.firstName;
    } else if (user?.lastName) {
      return user.lastName;
    }
    return user?.username || "";
  };

  const getInitials = (user: any) => {
    const displayName = getDisplayName(user);
    return displayName
      .split(" ")
      .map((word: string) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const user = currentUserData?.user;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <Sidebar className="hidden lg:flex" />

        <div className="flex-1 transition-all duration-300">
          <motion.div
            className="bg-white border-b border-gray-200 px-6 py-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.button
                  className="lg:hidden p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaBars className="w-5 h-5 text-gray-600" />
                </motion.button>

                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Profile Settings
                  </h1>
                  <p className="text-gray-600">
                    Manage your account information
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {!isEditing ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    <FaEdit className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </motion.button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCancel}
                      className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      <FaTimes className="w-4 h-4" />
                      <span>Cancel</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSubmit}
                      disabled={isUpdating}
                      className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaSave className="w-4 h-4" />
                      <span>{isUpdating ? "Saving..." : "Save Changes"}</span>
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <motion.div
                className="bg-white rounded-lg shadow-sm p-8 mb-6 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex items-center space-x-6">
                  <motion.div
                    className="w-24 h-24 bg-gray-900 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {getInitials(user)}
                  </motion.div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {getDisplayName(user)}
                    </h2>
                    <p className="text-gray-600 mb-2">@{user?.username}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="capitalize">{user?.role}</span>
                      <span>•</span>
                      <span>
                        Member since{" "}
                        {new Date(user?.createdAt || "").getFullYear()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-lg shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <form onSubmit={handleSubmit}>
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors ${
                              isEditing
                                ? "border-gray-300 bg-white"
                                : "border-gray-200 bg-gray-50"
                            }`}
                            placeholder="Enter your username"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors ${
                              isEditing
                                ? "border-gray-300 bg-white"
                                : "border-gray-200 bg-gray-50"
                            }`}
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors ${
                            isEditing
                              ? "border-gray-300 bg-white"
                              : "border-gray-200 bg-gray-50"
                          }`}
                          placeholder="Enter your first name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors ${
                            isEditing
                              ? "border-gray-300 bg-white"
                              : "border-gray-200 bg-gray-50"
                          }`}
                          placeholder="Enter your last name"
                        />
                      </div>

                      {isEditing && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password (leave blank to keep current)
                          </label>
                          <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                              placeholder="Enter new password"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Social Links
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <div className="relative">
                          <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors ${
                              isEditing
                                ? "border-gray-300 bg-white"
                                : "border-gray-200 bg-gray-50"
                            }`}
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Facebook
                        </label>
                        <div className="relative">
                          <FaFacebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 w-4 h-4" />
                          <input
                            type="url"
                            name="facebook"
                            value={formData.facebook}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors ${
                              isEditing
                                ? "border-gray-300 bg-white"
                                : "border-gray-200 bg-gray-50"
                            }`}
                            placeholder="https://facebook.com/username"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Instagram
                        </label>
                        <div className="relative">
                          <FaInstagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-600 w-4 h-4" />
                          <input
                            type="url"
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors ${
                              isEditing
                                ? "border-gray-300 bg-white"
                                : "border-gray-200 bg-gray-50"
                            }`}
                            placeholder="https://instagram.com/username"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          LinkedIn
                        </label>
                        <div className="relative">
                          <FaLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-700 w-4 h-4" />
                          <input
                            type="url"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors ${
                              isEditing
                                ? "border-gray-300 bg-white"
                                : "border-gray-200 bg-gray-50"
                            }`}
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          X (Twitter)
                        </label>
                        <div className="relative">
                          <FaTwitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-4 h-4" />
                          <input
                            type="url"
                            name="x"
                            value={formData.x}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors ${
                              isEditing
                                ? "border-gray-300 bg-white"
                                : "border-gray-200 bg-gray-50"
                            }`}
                            placeholder="https://x.com/username"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          YouTube
                        </label>
                        <div className="relative">
                          <FaYoutube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600 w-4 h-4" />
                          <input
                            type="url"
                            name="youtube"
                            value={formData.youtube}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors ${
                              isEditing
                                ? "border-gray-300 bg-white"
                                : "border-gray-200 bg-gray-50"
                            }`}
                            placeholder="https://youtube.com/channel/..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
