import React, { useContext, useEffect, useState } from "react";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "@/context/UserContext";
import { apiClient } from "@/api/axios";
// import {user.jpg} from "../assests/user.jpg"

const Navbar1 = () => {
    
    const user = useContext(UserContext); 
  const [userId, setUserId] = useState(null);
//   const [accessToken, setAccessToken] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [userName, setUserName] = useState("Guest");
  const navigate = useNavigate()
  // Fetch user details from localStorage when component mounts
  useEffect(() => {
    setUserId(user?.id);
    // setAccessToken(localStorage.getItem("AccessToken"));
    setAvatarUrl(
      user?.avatar || "https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fsearch%3Fk%3Ddefault%2Bavatar&psig=AOvVaw04t_GWwT7vB3zbrFgLQkWh&ust=1737262814023000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJCxsLm-_ooDFQAAAAAdAAAAABAE" // Default placeholder
    );
    setUserName(user?.username || "Guest");
  }, []);

  const handleLogout =async () => {
    try {
      const response = await apiClient.post(
        `/api/v1/auth/logout`,
        {}, // Empty body
        {
          withCredentials: true,
        }
      );
      
      if (response){
        localStorage.clear();
        navigate('/');
        window.location.href = '/'
      }
      else throw Error;
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <Navbar fluid rounded className="mt-0 pt-3">
      {/* Brand Logo */}
      <Navbar.Brand className="font-league font-[700] text-xl" href="/">
        <span className="text-[#7ED757]">Learn</span>Stream
      </Navbar.Brand>

      {/* Right Section */}
      <div className="flex md:order-2">
        {/* Dropdown Menu for Logged-In Users */}
        {userId  && (
          <Dropdown
            arrowIcon
            inline
            label={
              <Avatar
                alt="User Avatar"
                img={avatarUrl} // Dynamically fetched avatar URL
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{userName}</span>
            </Dropdown.Header>
            <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
          </Dropdown>
        )}

        {/* Navbar Toggle (Mobile) */}
        <Navbar.Toggle />
      </div>

      {/* Navbar Links */}
      <Navbar.Collapse>
        <Navbar.Link href="/" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="/about">About</Navbar.Link>
        <Navbar.Link href="/services">Services</Navbar.Link>
        <Navbar.Link href="/pricing">Pricing</Navbar.Link>
        <Navbar.Link href="/contact">Contact</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navbar1;
