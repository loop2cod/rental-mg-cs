"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const CustomerInfoForm = ({ formData, handleInputChange, handleSelectChange }: {
  formData: any,
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  handleSelectChange: (name: string, value: string) => void
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Customer Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="user_name">Customer Name</Label>
          <Input
            id="user_name"
            name="user_name"
            value={formData.user_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="user_phone">Phone Number</Label>
          <Input
            id="user_phone"
            name="user_phone"
            value={formData.user_phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="user_proof_type">ID Proof Type</Label>
          <Select
            value={formData.user_proof_type}
            onValueChange={(value) => handleSelectChange("user_proof_type", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select ID type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aadhar">Aadhar Card</SelectItem>
              <SelectItem value="passport">Passport</SelectItem>
              <SelectItem value="driving_license">Driving License</SelectItem>
              <SelectItem value="voter_id">Voter ID</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="user_proof_id">ID Number</Label>
          <Input
            id="user_proof_id"
            name="user_proof_id"
            value={formData.user_proof_id}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
    </div>
  )
}