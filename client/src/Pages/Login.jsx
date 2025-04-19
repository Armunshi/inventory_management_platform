import React, { useContext, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/api/axios";
import { UserContext } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });
  const navigate = useNavigate()
  const { setUser } = useContext(UserContext) 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (value) => {
    setFormData({ ...formData, role: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response =await apiClient.post('api/v1/auth/signin',JSON.stringify(formData),{
        headers:{'Content-Type':'application/json'},
        withCredentials:true
      })
      
      console.log(response)
      setUser(response.data?.data);
      navigate(`/user/${role}`)
    } catch (error) {
      console.log(error)
    }
    console.log("Login data submitted:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center h-full">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold text-center mb-6">Inventory Management Login</h2>
          {((localStorage.getItem(`user_id`)&&localStorage.getItem(`accessToken`)) || success) ? (
        <><Progress/></>
  ):(<form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Select Role</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="retailer">Retailer</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>)
          }
        </CardContent>
      </Card>
    </div>
  );
}
