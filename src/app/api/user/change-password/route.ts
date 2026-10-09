import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth, updatePasswordInDbAndRegistry, verifyUserCurrentPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "অননুমোদিত অনুরোধ। অনুগ্রহ করে প্রথমে সাইন ইন করুন।" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "বর্তমান পাসওয়ার্ড এবং নতুন পাসওয়ার্ড প্রদান করুন।" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।" },
        { status: 400 }
      );
    }

    if (confirmPassword !== undefined && newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মেলেনি।" },
        { status: 400 }
      );
    }

    // Verify current password
    const isCurrentValid = await verifyUserCurrentPassword(
      session.user.id,
      currentPassword
    );

    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "আপনার বর্তমান পাসওয়ার্ডটি সঠিক নয়।" },
        { status: 400 }
      );
    }

    // Update password in DB and remote registry
    await updatePasswordInDbAndRegistry(session.user.id, newPassword);

    return NextResponse.json({
      success: true,
      message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
