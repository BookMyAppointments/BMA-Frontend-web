"use client";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { Building, Users, Wrench, Heart, Save, Loader2 } from "lucide-react";
import { HospitalFormErrors, HospitalDataRequest } from "../create/types";
import {
  ArraySection,
  BasicInfoSection,
  HoursSection,
  LocationSection,
} from "../components";
import { useRouter, useSearchParams } from "next/navigation";
import UnAuthorized from "@/components/miscellaneous/UnAuthorized";

const HospitalForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Being signed in is enough to submit a request now -- a super admin
    // reviews it before the hospital goes live either way. An invite link
    // (if a super admin issued one) still needs to check out if present.
    if (!localStorage.getItem("token")) {
      setAuthorized(false);
      return;
    }

    const uniqueCode = searchParams.get("uniqueCode");
    if (!uniqueCode) return;

    const verifyCode = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/admin-verify-code/${uniqueCode}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.status || response.status !== 201) {
          toast.error("That invite link is invalid or already used.");
          setAuthorized(false);
        }
      } catch (error) {
        console.error("Error verifying code:", error);
      }
    };

    verifyCode();
  }, [searchParams]);

  const [errors, setErrors] = useState<HospitalFormErrors>({});
  const [Authorized, setAuthorized] = useState<boolean>(true);
  const [formData, setFormData] = useState<HospitalDataRequest>({
    name: "",
    location: {
      lat: "",
      lng: "",
      address: "",
    },
    departments: [] as string[],
    facilities: [] as string[],
    services: [] as string[],
    hours: {
      monday: { open: "", close: "", closed: false },
      tuesday: { open: "", close: "", closed: false },
      wednesday: { open: "", close: "", closed: false },
      thursday: { open: "", close: "", closed: false },
      friday: { open: "", close: "", closed: false },
      saturday: { open: "", close: "", closed: false },
      sunday: { open: "", close: "", closed: false },
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: HospitalFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Hospital name is required";
    }

    if (!formData.location.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.location.lat || !formData.location.lng) {
      newErrors.coordinates = "Latitude and longitude are required";
    }

    if (formData.departments.length === 0) {
      newErrors.departments = "At least one department is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Submitting hospital data:", formData);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/hospitals/create${
          searchParams.get("uniqueCode")
            ? `?uniqueCode=${searchParams.get("uniqueCode")}`
            : ""
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log(response.status, data);
      if (data.success) {
        toast.success("Submitted! A super admin will review it before it goes live.");
        router.push("/register/status");
      } else {
        throw new Error(data.message || "Failed to create hospital");
      }
    } catch (error) {
      console.error("Error creating hospital:", error);
      toast.error('Failed to create hospital. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!Authorized) {
    return <UnAuthorized />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Building className="text-blue-600" size={32} />
              Create New Hospital
            </h1>
            <p className="text-gray-600 mt-2">
              Add a new hospital to the system with all required details
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <BasicInfoSection
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
            {/* Location Section */}
            <LocationSection
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />{" "}
            {/* Departments Section */}
            <ArraySection
              title="Departments"
              icon={<Users className="text-green-600" size={20} />}
              items={formData.departments}
              onItemsChange={(departments: string[]) =>
                setFormData((prev) => ({ ...prev, departments }))
              }
              placeholder="Enter department name"
              error={errors.departments}
            />{" "}
            {/* Facilities Section */}
            <ArraySection
              title="Facilities"
              icon={<Wrench className="text-purple-600" size={20} />}
              items={formData.facilities}
              onItemsChange={(facilities: string[]) =>
                setFormData((prev) => ({ ...prev, facilities }))
              }
              placeholder="Enter facility name"
              error={undefined}
            />
            {/* Services Section */}
            <ArraySection
              title="Services"
              icon={<Heart className="text-red-600" size={20} />}
              items={formData.services}
              onItemsChange={(services: string[]) =>
                setFormData((prev) => ({ ...prev, services }))
              }
              placeholder="Enter service name"
              error={undefined}
            />
            {/* Hours Section */}
            <HoursSection formData={formData} setFormData={setFormData} />
            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Creating Hospital...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Create Hospital
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HospitalForm;
