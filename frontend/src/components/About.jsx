import React from "react";
import { FaUserMd, FaHeartbeat, FaLaptopMedical } from "react-icons/fa";
import { IoMdPeople } from "react-icons/io";
import assets from "../assets/assets";
import ApproachCard from "./ApproachCard";
import TeamMember from "./TeamMember";
import Newsletter from "./NewsLetter";

const About = () => {
  return (
    <div className="bg-gray-50 mt-20">
      <div>
        {/* Hero Section */}
        <section className="bg-blue-400 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              About TeleCare Hub
            </h1>
            <p className="text-base md:text-xl max-w-2xl mx-auto">
              Revolutionizing healthcare through innovative telemedicine
              solutions
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-800">
                  Our Story
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Founded in 2023, TeleCare Hub emerged from a simple idea:
                  healthcare should be accessible to everyone, regardless of
                  location or circumstance. Our team of medical professionals
                  and technologists came together to bridge the gap between
                  patients and quality care.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  What started as a small startup has grown into a trusted
                  telemedicine platform serving thousands of patients
                  nationwide. We're proud to be at the forefront of digital
                  healthcare innovation.
                </p>
                <div className="bg-blue-100 border-l-4 border-blue-500 p-4">
                  <p className="text-blue-700 font-medium italic">
                    "Our mission is to make healthcare more convenient,
                    affordable, and effective through technology."
                  </p>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img
                  src={assets.aiDoctor2}
                  alt="TeleCare Hub team"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Approach Section */}
        <section className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Our Approach
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <ApproachCard
                icon={<FaUserMd className="text-blue-600 text-4xl mb-4" />}
                title="Patient-Centered"
                description="We put patients at the heart of everything we do, ensuring compassionate, personalized care."
              />
              <ApproachCard
                icon={
                  <FaLaptopMedical className="text-blue-600 text-4xl mb-4" />
                }
                title="Technology-Driven"
                description="Our platform leverages cutting-edge technology to deliver seamless healthcare experiences."
              />
              <ApproachCard
                icon={<FaHeartbeat className="text-blue-600 text-4xl mb-4" />}
                title="Quality Care"
                description="We maintain the highest medical standards with board-certified healthcare providers."
              />
              <ApproachCard
                icon={<IoMdPeople className="text-blue-600 text-4xl mb-4" />}
                title="Community Focus"
                description="We're committed to improving healthcare access for underserved communities."
              />
            </div>
          </div>
        </section>

        {/* Meet the Team Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Meet Our Medical Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <TeamMember
                name="Dr. Sarah Johnson"
                role="Chief Medical Officer"
                bio="Board-certified internist with 15 years of clinical experience and telemedicine expertise."
                specialty="Internal Medicine"
              />
              <TeamMember
                name="Dr. Michael Chen"
                role="Pediatrics Specialist"
                bio="Pediatrician dedicated to making healthcare accessible for children in rural areas."
                specialty="Pediatrics"
              />
              <TeamMember
                name="Dr. Lisa Rodriguez"
                role="Mental Health Director"
                bio="Psychiatrist focused on expanding mental health services through telemedicine."
                specialty="Psychiatry"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

<ApproachCard />;

export default About;
