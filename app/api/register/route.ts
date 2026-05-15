// /app/api/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/connectToDB";
import { User } from "@/models/User";
import type { Role } from "@/types";

const VALID_ROLES: Role[] = ["buyer", "supplier", "admin"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Destructure and trim values safely
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
      organizationName,
      organizationType,
      roleInOrganization,
      country,
      agreeToTerms,
      agreeToPrivacy,
    } = body;

    const trimmedEmail = email?.toLowerCase().trim();
    const trimmedFirstName = firstName?.trim();
    const trimmedLastName = lastName?.trim();
    const trimmedPassword = password?.trim();

    // 1. Basic Required Validation
    if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !trimmedPassword || !role) {
      return NextResponse.json({ success: false, message: "Required fields are missing" }, { status: 400 });
    }

    // 2. Role Validation
    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json({ success: false, message: "Invalid role selected" }, { status: 400 });
    }

    // 3. Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json({ success: false, message: "Invalid email address" }, { status: 400 });
    }

    // 4. Password Strength Validation
    if (trimmedPassword.length < 8) { // Updated to 8 for better security
      return NextResponse.json({ success: false, message: "Password must be at least 8 characters" }, { status: 400 });
    }

    // 5. Terms/Privacy Validation
    if (!agreeToTerms || !agreeToPrivacy) {
      return NextResponse.json({ success: false, message: "You must accept terms and privacy policy" }, { status: 400 });
    }

    // 6. Supplier-Specific Validation
    if (role === "supplier" && (!organizationName || !organizationType)) {
      return NextResponse.json({ success: false, message: "Supplier organization details are required" }, { status: 400 });
    }

    await connectToDB();

    // 7. Duplicate Email Check
    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Email already registered" }, { status: 409 });
    }

    // 8. Hash Password
    const hashedPassword = await bcrypt.hash(trimmedPassword, 12);

    // 9. Create User
    const user = await User.create({
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      email: trimmedEmail,
      phone: phone?.trim(),
      password: hashedPassword,
      role,
      organizationName: organizationName?.trim(),
      organizationType,
      roleInOrganization: roleInOrganization?.trim(),
      country: country?.trim(),
      verified: true, // Consider changing to false if you implement email verification
      termsAccepted: true,
      privacyAccepted: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: { id: user._id, email: user.email, role: user.role },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ONBOARDING_API_ERROR:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

