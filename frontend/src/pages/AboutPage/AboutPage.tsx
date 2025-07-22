import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaPen,
  FaUsers,
  FaHeart,
  FaRocket,
  FaLightbulb,
  FaGlobe,
  FaQuoteLeft,
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import type { RootState } from "../../redux/store";

const AboutPage: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const features = [
    {
      icon: <FaPen className="w-8 h-8" />,
      title: "Rich Writing Experience",
      description:
        "Create beautiful stories with our intuitive rich text editor that supports formatting, images, and more.",
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: "Vibrant Community",
      description:
        "Connect with fellow writers and readers from around the world. Share ideas and get inspired.",
    },
    {
      icon: <FaHeart className="w-8 h-8" />,
      title: "Passion-Driven",
      description:
        "Built by writers, for writers. We understand what you need to tell your story effectively.",
    },
    {
      icon: <FaRocket className="w-8 h-8" />,
      title: "Fast & Reliable",
      description:
        "Lightning-fast performance ensures your writing flow is never interrupted.",
    },
    {
      icon: <FaLightbulb className="w-8 h-8" />,
      title: "Discover Ideas",
      description:
        "Explore diverse topics and perspectives that spark creativity and broaden your horizons.",
    },
    {
      icon: <FaGlobe className="w-8 h-8" />,
      title: "Global Reach",
      description:
        "Share your voice with readers worldwide and make an impact beyond borders.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Stories Published" },
    { number: "5K+", label: "Active Writers" },
    { number: "50K+", label: "Monthly Readers" },
    { number: "100+", label: "Countries Reached" },
  ];

  const teamMembers = [
    {
      name: "Bruce Wayne",
      role: "Founder & CEO",
      bio: "Passionate about democratizing storytelling and giving everyone a voice.",
      avatar:
        "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=150&h=150&fit=crop&crop=face",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#",
      },
    },
    {
      name: "John Wick",
      role: "Head of Product",
      bio: "Focused on creating the best writing experience for our community.",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#",
      },
    },
    {
      name: "Suyog Baniya",
      role: "Lead Developer",
      bio: "Building the technology that powers millions of stories worldwide.",
      avatar:
        "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=150&h=150&fit=crop&crop=face",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              About MeroBlog
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              We believe everyone has a story worth telling. MeroBlog is a
              platform where writers and readers come together to share ideas,
              experiences, and perspectives that matter.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                to={userInfo ? "/write" : "/signup"}
                className="bg-gray-900 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors duration-200 inline-block"
              >
                {userInfo ? "Start Writing" : "Join Our Community"}
              </Link>
              <Link
                to="/blogs"
                className="bg-white text-gray-900 border border-gray-300 px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-50 transition-colors duration-200 inline-block"
              >
                Explore Stories
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <FaQuoteLeft className="w-12 h-12 mx-auto mb-8 text-gray-400" />
            <blockquote className="text-2xl md:text-3xl font-light leading-relaxed mb-8 max-w-4xl mx-auto">
              "Our mission is to democratize storytelling and create a world
              where every voice can be heard, every story can be shared, and
              every reader can find content that inspires them."
            </blockquote>
            <cite className="text-lg text-gray-300">— The MeroBlog Team</cite>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, staggerChildren: 0.2 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose MeroBlog?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've built the perfect platform for writers and readers to
              connect, create, and discover amazing content.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-gray-900 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind MeroBlog who are dedicated to
              empowering storytellers worldwide.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-8 rounded-xl text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.img
                  src={member.avatar}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-gray-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {member.bio}
                </p>
                <div className="flex justify-center space-x-4">
                  <a
                    href={member.social.twitter}
                    className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
                  >
                    <FaTwitter className="w-5 h-5" />
                  </a>
                  <a
                    href={member.social.linkedin}
                    className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                  >
                    <FaLinkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={member.social.github}
                    className="text-gray-400 hover:text-gray-900 transition-colors duration-200"
                  >
                    <FaGithub className="w-5 h-5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Share Your Story?
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Join thousands of writers who have already discovered the joy of
              sharing their thoughts, experiences, and creativity with the
              world.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link
                to={userInfo ? "/write" : "/signup"}
                className="bg-white text-gray-900 px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors duration-200 inline-block"
              >
                {userInfo ? "Write Your First Story" : "Get Started Today"}
              </Link>
              <Link
                to="/blogs"
                className="border border-white text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-white hover:text-gray-900 transition-colors duration-200 inline-block"
              >
                Read Amazing Stories
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
